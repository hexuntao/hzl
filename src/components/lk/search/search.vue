<template>
  <view class="lk-search" :class="searchClasses" :style="searchStyles">
    <slot name="left"></slot>
    <view class="search__content" :style="contentStyles" @click="onClick">
      <text class="search__label" v-if="label">{{ label }}</text>
      <view class="search__field">
        <lk-icon name="search" v-if="showSearchIcon" class="search__icon" />
        <input
          class="search__input"
          :value="value"
          :adjust-position="adjustPosition"
          type="text"
          :focus="focus"
          :disabled="disabled"
          :placeholder="placeholder"
          :confirm-type="confirmType"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @confirm="onConfirm"
        />
      </view>
    </view>
    <slot name="right"></slot>
    <view class="search__action" v-if="action" @click="onSearch">
      <text>{{ action }}</text>
    </view>
  </view>
</template>

<script>
import { basic } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("search");

export default {
  data() {
    return {
      cname: "search"
    };
  },
  props: {
    value: null,
    label: String,
    placeholder: [String, Number],
    confirmType: {
      type: String,
      default: "search"
    },
    action: String,
    adjustPosition: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    showSearchIcon: {
      type: Boolean,
      default: true
    },
    background: String,
    contentStyle: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [basic],
  computed: {
    searchClasses() {
      return formatClass([this.action ? "search--show-action" : ""]);
    },
    searchStyles() {
      return formatStyle({ background: this.background, ...this.customStyle });
    },
    contentStyles() {
      return formatStyle(this.contentStyle);
    }
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.detail.value);
    },
    onSearch() {
      this.$emit("search", this.value);
    },
    onFocus() {
      this.$emit("focus", this.value);
    },
    onBlur() {
      this.$emit("blur", this.value);
    },
    onConfirm() {
      this.$emit("confirm", this.value);
      this.$emit("search", this.value);
    },
    onClick() {
      if (this.disabled) {
        this.$emit("click");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.lk-search {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
  background-color: #fff;
  .search__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding-left: 16rpx;
    background-color: #f7f8fa;
    border-radius: 4rpx;
  }
  .search__label {
    padding: 0 10rpx;
    color: $text-color;
    font-size: $font-size;
    line-height: 68rpx;
  }
  .search__field {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx 30rpx;
    overflow: hidden;
    color: $text-color;
    font-size: $font-size;
    line-height: 48rpx;
    background-color: #fff;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 10rpx 16rpx 10rpx 0;
    background-color: transparent;
  }
  .search__icon {
    margin-right: 10rpx;
  }
  .search__input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: $text-color;
    font-size: $font-size;
    line-height: 48rpx;
    height: 48rpx;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
  }
  .search__action {
    padding: 0 16rpx;
    color: $text-color;
    font-size: $font-size;
    line-height: 68rpx;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
  }
}
.search--show-action {
  padding-right: 0;
}
</style>
