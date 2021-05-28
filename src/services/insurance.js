/*
 * @Author: 张淦
 * @Date: 2020-03-18 10:22:08
 * @LastEditors: 张淦
 * @Description: 医保后台
 * @FilePath: /gpay-ops-static/src/services/insurance.js
 */
// 分账模块
import fetch from "../request/fetch";

// 0.公共方法
export default {
  apiGetMedicalTypeList: (params) =>
    fetch("/mi/dict/medicalTypeList.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 参保类型列表
  apiGetSureStatus: (params) =>
    fetch("/mi/dict/sureStatusList.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 医保结算装态列表
  apiGetHospitalDetail: (params) =>
    fetch("/mi/dict/hospitalList.json", { method: "post", data: params }).then(
      (res) => res.data
    ), // 医疗机构查询
  apiGetMedicalCenterList: (params) =>
    fetch("/mi/dict/medicalCenterList.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 医保中心列表
  apiGetBindCardWhiteList: (params) =>
    fetch("/mi/person/query_white_list.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 绑卡白名单列表
  apiGetCertificatesList: (params) =>
    fetch("/mi/person/page_certificate_list.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 电子凭证列表,
  apiGetDoctorList: (params) =>
    fetch("/mi/doctor/query.json", { method: "post", data: params }).then(
      (res) => res.data
    ), // 医生管理列表
  apiGeDepartmentList: (params) =>
    fetch("/mi/department/page_list.json", {
      method: "post",
      data: params,
    }).then((res) => res.data), // 科室管理列表
};
