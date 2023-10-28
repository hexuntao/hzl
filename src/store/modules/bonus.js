import { bonus } from "@/common/data/texts";
import { GET_BONUSSETTEXT } from "@/common/interface/bonus";

export default {
  state: {
    info: {}, //信息
    isSetText: false,
    texts: bonus
  },
  getters: {},
  mutations: {
    // 设置会员文案
    setBonusTexts(state, data = {}) {
      state.texts = data;
      state.isSetText = true;
    }
  },
  actions: {
    // 获取分红代理商设置文案
    getBonusTexts({ rootState, getters, state, commit }) {
      return new Promise((resolve, reject) => {
        const { areabonus, globalbonus, teambonus } = rootState.config.addons;
        if (
          getters.token &&
          (areabonus || globalbonus || teambonus) &&
          !state.isSetText
        ) {
          GET_BONUSSETTEXT().then(({ data }) => {
            if (data.common && data.area && data.global && data.team) {
              commit("setBonusTexts", data);
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
