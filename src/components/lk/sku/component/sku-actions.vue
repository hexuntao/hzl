<template>
  <view class="sku-actions">
    <button
      class="btn-action btn-action-cart"
      v-if="showAddCartBtn"
      @click="click('addCart')"
    >
      {{ cartBtnText }}
    </button>
    <button class="btn-action btn-action-buy" @click="click('buy')">
      {{ buyBtnText }}
    </button>
  </view>
</template>

<script>
export default {
  name: "sku-actions",
  data() {
    return {};
  },
  props: {
    cartText: String,
    buyText: String,
    skuEventBus: Object,
    showAddCartBtn: Boolean
  },
  computed: {
    cartBtnText() {
      return this.cartText || "加入购物车";
    },
    buyBtnText() {
      return this.buyText || "立即购买";
    }
  },
  methods: {
    click(action) {
      this.$Events.$emit("sku:" + action);
    }
  }
};
</script>

<style scoped lang="scss">
.sku-actions {
  display: flex;
  flex-shrink: 0;
  padding: 0 10rpx;
  .btn-action {
    font-size: $font-size;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    border: none;
    width: 100%;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    border-radius: 0;
    &-cart {
      background: linear-gradient(to right, #ffd01e, #ff8917);
    }
    &-buy {
      background: linear-gradient(to right, #ff6034, #ee0a24);
    }
    &:after {
      display: none;
    }
  }
  .btn-action:first-of-type {
    margin-left: 10rpx;
    border-top-left-radius: 40rpx;
    border-bottom-left-radius: 40rpx;
  }
  .btn-action:last-of-type {
    margin-right: 10rpx;
    border-top-right-radius: 40rpx;
    border-bottom-right-radius: 40rpx;
  }
}
</style>
