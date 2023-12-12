<template>
  <view class="juan">
    <text class="juan-text">劵</text><text class="price">￥{{ price }}</text>
  </view>
</template>

<script>
export default {
  name: "coupon-juan",
  data() {
    return {};
  },
  props: {
    price: [String, Number]
  }
};
</script>

<style lang="scss" scoped>
.juan {
  height: 44rpx;
  position: relative;
  padding: 6rpx;
  background-color: #fff0c2;
  border-radius: 12rpx;
  color: $orange;
  .juan-text {
    padding-right: 6rpx;
  }
  .price {
    padding-right: 20rpx;
  }
  .price::before {
    content: "";
    border-left: 4rpx dotted orange;
    height: 20rpx;
  }
}
.juan::after {
  position: absolute;
  content: "";
  top: 50%;
  right: -10rpx;
  transform: translateY(-50%);
  background-color: $white;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}
</style>