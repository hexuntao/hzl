<template>
  <view class="star-box">
    <view class="star">
      <lk-icon
        :size="size"
        class-prefix="v-icon"
        :name="'v-icon-rate-' + item"
        v-for="(item, index) in list"
        :key="index"
        :custom-style="{
          width: 'auto',
          minWidth: '28rpx',
          marginLeft: gutter + 'rpx',
          marginRight: gutter + 'rpx'
        }"
        :color="disabled ? disabledColor : item !== 'off' ? color : voidColor"
        @click="click(index)"
      />
    </view>
    <slot>
      <text class="num" v-if="showFraction && value">
        {{ value }}{{ unit }}
      </text>
    </slot>
  </view>
</template>

<script>
import { basic } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("star");

const CLS_ON = "on"; //满星状态
const CLS_HALF = "half"; //半星状态
const CLS_OFF = "off"; //无星状态

export default {
  data() {
    return {
      cname: "star"
    };
  },
  mixins: [basic],
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    disabled: Boolean,
    size: {
      type: [Number, String],
      default: 12
    },
    color: {
      type: String,
      default: "#ffd21e"
    },
    voidColor: {
      type: String,
      default: "#c7c7c7"
    },
    disabledColor: {
      type: String,
      default: "#bdbdbd"
    },
    count: {
      type: Number,
      default: 5
    },
    unit: {
      type: String,
      default: "分"
    },
    showFraction: {
      type: Boolean,
      default: true
    },
    // 间距
    gutter: {
      type: [Number, String],
      default: 0
    },
    // 是否允许点击
    allowClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    list() {
      let result = [];
      let score = Math.floor(parseFloat(this.value) * 2) / 2;
      let hasDecimal = score % 1 !== 0;
      let integer = Math.floor(score);
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON);
      }
      if (hasDecimal) {
        result.push(CLS_HALF);
      }
      while (result.length < this.count) {
        result.push(CLS_OFF);
      }
      return result;
    }
  },
  methods: {
    click(index) {
      if (this.allowClick) {
        this.$emit("input", index + 1);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.star-box {
  display: flex;
  align-items: center;
}

.num {
  font-size: $font-size-xs;
  padding: 0 8rpx;
  color: $text-gray;
}
</style>
