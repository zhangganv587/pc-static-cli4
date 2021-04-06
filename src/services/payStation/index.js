/*
 * @Author: zhanggan
 * @Date: 2021-04-06 17:43:47
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/services copy/payStation/index.js
 */
export default {
  // 得到支付信息（医保收银台-线下收款）
  apiGetInfoByMedicalInsure: (params) =>
    this.$http
      .post("/pay/infoByMedicalInsureWeb", {
        data: params,
      })
      .then((res) => res.data),
  // 处方上传结果(商户收银台-广州)
  apiGetPayGuangZhouStatus: (params) =>
    this.$http
      .post("/pay/guangzhou/status", {
        data: params,
      })
      .then((res) => res.data),
  // 处方结算确认(商户收银台-广州)
  apiGetPayGuangZhouSettle: (params) =>
    this.$http
      .post("/pay/guangzhou/settle", {
        data: params,
      })
      .then((res) => res.data),
  // 处方结算重试(商户收银台-广州)
  apiGetPayGuangZhouRetry: (params) =>
    this.$http
      .post("/pay/guangzhou/retry", {
        data: params,
      })
      .then((res) => res.data),
  // 商户收银台信息获取(商户收银台)
  apiGetPayInfoByComm: (params) =>
    this.$http
      .post("/pay/infoByComm", {
        data: params,
      })
      .then((res) => res.data),
  // 线下收款(商户收银台)
  apiGetPayCashPay: (params) =>
    this.$http
      .post("/pay/cashPay", {
        data: params,
      })
      .then((res) => res.data),
  // 订单结果获取(收银台通用)
  apiGetPayResult: (params) =>
    this.$http
      .post("/pay/result", {
        data: params,
      })
      .then((res) => res.data),
};
