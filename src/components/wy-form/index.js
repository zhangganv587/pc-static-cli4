/*
 * @Description wy-form
 * @Author wangjun
 * @Date 2020-07-07 13:42:02
 * @LastEditTime 2021-03-29 16:57:54
 * @LastEditors
 */
import Vue from "vue";
import WyFormComponent from "./form.vue";

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

const WyForm = {
  install(Vue) {
    Vue.component("WyForm", WyFormComponent);
    if (!Vue.prototype.$WYBUS) {
      Vue.prototype.$WYBUS = bus;
    }
  },
};

export default WyForm;
