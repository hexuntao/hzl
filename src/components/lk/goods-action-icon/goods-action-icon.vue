<template>
  <view class="goods-action-icon" @click="onClick">
    <slot>
      <lk-icon
        class="goods-action-icon__icon"
        :info="badge"
        :name="icon"
        :color="color"
        :dot="dot"
        size="20"
      />
      <view class="text">{{ text }}</view>
    </slot>
  </view>
</template>

<script>
import { basic, navigate } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("goods-action-icon");

export default {
  data() {
    return {
      cname: "goods-action-icon"
    };
  },
  mixins: [basic, navigate],
  props: {
    text: String,
    icon: String,
    color: String,
    dot: Boolean,
    badge: [Number, String]
  },
  computed: {
    classes() {
      return formatClass(bem());
    },
    iconClasses() {
      return formatClass([bem("icon")]);
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
      this.toNavigate();
    }
  }
};
</script>

<style scoped lang="scss">
.goods-action-icon {
  color: $text-gray;
  display: flex;
  width: 100rpx;
  height: 100rpx;
  font-size: $font-size-sm;
  line-height: 1;
  text-align: center;
  background-color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:active {
    background-color: #f2f3f5;
  }

  &__icon {
    width: 40rpx;
    height: 40rpx;
    color: $text-gray;
    margin: 0 auto 10rpx;
    font-size: 40rpx;
  }
  .text {
    display: flex;
    max-width: 100rpx;
    height: 24rpx;
    overflow: hidden;
    justify-content: center;
  }
}
</style>
