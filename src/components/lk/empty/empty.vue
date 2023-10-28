<template>
  <view class="empty-box" :style="[backgroundColorStyle]">
    <view class="box">
      <slot name="content">
        <image class="image" v-if="image" :src="image" mode="aspectFit" />
      </slot>
      <view class="message">{{ message }}</view>
      <slot name="foot"> </slot>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "empty"
    };
  },
  props: {
    backgroundColor: String,
    image: String,
    message: String
  },
  computed: {
    backgroundColorStyle() {
      return { backgroundColor: this.backgroundColor || "" };
    }
  }
};
</script>

<style scoped lang="scss">
.empty-box {
  padding: 40rpx;
  .box {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .image {
    display: flex;
    width: 500rpx;
    height: 320rpx;
    margin: 40rpx;
  }
  .message {
    font-size: $font-size-sm;
    color: $gray-dark;
  }
}
</style>
