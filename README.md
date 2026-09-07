# dsh-plugin-namelist（电销名单管理辅助插件）

通过**聊天对话**调用**后端 HTTP 服务**，完成**电销名单**的查询、状态修改、派发/锁定给坐席。

对应后端：`za-castle-telemarket-ms` 的 `ApiInnerController`（`com.zhongan.castle.telemarket.biz.web.inner.ApiInnerController`）。
对应实体：`TelemarketQuoteList`（`telemarket_quote_list` 表，保险车险电销线索名单）。

用户用自然语言说"查一下车牌粤A12345 的名单""把 id=123 标记成签单成功""把 id=123 派给坐席 userId=xxx"，模型就会自动识别意图并调用本插件注册的工具，工具内部请求后端服务，最后把结果以表格回显到聊天里。

## 它是怎么工作的

```
用户对话 --→ 模型识别意图 --→ 调用工具 --→ 工具发 HTTP 请求到后端服务 --→ 名单查询/修改/派发
                                              │
                                              └--→ 渲染结果表格(聊天内)
```

本插件注册了 **5 个工具**，每个都对齐真实后端接口：

| 工具名 | 作用 | 后端接口 | 典型对话 |
| --- | --- | --- | --- |
| `quote_list_query` | 按车牌/车架号查询名单 | `POST /inner/api/queryQuoteListByVehicle` | "查一下车牌粤A12345 的名单" |
| `quote_list_query_by_phone` | 按手机号查询名单 | `GET /inner/api/queryQuoteListByPhone` | "手机号 138... 对应哪条名单" |
| `quote_list_update` | 修改（跟进状态/报价状态/分类/备注） | `POST /inner/api/updateQuoteList` | "把 id=123 标记成签单成功" |
| `quote_list_assign` | 指派名单给坐席 | `GET /inner/api/telemarket-ms/assignAgent` | "把名单 123 指派给坐席 张三" |
| `quote_agent_query` | 查询坐席信息 | `POST /inner/api/queryAgentInfo` | "查一下坐席张三的信息" |

> 说明：派发/指派用 `assignAgent` 接口，入参是 `quoteListId`（名单 id）+ `userName`（坐席用户名），后端根据 userName 查坐席并写入名单 userId。指派前可先用 `quote_agent_query` 确认坐席的 userName。

## 后端接口对照

### 统一响应体 `ResultBase<T>`

查询接口返回 `ResultBase`，字段为：

| 字段 | 含义 |
| --- | --- |
| `isSuccess`（或 `success`） | 是否成功 |
| `value` | 业务数据 |
| `errorMsg` | 失败原因 |
| `errorCode` | 错误码 |

> 插件已兼容 `isSuccess` 和 `success` 两种字段名（Java `boolean isSuccess` + fastjson 序列化可能输出任一种）。

### 五个接口

| 接口 | 方法 | 入参 | 返回 |
| --- | --- | --- | --- |
| `/inner/api/queryQuoteListByVehicle` | POST | `{ vehicleLicencePlateNo?, vehicleFrameNo? }` | `ResultBase<List<TelemarketQuoteList>>` |
| `/inner/api/queryQuoteListByPhone` | GET | `?phoneNo=xxx` | `ResultBase<List<TelemarketQuoteList>>` |
| `/inner/api/updateQuoteList` | POST | `{ id, ...要改的字段 }` | `int`（影响行数） |
| `/inner/api/telemarket-ms/assignAgent` | GET | `?quoteListId=xxx&userName=xxx` | `int`（影响行数） |
| `/inner/api/queryAgentInfo` | POST | `TelemarketUser`（按 userName/name 等过滤） | `ResultBase<List<TelemarketUser>>` |

- `queryQuoteListByVehicle` 要求车牌号、车架号**至少一个**（都空会报"车牌和车架不能都为空"）。
- `queryQuoteListByPhone` 是 **GET** 请求，query 参数 `phoneNo`（手机号，必填）。
- `updateQuoteList` 返回原始 `int`，不是 `ResultBase`；id 不存在或校验失败会抛异常（返回非 200）。
- `assignAgent` 是 **GET** 请求，query 参数 `quoteListId`（名单 id）和 `userName`（坐席用户名）；后端根据 userName 查坐席，写入名单 userId，返回 `int` 影响行数。
- `queryAgentInfo` 是 **POST** 请求，body 传 `TelemarketUser` 对象；后端固定 `ondutyStatus="ON"`，只查在岗坐席。

## 接入字段

### 查询（`quote_list_query`）

- `vehicleLicencePlateNo`（车牌号）
- `vehicleFrameNo`（车架号）

### 按手机号查询（`quote_list_query_by_phone`）

- `phoneNo`（手机号，必填）

### 修改（`quote_list_update`）

| 字段 | 类型 | 枚举 | 说明 |
| --- | --- | --- | --- |
| `id` | integer | — | 名单主键（必填） |
| `followStatus` | integer | 0/1/2/3/4/5/6/99 | 跟进状态 |
| `quoteStatus` | integer | 0/1/2 | 报价状态 |
| `nameType` | string | — | 名单分类 |
| `remark` | string | — | 备注 |
| `listRemark` | string | — | 名单备注 |

### 派发/指派（`quote_list_assign`）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `quoteListId` | integer | 名单主键 id（必填） |
| `userName` | string | 目标坐席用户名（必填，后端据此查坐席） |

### 查询坐席（`quote_agent_query`）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `userName` | string | 坐席用户名（登录账号） |
| `name` | string | 坐席姓名 |
| `realName` | string | 坐席真实姓名 |
| `phoneNo` | string | 坐席手机号 |

