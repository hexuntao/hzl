/**
 * 用户分享
 * 用于小程序、H5微信公众号页面分享
 *
 * 分享时的链接需要在链接后面拼接上推广码
 * 需要判断当前页面分享类型 shareType
 * ''       ==>   为空均表示分享首页到'/pages/mall/index'
 * current  ==>   表示分享当前页面
 * custom   ==>   表示自定义分享到任意页面
 */

let flag = 1; // 第一次进来会执行两次onShow，flag标识避免请求两次

import { mapGetters, mapActions } from "vuex";

// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
import { isWeixin } from "@/common/utils";
// #endif

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["token", "shareParams"]) // 分享参数
  },
  /**
   * 小程序平台分享
   */
  onShareAppMessage(e) {
    // 用户点击右上角
    if (e.from == "menu") {
      // this.routeQuery  当前页面路由参数
    } else if (e.from == "button") {
      // 按钮分享
    }
    console.log(this.shareParams);
    return {
      title: this.shareParams.title,
      imageUrl: this.shareParams.imgUrl,
      path: this.shareParams.link
    };
  },
  /**
   * 小程序平台分享朋友圈
   */
  onShareTimeline(e) {
    console.log(e);
    console.log(this.shareParams);
    return {
      title: this.shareParams.title,
      query: this.shareParams.query,
      imageUrl: this.shareParams.imgUrl
    };
  },
  onShow() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    if (page && !this.$noShowFlag) {
      this.$noShowFlag = true;
      this.getConfig().then(res => {
        const { addon } = this.$store.getters.route.meta;
        const { addons } = this.$store.state.config;
        const addonArr = typeof addon == "string" ? [addon] : addon || [];
        if (addon && !addonArr.some(e => !!addons[e])) {
          //未开启相关应用
          return uni.reLaunch({
            url: "/packages/mall/notice?type=noaddon&addon=" + addon
          });
        }
        typeof this.configCall === "function" && this.configCall(res);
        if (this.token) {
          this.getMemberInfo().then(info => {
            typeof this.memberCall === "function" && this.memberCall(info);
            this.setWxShare();
          });
        } else {
          this.setWxShare();
        }
      });
    }
  },
  onUnload() {
    this.$noShowFlag = false;
    this.$store.commit("setShareParam", {
      //清空自定义分享参数
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    });
  },
  onHide() {
    this.$noShowFlag = false;
    this.$store.commit("setShareParam", {
      //清空自定义分享参数
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    });
  },
  methods: {
    ...mapActions(["getConfig", "getMemberInfo"]),
    // 微信分享方法
    setWxShare(opionts) {
      /**
       * 如 优先取传入的参数，并储存
       *  未传入参数 取储存的参数，空为没有设置自定义分享参数
       */
      let param = opionts || this.$customShareParam;
      if (param) {
        this.$customShareParam = param;
        this.$store.commit("setShareParam", param || {});
      }
      // console.log(this.shareParams);
      // #ifdef H5
      if (isWeixin()) {
        this.$nextTick(() => {
          wxSdk.wxShare(this.shareParams).then(() => {});
        });
      }
      // #endif
    }
  }
};
