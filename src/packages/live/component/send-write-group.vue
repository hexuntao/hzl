<template>
  <!-- <lk-popup v-model="show" round position="bottom" :mask-opacity="0"> -->
  <view class="popup-box" :style="popupStyle">
    <view class="mask" @click="show = false"></view>
    <view class="send-write-group">
      <view class="warp">
        <!-- <view class="switch-box">
          <u-switch v-model="checked" :active-color="theme.color" text="弹" />
        </view> -->
        <view class="send-box">
          <view class="input-box" v-if="showInputBox">
            <textarea
              class="input"
              :style="inputPadding"
              ref="input"
              :value="content"
              :focus="isFocus"
              :autoFocus="isFocus"
              auto-height
              fixed
              :maxlength="-1"
              :adjust-position="false"
              :cursor-spacing="20"
              :disable-default-padding="false"
              :show-confirm-bar="false"
              confirm-type="发送"
              placeholder="说点什么..."
              @input="onContent"
              @confirm="onSend"
              @focus="onFocus"
            />
          </view>
          <lk-button bing-mobile type="text" @click="onSend">
            <view class="text">发送</view>
          </lk-button>
          <!-- #ifdef MP -->
          <view class="placeholder-height" :style="placeholderHeight"></view>
          <!--  #endif -->
        </view>
      </view>
    </view>
  </view>
  <!-- </lk-popup> -->
</template>

<script>
import uSwitch from "./switch/switch";
import { mapState } from "vuex";
import { platform, isBrowser } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
let sendFlag = true;
export default {
  data() {
    const padding =
      platform("MP") && isBrowser("ios") ? "0rpx 20rpx" : "20rpx 20rpx";
    return {
      checked: false,
      isFocus: false,
      content: "",
      inputPadding: "padding:" + padding,
      keyboardheight: ""
    };
  },
  watch: {
    show(e) {
      if (e) {
        // #ifdef H5
        this.$nextTick(() => {
          this.isFocus = true;
        });
        // #endif
        // #ifdef MP
        setTimeout(() => {
          this.isFocus = true;
        }, 200);
        // #endif
      } else {
        this.keyboardheight = 0;
        this.isFocus = false;
      }
    }
  },
  props: {
    value: Boolean
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    popupStyle() {
      return formatStyle({
        display: this.show ? "block" : "none"
      });
    },
    placeholderHeight() {
      return formatStyle({
        height: this.keyboardheight ? this.keyboardheight + "px" : "736rpx"
      });
    },
    showInputBox() {
      // #ifdef H5
      return this.show;
      // #endif
      return true;
    }
  },
  methods: {
    onFocus(e) {
      this.keyboardheight = e.detail.height;
    },
    close() {
      this.$emit("input", false);
    },
    onContent({ detail }) {
      this.content = String(detail.value).trim();
    },
    onSend() {
      if (!sendFlag) {
        return;
      }
      if (!this.content) {
        return this.$Prompt.toast("没有什么想说的吗");
      }
      this.$emit("send", {
        text: this.content || "",
        name: this.memberInfo.name,
        uid: this.memberInfo.uid
      });
      this.content = "";
      this.close();
    }
  },
  components: {
    uSwitch
  }
};
</script>

<style lang="scss" scoped>
.send-write-group {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  background: #fff;
  transition-duration: 0.25s;
}
.warp {
  position: relative;
  z-index: 11;
  display: flex;
  align-items: center;
  background: #ffffff;
  height: 100%;
  animation: fade;
  animation-duration: 0.2s;
}
.switch-box {
  flex: none;
  padding-left: 30rpx;
  display: flex;
  align-items: center;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -15rpx;
    display: block;
    width: 1rpx;
    height: 70%;
    background: #ddd;
  }
}
.send-box {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100rpx;
  padding: 20rpx 30rpx;
  .placeholder-height {
    width: 100%;
  }
  .input-box {
    flex: 1;
  }
  .input {
    background: #ffffff;
    width: calc(100% - 40rpx);
    box-sizing: content-box;
    border: 1rpx solid #ebedf0;
    border-radius: 40rpx;
    font-size: $font-size;
    padding: 20rpx 20rpx;
    line-height: 40rpx;
    height: 60rpx;
    max-height: 160rpx;
  }
  .text {
    color: $blue;
    flex: none;
    margin-left: 30rpx;
  }
}
.popup-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: none;
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
