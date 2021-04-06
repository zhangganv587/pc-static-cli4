/*
 * @Author: 张淦
 * @Date: 2020-02-13 09:56:46
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /pc-static-cli4/src/services copy/base/index.js
 */
export default {
  // 得到支付信息（医保收银台-线下收款）
  apiGetInfoByMedicalInsure: (params) =>
    this.$http
      .post("/pay/infoByMedicalInsureWeb", {
        data: params,
      })
      .then((res) => res.data),
  // 扫描支付宝二维码，提交支付信息
  apiGetaliPay: (params) =>
    this.$http
      .post("/aliPay/scan/payment", {
        data: params,
      })
      .then((res) => res.data),
  // 扫描微信二维码，提交支付信息
  apiGetwxPay: (params) =>
    this.$http
      .post("/wxPay/scan/payment", {
        data: params,
      })
      .then((res) => res.data),
  // 线下现金银行卡支付，提交支付信息
  apiGetCashPay: (params) =>
    this.$http
      .post("/pay/cashPay", {
        data: params,
      })
      .then((res) => res.data),
};
