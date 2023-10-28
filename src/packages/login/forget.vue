<template>
  <view class="pages">
    <view class="banner">
      <image
        :src="bannerInfo.src"
        mode="widthFix"
        @click="toLink(bannerInfo.link)"
      />
    </view>
    <view>
      <lk-field-areacode v-model="form.mobile" @get-areacode="getAreacode" />
      <lk-field-msgcode
        v-model="form.verification_code"
        :mobile="form.mobile"
        :areacode="form.country_code"
        type="forget_password"
      />
      <lk-field
        label="新密码"
        v-model="form.password"
        type="password"
        placeholder="请输入新密码"
      />
      <lk-field
        label="确认密码"
        v-model="check_password"
        type="password"
        placeholder="请输入确认新密码"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :loading="isLoading"
        @click="onForget"
      >
        确定
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import {
  validMobile,
  validMsgcode,
  validImgcode,
  validPassword,
  validCheckPassword
} from "@/common/utils/validator";
import { RESET_PASSWORD } from "@/common/interface/login";
export default {
  name: "packages-login-forget",
  data() {
    return {
      form: {
        mobile: "",
        verification_code: "",
        country_code: "",
        password: ""
      },
      check_password: "",
      isLoading: false
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config
    }),
    ...mapGetters(["static"]),
    bannerInfo() {
      return {
        src:
          this.config.wap_login_adv ||
          this.static.baseImgPath + "login-head-default-01.png",
        link: this.config.wap_login_jump
      };
    }
  },
  onLoad() {},
  methods: {
    getAreacode(code) {
      this.form.mobile = "";
      this.form.country_code = code;
    },
    onForget() {
      let form = this.form;
      if (
        !validMobile(form.mobile, this.form.country_code) ||
        !validMsgcode(form.verification_code) ||
        !validPassword(form.password) ||
        !validCheckPassword(form.password, this.check_password)
      ) {
        return false;
      }
      this.isLoading = true;
      RESET_PASSWORD(form)
        .then(({ message }) => {
          this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            this.$Navigate.back();
            this.isLoading = false;
          });
        })
        .catch(error => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.field-msg-code {
  width: 200rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
