/*
 * @Author: 张淦
 * @Date: 2020-02-09 16:28:39
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /gpay-ops-static/src/request/fetch.js
 */
import Axios from "axios";
import store, { types } from "@/store";
import Config from "./config";

// 默认配置
const defaultConfig = {
  method: "post",
  baseURL: Config.API_URL,
  timeout: 50000,
  withCredentials: true,
};
export default function fetch(url, config) {
  if (typeof url === "object") {
    config = url;
    url = undefined;
  }
  config = { ...defaultConfig, ...config };
  config.method = config.method.toLocaleLowerCase();
  config.url = url || config.url;

  if (config.method === "post") {
    config.data = {
      condition: config.data,
    };
  }
  return Axios.request(config).finally(() => {
    // 设置请求 loading
    store.commit(types["EFFECT_LOADING"], {
      fetchUrl: url,
      loadStatus: false,
    });
  });
}
