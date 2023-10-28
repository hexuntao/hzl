<template>
  <view class="sku-stepper" v-if="!info.noEditNum">
    <view class="sku-stepper-container">
      <view class="sku__stepper-title">{{ stepperTitle || "购买数量" }}</view>
      <lk-stepper
        v-model="currentNum"
        :min="stepperMin"
        :max="stepperLimit"
        :disable-input="disableStepperInput"
        @overlimit="onOverLimit"
        @change="onChange"
      />
    </view>
    <!-- <view v-if="!hideStock" class="sku__stock">{{ stockText }}</view>
    <view v-if="!hideQuotaText && quotaText" class="sku__quota">
      {{ quotaText }}
    </view> -->
  </view>
</template>

<script>
import { LIMIT_TYPE } from "../constants";

const { QUOTA_LIMIT, STOCK_LIMIT } = LIMIT_TYPE;
export default {
  name: "sku-stepper",
  data() {
    return {
      currentNum: this.selectedNum,
      // 购买限制类型: 限购/库存
      limitType: STOCK_LIMIT
    };
  },
  props: {
    skuStockNum: Number,
    info: Object,
    selectedSkuComb: Object,
    selectedNum: Number,
    leastNum: Number,
    stepperTitle: String,
    quota: Number,
    quotaUsed: Number,
    hideStock: Boolean,
    hideQuotaText: Boolean,
    disableStepperInput: Boolean,
    customStepperConfig: Object,
    action: String
  },
  watch: {
    currentNum(num) {
      this.$emit("num-change", num);
    },

    stepperLimit(limit) {
      if (limit < this.currentNum) {
        this.currentNum = limit;
      }
    }
  },
  computed: {
    stock() {
      const { stockNum } = this.customStepperConfig;
      if (stockNum !== undefined) {
        return stockNum;
      }
      // if (this.selectedSkuComb) {
      //   return this.selectedSkuComb.stock || 0;
      // }
      return this.skuStockNum;
    },

    stockText() {
      const { stockFormatter } = this.customStepperConfig;
      if (stockFormatter) return stockFormatter(this.stock);

      return `剩余${this.stock}件`;
    },

    quotaText() {
      const { quotaText, hideQuotaText } = this.customStepperConfig;

      if (hideQuotaText) return "";

      let text = "";

      if (quotaText) {
        text = quotaText;
      } else if (this.quota > 0) {
        text = `限购${this.quota}件`;
      }

      return text;
    },

    stepperLimit() {
      const quotaLimit = this.quota - (this.quotaUsed || 0);
      let limit;

      // 无限购时直接取库存，有限购时取限购数和库存数中小的那个
      if (this.quota > 0 && quotaLimit <= this.stock) {
        // 修正负的limit
        limit = quotaLimit < 0 ? 0 : quotaLimit;
        this.limitType = QUOTA_LIMIT;
      } else {
        limit = this.stock;
        this.limitType = STOCK_LIMIT;
      }

      return limit;
    },

    stepperMin() {
      return this.leastNum || 1;
    }
  },

  methods: {
    setCurrentNum(num) {
      this.currentNum = num;
    },

    onOverLimit(action) {
      this.$emit("sku-over-limit", {
        action,
        limitType: this.limitType,
        quota: this.quota,
        quotaUsed: this.quotaUsed,
        least: this.stepperMin
      });
    },

    onChange(currentValue) {
      const { handleStepperChange } = this.customStepperConfig;
      handleStepperChange && handleStepperChange(currentValue);
      this.$emit("change", currentValue);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.sku {
  &-stepper {
    padding: 24rpx 0;
    margin-left: 30rpx;
    &-stock {
      padding: 24rpx 0;
      margin-left: 30rpx;
    }

    &-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60rpx;
      margin-right: 40rpx;
    }
  }

  &__stock {
    display: inline-flex;
    margin-right: 20rpx;
    color: $gray-dark;
    font-size: $font-size-sm;
  }

  &__quota {
    display: inline-flex;
    color: $red;
    font-size: $font-size-sm;
  }
}
</style>
