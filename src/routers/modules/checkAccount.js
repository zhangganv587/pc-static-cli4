/*
 * @Author: zhanggan
 * @Date: 2021-01-22 11:00:37
 * @LastEditors: zhanggan
 * @Description: 对账管理
 * @FilePath: /pc-static-cli4/src/routers/modules/checkAccount.js
 */
const FundList = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountStatement/fundList.vue"
  );
const FundExport = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountStatement/fundExport.vue"
  );
const FundConfig = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountStatement/fundConfig.vue"
  );
const Statistic = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountStatement/statistic.vue"
  );
const Insurance = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountStatement/insurance.vue"
  );
const ChanelStatementFile = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountFileManage/channelStatementFile.vue"
  );
const PaymentStatementFile = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountFileManage/paymentStatementFile.vue"
  );
const InsuranceStatementFile = () =>
  import(
    /* webpackChunkName:'CheckAccount'*/ "@/pages/checkAccount/accountFileManage/insuranceStatementFile.vue"
  );

export default [
  // 对账管理
  {
    path: "/checkaccount/fundlist",
    component: FundList,
    meta: {
      title: "资金对账列表",
    },
  },
  {
    path: "/checkaccount/fundlist/export",
    component: FundExport,
    meta: {
      title: "异步账单导出",
    },
  },
  {
    path: "/checkaccount/fundconfig",
    component: FundConfig,
    meta: {
      title: "渠道账号配置",
    },
  },
  {
    path: "/checkaccount/statistic",
    component: Statistic,
    meta: {
      title: "对账统计",
    },
  },
  {
    path: "/checkaccount/insurance",
    component: Insurance,
    meta: {
      title: "医保对账",
    },
  },
  // 对账文件管理
  {
    path: "/checkaccount/channelfile",
    component: ChanelStatementFile,
    meta: {
      title: "渠道账单文件",
    },
  },
  {
    path: "/checkaccount/paymentfile",
    component: PaymentStatementFile,
    meta: {
      title: "收银台账单文件",
    },
  },
  {
    path: "/checkaccount/insurancefile",
    component: InsuranceStatementFile,
    meta: {
      title: "医保账单文件",
    },
  },
];
