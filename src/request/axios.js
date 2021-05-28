/*
 * @Description 最新 axios
 * @Author wangjun
 * @Date 2021-03-08 11:25:03
 */
import axios from "axios";
import Config from "./config";
import { Message } from "@weiyi/vit";
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 30000,
  withCredentials: true,
});

function errorReport(url, error, requestOptions, response) {
  if (window.$sentry) {
    const errorInfo = {
      error: typeof error === "string" ? new Error(error) : error,
      type: "request",
      requestUrl: url,
      requestOptions: JSON.stringify(requestOptions),
    };

    if (response) {
      errorInfo.response = JSON.stringify(response);
    }

    window.$sentry.log(errorInfo);
  }
}

// 请求拦截
api.interceptors.request.use(
  (config) => {
    // 需要解决跨域问题的 不能加自定义头
    if (config.forbiddenDefineHeaders) {
      return config;
    }
    return config;
  },
  (e) => {
    console.log(e);
    return Promise.reject(e);
  }
);

// 响应拦截
api.interceptors.response.use(
  (res = {}) => {
    try {
      const status = res.status;
      if (/^2\d{2}/.test(status)) {
        const data = res && res.data;
        if (Object.prototype.toString.call(data) === "[object Blob]") {
          return Promise.resolve(data);
        }
        // 错误提示
        if (data && +data.code !== 0 && data.message) {
          if (res && res.config && res.config.noMessage) {
            return;
          }
          Message({
            message: data.message,
            type: "warning",
          });
          return Promise.reject(data);
        }
        if (res && res.config && res.config.allDataResponse) {
          return Promise.resolve(data);
        } else {
          return Promise.resolve(data && data.data);
        }
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  },
  // 非 2xx 状态响应
  (e) => {
    if (e && e.response && e.response.status >= 400) {
      const { config, data } = e.response;
      errorReport(config.url, data.message, config.data);
      // 错误提示
      if (e.response.data && e.response.data.message) {
        Message({
          message: e.response.data && e.response.data.message,
          type: "warning",
        });
      } else {
        Message({
          message: "网络错误,请稍后再试",
          type: "warning",
        });
      }
    } else {
      Message({
        message: "网络错误,请稍后再试",
        type: "warning",
      });
    }
    return Promise.reject(e);
  }
);
export default api;
