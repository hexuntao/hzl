import {
  GET_SHAREINFO,
  GET_THINGCIRCLETWOTEXTS
} from "@/common/interface/thingcircletwo";
import { thingcircletwo } from "@/common/data/texts";

export default {
  state: {
    isSetText: false,
    texts: thingcircletwo
  },
  mapMutations: {
    // 设置社交圈文案
    setThingcircletwoTexts(state, data = {}) {
      state.texts = data;
      state.isSetText = true;
    }
  },
  actions: {
    /**
     * 获取社交圈分享参数
     * @param {String} params
     */
    getThingcircletwoShareInfo(context, params) {
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
    getThingcircletwoTexts({ rootState, state, commit }) {
      return new Promise((resolve, reject) => {
        if (!state.isSetText) {
          GET_THINGCIRCLETWOTEXTS().then(({ data }) => {
            if (data.thingcircletwo) {
              commit("setThingcircletwoTexts", data);
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
