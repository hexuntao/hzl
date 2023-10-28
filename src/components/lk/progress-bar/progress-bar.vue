<template>
  <view class="progress-outer" :class="progressClasses">
    <view class="progress" :style="{ background: bg }">
      <view
        class="progress-bar"
        :class="type && 'progress-bar' + type"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="0"
        :aria-valuemax="max"
        :style="{
          width: (percent < 100 ? percent : 100) + '%',
          background: barBg
        }"
      ></view>
    </view>
    <view class="progress-text">
      <slot name="progress-text">
        <text>已抢 {{ num }} 件</text>
        <text>{{ valueText }}</text>
      </slot>
    </view>
  </view>
</template>

<script>
import { formatClass } from "@/common/utils/stringify";
export default {
  data() {
    return {};
  },
  props: {
    customClass: {
      type: [String, Array, Object],
      default: () => {}
    },
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: ""
    },
    num: {
      type: [String, Number],
      default: 0
    },
    bg: String,
    barBg: String
  },
  computed: {
    progressClasses() {
      return formatClass(this.customClass);
    },
    percent() {
      return parseInt((this.value * 100) / this.max, 10);
    },
    valueText() {
      return this.percent + "%";
    }
  }
};
</script>
<style scoped lang="scss">
.progress-outer {
  height: 40rpx;
  max-height: 100%;
  width: 100%;

  position: relative;
  font-size: $font-size-sm;
  .progress {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20rpx;
    background: rgba(255, 69, 78, 0.4);
  }

  .progress .progress-bar {
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    transition: width 0.6s ease;
    background: $red;
    border-radius: 20rpx;
    background-size: cover !important;
  }

  .progress-text {
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    color: #ffffff;
    font-size: inherit;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
