/*
 * @Author: your name
 * @Date: 2019-12-06 16:53:51
 * @LastEditors: zhanggan
 * @Description: In User Settings Edit
 * @FilePath: /gpay-ops-static/src/services/checkAccount.js
 */
// 分账模块
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetBizCategory: (params) =>
    fetch("/payAccount/bizCategoryList.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetExportList: (params) =>
    fetch("/payAccount/pageExportRecord.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetPartnerList: (params) =>
    fetch("/payAccount/searchInstitution.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetStatistics: (params) =>
    fetch("/payAccount/queryStatistics.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiPostExportDelay: (params) =>
    fetch("/payAccount/resultExportDelay.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiGetChannelConfigList: (params) =>
    fetch("/payAccount/config/pageChannel.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
  apiPostChannelConfigUpdate: (params) =>
    fetch("/payAccount/config/updateConfigStatus.json", {
      method: "post",
      data: params,
    }).then((res) => res.data),
};
