/*
 * @Author: 张淦
 * @Date: 2020-03-02 17:05:37
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /pc-static-cli4/src/routers/base/index.js
 */
const payIndex = () =>
  import(/* webpackChunkName:'index'*/ "@/pages/base/payIndex");
const payResult = () =>
  import(/* webpackChunkName:'index'*/ "@/pages/base/payResult");

const base = [
  {
    path: "/",
    redirect: "/index",
    name: "index",
  },
  {
    path: "/index",
    component: payIndex,
    meta: {
      title: "支付页",
    },
  },
  {
    path: "/result",
    component: payResult,
    meta: {
      title: "结果页",
    },
  },
];

export default base;
