import Vue from "vue";
import Vuex from "vuex";
import basic from './basic'

Vue.use(Vuex);

let modules = {};
const files = require.context("./modules", false, /\.js$/);
files.keys().forEach(key => {
  const item = files(key).default;
  const name = key.replace(/(.*\/)*([^.]+).*/gi, "$2");
  modules[name] = item;
});

export default new Vuex.Store({
  state: {
    ...basic.state
  },
  getters: {
    ...basic.getters
  },
  mutations: {
    ...basic.mutations
  },
  modules
});
