import {
  GET_MEMBERINFO,
  EXTEND_SUB,

  EXTEND_SHOP,
  CHECK_PAYPASSWORD,
  GET_AREA,
  GET_MEMBERSETTEXT,
  GET_MPSUBSCRIDETEMPLATEID,
  SET_MPSUBSCRIDETEMPLATEIFNO,
  GET_NOTICETEMPLATEID,
  SET_POSTNOTICETEMPLATEINFO
} from "@/common/interface/member";
import $Storage from "@/api/storage";
import $Prompt from "@/api/prompt";
import { memberText } from "@/common/data/texts";
import { Base64 } from "@/common/lib/base64";
import {
  SET_BINDMOBILE,
  GET_BINDMOBILE,
  REMOVE_BINDMOBILE
} from "@/common/utils/auth";

// #ifdef H5
import Vue from "vue";
// #endif

function getName({ nick_name, user_name, user_tel }) {
  if (nick_name) return nick_name;
  if (user_name) return user_name;
  if (user_tel) return user_tel;
  return "未设置昵称";
}

export default {
  state: {
    sceneCode: "", // 场景推广码(分享进来的code)
    posterParams: null, // 海报分享场景参数
    //会员信息
    info: {
      // 添加默认字段名，方可监听数据
      uid: "",
      balance: 0,
      point: 0,
      user_tel: "",
      extend_code: "",
      openid: "",
      member_img: "",
      nick_name: "",
      referee_name: "",
      isdistributor: "",
      country_code: "",
      ppl: 0, // 支付密码长度
      is_password_set: 0, // 是否设置过密码
      receivegoodscode: {
        copy_writing: "领货码",
        count: 0
      }
    },
    // 是否绑定过手机
    isBindMobile: 0,
    texts: memberText,
    areaList: ""
  },
  getters: {
    // 场景推广码(分享进来的code)
    sceneCode: state => {
      return state.sceneCode || $Storage.get("sceneCode") || "";
    },
    // 会员自身推广码
    extendCode: state =>
      state.info && state.info.extend_code ? state.info.extend_code : "",
    encodeUid: state => {
      return state.info && state.info.uid
        ? encodeURIComponent(Base64.encode(state.info.uid))
        : "";
    },
    /**
     * 弹出绑定手机的标识
     */
    getPhoneNumber: (state, root) => {
      return root.isBingFlag ? "getPhoneNumber" : "";
    },
    // 是否绑定过手机
    isBindMobile: state => {
      return state.isBindMobile
        ? state.isBindMobile
        : GET_BINDMOBILE()
        ? Number(GET_BINDMOBILE())
        : 0;
    },
    /**
     * 是否显示绑定手机弹窗
     * 小程序弹出选择手机号窗口
     * h5端跟app弹除绑定手机窗口
     */
    isShowBindMobile: (state, root) => {
      return root.token && root.isBingFlag && !state.isBindMobile;
    },
    /**
     * 是否需要用户授权
     * 无会员头像跟昵称表示需要用户点击授权
     */
    isNeedAuthorize: ({ info }) => {
      return !(info.member_img && info.nick_name);
    }
  },
  mutations: {
    // 设置会员信息
    setMemberInfo(state, info = {}) {
      state.info = Object.assign({ ...state.info }, { ...info });
    },
    // 设置登录后是否绑定手机号标识 1为绑定  其他未绑定
    setBindMobile(state, have_mobile) {
      state.isBindMobile = have_mobile ? 1 : 0;
      SET_BINDMOBILE(state.isBindMobile);
    },
    // 删除会员信息
    removeMemberInfo(state) {
      state.info = {};
      REMOVE_BINDMOBILE();
    },
    // 设置会员文案
    setMemberTexts(state, data = {}) {
      state.texts = data;
    },
    // 设置场景推广码
    setSceneCode(state, code) {
      let str = null;
      // 如url存在多个推广码情况，获取到的推广码为数组，所以取数组最后一个值
      if (Array.isArray(code)) {
        str = code[code.length - 1];
      } else {
        str = code;
      }
      state.sceneCode = str;
      $Storage.set("sceneCode", str);
    },
    // 设置分享海报参数
    setSharePosterParams(state, params) {
      state.posterParams = params;
    },
    // 设置分享海报参数
    setShareShopParams(state, params) {
      state.shopParams = params;
    },
    // 删除场景推广码
    removeSceneCode(state) {
      $Storage.remove("sceneCode");
      state.sceneCode = null;
    },
    setAreaList(state, list) {
      state.areaList = list;
    }
  },
  actions: {
    /**
     * 获取会员信息
     * @param {*} update 是否更新会员信息 默认false,
     */
    getMemberInfo({ state, commit, rootState, getters }, con = {}) {
      return new Promise((resolve, reject) => {
        con.update || !state.info.uid ? getData() : resolve(state.info);
        function getData() {
          GET_MEMBERINFO({}, con.config)
            .then(({ data }) => {
              // data.user_tel = "";
              // data.member_img = "";
              // data.nick_name = "";
              // data.username = "";
              // data.is_password_set = 0;
              // data.isdistributor = 0;
              if (data.uid) {
                data.name = getName(data);
                data.level_name = data.level_name || "默认等级";
                data.member_img = data.member_img || getters.static.noAvatar;

                // 开启代理分销应用 分销商状态为代理分销的状态
                if (rootState.config.addons.agent) {
                  data.isdistributor = data.isagent;
                }

                // #ifdef MP-WEIXIN
                data.openid = data.mp_openid;
                // #endif

                // #ifndef MP-WEIXIN
                data.openid = data.wx_openid;
                // #endif
                commit("setMemberInfo", data);
                commit("setBindMobile", data.user_tel);
                resolve(data);
              } else {
                commit("setBindMobile", 0);
                commit("removeUserInfo", {});
                commit("removeMemberInfo");
                resolve();
              }
            })
            .catch(error => {
              resolve(state.info);
            });
        }
      });
    },
    // 获取会员设置文案
    getMemberTexts({ commit }) {
      return new Promise((resolve, reject) => {
        GET_MEMBERSETTEXT()
          .then(({ data }) => {
            if (data.balance_style) {
              commit("setMemberTexts", data);
            }
            resolve();
          })
          .catch(() => {});
      });
    },
    // 推广下线
    extendSub({ state, commit }) {
      return new Promise((resolve, reject) => {
        let params = {};
        params.extend_code = state.sceneCode;
        if (state.posterParams) {
          params.poster_id = state.posterParams.poster_id;
          params.poster_type = state.posterParams.poster_type;
        }
        EXTEND_SUB(params)
          .then(({ message }) => {
            commit("removeSceneCode");
            resolve();
            console.log(message);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 推广下线
    extendShop({ state, commit }) {
      return new Promise((resolve, reject) => {
        let params = {};
        params.shop_id = state.shopParams.shop_id;

        EXTEND_SHOP(params)
            .then(({ message }) => {
              resolve();
              console.log(message);
            })
            .catch(error => {
              reject(error);
            });
      });
    },
    // 检查支付密码
    checkPayPassword(context, password) {
      return new Promise((resolve, reject) => {
        CHECK_PAYPASSWORD({ password })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 小程序绑定手机号
     */
    mpBindMobile({ commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        dispatch("bindAccount", {
          get_wx_mobile: true,
          encrypted_data: params.encryptedData,
          iv: params.iv
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 获取省市区列表
     */
    getAreaList({ commit }, config = {}) {
      return new Promise((resolve, reject) => {
        GET_AREA({}, config)
          .then(({ data }) => {
            // commit("setAreaList", data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 小程序设置订阅消息，必须使用button按钮点击后才能弹出订阅窗口
    // setSubscribe({ state }, options = {}) {
    //   return new Promise((resolve, reject) => {
    //     // #ifndef MP-WEIXIN
    //     resolve();
    //     // #endif
    //     // #ifdef MP-WEIXIN
    //     GET_MPSUBSCRIDETEMPLATEID({ type: options.type })
    //       .then(({ data }) => {
    //         let arr = data || [];
    //         let tmplIds = [];
    //         arr.forEach(e => {
    //           if (e.type == options.type && e.status == 1) {
    //             tmplIds.push(e.template_id);
    //           }
    //         });
    //         if (tmplIds.length) {
    //           // 发送订阅消息
    //           uni.requestSubscribeMessage({
    //             tmplIds: tmplIds,
    //             success: res => {
    //               let params = {
    //                 uid: state.info.uid,
    //                 list: []
    //               };
    //               console.log("success", res);
    //               for (const key in res) {
    //                 if (key != "errMsg" && key != "errCode") {
    //                   params.list.push({
    //                     template_id: key,
    //                     action: res[key]
    //                   });
    //                 }
    //               }
    //               console.log("订阅消息模板", params);
    //               if (params.list.length) {
    //                 SET_MPSUBSCRIDETEMPLATEIFNO(params, {
    //                   isShowLoading: true
    //                 })
    //                   .then(m => {
    //                     console.log("消息发送成功", m);
    //                     resolve();
    //                   })
    //                   .catch(error => {
    //                     console.log(error);
    //                     resolve();
    //                   });
    //               } else {
    //                 resolve();
    //               }
    //             },
    //             fail: ({ errMsg, errCode }) => {
    //               console.log(errCode, errMsg);
    //               resolve();
    //             },
    //             complete: () => {}
    //           });
    //         } else {
    //           resolve();
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //         resolve();
    //       });
    //     // #endif
    //   });
    // },

    // 公众号订阅通知
    setSubscribeH5({ state }, options = {}) {
      return new Promise((resolve, reject) => {
        GET_NOTICETEMPLATEID({ node_id: options.node_id })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            resolve(error);
          });
      });
    },

    // 新=>统一小程序 H5订阅消息
    setSubscribe({ state }, options = {}) {
      return new Promise((resolve, reject) => {
        // #ifndef MP-WEIXIN
        resolve();
        // #endif
        // #ifdef MP-WEIXIN
        GET_NOTICETEMPLATEID({ node_id: options.node_id })
          .then(res => {
            // console.log(res);
            let arr = res.data || [];
            let tmplIds = [];

            arr.forEach(e => {
              if (arr.length > 0) {
                tmplIds.push(e.template_id);
              }
            });
      
            // resolve(res);
            if (tmplIds.length) {
              // 发送订阅消息
              uni.requestSubscribeMessage({
                tmplIds: tmplIds,
                success: res => {
                  let params = {
                    uid: state.info.uid,
                    list: []
                  };
                  console.log("success", res);
                  for (const key in res) {
                    if (key != "errMsg" && key != "errCode") {
                      params.list.push({
                        template_id: key,
                        action: res[key]
                      });
                    }
                  }
                  arr.forEach(e=>{
                    console.log(e.template_code);
                    params.list.forEach(k=>{
                      console.log(k,"k");
                      if(e.template_id==k.template_id){
                        k['template_code']=e.template_code
                      }
                     
                    })

                  })
                  console.log("订阅消息模板", params);
                  if (params.list.length) {
                    SET_POSTNOTICETEMPLATEINFO(params, {
                      isShowLoading: true
                    })
                      .then(m => {
                        console.log("消息发送成功", m);
                        resolve();
                      })
                      .catch(error => {
                        console.log(error);
                        resolve();
                      });
                  } else {
                    resolve();
                  }
                },
                fail: ({ errMsg, errCode }) => {
                  console.log(errCode, errMsg);
                  resolve();
                },
                complete: () => {}
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            console.log(error);
            resolve();
          });
        // #endif
      });
    }
  }
};
