<template>
  <view class="floater-kefu" v-if="wxKefuImage">
    <button class="kefu-btn" open-type="contact">
      <image :src="wxKefuImage" class="image" mode="aspectFit" />
    </button>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    image: String
  },
  computed: {
    ...mapState({
      wxKefuImage: ({ config }) => config.wxKefuImage
    })
  }
};
</script>

<style lang="scss" scoped>
.floater-kefu {
  position: fixed;
  right: 30rpx;
  width: 100rpx;
  height: 100rpx;
  bottom: calc(var(--window-bottom) + 60rpx + env(safe-area-inset-bottom));
  z-index: 100;
}
.kefu-btn {
  border: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-size: $font-size;
  color: $text-color;
  box-sizing: border-box;
}
.kefu-btn::before,
.kefu-btn::after {
  display: none;
}
.image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
