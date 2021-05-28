/*
 * @Author: zhanggan
 * @Date: 2021-04-14 13:59:08
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/request/config/index.js
 */
/* eslint-disable no-undef */
import dev from "./config.dev";
import test from "./config.test";
import prod from "./config.prod";

let config = dev;

if (process.env.VUE_APP_ENV === "production") {
  config = prod;
} else if (process.env.VUE_APP_ENV === "test") {
  config = test;
}

export default { ...config };
