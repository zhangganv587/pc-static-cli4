/*
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /pc-static-cli4/src/menuConfig/routeData.js
 */
import routes from "../routers/router";
import menus from "./menus";
import { allMenusData } from "./menuData";
import store from "../store";
import { pathToRegexp } from "path-to-regexp";

// 所有有权限的路由数据
const allAuthRoutesData = {};
const authMenuPaths = [];

// 所有的路由数据
export let allRoutesData = {};

export default function getAllRoutesData() {
  getAuthMenuPaths(menus);
  getAuthRoutesData(routes);
  return allAuthRoutesData;
}
// 获取所有权限的路由path数组 authMenuPaths = []
function getAuthMenuPaths(menus, parentPath = "", parentAuth = "") {
  const { userRoles } = store.state;
  for (let i = 0, len = menus.length; i < len; i++) {
    const data = menus[i];
    const { path, authority, children } = data;
    const newData = {
      path: `${parentPath}/${path}`,
      authority: authority || parentAuth,
    };
    let result = false;
    if (Array.isArray(userRoles)) {
      result = userRoles.some((item) => {
        if (item.identity === newData.authority) {
          return true;
        }
      });
    }
    if (!newData.authority || result) {
      if (Array.isArray(children) && children.length) {
        getAuthMenuPaths(children, newData.path, newData.authority);
      } else {
        authMenuPaths.push(newData.path);
      }
    }
  }
  return Array.from(new Set(authMenuPaths));
}

// 获取所有有权限的路由信息 { path: route }
function getAuthRoutesData(routes) {
  for (let i = 0, len = routes.length; i < len; i++) {
    const routeData = routes[i];
    const { path, children, meta } = routeData;

    allRoutesData[path] = routeData;

    if (meta && meta.needCheckAuth !== false) {
      const isMatchMenu = authMenuPaths.some((menuPath) => {
        return (
          path === "/" || path === menuPath || pathToRegexp(path).test(menuPath)
        );
      });
      if (isMatchMenu) {
        allAuthRoutesData[path] = routeData;

        if (children && Array.isArray(children)) {
          getAuthRoutesData(children);
        }
      }
    } else {
      allAuthRoutesData[path] = routeData;
    }
  }

  allRoutesData = { ...allMenusData, ...allRoutesData };
}
