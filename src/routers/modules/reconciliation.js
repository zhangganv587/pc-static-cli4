/*
 * @Description 渠道对账管理
 * @Author wangjun
 * @Date 2021-03-08 09:41:51
 */
const ChannelReconciliation = () =>
  import(
    /* webpackChunkName:'channel-reconciliation' */ "@/pages/reconciliation-manage/channel-reconciliation.vue"
  );
const CheckedChannel = () =>
  import(
    /* webpackChunkName:'checked-channel' */ "@/pages/reconciliation-manage/checked-channel.vue"
  );
const ErrorManage = () =>
  import(
    /* webpackChunkName:'error-manage' */ "@/pages/reconciliation-manage/error-manage.vue"
  );
const CreditManage = () =>
  import(
    /* webpackChunkName:'credit-manage' */ "@/pages/reconciliation-manage/credit-manage.vue"
  );
const ChannelLog = () =>
  import(
    /* webpackChunkName:'channel-log' */ "@/pages/reconciliation-manage/channel-log.vue"
  );

export default [
  {
    path: "/reconciliation/fund",
    name: "渠道对账",
    component: ChannelReconciliation,
    meta: {
      title: "渠道对账",
      privilege: ["admin", "user"],
      showMenu: true,
    },
  },
  {
    path: "/reconciliation/checked-channel",
    name: "查看对账明细",
    component: CheckedChannel,
    meta: {
      title: "查看对账明细",
      privilege: ["admin", "user"],
    },
  },
  {
    path: "/reconciliation/error-manage",
    name: "差错管理",
    component: ErrorManage,
    meta: {
      title: "差错管理",
      privilege: ["admin", "user"],
      showMenu: true,
    },
  },
  {
    path: "/reconciliation/credit-manage",
    name: "挂账管理",
    component: CreditManage,
    meta: {
      title: "挂账管理",
      privilege: ["admin", "user"],
      showMenu: true,
    },
  },
  {
    path: "/reconciliation/channel-log",
    name: "对账任务",
    component: ChannelLog,
    meta: {
      title: "对账任务",
      privilege: ["admin", "user"],
      showMenu: true,
    },
  },
];
