/*
 * @Author: langshuang1
 * @Date: 2019-12-26 15:00:45
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /gpay-ops-static/src/menuConfig/menuData.js
 */
import menus from "./menus";

// 用户有权限的菜单数据
// 用于展示左侧菜单
let authMenusData;

// 用户拥有权限数据
let cacheUserAuth;

// 用户有权限的菜单路劲数据
// 用于在 src/menuConfig/routeData.js 获取所有有权限的路由数据，在 beforeEach 做路由匹配
// 获取所有的菜单数据
export const allMenusData = {};

export default function getMenuData(userAuth = []) {
  if (
    String(cacheUserAuth) !== String(userAuth) ||
    !authMenusData ||
    !Object.keys(allMenusData).length
  ) {
    cacheUserAuth = userAuth;
    authMenusData = traversMenuData(userAuth, menus);
  }

  return authMenusData;
}

// 遍历菜单
// function getAuthMenuData(userAuth) {
function traversMenuData(userAuth, menus, parentPath = "", parentAuth = "") {
  const newMenuData = [];
  for (let i = 0, len = menus.length; i < len; i++) {
    const data = menus[i];
    const { path, authority, children } = data;
    const newData = {
      ...data,
      path: `${parentPath}/${path}`,
      authority: authority || parentAuth,
    };
    allMenusData[newData.path] = newData;
    if (userAuth.includes(newData.path)) {
      if (Array.isArray(children) && children.length) {
        newMenuData.push({
          ...newData,
          children: traversMenuData(
            userAuth,
            children,
            newData.path,
            newData.authority
          ),
        });
      } else {
        newMenuData.push(newData);
      }
    }
  }
  return newMenuData;
}
