import {
  GET_SHAREINFO,
  GET_THINGCIRCLETEXTS
} from "@/common/interface/thingcircle";
import { thingcircle } from "@/common/data/texts";

export default {
  state: {
    isSetText: false,
    texts: thingcircle
  },
  mapMutations: {
    // 设置社交圈文案
    setThingcircleTexts(state, data = {}) {
      state.texts = data;
      state.isSetText = true;
    }
  },
  actions: {
    /**
     * 获取社交圈分享参数
     * @param {String} params
     */
    getThingcircleShareInfo(context, params) {
      return new Promise((resolve, reject) => {
        GET_SHAREINFO(params)
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 获取社交圈设置文案
    getThingcircleTexts({ rootState, state, commit }) {
      return new Promise((resolve, reject) => {
        if (!state.isSetText) {
          GET_THINGCIRCLETEXTS().then(({ data }) => {
            if (data.thingcircle) {
              commit("setThingcircleTexts", data);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    }
  }
};
