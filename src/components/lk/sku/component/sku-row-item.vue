<template>
  <text
    class="sku-row__item"
    :class="{
      'sku-row__item--active': isChoosed,
      'sku-row__item--disabled': !isChoosable
    }"
    :style="{
      color: isChoosed ? theme.color : '',
      background: isChoosed ? theme.opacity : ''
    }"
    @click="onSelect"
  >
    {{ skuValue.name }}
  </text>
</template>

<script>
import { isSkuChoosable } from "../utils/skuHelper";
export default {
  name: "sku-row-item",
  data() {
    return {};
  },
  props: {
    skuValue: Object,
    skuList: Array,
    selectedSku: Object,
    skuKeyStr: String
  },
  computed: {
    isChoosed() {
      return this.skuValue.id === this.selectedSku[this.skuKeyStr];
    },

    isChoosable() {
      return isSkuChoosable(this.skuList, this.selectedSku, {
        key: this.skuKeyStr,
        valueId: this.skuValue.id
      });
    }
  },
  methods: {
    onSelect() {
      if (this.isChoosable) {
        this.$emit("sku-select", {
          ...this.skuValue,
          skuKeyStr: this.skuKeyStr
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sku-row {
  &__item {
    display: inline-block;
    padding: 10rpx 20rpx;
    margin: 0 20rpx 20rpx 0;
    height: 56rpx;
    min-width: 104rpx;
    line-height: 36rpx;
    font-size: $font-size-sm;
    color: $text-color;
    background: #F6F6F6;
    text-align: center;
    border-radius: 6rpx;
    box-sizing: border-box;

    &--active {
      color: $white;
      border-color: $red;
      background: $red;
    }

    &--disabled {
      background: #e8e8e8;
      border-color: $border-color;
      color: #999;
    }
  }
}
</style>
