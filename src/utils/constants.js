/*
 * @Author: langshuang1
 * @Date: 2019-12-13 15:02:16
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /pc-static-cli4/src/utils/constants.js
 */
import config from "@/request/config";

// 路由白名单
export const URL_WHITE_LIST = [
  "/main/main",
  "/helps",
  "/networkError",
  "/notpermission",
  "/notfound",
  "/target",
];
// 可用状态
export const AVAILABLE_STATE = {
  0: "启用",
  1: "禁用",
};
export const AVAILABLE_STATE_ARR = [
  {
    text: "启用",
    className: "text-success",
  },
  {
    text: "禁用",
    className: "text-warning",
  },
];
// 按钮可用状态
export const DICT_STATUS = {
  0: "禁用",
  1: "启用",
};
export const DICT_STATUS_ARR = [
  {
    text: "禁用",
    className: "text-warning",
  },
  {
    text: "启用",
    className: "text-success",
  },
];
// 账户类型
export const SUB_ACCOUNT_TYPE = {
  0: "主账户",
  1: "子账户",
};
export const CARD_ACCOUNT_TYPE = {
  0: "企业",
  1: "个人",
};
// 银行卡类型
export const BANK_CARD_TYPE = {
  0: "储蓄卡",
  1: "信用卡",
};
// 绑卡状态
export const BANK_CARD_STATE = {
  0: "已绑卡",
  1: "未绑卡",
  2: "绑卡申请中",
  3: "认证中",
  4: "绑卡失败",
};
// 上传文件
export const UPLOAD_URL = config.API_URL + "/pay/file/Upload.json";
// 币种
export const CURRENCY_LIST = {
  CNY: "人民币",
  HKD: "港币",
};
// 审批状态
export const APPROVAL_STATUS = [
  {
    text: "审批通过",
    className: "text-success",
  },
  {
    text: "待审批",
    className: "text-default",
  },
  {
    text: "审批驳回",
    className: "text-warning",
  },
];
export const APPROVAL_STATUS_ARR = [
  {
    label: "审批通过",
    value: 0,
  },
  {
    label: "待审批",
    value: 1,
  },
  {
    label: "审批驳回",
    value: 2,
  },
];
export const MOBILE_REG = /^1[3456789]\d{9}$/;
export const MONEY_REG = /^\d+(\.\d{1,2})?$/;

