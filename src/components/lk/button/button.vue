<template>
  <button
    :style="btnStyles"
    :class="btnClasses"
    :disabled="disabled"
    :loading="loading"
    :form-type="formType"
    :open-type="openTypeText"
    @tap="onClick"
    @getphonenumber="getphonenumber"
    @getuserinfo="getuserinfo"
    @error="error"
    @opensetting="opensetting"
    @launchapp="launchapp"
  >
    <lk-loading
      :custom-class="loadingClasses"
      :type="loadingType"
      :size="loadingSize"
      color="#ffffff"
      v-if="loading"
    />
    <lk-icon
      :custom-class="iconClasses"
      :class-prefix="iconPrefix"
      :size="iconSize"
      :color="iconColor"
      :name="icon"
      v-else-if="icon"
    />
    <view :class="textClasses" v-if="!loading">
      <slot> {{ text }} </slot>
    </view>
    <view :class="loadingTextClasses" v-if="loadingText">
      <slot> {{ loadingText }} </slot>
    </view>
  </button>
</template>

<script>
import { basic, navigate } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";
import { BORDER_SURROUND, WHITE } from "@/common/utils/constant";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

const bem = create("button");

export default {
  props: {
    text: String,
    icon: String,
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    loadingText: String,
    loadingType: {
      type: String,
      default: "circular"
    },
    iconPrefix: {
      default: "icons"
    },
    type: {
      type: String,
      default: "default"
    },
    size: {
      type: String,
      default: "normal"
    },
    loadingSize: {
      type: String
    },
    iconSize: {
      type: String,
      default: "20"
    },
    iconColor: {
      type: String
    },
    formType: String,
    openType: String,
    to: [String, Object],
    //是否绑定手机
    bingMobile: {
      type: Boolean,
      default: false
    },
    // 主题颜色
    themeColor: Boolean,
    subscribeType: [String, Number] //小程序订阅消息类型
  },
  mixins: [basic, navigate],
  computed: {
    btnStyles() {
      const styles = {
        color: "",
        background: "",
        borderColor: "",
        ...this.customStyle
      };
      if (this.themeColor) {
        styles.color = this.plain ? this.theme.color : WHITE;
        if (!this.plain) {
          styles.background = this.theme.gradient;
        }
        if (styles.color && styles.color.indexOf("gradient") !== -1) {
          styles.border = 0;
        } else {
          styles.borderColor = this.theme.color;
        }
      }

      if (this.color) {
        styles.color = this.plain ? this.color : WHITE;

        if (!this.plain) {
          styles.background = this.color;
        }

        if (this.color.indexOf("gradient") !== -1) {
          styles.border = 0;
        } else {
          styles.borderColor = this.color;
        }
      }
      return formatStyle(styles);
    },
    btnClasses() {
      return formatClass([
        bem([
          this.type,
          this.size,
          {
            plain: this.plain,
            loading: this.loading,
            disabled: this.disabled,
            hairline: this.hairline,
            block: this.block,
            round: this.round,
            square: this.square
          }
        ]),
        this.customClass
      ]);
    },
    textClasses() {
      return formatClass(bem("text"));
    },
    loadingClasses() {
      return formatClass(bem());
    },
    loadingTextClasses() {
      return formatClass(bem("loading--text"));
    },
    iconClasses() {
      return formatClass(bem("icon"));
    },
    ...mapGetters(["token", "isShowBindMobile"]),
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    openTypeText() {
      // #ifndef MP
      return this.openType;
      // #endif
      // #ifdef MP
      if (this.bingMobile && this.isShowBindMobile) {
        return "getPhoneNumber";
      }
      return this.openType;
      // #endif
    }
  },
  methods: {
    ...mapMutations(["setLoginBeforePath"]),
    ...mapActions(["mpBindMobile"]),
    onClick() {
      if (!this.loading && !this.disabled) {
        if (this.bingMobile) {
          // 需要绑定手机时，验证不通过时，进行拦截点击
          if (!this.token) {
            this.setLoginBeforePath(this.$store.getters.route.fullPath);
            this.$Navigate.push("/packages/login/index").then(() => {
              this.$Prompt.toast("您未登录，请先登录！");
            });
            return false;
          }
          if (this.isShowBindMobile) {
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

        if (this.to) {
          this.$Navigate.push(this.to);
          return false;
        }

        this.$emit("click");
      }
    },
    getphonenumber(event) {
      //console.log('abcd');
      //console.log(event);
      if (event.detail.encryptedData) {
        this.mpBindMobile(event.detail);
        this.$emit("getphonenumber", event.detail);
      } else {
        console.log("拒绝获取手机");
      }
    },
    getuserinfo(event) {
      this.$emit("getuserinfo", event);
    },
    error(event) {
      this.$emit("error", event);
    },
    opensetting(event) {
      this.$emit("opensetting", event);
    },
    launchapp(event) {
      this.$emit("launchapp", event);
    }
  }
};
</script>

<style lang="scss" scoped>
button:after {
  border-width: 0;
}

.lk-button {
  position: relative;
  display: inline-flex;
  vertical-align: top;
  justify-content: center;
  box-sizing: border-box;
  height: 88rpx;
  margin: 0;
  padding: 0;
  font-size: $font-size;
  line-height: 88rpx;
  text-align: center;
  border-radius: 4rpx;
  cursor: pointer;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  -webkit-appearance: none;
  -webkit-text-size-adjust: 100%;
}

.lk-button::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: #000;
  border: inherit;
  border-color: #000;
  border-radius: inherit;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  content: " ";
}

.lk-button:active::before {
  opacity: 0.1;
}

.lk-button--disabled::before,
.lk-button--loading::before {
  display: none;
}

.lk-button--default {
  color: $text-color;
  background-color: #fff;
  border: 2rpx solid $border-color;
}

.lk-button--primary {
  color: #fff;
  background-color: $green;
  border: 2rpx solid $green;
}

.lk-button--info {
  color: #fff;
  background-color: $blue;
  border: 2rpx solid $blue;
}

.lk-button--danger {
  color: #fff;
  background-color: $red;
  border: 2rpx solid $red;
}

.lk-button--warning {
  color: #fff;
  background-color: $orange;
  border: 2rpx solid $orange;
}

.lk-button--plain {
  background-color: #fff;
}

.lk-button--plain.lk-button--primary {
  color: $green;
}

.lk-button--plain.lk-button--info {
  color: $blue;
}

.lk-button--plain.lk-button--danger {
  color: $red;
}

.lk-button--plain.lk-button--warning {
  color: $orange;
}

.lk-button--plain.lk-button--text {
  background-color: transparent;
}

.lk-button--large {
  width: 100%;
  height: 100rpx;
  line-height: 96rpx;
}

.lk-button--normal {
  //padding: 0 30rpx;
  font-size: $font-size;
}

.lk-button--small {
  min-width: 120rpx;
  height: 60rpx;
  padding: 0 16rpx;
  font-size: $font-size-sm;
  line-height: 60rpx;
}

.lk-button--text {
  color: inherit;
  background-color: transparent;
  border: none;
  line-height: 1;
  padding: 0;
  height: auto;
  width: auto;
  font-size: inherit;
  color: inherit;
  border-radius: 0;
  &:after {
    border-radius: 0;
  }
  &::before {
    display: none;
  }
  .lk-button__text {
    line-height: 1.4;
  }
}

.lk-button__loading {
  display: inline-block;
  color: inherit;
  vertical-align: top;
}

.lk-button--mini {
  display: inline-block;
  min-width: 100rpx;
  height: 44rpx;
  font-size: $font-size-xs;
  line-height: 44rpx;
}

.lk-button--block {
  display: flex;
  width: 100%;
}

.lk-button--disabled,
uni-button[disabled],
uni-button[disabled]:not([type]),
uni-button[disabled][type="default"] {
  color: #999;
  background-color: #e8e8e8;
  border: 2rpx solid #e5e5e5;
  opacity: 0.5;
}

.lk-button--loading {
  cursor: default;
}

.lk-button--round {
  border-radius: 999rpx;
}

.lk-button--square {
  border-radius: 0;
  &:after {
    border-radius: 0;
  }
}

.lk-button__icon {
  min-width: 1em;
  font-size: 1.2em;
  line-height: inherit;
  align-items: center;
  height: 100%;
  color: inherit;
  vertical-align: middle;
}

.lk-icon__image {
  width: 1em;
  height: 1em;
  object-fit: contain;
}

.lk-button__loading--text {
  margin-left: 10rpx;
}

.lk-button--hairline {
  border-width: 0;
}

.lk-button--hairline::after {
  border-color: inherit;
  border-radius: 8rpx;
  border-width: 2rpx;
}

.lk-button--hairline.lk-button--round::after {
  border-radius: 999rpx;
}

.lk-button--hairline.lk-button--square::after {
  border-radius: 0;
}
</style>
