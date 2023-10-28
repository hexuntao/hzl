<script>
import $Plugins from "./api/plugins";
import $Other from "./api/other";
import $Store from "./store";
// #ifdef H5
import { mapGetters } from "vuex";
import routes from "./router/routes";
import {
  routePathToName,
  formatURLQuery,
  encodeUriParams
} from "./common/utils";
import { compPath } from "./common/utils/comp-path";
// #endif

let flag = true;

// #ifdef MP-WEIXIN
// 微信小程序直播插件
let livePlayer = "";
if (__wxConfig.plugins && __wxConfig.plugins["live-player-plugin"]) {
  livePlayer = requirePlugin("live-player-plugin");
}
// #endif

export default {
  globalData:{
    isshow:1
  },
  onLaunch(options) {
    flag = false;
    const { path, query } = options;

    // #ifdef H5
    const pathname = location.pathname.split("/wap")[1];
    if (
      pathname &&
      pathname != "/" &&
      pathname.indexOf("/pay/payment") == -1 &&
      pathname.indexOf("/pay/level") == -1 &&
      pathname.indexOf("/pay/membercard") == -1 &&
      pathname.indexOf("/pay/wallet") == -1 &&
      pathname.indexOf("/pages/") == -1 &&
      pathname.indexOf("/packages/") == -1
    ) {
      const isRoute = routes[routePathToName(compPath(pathname))];
      if (isRoute) {
        console.log("旧路由转新路由", compPath(pathname) + location.search);
        location.assign(
          `${location.origin}/wap${compPath(pathname) + location.search}`
        );
        return false;
      }
    }
    // #endif

    // #ifdef MP-WEIXIN
    // 获取第三方平台数据
    const extConfig = $Plugins.getExtConfig(true);
    $Store.commit("setExtConfig", extConfig);
    console.log($Store.getters.token || "");
    // #endif

    console.log($Store.getters.token ? "已登录" : "未登录");

    // #ifdef H5
    if (!$Store.getters.token && $Store.state.isWeixin) {
      // h5 微信端 不在这里进行获取配置，需在pages路由拦截 前登陆，避免页面onLoad生命周期同时执行
      return false;
    }
    // #endif
    $Store
      .dispatch("getConfig", {
        update: true,
        debug: query.debug
      })
      .then(config => {
        if (!config.wap_status) {
          // 商城未开启跳转商城公告提示
          uni.reLaunch({
            url: "/packages/mall/notice?type=unopened&tip=商城已关闭"
          });
          return false;
        }
        if (
          config.wap_status &&
          path == "packages/mall/notice" &&
          query.type == "unopened"
        ) {
          uni.reLaunch({
            url: "/pages/mall/index"
          });
          return false;
        }
        if ($Store.state.isWeixin && !config.is_wchat) {
          // 微信环境 未对接公众号跳转商城公告
          uni.reLaunch({
            url: "/packages/mall/notice?type=nowechat"
          });
          return false;
        }

        // #ifdef APP-PLUS
        if (config.addons.appshop) {
          $Other.appUpdateManager({
            version: config.app_version,
            wgturl: config.app_wgturl
          });
        }
        // #endif

        // #ifdef H5
        if (!$Store.getters.token) {
          if (query.code && query.state === "wchat") {
            // 微信授权成功回调携带参数
            $Store
              .dispatch("authLogin", {
                type: "WCHAT",
                code: query.code,
                method: "GET"
              })
              .then(() => {
                location.reload();
              });
          } else if (query.user_token && query.state == "qq") {
            // qq授权获取user_token
            $Store.commit("setUserInfo", {
              user_token: query.user_token,
              have_mobile: true
            });
          } else {
            if (
              $Store.state.isWeixin &&
              config.is_wchat &&
              process.env.NODE_ENV != "development"
            ) {
              const fullPath =
                "/" + path + formatURLQuery(`?${encodeUriParams(query)}`);
              // 微信环境自动授权登录(开发环境不自动授权登录)
              $Store.commit("setLoginBeforePath", fullPath);
              // 获取场景参数并储存
              const { extend_code, poster_id, poster_type } = query;
              if (extend_code) {
                $Store.commit("setSceneCode", extend_code);
                // 场景海报参数
                if (poster_id && poster_type) {
                  $Store.commit("setSharePosterParams", {
                    poster_id,
                    poster_type
                  });
                }
              }
              $Store.dispatch("authLogin", {
                type: "WCHAT",
                redirect_url: fullPath
              });
            }
          }
        }
        if (config.vconsole) {
          const vconsole = require("./static/h5/vconsole.min");
          new vconsole();
          console.info("version", $Store.state.version);
        }
        // #endif
      })
      .catch(err => {
        const { code, message } = err || {};
        if (
          (code == -10000 || code == -10001) &&
          path != "/packages/mall/notice" &&
          query.type != "unopened"
        ) {
          uni.reLaunch({
            url: "/packages/mall/notice?type=unopened&tip=" + message
          });
        }
      });
  },
  onShow(options) {
    // #ifdef MP-WEIXIN
    $Other.updateManager(); // 小程序更新
    // #endif

    // 应用生命周期 应用显示时都重新刷新商城配置
    if (flag && process.env.NODE_ENV != "development") {
      $Store
        .dispatch("getConfig", {
          update: true
        })
        .then(data => {
          typeof this.configCall === "function" && this.configCall(data);
          $Store.getters.token &&
            $Store.dispatch("getMemberInfo", {
              update: true
            });
        });
    }

    // #ifdef MP-WEIXIN
    const { scene } = options;
    if (livePlayer && (scene == 1007 || scene == 1008 || scene == 1044)) {
      livePlayer
        .getShareParams()
        .then(res => {
          const { room_id, openid, share_openid, custom_params } = res;
          console.log(res);
          if (custom_params.extend_code) {
            $Store.commit("setSceneCode", custom_params.extend_code);
            // 登录状态下成为下线
            $Store.getters.token && $Store.dispatch("extendSub");
          }
          const param = custom_params ? JSON.parse(custom_params) : {};
          if (param.extend_code) {
            $Store.commit("setSceneCode", param.extend_code);
            // 登录状态下成为下线
            $Store.getters.token && $Store.dispatch("extendSub");
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    }
    // #endif
  },
  onHide() {
    flag = true;
  },
  onError(e) {
    console.log("onError", e);
  },
  // #ifdef H5
  watch: {
    routeInfo({ meta }) {
      if (uni.canIUse("css.var")) {
        const windowBottomValue = meta.isTabBar ? this.windowBottom : 0;
        const envMethod = uni.canIUse("css.env")
          ? "env"
          : uni.canIUse("css.constant")
          ? "constant"
          : "";
        const bottom =
          windowBottomValue && envMethod
            ? `calc(${windowBottomValue}px + ${envMethod}(safe-area-inset-bottom))`
            : `${windowBottomValue}px`;
        document.documentElement.style.setProperty("--window-bottom", bottom);
      }
    }
  },
  computed: {
    ...mapGetters({
      routeInfo: "route",
      windowBottom: "windowBottom"
    })
  }
  // #endif
};
</script>

<style lang="scss">
@import "./common/styles/app.scss";
</style>
