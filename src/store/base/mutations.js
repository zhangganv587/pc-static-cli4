/*
 * @Author: zhanggan
 * @Date: 2020-08-27 18:04:00
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/store/base/mutations.js
 */
import types from "./type";

export default {
  [types.BASE_PAY_INFO](state, data) {
    console.log(data);
    state.payInfo = data;
  },
  [types.BASE_PAY_RESULT](state, data) {
    state.payResult = data;
  },
};
