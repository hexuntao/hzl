<template>
  <view class="">
    <view class="u-steps">
      <view class="u-steps-item" v-for="(item, index) in list" :key="index">
        <view
          class="u-steps-item-num"
          v-if="mode == 'number' && active < index"
          >{{ index + 1 }}</view
        >
        <view
          class="u-steps-item-dot"
          v-if="mode == 'dot'"
          :style="{
            backgroundColor: index <= active ? innerActiveColor : unActiveColor
          }"
        ></view>
        <lk-icon
          size="22"
          class="u-steps-item-checked"
          :style="{
            backgroundColor: index <= active ? innerActiveColor : unActiveColor
          }"
          v-if="mode == 'number' && active >= index"
          name="success"
        />
        <text
          :style="{
            color: index <= active ? innerActiveColor : unActiveColor
          }"
          >{{ item.name }}</text
        >
        <view
          class="u-steps-item-line"
          :style="{
            backgroundColor:
              index <= active ? innerActiveColor : unActiveColor,
            top: mode == 'dot' ? '24rpx' : '36rpx'
          }"
        >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * steps 步骤条
 * @description 该组件一般用于完成一个任务要分几个步骤，标识目前处于第几步的场景。
 * @property {String} mode 设置模式（默认dot）
 * @property {Array} list 数轴条数据，数组。具体见上方示例
 * @property {String} type type主题（默认primary）
 * @property {Number String} active 设置当前处于第几步
 * @property {String} active-color 已完成步骤的激活颜色，如设置，type值会失效
 * @property {String} un-active-color 未激活的颜色，用于表示未完成步骤的颜色（默认#606266）
 * @example <u-steps :list="numList" active-color="#fa3534"></u-steps>
 */
export default {
  name: "u-steps",
  props: {
    // 步骤条的类型，dot|number
    mode: {
      type: String,
      default: "dot"
    },
    // 步骤条的数据
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 当前哪一步是激活的
    active: {
      type: [Number, String],
      default: 0
    },
    // 激活步骤的颜色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 未激活的颜色
    unActiveColor: {
      type: String,
      default: "#606266"
    }
  },
  data() {
    return {};
  },
  computed: {
    innerActiveColor() {
      if (this.activeColor) return this.activeColor;
      else return "#f44";
    }
  }
};
</script>

<style lang="scss" scoped>
.u-steps {
  display: flex;
}
.u-steps-item {
  flex: 1;
  text-align: center;
  position: relative;
  min-width: 100rpx;
  font-size: 26rpx;
  color: #8799a3;
}
.u-steps-item .u-steps-item-line {
  content: "";
  position: absolute;
  height: 2rpx;
  width: calc(100% - 80rpx);
  left: calc(0rpx - (100% - 80rpx) / 2);
  top: 36rpx;
  z-index: 0;
}
.u-steps-item:first-child .u-steps-item-line {
  display: none;
}
.u-steps-item-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  border: 1px solid #8799a3;
  border-radius: 50%;
  margin: 14rpx auto;
  overflow: hidden;
}
.u-steps-item-dot {
  width: 20rpx;
  height: 20rpx;
  display: flex;
  border-radius: 50%;
  margin: 14rpx auto;
}
.u-steps-item-checked {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  color: #fff !important;
  height: 44rpx;
  border-radius: 50%;
  margin: 14rpx auto;
  overflow: hidden;
}
</style>
