import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["token", "isBingFlag", "isBindMobile"])
  },
  methods: {
    ...mapActions(["setLoginBeforePath", "wxBindMobile"]),
    /**
     * 验证是否绑定手机
     */
    validBindMobile() {
      // 需要绑定手机时，验证不通过时，进行拦截点击
      if (!this.token) {
        this.setLoginBeforePath(this.$store.getters.route.fullPath);
        this.$Navigate.push("/packages/login/index").then(() => {
          this.$Prompt.toast("您未登录，请先登录！");
        });
        return false;
      }
      if (this.token && this.isBingFlag && !this.isBindMobile) {
        // #ifdef H5
        this.$BindMobile.open();
        // #endif

        // #ifdef APP-PLUS
        uni.navigateTo({
          url: "/pages/member/bind"
        });
        // #endif
        return false;
      }
    }
  }
};
