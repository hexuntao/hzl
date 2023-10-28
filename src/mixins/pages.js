import share from "./share";
import { mapGetters } from "vuex";
import { yuan } from "@/common/utils";
import { isTabbarRoute } from "@/common/utils/navigate";
// #ifdef H5
import $Store from "@/store";
import { formatURLQuery, encodeUriParams } from "@/common/utils";
// #endif

export default {
  data() {
    return {
      routeQuery: {}
    };
  },
  computed: {
    ...mapGetters(["token", "theme"])
  },
  filters: {
    yuan(value) {
      return yuan(value);
    }
  },
  mixins: [share],
  async onLoad(options) {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];

    this.routeQuery = options;
    if (options.scene && options.scene.indexOf("_") == -1) {
      // 小程序太阳码进入场景，需要解析参数
      this.routeQuery = await this.$store.dispatch("getMpCodeScene", {
        scene: options.scene
      });
    }
    this.callLoad(this.routeQuery);

    this.$store.commit("setCurrentRoute", {
      path: page.route,
      query: this.routeQuery
    });

    // 获取场景参数并储存
    const { extend_code, poster_id, poster_type,shop_id } = this.routeQuery;
    if (extend_code) {
      this.$store.commit("setSceneCode", extend_code);
      // 场景海报参数
      if (poster_id && poster_type) {
        this.$store.commit("setSharePosterParams", {
          poster_id,
          poster_type
        });
      }
      // 登录状态下成为下线
      this.token && this.$store.dispatch("extendSub");
    }

    if (shop_id) {
      this.$store.commit("setShareShopParams", {
        shop_id,
      });
      this.$store.dispatch("extendShop")
    }

    if (
      this.$store.getters.route.name &&
      !this.$store.state.isWeixin &&
      !this.token &&
      !this.$store.getters.route.meta.noLogin
    ) {
      // 非微信环境下，未登录情况跳转到登录页面
      this.$store.commit(
        "setLoginBeforePath",
        this.$store.getters.route.fullPath
      );
      return uni.redirectTo({ url: "/packages/login/index" });
    }
  },
  onShow() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    if (page) {
      //第一次进入可能会获取不到page
      this.$store.commit("setCurrentRoute", {
        path: page.route,
        query: this.routeQuery
      });

      // #ifdef MP-WEIXIN
      // tabbar 页面需设置 icon
      if (isTabbarRoute("/" + page.route)) {
        this.$store.commit("setTabbarStyle");
        this.$store.commit("setTabbarCartBage");
      }
      // #endif
    }
  },
  onHide() {
    this.$store.commit("clearRequestList");
  },
  onUnload() {
    this.$store.commit("clearRequestList");
  },
  // #ifdef H5
  beforeRouteEnter(to, from, next) {
    if (!$Store.getters.token && $Store.state.isWeixin) {
      const query = to.query;
      $Store
        .dispatch("getConfig", {
          update: true,
          debug: query.debug
        })
        .then(config => {
          if (!config.wap_status) {
            if (to.path == "/packages/mall/notice") {
              next();
            } else {
              // 商城未开启跳转商城公告提示
              uni.reLaunch({
                url: "/packages/mall/notice?type=unopened&tip=商城已关闭"
              });
            }
            return false;
          }
          if (to.path == "/packages/mall/notice" && query.type == "unopened") {
            uni.reLaunch({
              url: "/pages/mall/index"
            });
            return false;
          }
          if (!config.is_wchat) {
            // 未对接公众号跳转商城公告
            if (to.path == "/packages/mall/notice") {
              next();
            } else {
              uni.reLaunch({ url: "/packages/mall/notice?type=nowechat" });
            }
            return false;
          }

          if (query.code && query.state === "wchat") {
            // 微信授权成功回调携带参数
            $Store
              .dispatch("authLogin", {
                type: "WCHAT",
                code: query.code,
                method: "GET"
              })
              .then(() => {
                next();
              });
          } else if (query.user_token && query.state == "qq") {
            // qq授权获取user_token
            $Store.commit("setUserInfo", {
              user_token: query.user_token,
              have_mobile: true
            });
            next();
          } else {
            if (config.is_wchat && process.env.NODE_ENV != "development") {
              const fullPath =
                to.path + formatURLQuery(`?${encodeUriParams(query)}`);
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
              // 这里没有next()  是因为授权登录 会跳转到微信授权页面
            } else {
              next();
            }
          }

          if (config.vconsole) {
            // vconsole 是 在手机端调试使用，接口返回vconsole为true 即可
            const vconsole = require("../static/h5/vconsole.min");
            new vconsole();
            console.info("version", $Store.state.version);
          }
        })
        .catch(err => {
          const { code, message } = err;
          if (
            code == -10001 &&
            to.path != "/packages/mall/notice" &&
            query.type != "unopened"
          ) {
            uni.reLaunch({
              url: "/packages/mall/notice?type=unopened&tip=" + message
            });
          } else {
            next();
          }
        });
    } else {
      next();
    }
  },
  // #endif
  methods: {
    // load回调，可以在每个页面调用callLoad
    callLoad(query) {}
  }
};
