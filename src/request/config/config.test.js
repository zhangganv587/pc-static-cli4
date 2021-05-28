/*
 * @Author: 张淦
 * @Date: 2020-04-22 14:33:50
 * @LastEditors: zhanggan
 * @Description: 医保后台
 * @FilePath: /pc-static-cli4/src/request/config/config.test.js
 */
/* 开发环境配置 */
module.exports = {
  GOPS_LOGIN: "//user.guahao-test.com/login",
  API_URL:
    location.hostname.indexOf("qa1") > -1
      ? "//gpay-ops-web-qa3.guahao-test.com"
      : "//gpay-ops-web-qa3.guahao-test.com",
};
