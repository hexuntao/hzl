<template>
  <view class="discount-group">
    <view class="item" v-if="showManSong">
      <lk-tag type="danger">满减</lk-tag>
      <view class="text text-nowrap">
        <text>订单满</text>
        <text>{{ items.price | toNumber }}</text>
        <text>减</text>
        <text>{{ items.discount | toNumber }}</text>
      </view>
    </view>
    <view class="item" v-if="items.free_shipping == 1">
      <lk-tag type="success">包邮</lk-tag>
      <view class="text text-nowrap">
        <text>订单满{{ items.price | toNumber }}包邮</text>
      </view>
    </view>
    <view class="item" v-if="items.coupon_type_id">
      <lk-tag type="primary">满送</lk-tag>
      <view class="text text-nowrap">
        <text>订单满</text>
        <text>{{ items.price | toNumber }}</text>
        <text>送优惠券( {{ items.coupon_type_name }} )</text>
      </view>
    </view>
    <view class="item" v-if="items.gift_card_id">
      <lk-tag type="primary">满送</lk-tag>
      <view class="text text-nowrap">
        <text>订单满</text>
        <text>{{ items.price | toNumber }}</text>
        <text>送礼品券( {{ items.gift_voucher_name }} )</text>
      </view>
    </view>
    <view class="item" v-if="items.gift_id">
      <lk-tag type="primary">满送</lk-tag>
      <view class="text text-nowrap">
        <text>订单满</text>
        <text>{{ items.price | toNumber }}</text>
        <text>送赠品( {{ items.gift_name }} )</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    items: Object
  },
  filters: {
    toNumber(value) {
      return parseFloat(value);
    }
  },
  computed: {
    showManSong() {
      return this.items.man_song_id && parseFloat(this.items.discount);
    }
  }
};
</script>

<style scoped lang="scss">
.discount-group {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 30rpx;
  overflow: hidden;
  color: $text-color;
  font-size: $font-size;
  line-height: 48rpx;
  background-color: #fff;
  flex-flow: column;
  .item {
    display: flex;
    font-size: $font-size-sm;
    color: $text-light;
    align-items: center;
    line-height: 36rpx;
    margin: 8rpx 0;
    .text {
      flex: 1;
      padding-left: 12rpx;
    }
  }
}
</style>
