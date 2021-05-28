/*
 * @Description 对账管理
 * @Author wangjun
 * @Date 2021-03-12 15:05:57
 */

import api from "@/request/axios";

export const fetchRecordDetails = (data) =>
  api({
    method: "post",
    url: "/checking/resultDetail.json",
    data,
  });
// 差错管理-调账处理
export const fetchWrongAdjustment = (data) =>
  api({
    method: "post",
    url: "/checking/wrong/adjustment.json",
    data,
  });

// 差错管理-调账提示
export const fetchWrongAdjustmentTip = (data) =>
  api({
    method: "post",
    url: "/checking/wrong/adjustmenttip.json",
    data,
  });

export const fetchStaysOperate = (data) =>
  api({
    method: "post",
    url: "/checking/stays/operate.json",
    data,
  });

export const fetchAccountList = (data) =>
  api({
    method: "post",
    url: "/checking/account/list.json",
    data,
  });

// 资金报表详情

export const fetchFundDetails = (data) =>
  api({
    method: "post",
    url: "/checking/payreport/detail",
    data,
  });

export const fetchAllInstitution = (data) =>
  api({
    method: "post",
    url: "/checking/searchAllInstitution",
    data,
  });
