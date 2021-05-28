/*
 * @Author: 张淦
 * @Date: 2020-02-11 11:07:38
 * @LastEditors: zhanggan
 * @Description: 发票系统
 * @FilePath: /gpay-ops-static/src/services/invoice.js
 */
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetEnterpriseList: (params) =>
    fetch("/invoice/enterprise.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
};
