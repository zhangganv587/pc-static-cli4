// 分账模块
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetChannelList: (params) =>
    fetch("/subAccount/list.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetAccountList: (params) =>
    fetch("/settlement/list.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetBankList: (params) =>
    fetch("/subAccount/bank.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
  apiGetPayConfigList: (params) =>
    fetch("/paylog/dictionary.json", { method: "post", data: params }).then(
      (res) => res.data
    ),
};
