<template>
  <view class="anchor-top-bar" :style="'top:' + top">
    <view class="left-icon">
      <lk-icon name="arrow-left" size="20" color="#ffffff" @click="back" />
    </view>
    <view class="bar-box" v-if="showInfo">
      <view class="info">
        <image class="avatar" :src="avatar" mode="aspectFill" />
        <view class="text">
          <view class="name">{{ name }}</view>
          <view class="label">{{ label }}</view>
        </view>
        <slot name="infoRight" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    let screenInfo = uni.getSystemInfoSync();
    return {
      top: screenInfo.statusBarHeight
        ? screenInfo.statusBarHeight + "px"
        : "15px"
    };
  },
  props: {
    avatar: String,
    name: String,
    label: String,
    showInfo: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    back() {
      this.$Navigate.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.anchor-top-bar {
  position: fixed;
  z-index: 998;
  top: calc(var(--status-bar-height));
  left: 20rpx;
  display: flex;
  align-items: center;
  .bar-box {
    background: rgba(0, 0, 0, 0.5);
    padding: 8rpx;
    display: flex;
    align-items: center;
    border-radius: 99999rpx;
  }
  .left-icon {
    flex: none;
    width: 60rpx;
    height: 76rpx;
    display: flex;
    align-items: center;
  }
  .info {
    flex: 1;
    color: #ffffff;
    font-size: $font-size-sm;
    display: flex;
    align-items: center;
  }
  .avatar {
    display: block;
    border-radius: 50%;
    overflow: hidden;
    width: 60rpx;
    height: 60rpx;
  }
  .text {
    padding: 0 10rpx;
  }
  .name {
    max-width: 200rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .label {
    font-size: $font-size-xs;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
