import Vue from "vue";
import App from "./App";
import store from "./store";
import navigate from "./api/navigate";
import prompt from "./api/prompt";

// #ifdef MP-WEIXIN
import "./common/lib/weapp-cookie";
// #endif

// #ifdef H5
import popupBindMobile from "./components/lk/bind-mobile";
Vue.component("popupBindMobile", popupBindMobile);
Vue.prototype.$BindMobile = popupBindMobile;
import barrage from "./components/lk/barrage";
Vue.component("barrage", barrage);
Vue.prototype.$Barrage = barrage;
Vue.prototype.$Barrage.create();
// #endif

import pages from "./mixins/pages";

Vue.prototype.$Navigate = navigate;
Vue.prototype.$Prompt = prompt;

// 注入全局
Vue.mixin(pages);

Vue.config.productionTip = false;
App.mpType = "app";

// #ifdef H5
Vue.config.ignoredElements.push("wx-open-subscribe");
// #endif

const app = new Vue({
  ...App,
  store
});

app.$mount();
