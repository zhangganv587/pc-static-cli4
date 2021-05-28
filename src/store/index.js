import Vue from "vue";
import Vuex from "vuex";

import types from "./types";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

export { types };

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {},
});
