<template>
  <view class="card-group-box">
    <view class="code-box">
      <view class="image">
        <image :src="qrcode" mode="widthFix" />
      </view>
      <view class="code">
        <text>{{ code }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    qrcode: String,
    code: String
  }
};
</script>

<style lang="scss" scoped>
.code-box {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: $cell-padding;
  justify-content: center;
  align-items: center;
}

.image {
  height: 0;
  width: 60%;
  padding: 30% 0;
  overflow: hidden;
}

.image image {
  display: block;
  width: 100%;
  margin-top: -50%;
  background-color: #fff;
  border: none;
  background: $image-background;
}

.code {
  width: 60%;
  background: $background-color;
  text-align: center;
  padding: 8rpx 16rpx;
  margin-top: 20rpx;
}
</style>
