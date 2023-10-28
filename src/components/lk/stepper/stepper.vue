<template>
  <view class="stepper">
    <view @click="onChange('minus')" class="numbox__minus">
      <text
        class="stepper--text"
        :class="{ 'stepper--disabled': currentValue <= min || disabled }"
        >-</text
      >
    </view>
    <input
      :disabled="disabled || disableInput"
      @blur="onBlur"
      @input="onInput"
      class="numbox__value"
      type="number"
      :value="currentValue"
    />
    <view @click="onChange('plus')" class="numbox__plus">
      <text
        class="stepper--text"
        :class="{ 'stepper--disabled': currentValue >= max || disabled }"
        >+</text
      >
    </view>
  </view>
</template>

<script>
import { isDef } from "@/common/utils";
export default {
  data() {
    const value = this.range(
      isDef(this.value) ? this.value : this.defaultValue
    );
    if (value !== +this.value) {
      this.$emit("input", value);
    }
    return {
      cname: "stepper",
      currentValue: value
    };
  },
  props: {
    value: null,
    integer: Boolean,
    disabled: Boolean,
    asyncChange: Boolean,
    disableInput: Boolean,
    min: {
      type: [String, Number],
      default: 1
    },
    max: {
      type: [String, Number],
      default: Infinity
    },
    step: {
      type: [String, Number],
      default: 1
    },
    defaultValue: {
      type: [String, Number],
      default: 1
    },
    name: [String, Number]
  },
  watch: {
    value(val) {
      if (val !== this.currentValue) {
        this.currentValue = this.format(val);
      }
    },
    min(val) {
      if (val !== this.currentValue) {
        this.currentValue = this.format(val);
      }
    },
    currentValue(val) {
      this.$emit("input", val);
      this.$emit("change", val, this.name);
    }
  },
  computed: {
    minusDisabled() {
      return this.disabled || this.currentValue <= this.min;
    },
    plusDisabled() {
      return this.disabled || this.currentValue >= this.max;
    }
  },
  methods: {
    // filter illegal characters
    format(value) {
      value = String(value).replace(/[^0-9.-]/g, "");
      return value === "" ? 0 : this.integer ? Math.floor(value) : +value;
    },

    // limit value range
    range(value) {
      return Math.max(Math.min(this.max, this.format(value)), this.min);
    },

    onInput(event) {
      const { value } = event.target;

      const formatted = this.format(value);

      if (!this.asyncChange) {
        if (+value !== formatted) {
          event.target.value = formatted;
        }
        this.currentValue = formatted;
      } else {
        event.target.value = this.currentValue;
        this.$emit("input", formatted);
        this.$emit("change", formatted, this.name);
      }
    },

    onChange(type) {
      if (this[`${type}Disabled`]) {
        this.$emit("overlimit", type, this.name);
        return;
      }

      const diff = type === "minus" ? -this.step : +this.step;
      const value = Math.round((this.currentValue + diff) * 100) / 100;

      if (!this.asyncChange) {
        this.currentValue = this.range(value);
      } else {
        this.$emit("input", value);
        this.$emit("change", value, this.name);
      }
      this.$emit(type);
    },

    onFocus(event) {
      this.$emit("focus", event);
    },

    onBlur(event) {
      this.currentValue = this.range(this.currentValue);
      this.$emit("blur", event);

      // fix edge case when input is empty and min is 0
      if (this.currentValue === 0) {
        event.target.value = this.currentValue;
      }
    }
  }
};
</script>
<style scoped lang="scss">
/* #ifdef APP-NVUE */
/* #endif */

.stepper {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  height: 56rpx;
  line-height: 56rpx;
  width: 176rpx;
}

.numbox__value {
  text-align: center;
  font-size: $font-size;
  border-left-width: 0;
  border-right-width: 0;
  width: 60rpx;
  height: 56rpx;
  padding: 2rpx;
  border: 0;
  margin: 0 2rpx;
  background-color: #f2f3f5;
}

.numbox__minus {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: $gray-darker;
  border-top-left-radius: 6rpx;
  border-bottom-left-radius: 6rpx;
  border-right-width: 0;
  width: 56rpx;
  height: 56rpx;
  box-sizing: border-box;
  background-color: #f2f3f5;
}

.numbox__plus {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: $gray-darker;
  border-top-left-radius: 6rpx;
  border-bottom-left-radius: 6rpx;
  border-right-width: 0;
  width: 56rpx;
  height: 56rpx;
  box-sizing: border-box;
  background-color: #f2f3f5;
}

.stepper--text {
  font-size: $font-size-lg;
  color: inherit;
}

.stepper--disabled {
  color: #c0c0c0;
}
</style>
