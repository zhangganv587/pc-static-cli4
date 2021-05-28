/*
 * @Author: zhanggan
 * @Date: 2021-04-14 14:37:06
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/utils/format.js
 */
// format 下拉框参数
const format = {
  // 退款状态
  refundStatus: [
    {
      key: "",
      label: "",
    },
  ],
  // 退款方式
  refundWay: [
    {
      key: "",
      label: "",
    },
  ],
  // 支付方式
  payWay: [
    {
      key: "",
      label: "",
    },
  ],
  // 接口方式
  apiWay: [
    {
      key: "",
      label: "",
    },
  ],
  // 结算记录-状态
  // 提现状态：0-成功；1-失败；2-处理中,Integer
  settleRecordStatus: [
    {
      key: 0,
      label: "成功",
    },
    {
      key: 1,
      label: "失败",
    },
    {
      key: 2,
      label: "处理中",
    },
  ],
  // 分账状态
  // 分账状态:pending: 待分账;suc：分账成功;fail:分账失败
  divideAccountStatus: [
    {
      key: "pending",
      label: "待分账",
    },
    {
      key: "suc",
      label: "分账成功",
    },
    {
      key: "fail",
      label: "分账失败",
    },
  ],
  // routinglAccountType": "分账账户类型：0-主账户；1-子账户",
  routinglAccountType: [
    {
      key: "0",
      label: "主账户",
    },
    {
      key: "1",
      label: "子账户",
    },
  ],
  // 交易类型
  // 交易类型: pay:支付,refund:退款
  tradeType: [
    {
      key: "pay",
      label: "支付",
    },
    {
      key: "refund",
      label: "退款",
    },
  ],
};
export default format;