> 至少传一个过滤条件；后端固定 `ondutyStatus="ON"`，只查在岗坐席。

### 枚举值域

- 跟进状态 `followStatus`：0 未处理 / 1 跟进中 / 2 签单成功 / 3 实收成功 / 4 失败 / 5 待分配 / 6 未接通 / 99 紧急
- 报价状态 `quoteStatus`：0 报价中 / 1 转投保 / 2 已出单

## 目录结构

```
namelist-assistant/
├── package.json          插件包元信息
├── cordis.patch.yml      组合配置（把插件挂进 DSH 配置树）
├── lib/
│   └── index.js          插件本体：5 个工具 + 调用后端服务
└── README.md             本文档
```

## 安装（给别人用）

### 方式一：`dsh plugin add`（推荐）

前提：本插件已发布为 git 仓库或 npm 包。对方在 DSH 里执行：

```sh
dsh plugin add dsh-plugin-namelist
```

DSH 会把插件安装到当前 profile，并自动应用 `cordis.patch.yml`（`dsh.bundle.patch` 声明了它）。

### 方式二：手动安装（本地开发 / 未发布时）

本插件是标准的「DSH bundle」形态（`package.json` 声明 `dsh.bundle.patch` 指向 `cordis.patch.yml`）。无论是发布后安装、还是本地开发，**关键点只有两个**：

1. **插件必须作为 profile `node_modules` 里的真实目录存在**（不能用符号链接 —— 符号链接会导致 Node 解析 peer 依赖时「逃逸」到插件源目录，从而找不到 `@deepseek-ai/dsh-tools`）。

2. **插件包名要能解析**：把插件目录放进 profile 的 `node_modules/`，并在该 profile 的 `package.json` 里加入依赖与 bundle：

```jsonc
// profiles/<name>/package.json
{
  "dependencies": { "dsh-plugin-namelist": "file:<插件目录绝对路径>" },
  "dsh": { "profile": { "bundles": [ "...", "dsh-plugin-namelist" ] } }
}
```

然后在该 profile 下 `pnpm install`。

### 安装后验证

重启 DSH 后，在聊天里说下面任意一句，模型会调用对应工具：

- "查一下车牌粤A12345 的名单"
- "手机号 13800138000 对应哪条名单"
- "查一下坐席张三的信息"
- "把 id=123 标记成签单成功，备注已收款"
- "把名单 123 指派给坐席 张三"

模型会调用对应工具，结果以表格回显。

### 对使用者环境的依赖

- 必须有访问 `http://za-castle-telemarket-ms.test.za.biz` 的网络（统一后端）
- DSH 版本需自带 `@deepseek-ai/dsh-tools` 与 `@deepseek-ai/cordis`（随 DSH 内置，无需额外安装）

## 后端地址配置

baseUrl 有三种配置方式，优先级从高到低：

1. `cordis.patch.yml` 的 `config.baseUrl`
2. 环境变量 `NAMELIST_API_URL`
3. `lib/index.js` 里的 `DEFAULT_BASE_URL`

当前默认指向：`http://za-castle-telemarket-ms.test.za.biz`

## 入参是怎么被决定的（关键设计说明）

自然语言的入参 **不是代码解析出来的**，而是"工具 schema + 模型推理"共同决定：

1. **选工具**：模型读每个工具的 `description`，判断"这是查询还是改状态还是派发"。
2. **填参数**：模型读每个字段的 `description`/`type`/`enum`/`required`，从用户话里抽取并映射。
   - 例："标记成签单成功" → 映射成 `followStatus: 2`（因为有 enum 锁死）；
   - 例："派给 userId=xxx" → `userId`（模型须先拿到坐席 id，拿不到会追问）。
3. **enum 锁值域**：状态字段用 enum，避免模型填出"签单成功"/"success"等不确定值。

所以**字段 `description` 写得越精准、`enum` 覆盖越全，入参就越准**。这是后续字段增删时最需要维护的地方。

## 关于 UI

当前骨架的"UI"是**工具结果卡片**：`output.render` 返回 markdown 表格，DSH 内置 Web 客户端自动渲染，**无需写前端代码、无需构建**。

若后续需要**自定义交互式 UI**（带按钮的名单面板、可点击派发等），需要额外做客户端插件（`dsh.client` + slot 注册 + Vite 构建），复杂度更高。当前对话驱动场景用结果卡片已足够，建议先跑通再升级。

## 依赖说明

- `@deepseek-ai/dsh-tools`：提供 `ctx.tools.register` 和 `defineTool`（DSH 已内置，声明为 peerDependency）。
- `@deepseek-ai/cordis`：插件框架（DSH 已内置，声明为 peerDependency）。

> 这两个是 **peer 依赖**，由 DSH base 提供，插件本身不打包它们。使用者无需单独安装。

## 常见问题

- **工具没出现**：确认 `cordis.patch.yml` 的 `name` 路径正确、DSH 已重启、`inject: ['tools']` 已声明。
- **工具调用报连接错误**：确认后端服务可访问、`baseUrl` 正确、网络能通该测试域名。
- **查询报"车牌和车架不能都为空"**：`queryQuoteListByVehicle` 要求车牌号/车架号至少传一个。
- **参数校验失败**：`followStatus`/`quoteStatus` 只接受各自 enum 里的值。
- **派发时模型不知道坐席用户名**：`assignAgent` 需要坐席 `userName`，模型若拿不到会追问你坐席用户名是什么。
