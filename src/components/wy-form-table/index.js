/*
 * @Description
 * @Author wangjun
 * @Date 2020-07-07 15:09:20
 * @LastEditTime 2021-03-29 16:58:03
 * @LastEditors
 */
/* eslint-disable */
import Vue from 'vue';
import WyFormTableComponent from './form-table';

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

const WyFormTable = {
  install(Vue, options) {
    Vue.component('WyFormTable', WyFormTableComponent);
    Vue.prototype.$WYOPITONS = options;
    if (!Vue.prototype.$WYBUS) {
      Vue.prototype.$WYBUS = bus;
    }
  },
};

export default WyFormTable;
