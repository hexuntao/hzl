import { GET_POSTERIMG } from "@/common/interface/poster";

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    /**
     * 获取海报图片
     * @param {Object} params
     * type ==> 1：商城海报 2：商品海报 3：关注海报 4：微店海报
     * goods_id ==> 为商品海报时需传商品id
     * is_mp ==> 为小程序
     * mp_page ==> 小程序路径
     */
    getPosterImg({ rootState, getters }, params) {
      return new Promise((resolve, reject) => {
        if (
          rootState.config.addons.poster &&
          getters.token &&
          rootState.member.info.isdistributor == 2
        ) {
          // #ifdef MP-WEIXIN
          params.is_mp = 1;
          // #endif
          params.scene = true; //表示新版本获取超级海报
          GET_POSTERIMG(params)
            .then(({ data }) => {
              let path = data.poster_path
                ? `${rootState.domain}/${data.poster_path}`
                : data.poster;
              data.poster
                ? resolve({
                    path: path,
                    width: data.width,
                    height: data.height,
                      shop_name: data.shop_name
                  })
                : reject();
            })
            .catch(() => {
              reject();
            });
        } else {
          reject();
        }
      });
    }
  }
};
