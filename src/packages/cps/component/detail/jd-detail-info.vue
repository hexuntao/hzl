<template>
  <view class="item">
    <view class="itemtitle">
      <view class="coupon-price">
        <view class="price first-letter"
          >￥{{ priceInfo }} <text class="quanhou">券后</text></view
        >
        <couponJuan
          v-if="couponList.length > 0 && couponList[0].isBest"
          :price="couponList[0].discount"
        />
      </view>
    </view>
    <view class="itenname">
      <view class="shopname">
        {{ skuName }}
      </view>
      <view class="return-price" @click="rule('/packages/cps/rule')">
        返佣规则
      </view>
    </view>
  </view>
</template>

<script>
import couponJuan from "../coupon-juan.vue";
export default {
  data() {
    return {};
  },
  props: {
    skuName: [String, Number],
    priceInfo: [String, Number],
    couponList: [Array],
  },
  methods: {
    rule(rule) {
      this.$Navigate.push(rule);
    },
  },
  components: {
    couponJuan,
  },
};
</script>

<style scoped lang="scss">
.item {
  width: 100%;
  height: auto;
  background-color: #fff;
  margin-top: 20rpx;
  .itemtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    .coupon-price {
      display: flex;
      align-items: center;
      .price {
        padding-right: 30rpx;
        color: $red;
        font-weight: 600;
        font-size: 40rpx;
        .quanhou {
          font-size: 0.7em;
          padding-left: 4rpx;
        }
      }
    }
    .sales {
      color: #999;
      font-size: 24rpx;
    }
  }
  .itenname {
    display: flex;
    padding: 8rpx 20rpx 20rpx 20rpx;
    .shopname {
      width: 140%;
      border-right: 2rpx solid #f8f8f8;
      font-size: 33rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .return-price {
      padding-left: 14rpx;
      color: #0099ff;
      font-size: 26rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
