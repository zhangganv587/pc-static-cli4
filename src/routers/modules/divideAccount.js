/*
 * @Author: 张淦
 * @Date: 2020-04-27 17:13:27
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /gpay-ops-static/src/router/divideAccount.js
 */
const AccountMerchants = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/divideAccount/accountMerchants/query.vue"
  );
const BankcardManage = () =>
  import(
    /* webpackChunkName:'BankcardManage'*/ "@/pages/divideAccount/bankcardManage/query.vue"
  );
const MerchantBalance = () =>
  import(
    /* webpackChunkName:'MerchantBalance'*/ "@/pages/divideAccount/merchantBalance/query.vue"
  );
const SettleAccount = () =>
  import(
    /* webpackChunkName:'SettleAccount'*/ "@/pages/divideAccount/settleAccount/query.vue"
  );
const SettleRecord = () =>
  import(
    /* webpackChunkName:'SettleRecord'*/ "@/pages/divideAccount/settleRecord/query.vue"
  );

export default [
  {
    path: "/divideaccount/accountMerchants",
    component: AccountMerchants,
    meta: {
      title: "分账商户管理",
    },
  },
  {
    path: "/divideaccount/bankcardManage",
    component: BankcardManage,
    meta: {
      title: "银行卡管理",
    },
  },
  {
    path: "/divideaccount/mercbalance",
    component: MerchantBalance,
    meta: {
      title: "商户余额查询",
    },
  },
  {
    path: "/divideaccount/settleaccount",
    component: SettleAccount,
    meta: {
      title: "分账流水查询",
    },
  },
  {
    path: "/divideaccount/settlerecord",
    component: SettleRecord,
    meta: {
      title: "结算记录查询",
    },
  },
];
