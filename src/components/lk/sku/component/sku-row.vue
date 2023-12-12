<template>
  <view class="sku-row">
    <view class="sku-row__title">{{ skuRow.k }}</view>
    <slot />
  </view>
</template>

<script>
export default {
  name: "sku-row",
  data() {
    return {};
  },
  props: {
    skuRow: Object
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.sku-row {
  padding: 10rpx 0;
  position: relative;
  &::after {
    content: " ";
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scaleY(0.5);
    border-bottom: 2rpx solid $border-color;
  }
  &:last-child {
    margin-bottom: 0;
  }

  &__title {
    padding-bottom: 20rpx;
  }
}
</style>
