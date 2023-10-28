<template>
  <view>
    <view class="icon-text" @click="show = true">
      <lk-icon name="play-circle-o" color="#ffffff" />
      <text class="text">{{ text }}</text>
    </view>
    <lk-popup
      v-model="show"
      wrpper-style="background:transparent;"
      :before-show="onBeforeShow"
      :before-hide="onBeforeHide"
    >
      <view class="video-box">
        <video class="video" id="goods-video" :src="src"></video>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    src: String,
    text: {
      type: String,
      default: "视频"
    }
  },
  mounted() {
    this.videoContext = uni.createVideoContext("goods-video", this);
  },
  methods: {
    onBeforeShow() {
      this.videoContext.play();
    },
    onBeforeHide() {
      this.videoContext.pause();
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-text {
  border-radius: 60rpx;
  background: rgba(0, 0, 0, 0.3);
  width: auto;
  height: 48rpx;
  z-index: 100;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  padding: 8rpx 16rpx;
  font-size: $font-size-sm;
  .text {
    padding: 0 8rpx;
  }
}
.video-box {
  height: 100vw;
  width: 100vw;
  overflow: hidden;
  .video {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
