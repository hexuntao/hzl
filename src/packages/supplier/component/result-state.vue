<template>
  <view class="result">
    <view class="box">
      <lk-icon :name="icon.name" size="50" square :color="icon.color" />
      <view class="text" v-if="message">{{ message }}</view>
    </view>
    <slot name="footer" />
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    /**
     * 分为五种状态
     * info 提示
     * success 成功
     * error 失败
     * warn 警告
     * wait 等待
     * 没有以上状态则显示传入的state做iconClass
     */
    state: {
      type: String,
      default: "info"
    },
    message: {
      type: String
    },
    color: {
      type: String
    }
  },
  computed: {
    icon() {
      let obj = {
        name: this.state,
        color: this.color
      };
      if (this.state === "info") (obj.name = "more"), (obj.color = "#1989fa");
      if (this.state === "success")
        (obj.name = "checked"), (obj.color = "#06bf04");
      if (this.state === "error") (obj.name = "clear"), (obj.color = "#666666");
      if (this.state === "warn") (obj.name = "info"), (obj.color = "#ff976a");
      if (this.state === "wait")
        (obj.name = "underway"), (obj.color = "#1989fa");
      return obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.result {
  background: #fff;
  padding: $cell-padding;
  margin: 20rpx 0;
}
.result .box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: $font-size-lg;
}
.text {
  margin: 20rpx 0;
}
</style>
