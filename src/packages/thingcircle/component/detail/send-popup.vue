<template>
  <!-- <lk-popup v-model="show" round position="bottom"> -->
  <view class="popup-box" :style="popupStyle">
    <view class="mask" @click="show = false"></view>
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
          :adjust-position="false"
          :maxlength="-1"
          :cursor-spacing="20"
          :disable-default-padding="false"
          :show-confirm-bar="false"
          confirm-type="发送"
          :placeholder="placeholder"
          @input="onPopupContent"
          @confirm="onSend"
          @focus="onFocus"
        />
      </view>
      <lk-button bing-mobile type="text" @click="onSend">
        <view class="text" @click="onSend">发送</view>
      </lk-button>
      <!-- #ifdef MP -->
      <view class="placeholder-height" :style="placeholderHeight"></view>
      <!--  #endif -->
    </view>
  </view>
  <!-- </lk-popup> -->
</template>

<script>
import {
  ADD_THINGCIRCLECOMMENT,
  REPLY_THINGCIRCLECOMMENT
} from "@/common/interface/thingcircle";
import { platform, isBrowser } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
let sendFlag = true;
export default {
  data() {
    const padding =
      platform("MP") && isBrowser("ios") ? "0rpx 20rpx" : "20rpx 20rpx";
    return {
      isFocus: false,
      content: "",
      inputPadding: "padding:" + padding,
      keyboardheight: ""
    };
  },
  props: {
    value: Boolean,
    options: Object
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
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    placeholder() {
      let text = "说点什么...";
      if (this.options.placeholder) {
        text = this.options.placeholder;
      }
      return text;
    },
    //判断回复评论还是添加评论
    apiName() {
      return this.options.action == "reply"
        ? REPLY_THINGCIRCLECOMMENT
        : ADD_THINGCIRCLECOMMENT;
    },
    // action() {
    //   return this.options.action == "reply" ? "get-more" : "init-list";
    // }
    popupStyle() {
      return formatStyle({
        display: this.show ? "block" : "none"
      });
    },
    sendBoxStyle() {
      return formatStyle({
        bottom: this.keyboardheight ? this.keyboardheight + "px" : 0
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
  mounted() {},
  methods: {
    onFocus(e) {
      this.keyboardheight = e.detail.height;
    },
    onPopupContent(e) {
      this.content = e.detail.value;
    },
    onSend() {
      if (!sendFlag) {
        return;
      }
      if (!this.content) {
        return this.$Prompt.toast("没有什么想说的吗");
      }
      let params = { ...this.options.params };
      params.content = this.content;
      console.log(this.options);
      sendFlag = false;
      this.apiName(params, { isShowLoading: true })
        .then(() => {
          this.$Prompt.toast("发布成功");
          this.content = "";
          this.$emit("init-list");
          sendFlag = true;
          this.show = false;
        })
        .catch(() => {
          this.content = "";
          sendFlag = true;
          this.show = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.send-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100rpx;
  padding: 20rpx 30rpx;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  background: #fff;
  line-height: 48rpx;
  transition-duration: 0.25s;
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
</style>