// 产品申请状态
export const PRODUCT_APPLY_STATUS = [
  {
    text: "未处理",
    className: "text-default",
  },
  {
    text: "已处理",
    className: "text-success",
  },
  {
    text: "作废",
    className: "text-disabled",
  },
];
export const PRODUCT_APPLY_STATUS_ARR = ["未处理", "已处理", "作废"];
// -- 对账业务 --
//   "accountChannel": "对账渠道：0-支付宝；1-微信",
export const ACCOUNT_CHANNEL_LIST = {
  0: "支付宝",
  1: "微信",
  2: "健康账户",
  3: "gpay",
  4: "机构",
  5: "mi-core",
  6: "医保中心",
  12: "乐山银行",
};
// "transactionType": "交易类型：0-支付；1-退款",
export const TRANSACTION_TYPE_LIST = {
  0: "支付",
  1: "退款",
};
// "accountResult": "对账结果：0-对平；9-未对平",
export const ACCOUNT_RESULT_STATUS = {
  0: "对平",
  9: "未对平",
};
// "recodeStatus": "导入状态：0：成功；1-失败",
export const RECODE_STATUS = {
  0: "成功",
  1: "失败",
};
export const METHOD_STATUS = {
  0: "自动",
  1: "手动",
};
// -- 发票业务 --
// "billingStatus": "开票状态：0-未开票；1-已提交；2-开票成功；99-当前订单不存在",
export const BILLING_STATUS_ARR = [
  {
    label: "未提交",
    value: "0",
  },
  {
    label: "待审核",
    value: "11",
  },
  {
    label: "待开票",
    value: "10",
  },
  {
    label: "开票完成",
    value: "2",
  },
  {
    label: "开票中",
    value: "6",
  },
  {
    label: "审核通过",
    value: "4",
  },
  {
    label: "开票失败",
    value: "20",
  },
  {
    label: "发票作废",
    value: "21",
  },
  {
    label: "订单关闭",
    value: "22",
  },
];
export const BILLING_STATUS = {
  0: "未提交",
  1: "待审核",
  2: "开票完成",
  4: "审核通过",
  6: "开票中",
  20: "开票失败",
  21: "发票作废",
  22: "订单关闭",
};
// "orderSource": "业务类型：hmall-购药；consult-问诊
export const ORDER_SOURCE_ARR = [
  {
    label: "购药",
    value: "hmall",
  },
  {
    label: "问诊",
    value: "consult",
  },
];
export const ORDER_SOURCE = {
  hmall: "购药",
  consult: "问诊",
};
// "preferentialPolicies": "是否享受优惠政策："
export const PREFERENTIAL_POLICIES = {
  0: "不使用",
  1: "使用",
};
// "mark": "零税率标识："
export const MARK_STATUS = {
  1: "免税",
  2: "不征税",
  3: "普通零税率",
};
// "hospitalType": "医疗机构类型"
export const HOSPITAL_TYPE = {
  0: "医院",
  1: "药店",
};
// "enterpriseType": "开票方式："
export const ENTERPRISE_STATUS = {
  0: "手动开票",
  1: "自动开票",
};
// "payWayCode": "微信开通产品：“
export const WX_PAY_WAY_CODE_ARR = [
  {
    label: "JSAPI支付",
    value: 2,
  },
  {
    label: "Native支付",
    value: 3,
  },
  {
    label: "APP支付",
    value: 4,
  },
  {
    label: "H5支付",
    value: 5,
  },
  {
    label: "小程序支付",
    value: 6,
  },
];
// "productType": "微信开通产品：“
export const WX_PRODUCT_TYPE_ARR = [
  {
    label: "APP支付",
    value: 4,
  },
  {
    label: "小程序支付",
    value: 6,
  },
  {
    label: "公众号支付",
    value: 8,
  },
];
// "productType": "支付宝开通产品：“
export const ALI_PRODUCT_TYPE_ARR = [
  {
    label: "当面付",
    value: 11,
  },
  {
    label: "APP支付",
    value: 13,
  },
  {
    label: "手机网站支付",
    value: 14,
  },
  {
    label: "电脑网站支付",
    value: 15,
  },
];
// "productType": "其他开通产品：“
export const OTHER_PRODUCT_TYPE_ARR = [
  {
    label: "手机网站支付",
    value: 16,
  },
  {
    label: "电脑网站支付",
    value: 17,
  },
];
//  "categoryType": "目录类型"
export const CATEGORY_TYPE_ARR = [
  {
    label: "疾病",
    value: 1,
  },
  {
    label: "诊疗",
    value: 2,
  },
  {
    label: "药品",
    value: 3,
  },
  {
    label: "材料",
    value: 4,
  },
];
//  "status": "账户状态"
export const HEALTH_ACCOUNT_STATUS = [
  {
    label: "正常",
    value: 0,
  },
  {
    label: "已解绑",
    value: 1,
  },
  {
    label: "已冻结",
    value: 2,
  },
];
//  "realNameFlag": "用户状态"
export const HEALTH_ACCOUNT_FlAG_ARR = [
  // {
  //   label: '未实名用户',
  //   value: 0,
  // },
  {
    label: "弱实名用户",
    value: 1,
  },
  {
    label: "强实名用户",
    value: 2,
  },
];

// ---- 健康账户 ----
export const HEALTH_ACCOUNT_FlAG = {
  0: "未实名用户",
  1: "弱实名用户",
  2: "强实名用户",
};
// "payMethod":"交易方式"
export const HACCOUNT_TSTP = {
  0: "红包支付",
  1: "快捷支付",
  2: "余额支付",
};
//  "payType": "交易类型"
export const HACCOUNT_PAY_TYPE = {
  2: "支付",
  3: "退款",
};
//  "payStatus": "交易状态"
export const HACCOUNT_PAY_STATUS = {
  3: "成功",
  4: "失败",
  5: "处理中",
  6: "处理异常",
};
//  "status": "状态"
export const HACCOUNT_ADJUST_STATUS = {
  0: "待审核",
  1: "调账中",
  2: "调账成功",
  3: "调账失败",
  4: "驳回",
};
