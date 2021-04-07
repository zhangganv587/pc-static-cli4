/*
 * @Author: zhanggan
 * @Date: 2021-04-06 14:03:27
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/services/axios.js
 */
/*eslint-disable*/
import axios from "axios";
import { baseApi } from "../config";

/* 全局默认配置 */
var http = axios.create({
  baseURL:
    process.env.VUE_APP_ENV === "production"
      ? baseApi
      : baseApi + sessionStorage.getItem("api"),
  timeout: 5000,
});
/* 请求拦截器 */
http.interceptors.request.use(
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

/* 响应拦截器 */
http.interceptors.response.use(
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

function get(url, data, loading) {
  return new Promise((resolve, reject) => {
    http
      .get(url)
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      )
      .catch((error) => {
        reject(error);
      });
  });
}

function post(url, data, loading) {
  return new Promise((resolve, reject) => {
    http
      .post(url, data, { loading: loading })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      )
      .catch((error) => {
        reject(error);
      });
  });
}

export { http, get, post };
