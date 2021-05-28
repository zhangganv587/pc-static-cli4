/*
 * @Author: zhanggan
 * @Date: 2021-04-13 10:52:42
 * @LastEditors: zhanggan
 * @Description: routers.index
 * @FilePath: /pc-static-cli4/src/routers/index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router";
import store from "../store";
import { pathToRegexp } from "path-to-regexp";
import { URL_WHITE_LIST } from "@/utils/constants";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { userRoles } = store.state;
  const { path: fullPath } = to;

  if (URL_WHITE_LIST.includes(fullPath)) {
    //url白名单内的 不校验
    next();
  } else if (
    userRoles === "" ||
    (Array.isArray(userRoles) && userRoles.length <= 0)
  ) {
    //初始化未获得接口数据时 不校验
    next();
  } else if (Array.isArray(userRoles) && userRoles.length > 0) {
    if (userRoles.includes(fullPath)) {
      next();
    } else {
      const isPathMatch = userRoles.some((path) => {
        return pathToRegexp(path).test(fullPath);
      });
      if (isPathMatch) {
        next();
      } else {
        next("/notpermission");
      }
    }
  } else {
    next("/notpermission");
  }
});

export default router;
