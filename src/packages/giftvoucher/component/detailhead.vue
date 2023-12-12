<template>
  <view class="item"  :class="list.state ==1?'use':'unuse'">
    <view class="info">
      <view class="img">
        <image :src="list.pic_cover_mid" />
      </view>
      <view class="text">
        <view class="name">{{list.giftvoucher_name}}</view>
        <view class="time">{{list.start_time | formatDate}} ~ {{list.end_time | formatDate}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  props: {
    list: {}
  },
  filters: {
    formatDate(value) {
      return formatDate(value, "YYYY-MM-DD hh:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 8rpx;
  margin: 30rpx;
  padding: 40rpx 30rpx;
  position: relative;
  overflow: hidden;
}

.item::after,
.item::before {
  content: "";
  display: block;
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #f8f8f8;
  border-radius: 50%;
  top: 50%;
  margin-top: -16rpx;
}

.item::after {
  right: -16rpx;
}

.item::before {
  left: -16rpx;
}

.item .info {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 100rpx;
}

.item .info .img {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
}

.item .info .img image {
  width: 100%;
  height: 100%;
}

.item .info .text {
  flex: 1;
}

.item .info .text .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16rpx;
  line-height: 1.4;
  color: #ffffff;
}

.item .info .text .time {
  font-size: 24rpx;
  color: #ffffff;
}

.item .info .text .detail {
  color: #666;
}

.a-link {
  color: #169bd5;
}
.use {
  //background-color: #ff6666;
  background: linear-gradient(to right, #0ed4ae, #06e285);
}
.unuse {
background-color: #999;
}
</style>