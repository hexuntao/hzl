import Vue from "vue";
import I18n from "@/static/js/i18n.min";
import zh from "../lang/zh-CN";
import en from "../lang/en-US";

Vue.use(I18n);

export default new I18n({
  locale: "zh-CN",
  messages: {
    "zh-CN": {
      ...zh
    },
    "en-US": {
      ...en
    }
  }
});
