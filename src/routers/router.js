/*
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /pc-static-cli4/src/routers/router.js
 */
import View from "@/components/view";

const Index = () => import(/* webpackChunkName:'index'*/ "@/pages/index");
const NotFound = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/notfound");
const NotPermission = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/notpermission");
const NetworkError = () =>
  import(/* webpackChunkName:'expcetion'*/ "@/pages/networkError");

// -----------   PC基础版  -------------
// import Base from './base';
// -----------   支付页  -------------
// import payRoute from './payStation';

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
        redirect: "/index",
        name: "index",
      },
      //   ...Base,
      //   ...payRoute,
    ],
  },
  {
    path: "/index",
    component: Index,
    meta: {
      title: "首页",
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
