<template>
  <view class="cell-group">
    <lk-cell :title="title" class="cell-panel">
      <text
        slot="titleRight"
        class="text-poundage"
        :class="info.loadingFlag ? 'text-red' : 'text-secondary'"
        >{{ poundageText }}</text
      >
    </lk-cell>
    <lk-cell>
      <view class="slider-box">
        <view class="slider-box-icon">
          <lk-icon class-prefix="v-icon" size="20" name="v-icon-motorcycle" />
        </view>
        <view class="slider">
          <slider
            v-if="info.gMin"
            class="slider-line"
            :value="value"
            :min="info.gMin || 1"
            :max="info.gMax || 100"
            :step="1"
            :block-size="20"
            @change="slider"
          />
        </view>
        <view class="slider-box-icon">
          <lk-icon class-prefix="v-icon" size="20" name="v-icon-car" />
        </view>
      </view>
      <view class="text">
        <text class="text-fee">{{ value }} {{ unit }}</text>
      </view>
      <view class="text">
        <text class="tip">{{ tip }}</text>
      </view>
    </lk-cell>
  </view>
</template>

<script>
import { yuan, bi } from "@/common/utils";
export default {
  data() {
    return {
      value: this.info.gMin || 1
    };
  },
  props: {
    info: Object,
    type: String,
    title: {
      type: String,
      default: "手续费"
    },
    unit: {
      type: String,
      default: "gwei"
    },
    tip: {
      type: String,
      default: "手续费由以太坊收取，费用越高处理速度越快手续费用由会员承当"
    }
  },
  computed: {
    poundageText() {
      const type = this.type.toUpperCase();
      const {
        gasFee,
        gasPrice,
        loadingFlag,
        loadingInitText,
        unit
      } = this.info;
      if (!loadingFlag) {
        return loadingInitText || "获取手续费中...";
      }
      if (parseFloat(gasFee) >= 0 && parseFloat(gasPrice) >= 0) {
        return gasFee + " " + unit + " ≈ ¥ " + gasPrice;
      }
    }
  },
  methods: {
    formatValue(e) {
      return e / 1;
    },
    slider(e) {
      this.value = e.detail.value;
      this.$emit("change", this.value);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}

.slider-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
}

.slider-box .slider-box-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-box .slider {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.slider-line {
  flex: 1;
}

.btn-slider {
  border-radius: 50%;
}

.text {
  text-align: center;
}

.text-fee {
  color: $red;
}
.text-poundage {
  font-size: $font-size-sm;
}
.text-secondary {
  color: $text-light;
}

.text .tip {
  font-size: $font-size-sm;
  color: $text-gray;
  display: inline-block;
  padding: $cell-padding;
  line-height: 1.4;
}
</style>
