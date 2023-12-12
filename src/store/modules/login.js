import {
  LOGIN,
  OTHER_LOGIN,
  LOGOUT,
  GET_MSGCODE,
  IS_HASMOBILE,
  BIND_ACCOUNT
} from "@/common/interface/login";

import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/common/utils/auth";
import $Prompt from "@/api/prompt";
import $Navigate from "@/api/navigate";

const port = {
  wx: 1, //公众号
  mp: 2, //小程序
  h5: 3, //h5端
  pc: 4, //pc端
  app: 5 //app端
};

export default {
  state: {
    token: null,
    name: null,
    avatar: null,
    openid: null
  },
  getters: {
    // 用户标识，可用与是否登录状态
    token: state => state.token || GET_TOKEN() || ""
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, info) {
      state.token = info.user_token;
      state.name = info.user_name;
      state.avatar = info.user_headimg;
      state.openid = info.openid;
      SET_TOKEN(info.user_token);
    },
    // 删除用户信息
    removeUserInfo(state, info = {}) {
      state.token = info.user_token;
      state.name = info.user_name;
      state.avatar = info.user_headimg;
      state.openid = "";
      REMOVE_TOKEN();
    }
  },
  actions: {
    // 登录
    login({ commit, dispatch, getters }, form) {
      return new Promise((resolve, reject) => {
        let mall_port = getters.port;
        form.mall_port = mall_port;
        LOGIN(form)
          .then(res => {
            if (res.code === 0) {
              // 登陆失败次数过多，需要验证码
              resolve(res);
            } else {
              commit("setUserInfo", res.data);
              dispatch("getMemberInfo", { update: true }).then(() => {
                resolve(res);
                dispatch("getCartList", { update: true });
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 授权登录接口（微信公众号，微信小程序，qq）
     * 类型form[type]：
     * WCHAT=>微信公众号
     * MP=>微信小程序
     * QQLOGIN=>qq
     */
    authLogin({ commit, dispatch, rootState, getters }, form = {}) {
      return new Promise((resolve, reject) => {
        const config = {};
        const sceneCode = getters.sceneCode; //分享进来的推广码
        let params = {};
        params.type = form.type;
        console.log("分享进来的推广码：", sceneCode);
        if (sceneCode) {
          params.extend_code = sceneCode;
        }

        // #ifdef MP-WEIXIN
        params = Object.assign({ ...params }, { ...form });
        // #endif

        // #ifdef APP-PLUS
        params.wx_openid = form.openId;
        params.name = form.nickName;
        params.unionGender = form.gender;
        params.iconurl = form.avatarUrl;
        params.unionid = form.unionId;
        // #endif

        // #ifdef H5
        config.method = form.method; // 第二次请求时使用get方式请求
        params.code = form.code; // 微信授权code
        if (form.redirect_url) {
          // 微信授权成功回调地址
          params.redirect_url = form.redirect_url;
        }
        // #endif

        // #ifndef H5
        config.loadingText = "登录中";
        // #endif
        console.log(params);


        OTHER_LOGIN(params, config)
          .then(res => {
            const { code, data, message } = res;
            if (code === 1) {
              // 登录成功
              commit("setUserInfo", data);
              // 有推广码授权成功则删除该推广码
              if (params.extend_code) {
                commit("removeSceneCode");
              }
              dispatch("getMemberInfo", {
                update: true,
                config: { loadingText: "加载中" }
              }).then(() => {
                console.log("获取会员信息", rootState.member.info);
                resolve(res);
                dispatch("getCartList", { update: true });
              });
            } else if (code === 2) {
              // 需要绑定手机
              $Navigate.replace("/pages/member/index").then(() => {
                $Prompt.toast(message);
              });
            } else if (code === 3) {
              // 账号被锁定
              $Navigate.pushTab("/pages/mall/index").then(() => {
                $Prompt.toast(message);
              });
            } else if (code === 4) {
              // h5进行授权
              // #ifdef H5
              if (typeof data.url === "string") {
                location.replace(data.url);
              } else {
                $Prompt.modal({
                  content: JSON.stringify(data),
                  showCancel: false
                });
              }
              // #endif
            } else if (code === 5) {
              // #ifdef MP-WEIXIN
              // 再次登录（微信小程序情况下）
              uni.login({
                provider: "weixin",
                complete(res) {
                  if (!res.code) {
                    $Prompt.modal({
                      content: "微信登录失败",
                      showCancel: false
                    });
                  }
                  dispatch("authLogin", { ...params, code: res.code }).then(
                    res => {
                      resolve(res);
                    }
                  );
                }
              });
              // #endif
            }else if(code===9725){
              resolve(res);

            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
            $Prompt.modal({ content: error.message, showCancel: false });
          });
      });
    },
    // 退出登录
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        LOGOUT()
          .then(res => {
            commit("removeUserInfo", {});
            commit("removeMemberInfo");
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取短信验证码
    getMsgcode({ rootState, getters }, form) {
      const mobile = form.mobile; // 获取输入的手机号
      return new Promise((resolve, reject) => {
        if (rootState.config.mobile_verification) {
          let mall_port = getters.port;
          if (form.type === "register") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              if (code === 0) {
                // 1 为存在手机号  0为 不存在手机号
                GET_MSGCODE(form)
                  .then(res => {
                    $Prompt.toast({ title: res.message, icon: "success" });
                    resolve(res);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                $Prompt.toast("该手机号码已被注册！");
              }
            });
          } else if (form.type === "login" || form.type === "forget_password") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              if (code === 1) {
                // 判断是否已注册手机号
                GET_MSGCODE(form)
                  .then(res => {
                    $Prompt.toast({ title: res.message, icon: "success" });
                    resolve(res);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                $Prompt.toast(message);
              }
            });
          } else if (
            form.type === "bind_email" ||
            form.type === "change_pay_password" ||
            form.type === "change_password" ||
            form.type === "update_mobile"
          ) {
            // 修改资料
            if (form.type == "update_mobile") {
              form.type = "bind_mobile";
            }
            GET_MSGCODE(form)
              .then(res => {
                $Prompt.toast({ title: res.message, icon: "success" });
                resolve(res);
              })
              .catch(error => {
                reject(error);
              });
          } else if (form.type === "bind_mobile") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              GET_MSGCODE(form)
                .then(res => {
                  $Prompt.toast({ title: res.message, icon: "success" });
                  resolve({ isHasMobile: code, msg: message });
                })
                .catch(error => {
                  reject(error);
                });
            });
          }
        } else {
          $Prompt.toast("商城未开启短信模版");
        }
      });
    },
    // 关联账户
    bindAccount({ commit, dispatch, getters }, form) {
      return new Promise((resolve, reject) => {
        let params = Object.assign({}, { ...form });
        let mall_port = getters.port;
        params.mall_port = mall_port;
        BIND_ACCOUNT(params)
          .then(({ code, data, message }) => {
            if (code === 1) {
              commit("setUserInfo", data);
              $Prompt.toast({ title: "关联成功", icon: "success" });
              //  更新会员数据
              dispatch("getMemberInfo", { update: true }).then(() => {
                resolve(data);
              });
            } else if (code === 5) {
              // #ifdef MP-WEIXIN
              // 再次登录（微信小程序情况下）
              uni.login({
                provider: "weixin",
                complete(res) {
                  if (!res.code) {
                    $Prompt.modal({
                      content: "微信登录失败",
                      showCancel: false
                    });
                  }
                  dispatch("authLogin", { code: res.code }).then(() => {
                    dispatch("bindAccount", { ...params });
                  });
                }
              });
              // #endif
            } else {
              $Prompt.toast(message);
              reject();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
