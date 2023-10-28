<template>
  <view
    class="submit-bar"
    :style="barBottom"
    :class="safeAreaInsetBottom ? 'inset-bottom' : ''"
  >
    <slot name="tip">
      <view class="tip" v-if="tip">{{ tip }}</view>
    </slot>
    <view class="bar">
      <slot />
      <view class="bar-text">
        <slot name="label" >
          <view class="bar-label">{{ label }}</view>
          <view class="bar-price first-letter">{{ priceText }}{{ptmoneyText}}</view>
        </slot>
      </view>
      <view class="bar-btn">
        <lk-wx-open-subscribe
          node_id="8"
          @success="success"
          v-if="showsubscribe"
        >
          <view slot="btn-subscribe">
            <lk-button
              class="btn"
              block
              round
              type="danger"
              :custom-style="{ height: '80rpx', lineHeight: '80rpx' }"
              :color="theme.gradient"
              :disabled="disabled"
              :loading="loading"
              @click="click"
            >
              {{ buttonText }}
            </lk-button>
          </view>
        </lk-wx-open-subscribe>

        <lk-button
          v-else
          class="btn"
          block
          round
          type="danger"
          :custom-style="{ height: '80rpx', lineHeight: '80rpx' }"
          :color="theme.gradient"
          :disabled="disabled"
          :loading="loading"
          @click="click"
        >
          {{ buttonText }}
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cname: "submit-bar"
    };
  },
  props: {
    showsubscribe: {
      type: Boolean,
      default: false
    },
    price: [String, Number],
	ptmoney: [String, Number],
    disabled: Boolean,
    loading: Boolean,
    tip: String,
    label: {
      type: String,
      default: "合计："
    },
    buttonText: {
      type: String,
      default: "提交"
    },
    symbol: {
      type: String,
      default: "¥"
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hasPrice() {
      return typeof this.price === "number";
    },
    priceText() {
      return yuan(this.price);
    },
	ptmoneyText() {
	  if(this.ptmoney!=0 && this.ptmoney!=null){
		  return '+'+this.ptmoney+'积分';
	  }else{
		  return '';
	  }
	},
    ...mapGetters(["windowBottom"]),
    barBottom() {
      return this.windowBottom ? `bottom:${this.windowBottom}px;` : "";
    }
  },
  methods: {
    success() {
      this.click();
    },
    click() {
      this.$emit("submit");
    }
  }
};
</script>

<style scoped lang="scss">
.submit-bar {
  position: fixed;
  left: 0;
  bottom: var(--window-bottom);
  width: 100%;
  z-index: 100;
  -webkit-user-select: none;
  user-select: none;
  background-color: $white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
  .tip {
    padding: 16rpx 24rpx;
    color: #f56723;
    font-size: $font-size-sm;
    line-height: 1.5;
    background-color: #fff7cc;
  }
  .bar {
    height: 100rpx;
    font-size: $font-size;
    display: flex;
    align-items: center;
    &-text {
      flex: 1;
      font-weight: 500;
      color: $text-color;
      padding-right: 24rpx;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      line-height: 1.2;
    }
    &-label {
      font-size: $font-size-sm;
    }
    &-price {
      color: $red;
      font-size: $font-size-lg;
      padding-left: 16rpx;
      font-weight: 800;
    }
    &-btn {
      width: 220rpx;
      font-size: $font-size;
      height: 80rpx;
      line-height: 80rpx;
      margin: 10rpx;
      border-radius: 80rpx;
      .btn {
        height: 80rpx;
        line-height: 80rpx;
      }
    }
  }
}
.submit-bar.inset-bottom {
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
