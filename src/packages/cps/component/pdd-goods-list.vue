<template>
  <view class="pdd_goods_list">
    <view class="item" v-for="(item, index) in list" :key="index">
      <lk-goods-box
        :title="item.goods_name"
        :image="item.goods_thumbnail_url"
        :to="'/packages/cps/detail?goods_id=' + item.goods_id + '&type=pdd'"
      >
        <view slot="couponPrice">
          <view class="coupon-price">
            <view class="price first-letter"
              >￥{{
                (
                  item.min_normal_price / 100 -
                  item.coupon_discount / 100
                ).toFixed(2)
              }}<text>劵后</text></view
            >
            <view class="sales">月销 {{ item.sales_tip }}</view>
          </view>
          <view class="coupon">
            <view class="return-price"
              >返还￥
              {{
                ((item.promotion_rate / 100000) * buyer_bonus_rate).toFixed(2)
              }}</view
            >
            <coupon-juan
              :price="item.coupon_discount / 100"
              v-if="item.has_coupon"
            ></coupon-juan>
          </view>
        </view>
      </lk-goods-box>
    </view>
  </view>
</template>

<script>
import couponJuan from "./coupon-juan.vue";
export default {
  name: "pdd_goods_list",
  data() {
    return {};
  },
  props: {
    list: Array,
    buyer_bonus_rate: {
      type: Number
    }
  },
  components: {
    couponJuan
  }
};
</script>

<style lang="scss" scoped>
.pdd_goods_list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
}
.item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  border-radius: 20rpx;
  overflow: hidden;
  font-size: $font-size-lg;
  .coupon-price {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    .price {
      color: $red;
      font-weight: 600;
      font-size: $font-size-lg;
      text {
        margin-left: 4rpx;
        font-size: $font-size-sm;
      }
    }
    .sales {
      font-size: $font-size-sm;
      color: $text-gray;
      display: flex;
      flex-flow: row;
    }
  }
  .coupon {
    display: flex;
    .return-price {
      margin-right: 16rpx;
      height: 40rpx;
      padding: 6rpx;
      border-radius: 12rpx;
      background-color: $red;
      color: $white;
      font-size: $font-size-sm;
    }
  }
}
</style>
