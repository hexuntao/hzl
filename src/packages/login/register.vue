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
        type="register"
      />
      <lk-field
        label="密码"
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      />
      <lk-field
        label="确认密码"
        v-model="check_password"
        type="password"
        placeholder="请输入确认密码"
      />
      <lk-field
        label="邀请码"
        v-model="extend_code"
        type="text"
        :disabled="extendCodeDisabled"
        placeholder="请输入邀请码"
      />
    </view>
    <view class="cell" v-if="config.reg_rule">
      <lk-checkbox-group :active-color="theme.color">
        <lk-checkbox v-model="checked">
          我已经阅读并同意
        </lk-checkbox>
      </lk-checkbox-group>
      <text class="text-link" @tap="onContract">
        《注册协议》
      </text>
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="config.reg_rule ? !checked : false"
        :loading="isLoading"
        @click="onRegister"
      >
        注册
      </lk-button>
      <lk-button class="last-btn" round block to="/packages/login/index">
        已有账号？去登录
      </lk-button>
    </view>
    <lk-popup
      v-model="showContract"
      class="contract-popup"
      title="注册协议"
      round
    >
      <view class="contract">
        <lk-parser
          show-with-animation
          lazy-load
          :html="contractContent"
        ></lk-parser>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import {
  validMobile,
  validMsgcode,
  validImgcode,
  validPassword,
  validCheckPassword
} from "@/common/utils/validator";
import { GET_IMGCODE, IS_HASMOBILE, REGISTER } from "@/common/interface/login";
import $Storage from "@/api/storage";
import { GET_REGISTERPROTOCOL } from "@/common/interface/config";
export default {
  name: "packages-login-register",
  data() {
    return {
      form: {
        mobile: "",
        verification_code: "",
        country_code: "",
        password: ""
      },
      extend_code: null,
      check_password: "",
      checked: false,
      isLoading: false,

      showContract: false,
      contractContent: ""
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      loginBeforePath: state => state.loginBeforePath
    }),
    ...mapGetters(["static", "port"]),
    bannerInfo() {
      return {
        src:
          this.config.wap_register_adv ||
          this.static.baseImgPath + "login-head-default-01.png",
        link: this.config.wap_register_jump
      };
    },
    extendCodeDisabled() {
      return !!$Storage.get("sceneCode");
    }
  },
  onLoad() {
    this.extend_code = $Storage.get("sceneCode") || "";
  },
  methods: {
    ...mapMutations(["setUserInfo", "removeSceneCode"]),
    ...mapActions(["getMemberInfo"]),
    onContract() {
      if (this.contractContent) {
        return (this.showContract = true);
      }
      GET_REGISTERPROTOCOL({ type: 1 }).then(({ data }) => {
        this.contractContent = data.register_protocol;
        this.showContract = true;
      });
    },
    getAreacode(code) {
      this.form.mobile = "";
      this.form.country_code = code;
    },
    onRegister() {
      let form = this.form;
      if (
        !validMobile(form.mobile, this.form.country_code) ||
        !validMsgcode(form.verification_code) ||
        !validPassword(form.password) ||
        !validCheckPassword(form.password, this.check_password)
      ) {
        return false;
      }
      if (this.extend_code) {
        form.extend_code = this.extend_code;
      }
      this.isLoading = true;

      IS_HASMOBILE({ mobile: form.mobile, mall_port: this.port }).then(e => {
        // 判断是否已注册手机号
        if (e.code === 0) {
          REGISTER({
            ...form,
            mall_port: this.port
          })
            .then(res => {
              this.setUserInfo(res.data);
              this.getMemberInfo({ update: true });
              // 注册时有推广码注册成功则删除该推广码
              if (form.extend_code) {
                this.removeSceneCode();
              }
              this.$Prompt
                .toast({ title: res.message, icon: "success" })
                .then(() => {
                  this.$Navigate.replace(this.loginBeforePath);
                });
            })
            .catch(error => {
              this.isLoading = false;
            });
        } else {
          this.isLoading = false;
          this.$Prompt.toast("该手机号码已被注册！");
        }
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
.cell {
  padding: $cell-padding;
  display: flex;
  align-items: center;
}
.last-btn {
  margin-top: 20rpx;
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
.contract {
  width: 80vw;
  height: 60vh;
  overflow-y: auto;
  padding: 30rpx;
  font-size: $font-size;
}
.contract-popup {
  top: 0;
  bottom: 0;
}
</style>
