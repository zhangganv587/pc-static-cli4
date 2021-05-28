const Home = () =>
  import(/* webpackChunkName:'enter'*/ "@/pages/home/index.vue");

const EnterApply = () =>
  import(/* webpackChunkName:'enter'*/ "@/pages/merchant/enterApply/index.vue");
const EnterHome = () =>
  import(/* webpackChunkName:'enter'*/ "@/pages/merchant/enterApply/home.vue");
const EnterTip = () =>
  import(/* webpackChunkName:'enter'*/ "@/components/base/v-page-tips.vue");

const BusinessList = () =>
  import(
    /* webpackChunkName:'business'*/ "@/pages/merchant/businessManage/list.vue"
  );
const BusinessAudit = () =>
  import(
    /* webpackChunkName:'business'*/ "@/pages/merchant/businessManage/audit.vue"
  );
const BusinessDetails = () =>
  import(
    /* webpackChunkName:'business'*/ "@/pages/merchant/businessManage/details.vue"
  );

// const ApprovalList = () => import(/* webpackChunkName:'merchant'*/ '@/pages/merchant/merchantManage/approvals.vue');
// const MerchantList = () => import(/* webpackChunkName:'merchant'*/ '@/pages/merchant/merchantManage/list.vue');

const FinanceSummary = () =>
  import(
    /* webpackChunkName:'finance'*/ "@/pages/merchant/financeManage/summary.vue"
  );
const FinanceDetail = () =>
  import(
    /* webpackChunkName:'finance'*/ "@/pages/merchant/financeManage/detail.vue"
  );

// const OrderPay = () => import(/* webpackChunkName:'order'*/ '@/pages/merchant/orderManage/payList.vue');
// const OrderList = () => import(/* webpackChunkName:'order'*/ '@/pages/merchant/orderManage/orderList.vue');
// const OrderRefund = () => import(/* webpackChunkName:'order'*/ '@/pages/merchant/orderManage/refundList.vue');
const PayRecord = () =>
  import(
    /* webpackChunkName:'order'*/ "@/pages/merchant/orderManage/payRecord.vue"
  );
const RefundRecord = () =>
  import(
    /* webpackChunkName:'order'*/ "@/pages/merchant/orderManage/refundRecord.vue"
  );

const ChannelAccount = () =>
  import(
    /* webpackChunkName:'channel'*/ "@/pages/merchant/channelManage/accountList.vue"
  );
const ChannelList = () =>
  import(
    /* webpackChunkName:'channel'*/ "@/pages/merchant/channelManage/channelList.vue"
  );
const ProductApplyList = () =>
  import(
    /* webpackChunkName:'channel'*/ "@/pages/merchant/channelManage/productApplyList.vue"
  );
const CollectionList = () =>
  import(
    /* webpackChunkName:'channel'*/ "@/pages/merchant/channelManage/collectionList.vue"
  );

const Dictionary = () =>
  import(/* webpackChunkName:'System'*/ "@/pages/systemManage/dictionary");
const Parameter = () =>
  import(/* webpackChunkName:'System'*/ "@/pages/systemManage/parameter");
const Personnel = () =>
  import(/* webpackChunkName:'System'*/ "@/pages/systemManage/personnel");

export default [
  {
    path: "/home",
    component: Home,
    meta: {
      title: "首页",
      showBreadcrumb: false,
    },
  },
  {
    path: "/enterApply", // 入住首页
    component: EnterHome,
    meta: {
      title: "机构入驻",
    },
  },
  {
    path: "/enterApply/info", // 入住页
    component: EnterApply,
    meta: {
      title: "入驻信息",
    },
  },
  {
    path: "/enterApply/tip/:phone", // 入驻提示
    component: EnterTip,
    meta: {
      title: "提示结果",
    },
  },
  {
    path: "/audit/pending/show", // 待审核，商户
    component: EnterApply,
    meta: {
      title: "审核结果",
    },
  },
  {
    path: "/audit/pending/operate", // 管理员查看，审批入驻
    component: EnterApply,
    meta: {
      title: "入驻审核",
    },
  },
  {
    path: "/audit/rejected", // 审核驳回
    component: EnterApply,
    meta: {
      title: "审核结果",
    },
  },
  {
    path: "/business/list",
    component: BusinessList,
    meta: {
      title: "机构业务列表",
    },
  },
  {
    path: "/business/admin",
    component: BusinessList,
    meta: {
      title: "机构业务列表",
    },
  },
  {
    path: "/business/details",
    component: BusinessDetails,
    meta: {
      title: "机构业务详情",
    },
  },
  {
    path: "/business/audit",
    component: BusinessAudit,
    meta: {
      title: "机构业务审核列表",
    },
  },
  {
    path: "/finance/summary",
    component: FinanceSummary,
    meta: {
      title: "交易汇总",
    },
  },
  {
    path: "/finance/detail",
    component: FinanceDetail,
    meta: {
      title: "交易明细",
    },
  },
  {
    path: "/order/list",
    component: PayRecord,
    meta: {
      title: "订单数据",
    },
  },
  {
    path: "/order/refund",
    component: RefundRecord,
    meta: {
      title: "退款流水",
    },
  },
  {
    path: "/channel/account",
    component: ChannelAccount,
    meta: {
      title: "账号列表",
    },
  },
  {
    path: "/channel/list",
    component: ChannelList,
    meta: {
      title: "渠道列表",
    },
  },
  {
    path: "/channel/productApplyList",
    component: ProductApplyList,
    meta: {
      title: "产品开通申请列表",
    },
  },
  {
    path: "/channel/collectionList",
    component: CollectionList,
    meta: {
      title: "收款账号列表",
    },
  },
  {
    path: "/system/parameter",
    component: Parameter,
    meta: {
      title: "参数管理",
    },
  },
  {
    path: "/system/dictionary",
    component: Dictionary,
    meta: {
      title: "字典管理",
    },
  },
  {
    path: "/system/person",
    component: Personnel,
    meta: {
      title: "人员管理",
    },
  },
];
