/*
 * @Author: zhanggan
 * @Date: 2021-04-06 13:51:32
 * @LastEditors: zhanggan
 * @Description: mian.js
 * @FilePath: /pc-static-cli4/src/main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./routers";
import store from "./store";

import "./assets/css/reset.css";
import "@weiyi/vit-theme-default";

import filters from "./filters/index";
import utils from "./utils/index";
import { get, post } from "./services/axios";
import VIT from "@weiyi/vit";

Vue.use(utils);
Vue.use(VIT);

Vue.prototype.$http = { get, post };

// 注入全局过滤器
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
