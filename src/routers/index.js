/*
 * @Author: langshuang1
 * @Date: 2019-12-26 15:00:45
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /pc-static-cli4/src/routers/index.js
 */
import VueRouter from "vue-router";
import routes from "./router";

const router = new VueRouter({
  mode: "history",
  base: "/newpc/",
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
});

export default router;
