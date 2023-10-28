<template>
  <view class="result-state-panel" :style="{ background: theme.gradient }">
    <view class="image">
      <image :src="image" v-if="state" mode="aspectFit" />
    </view>
    <view class="message">{{ text }}</view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    /**
     * 状态类型
     * pay-success      ==>  支付成功
     * pay-fail         ==>  支付失败
     * recharge-success ==>  充值成功
     * recharge-fail    ==>  充值失败
     * refund-success   ==>  同意退款
     * refund-fail      ==>  拒绝退款
     * refund-finish    ==>  完成退款
     */
    state: String,
    message: String
  },
  computed: {
    ...mapGetters(["static"]),
    image() {
      const { baseImgPath, noSquare } = this.static;
      return this.state ? `${baseImgPath}result-${this.state}.png` : noSquare;
    },
    text() {
      let text = "";
      if (!this.message) {
        switch (this.state) {
          case "pay-success":
            text = "支付成功";
            break;
          case "pay-fail":
            text = "支付失败";
            break;
          case "recharge-success":
            text = "充值成功";
            break;
          case "recharge-fail":
            text = "充值失败";
            break;
          case "refund-success":
            text = "同意退款";
            break;
          case "refund-fail":
            text = "拒绝退款";
            break;
          case "refund-finish":
            text = "完成退款";
            break;
        }
      } else {
        text = this.message;
      }
      return text;
    }
  }
};
</script>

<style lang="scss" scoped>
.result-state-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  height: 200rpx;
  background: $red;
  .image {
    display: flex;
    width: 200rpx;
    height: 100rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .message {
    margin-top: 20rpx;
    color: #ffffff;
  }
}
</style>
