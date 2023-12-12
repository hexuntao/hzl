<template>
  <view
    class="field"
    :class="[cellClassCenter, cellClassRequired, cellClassNoBorder]"
    :style="fieldStyle"
  >
    <slot name="leftIcon">
      <lk-icon
        v-if="leftIcon"
        :custom-class="['field-icon', 'field-left-icon']"
        :name="leftIcon"
        square
        :class-prefix="iconPrefix"
      />
    </slot>
    <slot name="label">
      <text class="field-label" v-if="label">{{ label }}</text>
    </slot>
    <textarea
      v-if="type === 'textarea'"
      class="field-input field-textarea"
      :class="[inputDisabledClass]"
      :style="inputStyles"
      :value="values"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :auto-height="autoHeight"
      :fixed="fixed"
      :cursor-spacing="cursorSpacing"
      :disable-default-padding="disableDefaultPadding"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @linechange="onLinechange"
      @keyboardheightchange="onKeyboardheightchange"
    />
    <input
      v-else
      class="field-input"
      :class="[inputDisabledClass]"
      :style="inputStyle"
      name="input"
      :password="isPassword"
      :type="type"
      :value="values"
      :disabled="disabled"
      :placeholder="placeholder"
      :cursor-spacing="cursorSpacing"
      :maxlength="maxLength"
      :confirm-type="confirmType"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />
    <view class="field-button" v-if="$slots.button">
      <slot name="button" />
    </view>
    <slot name="rightIcon">
      <lk-icon
        v-if="rightIcon"
        :custom-class="['field-icon', 'field-right-icon']"
        :name="rightIcon"
        @click="clickRightIcon"
      />
    </slot>
  </view>
</template>

<script>
import { basic, cell } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("field");

export default {
  data() {
    return {
      cname: "field"
    };
  },
  props: {
    value: {
      type: [String, Number],
      default: ""
    }, //内容
    label: [String, Number], // 左侧文案
    placeholder: [String, Number], //提示文案
    leftIcon: String, // 左侧图标
    rightIcon: String, // 右侧图标
    center: Boolean, //垂直居中
    required: Boolean, // 表示*
    disabled: Boolean, //禁止输入
    iconPrefix: {
      type: String,
      default: "icons"
    },
    maxlength: [String, Number],
    autoHeight: Boolean,
    type: {
      type: String,
      default: "text"
    },
    border: {
      type: Boolean,
      default: true
    },
    inputSize: [String, Number],
    inputStyle: {
      type: Object,
      default: () => ({})
    },
    fixed: {
      type: Boolean,
      default: false
    },
    cursorSpacing: {
      type: Number,
      default: 10
    },
    disableDefaultPadding: {
      type: Boolean,
      default: false
    },
    background: String,
    confirmType: String
  },
  computed: {
    values() {
      return this.value;
    },
    maxLength() {
      return this.maxlength ? Number(this.maxlength) : 140;
    },
    isPassword() {
      return !!this.type === "password";
    },
    cellClassCenter() {
      return this.center ? "field--center" : "";
    },
    cellClassRequired() {
      return this.required ? "field--required" : "";
    },
    cellClassNoBorder() {
      return !this.border ? "field--no-border" : "";
    },
    inputDisabledClass() {
      return this.disabled ? "field-input--disabled" : "";
    },
    inputStyles() {
      return formatStyle({
        fontSize: this.inputSize ? this.inputSize + "px" : "",
        ...this.inputStyle
      });
    },
    fieldStyle() {
      return formatStyle({
        background: this.background || ""
      });
    }
  },
  methods: {
    onInput(event) {
      this.$emit("input", event.target.value);
    },
    onFocus(event) {
      this.$emit("focus", event.target.value);
    },
    onBlur(event) {
      this.$emit("blur", event.target.value);
    },
    onConfirm(event) {
      this.$emit("confirm", event.target.value);
    },
    clickRightIcon() {
      this.$emit("click-right-icon");
    },
    onLinechange(event) {
      this.$emit("linechange", event.target.value);
    },
    onKeyboardheightchange(event) {
      this.$emit("keyboardheightchange", event.target.value);
    }
  }
};
</script>

<style scoped lang="scss">
// field
$field-icon-size: 32rpx;
$field-label-width: 180rpx;
$field-input-color: $text-color;
$field-input-min-height: 48rpx;
$field-input-disabled-color: $gray-dark;
$field-input-disabled-bg: #f5f5f5;

.field {
  position: relative;
  display: flex;
  flex-flow: row;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  color: $text-color;
  font-size: $font-size;
  line-height: 48rpx;
  background-color: $white;
  padding: $cell-padding;
  &::after {
    content: " ";
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    left: 30rpx;
    right: 0;
    bottom: 0;
    transform: scaleY(0.5);
    border-bottom: 2rpx solid $border-color;
  }
  &::last-child::after {
    border: none;
  }
  &-icon {
    display: flex;
    flex-flow: row;
    min-width: 1em;
    font-size: $field-icon-size;
    line-height: inherit;
  }
  &-label {
    width: $field-label-width;
    font-size: inherit;
  }
  &-input {
    position: relative;
    display: flex;
    flex-flow: row;
    flex: 1;
    align-items: center;
    overflow: hidden;
    vertical-align: middle;
    word-wrap: break-word;
    min-height: $field-input-min-height;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: $field-input-color;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
    font-size: inherit;
  }
  &-textarea {
    height: 120rpx;
  }
  &-input--disabled {
    opacity: 1;
    color: $field-input-disabled-color;
    background-color: $field-input-disabled-bg;
  }
  &-left-icon {
    margin-right: 10rpx;
  }
  &-right-icon {
    margin-right: -16rpx;
    padding: 0 16rpx;
    line-height: inherit;
  }
  &-button {
    display: flex;
    flex-flow: row;
    align-items: center;
    height: $field-input-min-height;
    margin-left: 10rpx;
  }
  &--center {
    align-items: center;
  }
  &--required {
    overflow: visible;
    &::before {
      content: "*";
      position: absolute;
      left: 14rpx;
      font-size: $font-size;
      color: $red;
    }
  }
  &--no-border::after {
    border: none;
  }
}
</style>
