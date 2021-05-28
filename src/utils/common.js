/*
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0 日期时间查看
 * @FilePath: /pc-static-cli4/src/utils/common.js
 */
import dayjs from "dayjs";
import store from "@/store";

export default {
  judgeState: (data) => {
    // const data = {
    //   accountList: 'getAccountList'
    // };
    for (const k in data) {
      if (!store.state[k].length && !Object.keys(store.state[k]).length) {
        store.dispatch(data[k]);
      }
    }
  },
  // 用于table里面的数据转化
  tableFormat: (arr, key, keyname = "key", labelName = "label") => {
    if (!arr || arr.length <= 0) {
      return "";
    }
    let label = "";
    arr.forEach((cur) => {
      if (cur[keyname] === key) {
        label = cur[labelName];
        return label;
      }
    });
    return label;
  },
  timeFormat: (time, formatStyle = "YYYY-MM-DD HH:mm:ss") => {
    if (time) {
      return dayjs(parseInt(time)).format(formatStyle);
    }
    return "";
  },
  // 金额转化，千分位转化成个位
  moneyFormat: (money) => {
    if (money === "" || money === undefined || money === null) {
      return null;
    }
    const resultMoney = Number(money / 100).toFixed(2);
    return resultMoney;
  },
  // 千位加逗号
  setMoney: (money) => {
    if (!money) {
      return "0";
    }
    const realMoney = Number(money / 100).toFixed(2);
    return parseFloat(realMoney).toLocaleString();
    // return realMoney;
  },
  // 千位加逗号
  setCount: (count) => {
    if (!count) {
      return "0";
    }
    return parseFloat(count).toLocaleString();
    // return realMoney;
  },
  // 根据 key 获取 url search query
  getUrlParams(url, name) {
    if (process.env.NODE_ENV === "development") {
      if (!url) {
        console.warn(
          `[getUrlParams]: please pass a valid URL，but received ${String(
            url
          )} now`
        );
      }

      if (!name) {
        console.warn(
          `[getUrlParams]: type check failed for prop "name". Expected String, got ${name} `
        );
      }
    }
    return new URLSearchParams(url).get(name);
  },
  // 去除输入中的空格
  trim(str) {
    if (str !== null) {
      return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    } else {
      return null;
    }
  },
};
