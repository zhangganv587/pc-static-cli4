/*
 * @Author: zhanggan
 * @Date: 2021-04-06 13:51:32
 * @LastEditors: zhanggan
 * @Description: mian.js
 * @FilePath: /pc-static-cli4/src/main.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import router from "./routers";
import store from "./store";
import filters from "./filters";
import utils from "./utils";

// 加载公共样式文件
import "./assets/css/reset.css";
import "@weiyi/vit-theme-default";
import "@weiyi/vit-menubar/index.css";

// axios
import "./request/interceptors";
import fetch from "./request/fetch";
import axios from "./request/axios";

// vit
import VIT from "@weiyi/vit";
import VitIcon from "@weiyi/vit-icon";
import VitMenubar from "@weiyi/vit-menubar";
import WyFormTable from "@/components/wy-form-table";

// 加载指令
import * as directives from "./directives";

Vue.use(utils);

// 注入全局请求
Vue.prototype.$fetch = fetch;

// 注入全局过滤器
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item]);
});

Vue.config.productionTip = false;

// 按需引入 VIT
Vue.use(VitIcon);
Vue.use(VitMenubar);
Vue.use(VIT, { size: "small", zIndex: 3000 }).use(WyFormTable, {
  axios,
});

// eventBus
Vue.prototype.$eventBus = new Vue();

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title;
//   const userInfo = sessionStorage.getItem("userInfo") || null;
//   if (!userInfo && to.meta.auth) {
//     next("/login");
//   } else {
//     next();
//   }
// });

const vm = new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});

// 加载指令
// ⚠️注意：不要修改执行顺序，否则 vm 获取不到
Object.keys(directives).forEach((key) => {
  let directive = directives[key];
  directive = typeof directive === "function" ? directive(vm) : directive;
  Vue.directive(key, directive);
});

export default vm;
