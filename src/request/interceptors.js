/*
 * @Author: 张淦
 * @Date: 2020-03-23 11:18:14
 * @LastEditors: zhanggan
 * @Description: vit引入修改
 * @FilePath: /pc-static-cli4/src/request/interceptors.js
 */
import Axios from "axios";
import { Message } from "@weiyi/vit";
import store, { types } from "@/store";
import router from "@/routers";
import configUrl from "./config";

// 添加请求拦截器
Axios.interceptors.request.use(
  (config) => {
    if (!config.url) {
      return Promise.reject({
        message: "请求 url 不能为空",
      });
    }

    // 设置请求 loading
    store.commit(types["EFFECT_LOADING"], {
      fetchUrl: config.url,
      loadStatus: true,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response拦截器
Axios.interceptors.response.use(
  (res) => {
    let { data: resData } = res;
    if (!resData) {
      resData = {
        success: false,
        code: 8,
        message: "请求失败",
        data: null,
      };
    }

    if (Object.prototype.toString.call(resData) !== "[object Blob]") {
      handleResponse(resData);
    }

    return resData;
  },
  (error) => {
    Message.closeAll();
    Message.error(error.message || "网络不给力，请刷新重试!");
    return Promise.reject(error);
  }
);

// SUCCESS(0, "执行成功")
// NOLOGIN(10001, "尚未登录")
// 处理响应数据
function handleResponse(resData) {
  const { code, message } = resData;

  switch (code) {
    case 0:
      return;
    // 没登录
    case "401":
      {
        const loginUrl = `${configUrl.GOPS_LOGIN}?target=${window.location.href}`;
        window.location.href = loginUrl;
      }
      break;
    // 没有权限
    case "403":
      router.replace("/notpermission");
      break;
    case 10008:
      Message.closeAll();
      Message.warning(message);
      break;
    default:
      Message.closeAll();
      Message.error(message);
      break;
  }
}
