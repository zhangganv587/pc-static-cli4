/*
 * @Author: zhanggan
 * @Date: 2020-08-24 15:43:39
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/store/base/index.js
 */
import actions from "./actions";
// import getters from './getters';
import mutations from "./mutations";
import state from "./state";

export default {
  namespaced: true,
  actions,
  // getters,
  mutations,
  state,
};
