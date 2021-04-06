/*
 * @Author: zhanggan
 * @Date: 2021-04-06 14:03:27
 * @LastEditors: zhanggan
 * @Description: filter
 * @FilePath: /pc-static-cli4/src/JS/filter.js
 */
// 过滤日期格式，传入时间戳，根据参数返回不同格式
const formatTimer = function (val, hours) {
  if (val) {
    const dateTimer = new Date(val * 1000);
    const y = dateTimer.getFullYear();
    let M = dateTimer.getMonth() + 1;
    let d = dateTimer.getDate();
    let h = dateTimer.getHours();
    let m = dateTimer.getMinutes();
    M = M >= 10 ? M : "0" + M;
    d = d >= 10 ? d : "0" + d;
    h = h >= 10 ? h : "0" + h;
    m = m >= 10 ? m : "0" + m;
    if (hours) {
      return y + "-" + M + "-" + d + " " + h + ":" + m;
    } else {
      return y + "-" + M + "-" + d;
    }
  }
};

// 金额显示为.xx形式
const checkxPrice = function (val) {
  if (val === null || val === "") {
    return "";
  } else {
    let result = "";
    const f = Math.round(val);
    if (isNaN(f)) {
      return result;
    }
    const msg = (f / 100).toString().split(".");
    if (msg.length === 2) {
      if (msg[1].length === 1) {
        result = `${f / 100}0`;
      } else {
        result = `${f / 100}`;
      }
    } else {
      result = `${f / 100}.00`;
    }
    return result;
  }
};
// 金额显示为.xx元形式
const priceNull = function (val) {
  if (val === null || val === "") {
    return "";
  } else {
    let result = "";
    const f = Math.round(val);
    if (isNaN(f)) {
      return result;
    }
    const msg = (f / 100).toString().split(".");
    if (msg.length === 2) {
      if (msg[1].length === 1) {
        result = `${f / 100}0`;
      } else {
        result = `${f / 100}`;
      }
    } else {
      result = `${f / 100}.00`;
    }
    return result + "元";
  }
};
export default {
  formatTimer,
  checkxPrice,
  priceNull,
};
