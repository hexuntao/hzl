<template>
  <view class="cell-group">
    <view class="divider">
      <text>店主权益</text>
    </view>
    <lk-grid-panel cols="4" icon-color="#666" :items="cardItems" />
    <view class="cell lk-hairline--top">
      <view>购买以上任意礼包即可成为店主。成为店主后能享受权益如下：</view>
      <view>1、拥有自己的专属微店。</view>
      <view>2、店主在平台消费即可获得相对应的返利。</view>
      <view>3、分享自己微店给朋友，销售后获得返利。</view>
      <view>
        4、下级{{ distributeTexts.distributor_name }}成为店主获得返利。
      </view>
      <view>5、下级销售产品后，亦可获得返利最大三级。</view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      cardItems: [
        {
          icon: "shop-o",
          title: "专属微店"
        },
        {
          icon: "cash-back-record",
          title: "自购返利"
        },
        {
          icon: "after-sale",
          title: "销售返利"
        },
        {
          icon: "replay",
          title: "开店返利"
        }
      ]
    };
  },
  props: {
    list: Array
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts
    })
  },
  components: {}
};
</script>

<style scoped lang="scss">
.cell-group {
  margin: 20rpx 0;
  padding: 20rpx 0;
  background: #fff;
}
.cell {
  padding: 20rpx 30rpx;
  line-height: 48rpx;
  font-size: $font-size-sm;
  color: $red;
}
</style>
