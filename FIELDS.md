# TelemarketQuoteList 字段属性表

> 数据来源：`za-castle-telemarket-ms` 的 `com.zhongan.castle.telemarket.biz.pojo.TelemarketQuoteList`
> （对应数据库表 `telemarket_quote_list`）。
>
> 本文档由后端实体源码自动解析生成，共 **163** 个字段。`@Transient` 字段不在数据库表中。

## 图例

- **列名**：数据库列名（`@Column(name=...)`）。为空表示无显式列名映射（`@Transient` 瞬态字段或按驼峰推断）。
- **瞬态**：✅ 表示 `@Transient`（非 DB 列，仅内存计算/传输用）。
- **ID**：主键字段。

## 字段清单

| # | Java 字段 | 列名 | 类型 | 主键 | 瞬态 | 说明 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `id` | `—` | `Long` | 🔑 |  | 主键ID |
| 2 | `inventTransId` | `invent_trans_id` | `String` |  |  | 批次号 |
| 3 | `serialNo` | `serial_no` | `Long` |  |  | 序号 |
| 4 | `bizQuoteId` | `biz_quote_id` | `Long` |  |  | 商业险报价单id |
| 5 | `foreQuoteId` | `fore_quote_id` | `Long` |  |  | 交强险报价单id |
| 6 | `campaignId` | `campaign_id` | `String` |  |  | 营销活动定义id |
| 7 | `campaignName` | `campaign_name` | `String` |  |  | 营销活动名称 |
| 8 | `merchantNo` | `merchant_no` | `String` |  |  | 商户号 |
| 9 | `applyNo` | `apply_no` | `String` |  |  | 商业险投保单号 |
| 10 | `insurePlaceCode` | `insure_place_code` | `String` |  |  | 投保地代码 |
| 11 | `thirdOrgCode` | `—` | `String` |  |  | 三级投保地代码 |
| 12 | `insurePlace` | `insure_place` | `String` |  |  | 投保地名称 |
| 13 | `vehicleOwner` | `vehicle_owner` | `String` |  |  | 车主姓名 |
| 14 | `vehicleOwnerPhoneNo` | `vehicle_owner_phone_no` | `String` |  |  | 车主电话 |
| 15 | `vehicleOwnerIdentityType` | `vehicle_owner_identity_type` | `Integer` |  |  | 车主证件类型 1-身份证 6-其他 24-社会信用代码 |
| 16 | `vehicleOwnerIdentityNo` | `vehicle_owner_identity_no` | `String` |  |  | 车主证件号码 |
| 17 | `vehicleOwnerBirthDate` | `vehicle_owner_birth_date` | `Date` |  |  | 车主生日 |
| 18 | `vehicleOwnerSex` | `vehicle_owner_sex` | `String` |  |  | 车主性别 |
| 19 | `ownershipAttribute` | `ownership_attribute` | `String` |  |  | 车主性质 01-机关 02-企业 03-私人 |
| 20 | `vehicleLicencePlateNo` | `vehicle_licence_plate_no` | `String` |  |  | 车牌号 |
| 21 | `vehicleFrameNo` | `vehicle_frame_no` | `String` |  |  | 车架号 |
| 22 | `vehicleEngineNo` | `vehicle_engine_no` | `String` |  |  | 发动机号 |
| 23 | `vehicleModelCode` | `vehicle_model_code` | `String` |  |  | 车辆配置型号代码 |
| 24 | `vehicleModelName` | `vehicle_model_name` | `String` |  |  | 车辆配置型号 |
| 25 | `vehicleRegisterDate` | `vehicle_register_date` | `Date` |  |  | 车辆初登日期 |
| 26 | `transferFlag` | `transfer_flag` | `String` |  |  | 过户车辆标志；0-未过户 1-过户 |
| 27 | `transferDate` | `transfer_date` | `Date` |  |  | 转移登记日期 |
| 28 | `useAttribute` | `use_attribute` | `String` |  |  | 车辆使用性质 01-营运 02-非营运 |
| 29 | `bizEffectiveDate` | `biz_effective_date` | `Date` |  |  | 商业险投保起期 |
| 30 | `bizPreimum` | `biz_preimum` | `String` |  |  | 商业险保费 |
| 31 | `foreEffectiveDate` | `fore_effective_date` | `Date` |  |  | 交强险投保起期 |
| 32 | `forePreimum` | `fore_preimum` | `String` |  |  | 交强险保费 |
| 33 | `quoteDate` | `quote_date` | `Date` |  |  | 报价时间 |
| 34 | `quoteAgainDate` | `quote_again_date` | `Date` |  |  | 再次报价入库时间 |
| 35 | `quoteStatus` | `quote_status` | `Integer` |  |  | 报价单状态 0-报价中；1-转投保；2-已出单 |
| 36 | `teleUserId` | `tele_user_id` | `String` |  |  | 上年出单坐席id |
| 37 | `teleUserName` | `tele_user_name` | `String` |  |  | 上年出单坐席姓名 |
| 38 | `followStatus` | `follow_status` | `Integer` |  |  | 跟进状态:0-未处理 1-跟进中 2-签单成功 3-实收成功 4-失败 5-待分配 6-未接通 99-紧急 |
| 39 | `utmSource` | `utm_source` | `String` |  |  | utm标识 |
| 40 | `vehicleAcquisitionPrice` | `vehicle_acquisition_price` | `String` |  |  | 新车购置价 |
| 41 | `vehicleAge` | `vehicle_age` | `String` |  |  | 车龄 |
| 42 | `userId` | `user_id` | `String` |  |  | 用户id,用于绑定名单时存相应坐席人员id |
| 43 | `lockDate` | `lock_date` | `Date` |  |  | 名单锁定时间 |
| 44 | `lockType` | `lock_type` | `String` |  |  | 锁定类型 1-系统分发 2-上级指派 3-电销自建 |
| 45 | `nextCallDate` | `next_call_date` | `Date` |  |  | 下次拨打时间 |
| 46 | `saleStage` | `sale_stage` | `String` |  |  | 销售阶段 |
| 47 | `lastContactDate` | `last_contact_date` | `Date` |  |  | 最后接触时间 |
| 48 | `callTimes` | `call_times` | `Integer` |  |  | 拨打次数 |
| 49 | `extraInfo` | `extra_info` | `String` |  |  | 扩展字段 |
| 50 | `creator` | `—` | `String` |  |  | 创建人 |
| 51 | `gmtCreated` | `gmt_created` | `Date` |  |  | 创建时间 |
| 52 | `modifier` | `—` | `String` |  |  | 最后修改人 |
| 53 | `gmtModified` | `gmt_modified` | `Date` |  |  | 最后修改时间 |
| 54 | `nameTypeCode` | `name_type_code` | `String` |  |  | N正常,Y删除 |
| 55 | `nameTypeDesc` | `name_type_desc` | `String` |  |  | 名单分类标识 |
| 56 | `parentNameType` | `parent_name_type` | `String` |  |  | 一级名单分类 |
| 57 | `errorCode` | `error_code` | `String` |  |  | 报价错误编码 |
| 58 | `errorMsg` | `error_msg` | `String` |  |  | 报价错误原因 |
| 59 | `productSource` | `product_source` | `String` |  |  | 1为双安联合产品；2为平安产品 |
| 60 | `personnelType` | `personnel_type` | `Integer` |  |  | 个团标志；0-团体 1-个人 |
| 61 | `businessModel` | `business_model` | `String` |  |  | 0-新保 1-续保 |
| 62 | `contactTag` | `contact_tag` | `String` |  |  | 名单联系人标签 |
| 63 | `wechatId` | `wechat_id` | `String` |  |  | 微信号 |
| 64 | `qualityScore` | `quality_score` | `String` |  |  | 任务质量评分 |
| 65 | `salesBatchId` | `sales_batch_id` | `String` |  |  | 销售批次id |
| 66 | `lastUserId` | `last_user_id` | `String` |  |  | 上一个锁定的坐席 |
| 67 | `salesBatch` | `sales_batch` | `String` |  |  | 销售批次名称 |
| 68 | `dispatchType` | `dispatch_type` | `String` |  |  | 派发方式0-即时派发，1-集中调度 |
| 69 | `remark` | `—` | `String` |  | ✅ | 备注（插入轨迹用） |
| 70 | `nameType` | `—` | `String` |  | ✅ | 名单分类 |
| 71 | `userName` | `—` | `String` |  | ✅ | 客服姓名 |
| 72 | `parentUserId` | `—` | `String` |  | ✅ | 上级Id |
| 73 | `parentUserName` | `—` | `String` |  | ✅ | 上级姓名 |
| 74 | `operateEntrance` | `—` | `String` |  | ✅ | 操作入口 |
| 75 | `agentUserCode` | `agent_user_code` | `String` |  |  | 业务员编码 |
| 76 | `distributionType` | `distribution_type` | `String` |  |  | 是否手动下发 1-手动 |
| 77 | `listRemark` | `list_remark` | `String` |  |  | 名单备注 |
| 78 | `deadLine` | `dead_line` | `Date` |  |  | 名单关闭/出单时间 |
| 79 | `contactId` | `contact_id` | `String` |  |  | 第三方id(天眼名单id) |
| 80 | `requestNo` | `request_no` | `String` |  |  | 请求编号 |
| 81 | `quotaStatus` | `quota_status` | `String` |  |  | 配额状态：号码修复中、号码已修复、失联修复中、失联已修复 |
| 82 | `businessType` | `business_type` | `String` |  |  | 名单销售状态：售前、售中 |
| 83 | `quotaApplyReqDate` | `quota_apply_req_date` | `Date` |  |  | 配额请求时间 |
| 84 | `quotaApplyRespDate` | `quota_apply_resp_date` | `Date` |  |  | 配额响应时间 |
| 85 | `quotaApplyResult` | `quota_apply_result` | `String` |  |  | 请求结果 |
| 86 | `orderCampaignId` | `order_campaign_id` | `String` |  |  | 出单营销活动 |
| 87 | `cloneId` | `—` | `String` |  | ✅ | 克隆名单id |
| 88 | `vehicleBrand` | `vehicle_brand` | `String` |  |  | 汽车品牌 |
| 89 | `lastProductSource` | `last_product_source` | `String` |  |  | 上年产品类型(1双安联合产品,2平安产品) |
| 90 | `lastInsureType` | `last_insure_type` | `String` |  |  | 上年承保险种(1商业,2交强,3商交) |
| 91 | `ncdRatio` | `ncd_ratio` | `String` |  |  | NCD系数 |
| 92 | `lastSanzeAmount` | `last_sanze_amount` | `String` |  |  | 上年保单三者保额 |
| 93 | `loanFlag` | `loan_flag` | `String` |  |  | 0非贷款车,1贷款车 |
| 94 | `orderChannelId` | `order_channel_id` | `String` |  |  | 出单营销活动 |
| 95 | `orderChannelName` | `order_channel_name` | `String` |  |  | 出单渠道名称 |
| 96 | `paOrg` | `pa_org` | `String` |  |  | 平安机构 |
| 97 | `isPutOn` | `is_put_on` | `String` |  |  | 是否投放OF |
| 98 | `myPhone` | `my_phone` | `String` |  |  | 是否本人手机 1：是 0：否 |
| 99 | `phoneHolderName` | `phone_holder_name` | `String` |  |  | 手机持有人姓名 |
| 100 | `phoneHolderCertificateNo` | `phone_holder_certificate_no` | `String` |  |  | 手机持有人证件号 |
| 101 | `coOperatorName` | `co_operator_name` | `String` |  |  | 企业经办人姓名 |
| 102 | `coOperatorCertificateNo` | `co_operator_certificate_no` | `String` |  |  | 企业经办人证件号 |
| 103 | `leadsId` | `leads_id` | `String` |  |  | leadsId 蚂蚁\|\|微保项目 |
| 104 | `phoneExpireDate` | `phone_expire_date` | `Date` |  |  | 号码有效期 |
| 105 | `houseBusinessFlag` | `house_business_flag` | `String` |  |  | 是否个体工商户 |
| 106 | `transactorName` | `transactor_name` | `String` |  |  | 经营者姓名 |
| 107 | `transactorIdNo` | `transactor_id_no` | `String` |  |  | 经营者身份证号 |
| 108 | `scrollId` | `—` | `String` |  | ✅ | 导出功能需使用scrollId查询 |
| 109 | `quoteListId` | `—` | `Long` |  | ✅ | 兼容自动外呼的名单id 字段 |
| 110 | `listLevel` | `list_level` | `String` |  |  | 名单类别 |
| 111 | `insuranceType` | `insurance_type` | `String` |  |  | 险种类型 1：商业险，2：交强险，3交商 |
| 112 | `garageSigned` | `garage_signed` | `String` |  |  | 是否签约修理厂 0:否，1：是 |
| 113 | `isAgentCase` | `is_agent_case` | `String` |  |  | 是否代位案件 N否，Y是 |
| 114 | `insureType` | `insure_type` | `String` |  |  | 承保方式 0共保，1自保 |
| 115 | `cpIsAdd` | `cp_is_add` | `String` |  |  | 企微是否添加 |
| 116 | `conversionRate` | `conversion_rate` | `String` |  |  | / |
| 117 | `conversionRateVal` | `conversion_rate_val` | `String` |  |  | 评分值 |
| 118 | `acceptDate` | `accept_date` | `Date` |  |  | 出单日期 |
| 119 | `reportNo` | `report_no` | `String` |  |  | 平安报案号 |
| 120 | `closeReason` | `close_reason` | `String` |  |  | 名单关闭原因 |
| 121 | `expireReason` | `expire_reason` | `String` |  |  | leadsId失效类型 |
| 122 | `expireReasonDesc` | `expire_reason_desc` | `String` |  |  | leadsId失效原因描述 |
| 123 | `phoneArea` | `phone_area` | `String` |  |  | 号码归属地 |
| 124 | `phoneEffectDate` | `phone_effect_date` | `Date` |  |  | 号码有效起期 |
| 125 | `sourceType` | `source_type` | `Integer` |  |  | 1蚂蚁 2微保 |
| 126 | `leadsTag` | `leads_tag` | `Integer` |  |  | leads_标签：0：二次触网；1：平台预约报价；2：用户回呼 |
| 127 | `leadsTime` | `leads_time` | `Date` |  |  | leads_标签产生时间 |
| 128 | `microMarket` | `micro_market` | `String` |  |  | 是否微营销促成（1：是,0：否） |
| 129 | `customerQuoteDate` | `customer_quote_date` | `Date` |  |  | 客户报价日期 |
| 130 | `callFollowResult` | `call_follow_result` | `Integer` |  |  | 拨打跟进结果（1:成功,2:跟进中,3:失败） |
| 131 | `callSummary` | `call_summary` | `String` |  |  | 跟进中说明或者失败理由 |
| 132 | `callReamrk` | `call_remark` | `String` |  |  | 拨打备注 |
| 133 | `productCode` | `product_code` | `String` |  |  | 产品代码 |
| 134 | `productName` | `product_name` | `String` |  |  | 产品名称 |
| 135 | `orderNo` | `order_no` | `String` |  |  | 订单号 |
| 136 | `policyNo` | `policy_no` | `String` |  |  | 保单号 |
| 137 | `installmentNo` | `—` | `String` |  | ✅ | 当前期数 |
| 138 | `assignNo` | `assign_no` | `String` |  |  | 定量指派批次号 |
| 139 | `assignUserId` | `—` | `String` |  | ✅ | 定量指派人员 |
| 140 | `driverAccidentPlan` | `driver_accident_plan` | `String` |  |  | 非车（驾意险）投保方案 |
| 141 | `accidentCnt` | `accident_cnt` | `Integer` |  |  | 出险次数 |
| 142 | `insuredYears` | `insured_years` | `Integer` |  |  | 续保年限 |
| 143 | `contactAging` | `contact_aging` | `String` |  |  | 接触时效 |
| 144 | `nonAutoProductCode` | `non_auto_product_code` | `String` |  |  | 非车产品编码 |
| 145 | `historyIssueCampaignId` | `history_issue_campaign_id` | `String` |  |  | 历史营销活动 |
| 146 | `historyIssueMerchant` | `history_issue_merchant` | `String` |  |  | 历史商户 |
| 147 | `realTime` | `real_time` | `String` |  |  | 名单类型 ：实时首发，实时非首发，非实时-预约 |
| 148 | `priceLevel` | `price_level` | `String` |  |  | 价格级别 |
| 149 | `policyScore` | `policy_score` | `String` |  |  | 保单评分 |
| 150 | `missedCalledNum` | `missed_called_num` | `Integer` |  |  | 未接上线 |
| 151 | `connectLimit` | `connect_limit` | `String` |  |  | 接通屏蔽 |
| 152 | `remainFollowTime` | `remain_follow_time` | `Date` |  |  | 剩余跟进时间 |
| 153 | `quoteCount` | `quote_count` | `Integer` |  |  | 报价次数 |
| 154 | `quoteStep` | `quote_step` | `String` |  |  | 报价阶段 |
| 155 | `transferStatus` | `transfer_status` | `String` |  |  | 转帐状态 |
| 156 | `selfPriceRatio` | `self_price_ratio` | `Double` |  |  | 自主定价系数 |
| 157 | `firstCallDate` | `first_call_date` | `String` |  |  | 首播年月 |
| 158 | `availableSaleDate` | `available_sale_date` | `Date` |  |  | 可销售期 |
| 159 | `feedbackResult` | `feedback_result` | `Integer` |  |  | 反馈结果 |
| 160 | `feedbackContent` | `feedback_content` | `String` |  |  | 反馈内容 |
| 161 | `feedbackRemark` | `feedback_remark` | `String` |  |  | 反馈备注 |
| 162 | `vehicleOwnerAppellation` | `—` | `String` |  | ✅ | 车主称呼（车主姓氏+先生/女士，根据性别拼接） |
| 163 | `bizEffectiveDateStr` | `—` | `String` |  | ✅ | 商业险投保起期（年月日格式：yyyy-MM-dd） |
