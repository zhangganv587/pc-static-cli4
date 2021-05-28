/*
 * @Author: 张淦
 * @Date: 2020-03-18 10:21:55
 * @LastEditors: zhanggan
 * @Description: 医保后台
 * @FilePath: /gpay-ops-static/src/router/insurance.js
 */
const InsuranceCenter = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/insuranceCenter.vue"
  );
const MedicalInstitution = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/medicalInstitution.vue"
  );
const InsuranceCard = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/insuranceCard.vue"
  );
const Operator = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/operator.vue"
  );
const Settlement = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/settlementFlow.vue"
  );
const BindCard = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/bindCardWhite.vue"
  );
const Certificate = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/certificates.vue"
  );
const Doctor = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/doctor.vue"
  );
const Department = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/department.vue"
  );
const DataDownload = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/insurance/dataDownload.vue"
  );

export default [
  // 医保后台管理
  {
    path: "/insurance/settlement",
    component: Settlement,
    meta: {
      title: "结算流水",
    },
  },
  {
    path: "/insurance/center",
    component: InsuranceCenter,
    meta: {
      title: "医保中心管理",
    },
  },
  {
    path: "/insurance/institute",
    component: MedicalInstitution,
    meta: {
      title: "医疗机构管理",
    },
  },
  {
    path: "/insurance/operator",
    component: Operator,
    meta: {
      title: "操作人管理",
    },
  },
  {
    path: "/insurance/card",
    component: InsuranceCard,
    meta: {
      title: "参保人管理",
    },
  },
  {
    path: "/insurance/bindcard",
    component: BindCard,
    meta: {
      title: "电话签约管理",
    },
  },
  {
    path: "/insurance/certificates",
    component: Certificate,
    meta: {
      title: "电子凭证管理",
    },
  },
  {
    path: "/insurance/doctor",
    component: Doctor,
    meta: {
      title: "医生管理",
    },
  },
  {
    path: "/insurance/department",
    component: Department,
    meta: {
      title: "科室管理",
    },
  },
  {
    path: "/insurance/download",
    component: DataDownload,
    meta: {
      title: "医保数据下载",
    },
  },
];
