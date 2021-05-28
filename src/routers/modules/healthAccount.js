/*
 * @Author: zhanggan
 * @Date: 2020-10-15 15:27:32
 * @LastEditors: zhanggan
 * @FilePath: /gpay-ops-static/src/router/healthAccount.js
 */
const healthAccountUserAccount = () =>
  import(
    /* webpackChunkName:'healthAccount'*/ "@/pages/healthAccount/userManagement/account.vue"
  );
const healthAccountUserFlow = () =>
  import(
    /* webpackChunkName:'healthAccount'*/ "@/pages/healthAccount/userManagement/flow.vue"
  );
const healthAccountTrade = () =>
  import(
    /* webpackChunkName:'healthAccount'*/ "@/pages/healthAccount/tradeManagement/trade.vue"
  );
const healthAccountAdjust = () =>
  import(
    /* webpackChunkName:'healthAccount'*/ "@/pages/healthAccount/tradeManagement/adjust.vue"
  );

export default [
  {
    path: "/healthaccount/account",
    component: healthAccountUserAccount,
    meta: {
      title: "用户账户管理",
    },
  },
  {
    path: "/healthaccount/useraccount",
    component: healthAccountUserAccount,
    meta: {
      title: "用户账户管理",
    },
  },
  {
    path: "/healthaccount/flow",
    component: healthAccountUserFlow,
    meta: {
      title: "开户流水管理",
    },
  },
  {
    path: "/healthaccount/trade",
    component: healthAccountTrade,
    meta: {
      title: "交易管理",
    },
  },
  {
    path: "/healthaccount/usertrade",
    component: healthAccountTrade,
    meta: {
      title: "交易管理",
    },
  },
  {
    path: "/healthaccount/adjust",
    component: healthAccountAdjust,
    meta: {
      title: "调账管理",
    },
  },
];
