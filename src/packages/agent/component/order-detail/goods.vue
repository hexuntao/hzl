<template>
  <view class="card-group-box">
    <lk-cell icon="shop-o" :title="detail.shop_name" />
    <view class="cell-goods">
      <lk-goods-card
        v-for="(item, index) in detail.order_goods"
        :key="index"
        :to="
          detail.order_type == 10
            ? '/packages/integral/goods/detail?goods_id=' + item.goods_id
            : '/packages/goods/detail?goods_id=' + item.goods_id
        "
        :num="item.num"
        :price="item.price"
        :desc="item.sku_name"
        :title="item.goods_name"
        :image="item.pic_cover"
        :point="item.goods_point"
      >
        <view slot="tags" v-if="buy_type == 'purchase' && item.purchase_to">
          采购于：
          <text>{{ item.purchase_to }}</text>
        </view>
      </lk-goods-card>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    buy_type: String,
    detail: {
      type: Object
    }
  },
  computed: {},
  methods: {},
  components: {}
};
</script>

<style lang="scss" scoped>
.btn {
  margin-left: 10rpx;
}
.cell-goods {
  padding: $cell-padding;
  background: #ffffff;
}
</style>
