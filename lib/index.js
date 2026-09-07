// 电销名单管理工具插件
// 通过聊天对话驱动，调用后端 HTTP 服务完成电销名单的：
//   - 查询（queryQuoteListByVehicle：按车牌号/车架号查询）
//   - 修改（updateQuoteList：改跟进状态/报价状态/名单分类/备注等）
//   - 派发（updateQuoteList：把名单 userId 改成目标坐席 id）
//
// 对应后端：za-castle-telemarket-ms 的 ApiInnerController
//   - POST /inner/api/queryQuoteListByVehicle  → ResultBase<List<TelemarketQuoteList>>
//   - POST /inner/api/updateQuoteList           → int（影响行数）
//
// 统一响应体 ResultBase 字段：isSuccess / errorMsg / errorCode / value / additionalInfo
// （Java 的 boolean isSuccess + fastjson 序列化，实际字段名可能是 success 或 isSuccess，两者都兼容）
//
// 导出形态：函数式插件 apply(ctx, config)
// 依赖：ctx.tools（@deepseek-ai/dsh-tools 提供）
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'namelist'

export const inject = ['tools']

export const Config = null

const DEFAULT_BASE_URL = 'http://za-castle-telemarket-ms.test.za.biz'

// ---------- 枚举值域（与实体注释一一对应，锁死模型输出） ----------
// 跟进状态 followStatus：0-未处理 1-跟进中 2-签单成功 3-实收成功 4-失败 5-待分配 6-未接通 99-紧急
const FOLLOW_STATUS = {
  0: '未处理', 1: '跟进中', 2: '签单成功', 3: '实收成功',
  4: '失败', 5: '待分配', 6: '未接通', 99: '紧急',
}
// 报价单状态 quoteStatus：0-报价中 1-转投保 2-已出单
const QUOTE_STATUS = { 0: '报价中', 1: '转投保', 2: '已出单' }

/**
 * 发起 HTTP 请求并返回解析后的 JSON。
 * @param {string} baseUrl
 * @param {string} path
 * @param {{method?: string, body?: any, query?: Record<string, any>, signal?: AbortSignal}} opts
 */
