/*
 * @Author: 张淦
 * @Date: 2020-02-13 09:56:46
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /pc-static-cli4/src/store/base/actions.js
 */
import base from "@/services/base";

export default {
  // 得到支付信息（医保收银台-线下收款）
  getInfoByMedicalInsure: (params) => {
    return base.apiGetInfoByMedicalInsure(params);
  },
  // 扫描支付宝二维码，提交支付信息
  getaliPay: (params) => {
    return base.apiGetaliPay(params);
  },
  // 扫描微信二维码，提交支付信息
  getwxPay: (params) => {
    return base.apiGetwxPay(params);
  },
  // 线下现金银行卡支付，提交支付信息
  getCashPay: (params) => {
    return base.apiGetCashPay(params);
  },
};
