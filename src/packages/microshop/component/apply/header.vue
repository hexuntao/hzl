<template>
  <view class="header">
    <image :src="bgImg" class="bg" />
    <view class="info">
      <view class="logo">
        <lk-avatar :src="info.avatar" />
      </view>
      <view class="text">
        <view class="name">{{ info.title }}</view>
        <view class="label">{{ info.label }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    info: Object
  },
  computed: {
    ...mapGetters(["static"]),
    bgImg() {
      return this.static.baseImgPath + "microshop-head-bg.png";
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  height: 140rpx;
  background: $image-background;
  overflow: hidden;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .info {
    position: relative;
    z-index: 1;
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 100%;
    padding: $cell-padding;
    align-items: center;
    .logo {
      flex: none;
      margin-right: 20rpx;
      font-size: $font-size-lg;
    }
    .text {
      flex: 1;
      color: #ffffff;
      line-height: 48rpx;
    }
    .label {
      word-break: break-word;
      line-height: 40rpx;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
