<template>
  <view class="u-checkbox-group" :style="{ flexFlow }">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    // 最多能选中多少个checkbox
    max: {
      type: [Number, String],
      default: 999
    },
    // 所有选中项的 name
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否禁用所有复选框
    disabled: {
      type: Boolean,
      default: false
    },
    // 在表单内提交时的标识符
    name: {
      type: [Boolean, String],
      default: ""
    },
    // 选中状态下的颜色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 组件的整体大小
    size: {
      type: [String, Number],
      default: 20
    },
    flexFlow: {
      type: String,
      default: "wrap"
    }
  },
  provide() {
    return {
      checkboxGroup: this
    };
  },
  data() {
    return {};
  },
  watch: {
    value(val) {
      this.$emit("change", val);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.u-checkbox-group {
  display: flex;
}
</style>
