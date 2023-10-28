<template>
  <view class="footer-tab">
    <view class="placeholder"></view>
    <view class="tabbar">
      <view
        class="item"
        :class="active == 0 ? 'active' : ''"
        :style="active == 0 ? 'color:' + theme.color : ''"
        @click="click(0)"
      >
        <view class="name">首页</view>
      </view>
      <view class="item" @click="click(1)">
        <view class="name">发布</view>
<!--        <view class="icon">
          <lk-icon name="add" size="30" :color="theme.color" />
        </view>-->
      </view>
      <view
        class="item"
        :class="active == 2 ? 'active' : ''"
        :style="active == 2 ? 'color:' + theme.color : ''"
        @click="click(2)"
      >
        <view class="name">我的</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  methods: {
    click(i) {
      let paths = [
        "/pages/thingcircle/index",
        "/packages/thingcircle/release/index",
        "/packages/thingcircle/mine"
      ];
      if (this.active != i) {
        if (i === 1) {
          this.$Navigate.push(paths[i]);
        } else {
          this.$Navigate.replace(paths[i]);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.placeholder {
  width: 100%;
  // height: 100rpx;
  // height: calc(100rpx + constant(safe-area-inset-bottom));
  // height: calc(100rpx + env(safe-area-inset-bottom));
}
.footer-tab {
  position: fixed;
  bottom: 0rpx;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tabbar {
  display: flex;
  flex-flow: row;
  z-index: 200;
  left: 0;
  right: 0;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
  .item {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    color: $text-gray;
  }
  .item.active {
    font-weight: 800;
  }
}
</style>
