/*
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /pc-static-cli4/src/routers/router.js
 */
import View from "@/components/view";
// import DivideAccount from './divideAccount';
import CheckAccount from "./modules/checkAccount";
import Merchant from "./modules/merchant";
import Invoice from "./modules/invoice";
import Insurance from "./modules/insurance";
import HealthAccount from "./modules/healthAccount";
import Reconciliation from "./modules/reconciliation";

const HelpList = () => import(/* webpackChunkName:'help'*/ "@/pages/help/list");
const NotFound = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/notfound");
const TargetUrl = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/target");
const NotPermission = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/notpermission");
const NetworkError = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/networkError");

export default [
  {
    path: "/",
    component: View,
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/",
        redirect: "/target",
        name: "index",
      },
      //   ...DivideAccount,
      ...Merchant,
      ...CheckAccount,
      ...Invoice,
      ...Insurance,
      ...HealthAccount,
      ...Reconciliation,
    ],
  },
  {
    path: "/main/main",
    meta: {
      title: "首页",
      needCheckAuth: false,
    },
    children: [
      {
        path: "/",
        redirect: "/target",
        name: "index",
      },
    ],
  },
  {
    path: "/helps",
    component: HelpList,
    meta: {
      title: "帮助",
      needCheckAuth: false,
    },
  },
  {
    path: "/target",
    component: TargetUrl,
    meta: {
      title: "跳转页",
      needCheckAuth: false,
    },
  },
  {
    path: "/networkError",
    component: NetworkError,
    meta: {
      title: "网络异常",
      needCheckAuth: false,
    },
  },
  {
    path: "/notpermission",
    component: NotPermission,
    meta: {
      title: "无权限",
      needCheckAuth: false,
    },
  },
  {
    path: "/notfound",
    component: NotFound,
    meta: {
      title: "页面不存在",
      needCheckAuth: false,
    },
  },
  {
    path: "*",
    redirect: "/notfound",
  },
];
