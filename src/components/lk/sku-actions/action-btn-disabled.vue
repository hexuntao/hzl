<template>
  <view class="sku-action-group">
    <view class="action-btn">
      <lk-button square disabled>
        {{ info.goodsStateText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    // 活动相关参数
    params: Object,
    // 商品基本信息
    info: Object,
    buyBtnText: {
      type: String,
      default: "立即购买"
    }
  },
  methods: {}
};
</script>

<style scoped></style>
