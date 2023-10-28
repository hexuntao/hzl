<template>
  <lk-field
    v-model="code"
    :label="label"
    type="number"
    :maxlength="codeLength"
    :left-icon="leftIcon"
    :class-prefix="iconPrefix"
    :placeholder="placeholder"
  >
    <lk-button
      slot="button"
      size="mini"
      round
      plain
      type="danger"
      :color="btnColor"
      :disabled="isDisabled"
      @click="onSend"
    >
      {{ codeTxt }}
    </lk-button>
  </lk-field>
</template>

<script>
import { validMobile, validEmail } from "@/common/utils/validator";
import { GET_EMAILCODE } from "@/common/interface/login";
import store from "@/store";
export default {
  data() {
    return {
      cname: "field-magcode",
      isDisabled: false,
      codeTime: 0,
      codeTxt: "获取验证码"
    };
  },
  props: {
    value: [String, Number],
    mobile: [String, Number],
    email: [String, Number],
    label: {
      type: String,
      default: "验证码"
    },
    placeholder: {
      type: String,
      default: "请输入验证码"
    },
    codeLength: {
      type: [String, Number],
      default: 6
    },
    // 区号
    areacode: {
      type: [String, Number],
      default: 86
    },
    leftIcon: String,
    iconPrefix: String,
    type: String, //验证码类型  注册/登录/忘记密码/绑定手机/修改资料/修改邮箱等
    validType: {
      type: String,
      default: "mobile"
    },
    // 是否验证
    verify: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    btnColor() {
      return store.getters.theme ? store.getters.theme.color : "";
    },
    code: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    // 邮箱验证码
    getEmailcode(form) {
      return new Promise((resolve, reject) => {
        GET_EMAILCODE(form)
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 发送验证码
    onSend() {
      if (this.type === "bind_email" && this.validType == "email") {
        this.emailFn();
      } else {
        this.msgFn();
      }
    },
    msgFn() {
      if (this.verify && !validMobile(this.mobile, this.areacode)) {
        return false;
      }
      let params = {
        type: this.type || "",
        mobile: this.mobile
      };
      if (store.state.config.mobile_type == 1) {
        params.country_code = this.areacode;
      }
      store.dispatch("getMsgcode", params).then(res => {
        this.$emit("send-success", res);
        this.startTimer();
      });
    },
    emailFn() {
      if (!validEmail(this.email)) {
        return false;
      }
      this.getEmailcode({
        type: this.type || "",
        email: this.email
      }).then(res => {
        this.$emit("send-success", res);
        this.startTimer();
      });
    },
    startTimer() {
      this.codeTime = 60;
      this.isDisabled = true;
      this.codeTimer();
    },
    codeTimer() {
      if (this.codeTime > 0) {
        this.codeTime--;
        this.codeTxt = this.codeTime + "s后获取";
        setTimeout(this.codeTimer, 1000);
      } else {
        this.endTimer();
      }
    },
    endTimer() {
      this.codeTime = 0;
      this.isDisabled = false;
      this.codeTxt = "获取验证码";
    }
  }
};
</script>
