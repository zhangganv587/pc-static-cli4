/*
 * @Description wy-table
 * @Author wangjun
 * @Date 2020-07-03 10:52:33
 * @LastEditTime 2021-03-29 16:58:13
 * @LastEditors
 */
import Vue from "vue";
import WyTableComponent from "./wy-table";
/* eslint-disable */
const bus = new Vue({
  methods: {
    on(event, callback) {
      this.$on(event, callback);
      return this;
    },

    once(event, callback) {
      this.$once(event, callback);
      return this;
    },

    off(event, callback) {
      this.$off(event, callback);
      return this;
    },

    emit(event, ...args) {
      this.$emit(event, ...args);
      return this;
    },
  },
});

const WyTable = {
  install(Vue, options) {
    Vue.component('WyTable', WyTableComponent);
    Vue.prototype.$WYTABLE = options;
    if (!Vue.prototype.$WYBUS) {
      Vue.prototype.$WYBUS = bus;
    }
  },
};

export default WyTable;