async function callApi(baseUrl, path, opts = {}) {
  const { method = 'POST', body, query, signal } = opts
  let url = baseUrl.replace(/\/+$/, '') + path
  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
    }
    const q = qs.toString()
    if (q) url += '?' + q
  }
  const res = await fetch(url, {
    method,
    signal,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  const text = await res.text()
  if (!res.ok) {
    // 后端异常（如 updateQuoteList 校验失败 throw Exception）会返回非 200
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
  }

  try {
    return text ? JSON.parse(text) : {}
  } catch {
    // 某些接口返回非 JSON（如纯文本），按原始文本处理
    return { __raw: text }
  }
}

/**
 * 解析统一响应体 ResultBase。
 * 兼容 success / isSuccess 两种字段名。
 * 成功返回 value；失败抛出 errorMsg。
 */
function unwrapResultBase(data) {
  // 兼容 { isSuccess } 与 { success }
  const ok = data.isSuccess ?? data.success
  if (ok === false || (ok === undefined && data.errorMsg)) {
    throw new Error(data.errorMsg || '后端返回失败')
  }
  return data.value
}

/** 把名单项数组渲染成 markdown 表格。 */
function renderTable(items) {
  if (!items || items.length === 0) return '（无数据）'

  const cols = [
    ['id', 'ID'],
    ['vehicleOwner', '车主姓名'],
    ['vehicleOwnerPhoneNo', '车主电话'],
    ['vehicleLicencePlateNo', '车牌号'],
    ['vehicleFrameNo', '车架号'],
    ['insurePlace', '投保地'],
    ['insurePlaceCode', '投保地代码'],
    ['nameType', '名单分类'],
    ['userId', '坐席ID'],
    ['followStatus', '跟进状态'],
    ['quoteStatus', '报价状态'],
  ]
  const header = '| ' + cols.map((c) => c[1]).join(' | ') + ' |'
  const sep = '| ' + cols.map(() => '---').join(' | ') + ' |'

  const fmt = (it, key) => {
    const v = it[key]
    if (v === null || v === undefined) return ''
    if (key === 'followStatus') return `${v}·${FOLLOW_STATUS[v] ?? ''}`
    if (key === 'quoteStatus') return `${v}·${QUOTE_STATUS[v] ?? ''}`
    return v
  }
  const rows = items.map((it) => '| ' + cols.map((c) => fmt(it, c[0])).join(' | ') + ' |')
  return [header, sep, ...rows].join('\n')
}

/** 把坐席列表渲染成 markdown 表格。 */
function renderAgentTable(items) {
  if (!items || items.length === 0) return '（无数据）'

  const cols = [
    ['id', '坐席ID'],
    ['userName', '用户名'],
    ['name', '姓名'],
    ['realName', '真实姓名'],
    ['phoneNo', '手机号'],
    ['roleId', '角色ID'],
    ['parentUserId', '上级ID'],
    ['ondutyStatus', '在岗状态'],
  ]
  const header = '| ' + cols.map((c) => c[1]).join(' | ') + ' |'
  const sep = '| ' + cols.map(() => '---').join(' | ') + ' |'
  const rows = items.map((it) => '| ' + cols.map((c) => it[c[0]] ?? '').join(' | ') + ' |')
  return [header, sep, ...rows].join('\n')
}

export function apply(ctx, config = {}) {
  const baseUrl = (config.baseUrl || process.env.NAMELIST_API_URL || DEFAULT_BASE_URL).replace(/\/+$/, '')

  // ---------- 1) 查询名单（按车牌号/车架号） ----------
  ctx.tools.register(defineTool({
    name: 'quote_list_query',
    description:
      '根据车牌号或车架号查询电销名单。车牌号和车架号至少提供一个。' +
      '用于用户询问"查一下车牌粤A12345 的名单""车架号 XXX 对应哪条名单"等。',
    parameters: {
      vehicleLicencePlateNo: { type: 'string', description: '车牌号' },
      vehicleFrameNo: { type: 'string', description: '车架号' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => {
        const header = `共 ${value.items?.length ?? 0} 条名单`
        return [{ type: 'text', text: `${header}\n\n${renderTable(value.items)}` }]
      },
    },
    async execute(args, exec) {
      if (!args.vehicleLicencePlateNo && !args.vehicleFrameNo) {
        throw new Error('车牌号和车架号不能都为空')
      }
      const body = {}
      if (args.vehicleLicencePlateNo) body.vehicleLicencePlateNo = args.vehicleLicencePlateNo
      if (args.vehicleFrameNo) body.vehicleFrameNo = args.vehicleFrameNo

      const data = await callApi(baseUrl, '/inner/api/queryQuoteListByVehicle', {
        body,
        signal: exec.signal,
      })
      const list = unwrapResultBase(data)
      const items = Array.isArray(list) ? list : []
      return { items }
    },
  }))

  // ---------- 2) 修改名单（状态/分类/备注等） ----------
  ctx.tools.register(defineTool({
    name: 'quote_list_update',
    description:
      '修改一条电销名单。需提供目标记录 id，以及要更新的字段（跟进状态、报价状态、名单分类、备注等至少一个）。' +
      '用于"把 id=123 标记成签单成功""把这条备注改成 XXX"等。',
    parameters: {
      id: { type: 'integer', required: true, description: '要修改的名单主键 id' },
      followStatus: {
        type: 'integer',
        enum: [0, 1, 2, 3, 4, 5, 6, 99],
        description: '跟进状态：0未处理 1跟进中 2签单成功 3实收成功 4失败 5待分配 6未接通 99紧急',
      },
      quoteStatus: {
        type: 'integer',
        enum: [0, 1, 2],
        description: '报价单状态：0报价中 1转投保 2已出单',
      },
      nameType: { type: 'string', description: '名单分类（编码或描述）' },
      remark: { type: 'string', description: '备注内容' },
      listRemark: { type: 'string', description: '名单备注' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => {
        return [{ type: 'text', text: `已更新名单 id=${value.id}，影响行数 ${value.updated}` }]
      },
    },
    async execute(args, exec) {
      const body = { id: args.id }
      for (const k of ['followStatus', 'quoteStatus', 'nameType', 'remark', 'listRemark']) {
        if (args[k] !== undefined) body[k] = args[k]
      }
      // updateQuoteList 返回原始 int（影响行数），不是 ResultBase
      const updated = await callApi(baseUrl, '/inner/api/updateQuoteList', {
        body,
        signal: exec.signal,
      })
      return { id: args.id, updated: typeof updated === 'number' ? updated : 0 }
    },
  }))

  // ---------- 3) 指派名单给坐席（assignAgent 接口） ----------
  ctx.tools.register(defineTool({
    name: 'quote_list_assign',
    description:
      '指派一条名单给某个坐席。需提供名单 id（quoteListId）和目标坐席的用户名（userName）。' +
      '用于"把名单 123 指派给坐席 张三""把这条名单派给 userName=xxx"等。',
    parameters: {
      quoteListId: { type: 'integer', required: true, description: '要指派的名单主键 id（quoteListId）' },
      userName: { type: 'string', required: true, description: '目标坐席的用户名（userName，后端会据此查坐席）' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => {
        return [{ type: 'text', text: `已把名单 id=${value.quoteListId} 指派给坐席 ${value.userName}（影响行数 ${value.updated}）` }]
      },
    },
    async execute(args, exec) {
      const updated = await callApi(baseUrl, '/inner/api/telemarket-ms/assignAgent', {
        method: 'GET',
        query: { quoteListId: args.quoteListId, userName: args.userName },
        signal: exec.signal,
      })
      return { quoteListId: args.quoteListId, userName: args.userName, updated: typeof updated === 'number' ? updated : 0 }
    },
  }))

  // ---------- 4) 按手机号查询名单（queryQuoteListByPhone 接口） ----------
  ctx.tools.register(defineTool({
    name: 'quote_list_query_by_phone',
    description:
      '根据手机号查询电销名单。手机号必填。' +
      '用于用户询问"手机号 138... 对应哪条名单""查一下这个号码的名单"等。',
    parameters: {
      phoneNo: { type: 'string', required: true, description: '手机号' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => {
        const header = `共 ${value.items?.length ?? 0} 条名单`
        return [{ type: 'text', text: `${header}\n\n${renderTable(value.items)}` }]
      },
    },
    async execute(args, exec) {
      const data = await callApi(baseUrl, '/inner/api/queryQuoteListByPhone', {
        method: 'GET',
        query: { phoneNo: args.phoneNo },
        signal: exec.signal,
      })
      const list = unwrapResultBase(data)
      const items = Array.isArray(list) ? list : []
      return { items }
    },
  }))

  // ---------- 5) 查询坐席信息（queryAgentInfo 接口） ----------
  ctx.tools.register(defineTool({
    name: 'quote_agent_query',
    description:
      '查询坐席信息。可按坐席用户名(userName)、姓名(name)、手机号(phoneNo)等条件过滤。' +
      '用于用户询问"查一下坐席张三的信息""userName=xxx 的坐席是谁"等。可用来确认坐席 userName 后再做指派。',
    parameters: {
      userName: { type: 'string', description: '坐席用户名（登录账号），精确匹配' },
      name: { type: 'string', description: '坐席姓名' },
      realName: { type: 'string', description: '坐席真实姓名' },
      phoneNo: { type: 'string', description: '坐席手机号' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => {
        const header = `共 ${value.items?.length ?? 0} 个坐席`
        return [{ type: 'text', text: `${header}\n\n${renderAgentTable(value.items)}` }]
      },
    },
    async execute(args, exec) {
      const body = {}
      for (const k of ['userName', 'name', 'realName', 'phoneNo']) {
        if (args[k] !== undefined && args[k] !== '') body[k] = args[k]
      }
      const data = await callApi(baseUrl, '/inner/api/queryAgentInfo', {
        body,
        signal: exec.signal,
      })
      const list = unwrapResultBase(data)
      const items = Array.isArray(list) ? list : []
      return { items }
    },
  }))
}

export default apply
