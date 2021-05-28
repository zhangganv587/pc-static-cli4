/*
 * @Author: langshuang1
 * @Date: 2019-09-26 16:10:33
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /gpay-ops-static/src/services/merchant.js
 */
// 商户模块
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetRoleList: (params) =>
    fetch("/rule/roles.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetDictionaryList: (params) =>
    fetch("/dict/list.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetBusinessAdministration: (params) =>
    fetch("/merchant/business/query.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetPaymentAccountList: (params) =>
    fetch("/account/query.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetChannelList: (params) =>
    fetch("/pay/channel/list.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetDictionaryQuery: (params) =>
    fetch("/dict/query.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetPermissionsList: (params) =>
    fetch("/permissions/menuArray.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetBusinessNumber: (params) =>
    fetch("/permissions/query.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetTimeNumber: (params) =>
    fetch("/Index/generate.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetBusinessList: (params) =>
    fetch("/pay/apply/business.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetOtherChannelList: (params) =>
    fetch("/pay/channel/otherList.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
};
