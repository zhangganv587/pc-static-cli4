/*
 * @Author: zhanggan
 * @Date: 2020-08-24 15:13:47
 * @LastEditors: zhanggan
 * @FilePath: /pc-static-cli4/src/store/payStation/actions.js
 */
/* */
import services from "@/services/payStation";

export default {
  // 处方上传结果(商户收银台-广州)
  getPayGuangZhouStatus: (params) => {
    return services.apiGetPayGuangZhouStatus(params);
  },
  // 处方结算确认(商户收银台-广州)
  getPayGuangZhouSettle: (params) => {
    return services.apiGetPayGuangZhouSettle(params);
  },
  // 处方结算重试(商户收银台-广州)
  getPayGuangZhouRetry: (params) => {
    return services.apiGetPayGuangZhouRetry(params);
  },
  // 商户收银台信息获取(商户收银台)
  getPayInfoByComm: (params) => {
    return services.apiGetPayInfoByComm(params);
  },
  // 线下收款(商户收银台)
  getPayCashPay: (params) => {
    return services.apiGetPayCashPay(params);
  },
  // 订单结果获取(收银台通用)
  getPayResult: (params) => {
    return services.apiGetPayResult(params);
  },
};
