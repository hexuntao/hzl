<template>
  <view class="goods-action-bar">
    <view class="action-icon-bar">
      <slot name="iconBar"/>
    </view>
    <view class="action-button-bar">
      <slot name="buttonBar"/>
    </view>
    <slot />
  </view>
</template>

<script>
import { basic } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("goods-action-bar");

export default {
  data() {
    return {
      cname: "goods-action-bar"
    };
  },
  props: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.goods-action-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 100rpx;
  box-sizing: content-box;
  background-color: #fff;
  box-shadow: 0 -4rpx 20rpx 0 rgba(0, 0, 0, 0.05);
  z-index: 10;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  goods-action-icon {
    width: 100rpx;
  }
  goods-action-button {
    flex: 1;
  }
}
</style>
