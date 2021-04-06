/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from "vue";
import Vuex from "vuex";

// Modules
import base from "./base";
import payStation from "./payStation";
Vue.use(Vuex);

const store = new Vuex.Store({
  /**
   * Assign the modules to the store
   */
  modules: {
    base,
    payStation,
  },

  /**
   * If strict mode should be enabled
   */
  strict: false,
});

export default store;
