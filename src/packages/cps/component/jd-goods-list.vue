<template>
  <view class="jd_goods_list">
    <view class="item" v-for="(item, index) in list" :key="index">
      <lk-goods-box
        :title="item.skuName"
        :image="item.imageInfo.imageList[0].url"
        :to="'/packages/cps/detail?goods_id=' + item.skuId + '&type=jd'"
      >
        <view slot="bottom">
          <view class="coupon-price">
            <view class="price first-letter"
              >￥{{ item.priceInfo.price }}<text>劵后</text></view
            >
            <view class="sales">月销 {{ item.inOrderCount30Days }}</view>
          </view>
          <view class="coupon">
            <view class="return-price"
              >返还￥
              {{
                (
                  (item.commissionInfo.commission / 100) *
                  buyer_bonus_rate
                ).toFixed(2)
              }}
            </view>
            <coupon-juan
              v-if="
                item.couponInfo.couponList.length > 0 &&
                  item.couponInfo.couponList[0].isBest
              "
              :price="item.couponInfo.couponList[0].discount"
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
  name: "jd_goods_list",
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
.jd_goods_list {
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
