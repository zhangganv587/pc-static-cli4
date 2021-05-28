/*
 * @Author: zhanggan
 * @Date: 2020-11-24 19:40:15
 * @LastEditors: zhanggan
 * @Description: 健康账户后台
 * @FilePath: /gpay-ops-static/src/services/healthAccount.js
 */
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetHAChannel: (params) =>
    fetch("/haccount/account/member/getchannellist", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetHACodeList: (params) =>
    fetch("/haccount/account/member/getbizcodelist", {
      method: "post",
      data: params,
    }).then((res) => res.data),
};
