<template>
  <view class="img">
    <image :src="detail.card_codeImg" mode="scaleToFill" />
    <view class="text">{{detail.card_code}}</view>
  </view>
</template>

<script>
export default {
  props: {
    detail: {}
  }
};
</script>

<style lang='scss' scoped>
.img {
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto;
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
  image {
    width: 100%;
    height: 100%;
  }
  .text {
    font-size: 35rpx;
  }
}
</style>