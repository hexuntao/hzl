<template>
  <view class="bind-mobile">
    <lk-popup
      v-model="show"
      :title="title"
      round
      :mask-close="false"
      closeable
      :custom-style="{ zIndex: 1000, bottom: '0' }"
      :before-hide="onClose"
    >
      <view class="cell-group">
        <lk-field-areacode
          v-model="form.mobile"
          @blur="onBlur"
          @get-areacode="getAreacode"
        />
        <lk-field-msgcode
          v-model="form.verification_code"
          :mobile="form.mobile"
          :areacode="form.country_code"
          type="bind_mobile"
          ref="fieldMsgcode"
          @send-success="onSendSuccess"
        />

        <block v-if="isNewUser">
          <lk-field
            label="设置密码"
            v-model="password"
            type="password"
            placeholder="请输入新密码"
          />
          <lk-field
            label="确认密码"
            v-model="check_password"
            type="password"
            placeholder="请输入确认新密码"
          />
        </block>
        <view class="reg-rule" v-if="regRule">
          <view class="texts">
            授权即代表同意
            <text class="text-link" @click="onContract">
              《注册协议》
            </text>
          </view>
        </view>
        <lk-cell>
          <lk-button
            round
            type="danger"
            :color="btnColor"
            block
            :loading="isLoading"
            @click="onBind"
          >
            同意协议并绑定
          </lk-button>
        </lk-cell>
      </view>
    </lk-popup>
    <lk-popup
      v-model="showContract"
      class="contract-popup"
      title="注册协议"
      round
      style="z-index:3000"
      :mask-opacity="0"
    >
      <view class="contract" v-if="contractContent">
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
import {
  validMobile,
  validMsgcode,
  validPassword,
  validCheckPassword
} from "@/common/utils/validator";
import { IS_HASMOBILE } from "@/common/interface/login";
import store from "@/store";
import { isWeixin } from "@/common/utils";
import { GET_REGISTERPROTOCOL } from "@/common/interface/config";
import focusout from "@/mixins/focusout";
export default {
  data() {
    return {
      show: true,
      isLoading: false,
      isNewUser: false, // 是否为新用户
      form: {
        mobile: "",
        verification_code: "",
        country_code: ""
      },
      password: "",
      check_password: "",

      showContract: false,
      contractContent: ""
    };
  },
  mixins: [focusout],
  computed: {
    btnColor() {
      return store.getters.theme ? store.getters.theme.gradient : "";
    },
    title() {
      return this.isNewUser ? "绑定手机号" : "关联手机号";
    },
    regRule() {
      return store.state.config.reg_rule;
    }
  },
  methods: {
    onBlur() {
      this.validNewUser();
    },
    getAreacode(code) {
      this.form.mobile = "";
      this.form.country_code = code;
    },
    // 验证是否为新用户
    validNewUser() {
      return new Promise((resolve, reject) => {
        if (validMobile(this.form.mobile, this.form.country_code)) {
          IS_HASMOBILE({
            mobile: this.form.mobile,
            mall_port: store.state.port
          }).then(({ code }) => {
            this.isNewUser = !code;
            resolve();
          });
        }
      });
    },
    onBind() {
      let form = this.form;
      this.validNewUser().then(() => {
        if (
          !validMobile(form.mobile, this.form.country_code) ||
          !validMsgcode(form.verification_code)
        ) {
          return false;
        }
        if (this.isNewUser) {
          if (!validPassword(this.password)) {
            return false;
          }
          form.password = this.password;
          if (!validCheckPassword(form.password, this.check_password)) {
            return false;
          }
        } else {
          delete form.password;
        }

        this.isLoading = true;
        store
          .dispatch("bindAccount", form)
          .then(res => {
            this.isLoading = false;
            this.onClose();
          })
          .catch(() => {
            this.isLoading = false;
          });
      });
    },
    // 发送验证码完成
    onSendSuccess({ isHasMobile }) {
      this.isNewUser = isHasMobile != 1;
    },
    onClose() {
      // #ifdef H5
      this.close && this.close();
      // #endif
      this.$emit("close");
      this.isLoading = false;
      this.isNewUser = false;
      this.form = {
        mobile: "",
        verification_code: ""
      };
      this.password = "";
      this.check_password = "";
      this.$refs.fieldMsgcode.endTimer();
    },
    onContract() {
      if (this.contractContent) {
        return (this.showContract = true);
      }
      GET_REGISTERPROTOCOL({ type: 1 }).then(({ data }) => {
        this.contractContent = data.register_protocol;
        this.showContract = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bind-mobile {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
}
.cell-group {
  position: relative;
  z-index: 101;
  border-radius: 20rpx;
  overflow: hidden;
  max-width: 80vw;
  .cell-title {
    position: relative;
    justify-content: center;
    align-items: center;
    .title {
      font-weight: 800;
    }
    .btn-right {
      position: absolute;
      right: 15rpx;
      top: 15rpx;
      align-items: center;
    }
  }
  .reg-rule {
    .texts {
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-flow: row;
    }
    font-size: $font-size-sm;
    color: $text-light;
    padding: 20rpx 30rpx;
    background: #fff;
  }
}
.contract {
  width: 80vw;
  height: 60vh;
  padding: 30rpx;
  font-size: $font-size;
  overflow-y: auto;
}
.contract-popup {
  top: 0;
  bottom: 0;
}
</style>
