<template>
  <lk-cell>
    <view class="presell-info">
      <view class="front-item">
        <text class="sort">1</text>
        <view class="money">
          <text>定金</text>
          <text>{{ info.frontMoney | yuan }}</text>
        </view>
      </view>
      <view>
        <text class="sort">2</text>
        <view class="money">
          <text>尾款{{ info.tailText }}</text>
          <text>{{ info.tailMoney | yuan }}</text>
          <text class="time">
            {{ startTime }}
          </text>
          <text>开始支付</text>
        </view>
      </view>
    </view>
  </lk-cell>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  props: {
    info: Object
  },
  computed: {
    startTime() {
      return formatDate(this.info.pay_start_time, "YYYY-MM-DD");
    }
  }
};
</script>

<style scoped lang="scss">
.presell-info > view {
  display: flex;
  align-items: center;
  color: $text-light;
  font-size: $font-size-sm;
}

.presell-info > view .sort {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #909399;
  width: 40rpx;
  height: 40rpx;
  margin-right: 12rpx;
}

.presell-info .front-item {
  color: $red;
}

.presell-info .front-item .sort {
  background: $red;
}

.presell-info > view .money,
.presell-info > view .time {
  padding: 0 8rpx;
}
</style>
