<template>
  <view :class="loadingClasses">
    <view
      :class="spinnerClasses"
      :style="{
        color: color,
        width: width,
        height: height
      }"
    >
      <block v-if="type === 'spinner'">
        <view v-for="(s, i) in array12" :key="i" :class="dotClasses" />
      </block>
    </view>
    <view :class="textClasses" :style="{ fontSize: fontSize }">
      <slot />
    </view>
  </view>
</template>

<script>
import { basic, navigate } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef, addUnit } from "@/common/utils";

const bem = create("loading");

export default {
  data() {
    return {
      array12: Array.from({ length: 12 })
    };
  },
  props: {
    color: String,
    vertical: Boolean,
    type: {
      type: String,
      default: "circular"
    },
    size: [String, Number],
    textSize: [String, Number]
  },
  computed: {
    dotClasses() {
      return formatClass(bem("dot"));
    },
    textClasses() {
      return formatClass(bem("text"));
    },
    spinnerClasses() {
      return formatClass(bem("spinner", this.type));
    },
    loadingClasses() {
      return formatClass([
        bem([this.type, { vertical: this.vertical }]),
        this.customClass
      ]);
    },
    width() {
      return pxTorpx(this.size);
    },
    height() {
      return pxTorpx(this.size);
    },
    fontSize() {
      return pxTorpx(this.textSize);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
:host {
  font-size: 0;
  line-height: 1;
  display: flex;
  vertical-align: top;
  padding: 0 8rpx;
}
.lk-loading {
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  height: 100%;
  color: #c8c9cc;
  color: var(--loading-spinner-color, #c8c9cc);
}
.lk-loading__spinner {
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  width: 1.4em;
  height: 1.4em;
  -webkit-animation: van-rotate 0.8s linear infinite;
  animation: van-rotate 0.8s linear infinite;
}
.lk-loading__spinner--spinner {
  -webkit-animation-timing-function: steps(12);
  animation-timing-function: steps(12);
}
.lk-loading__spinner--circular {
  border: 2rpx solid transparent;
  border-top-color: initial;
  border-radius: 100%;
}
.lk-loading__text {
  margin-left: 16rpx;
  margin-left: var(--padding-xs, 16rpx);
  color: $text-light;
  color: var(--loading-text-color, $text-light);
  font-size: $font-size;
  font-size: var(--loading-text-font-size, $font-size);
  line-height: 40rpx;
  line-height: var(--loading-text-line-height, 40rpx);
}
.lk-loading__text:empty {
  display: none;
}
.lk-loading--vertical {
  -webkit-flex-direction: column;
  flex-direction: column;
}
.lk-loading--vertical .lk-loading__text {
  margin: 16rpx 0 0;
  margin: var(--padding-xs, 16rpx) 0 0;
}
.lk-loading__dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.lk-loading__dot:before {
  display: block;
  width: 4rpx;
  height: 25%;
  margin: 0 auto;
  background-color: currentColor;
  border-radius: 40%;
  content: " ";
}
.lk-loading__dot:first-of-type {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  opacity: 1;
}
.lk-loading__dot:nth-of-type(2) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  opacity: 0.9375;
}
.lk-loading__dot:nth-of-type(3) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  opacity: 0.875;
}
.lk-loading__dot:nth-of-type(4) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  opacity: 0.8125;
}
.lk-loading__dot:nth-of-type(5) {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  opacity: 0.75;
}
.lk-loading__dot:nth-of-type(6) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  opacity: 0.6875;
}
.lk-loading__dot:nth-of-type(7) {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
  opacity: 0.625;
}
.lk-loading__dot:nth-of-type(8) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  opacity: 0.5625;
}
.lk-loading__dot:nth-of-type(9) {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  opacity: 0.5;
}
.lk-loading__dot:nth-of-type(10) {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
  opacity: 0.4375;
}
.lk-loading__dot:nth-of-type(11) {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
  opacity: 0.375;
}
.lk-loading__dot:nth-of-type(12) {
  -webkit-transform: rotate(1turn);
  transform: rotate(1turn);
  opacity: 0.3125;
}
@-webkit-keyframes van-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
@keyframes van-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
</style>
