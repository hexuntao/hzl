<template>
  <view class="coupon-item" :class="'coupon-item-' + bgType">
    <view class="info-left" @click="click">
      <view class="money-box">
        <view class="money-box-text">
          <view class="num">{{ money }}</view>
          <view class="unit">{{ unit }}</view>
        </view>
        <view class="money-foot-text">{{ label }}</view>
		<view class="money-foot-text">（总共{{ last_count }}张）</view>
		
      </view>
      <view class="name-time">
        <view class="name-text">{{ name }}</view>
		<view class="name-text">{{coupon_name}}</view>
        <view class="time-text">{{ time }}</view>
      </view> 
    </view>
    <view class="info-right">
      <text class="semi-before" :style="'background-color:' + defectBg"></text>
      <text class="semi-after" :style="'background-color:' + defectBg"></text>
      <text></text>
      <slot name="right">
        <lk-button
          v-if="btnText"
          round
          size="small"
          plain
          type="text"
          bing-mobile
          :disabled="btnDisabled"
          :loading="btnLoading"
          @click="btnclick"
          >{{ btnText }}</lk-button
        >
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    bgType: {
      type: String,
      default: "red"
    },
    defectBg: {
      type: String,
      default: "#ffffff"
    },
    money: [String, Number],
    unit: String,
    label: String,
    name: String,
	coupon_name:String,
	last_count:Number,
    time: String,
    btnDisabled: {
      type: Boolean,
      default: false
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    btnText: String
  },
  computed: {},
  methods: {
    btnclick() {
      this.$emit("btn-click");
    },
    click() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-item {
  display: flex;
  align-items: center;
  position: relative;
  margin: 30rpx;
  height: 160rpx;
  background: #ffffff;
  color: #fff;
  border-radius: 8rpx;
  .info-left {
    display: flex;
    flex: 1;
    .money-box {
      display: flex;
      width: 180rpx;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .money-box-text {
        display: flex;
        align-items: baseline;
        .num {
          font-size: 40rpx;
          font-weight: bold;
          max-width: 150rpx;
          /* text-overflow: ellipsis; */
          white-space: nowrap;
          overflow: hidden;
          line-height: 1.2;
        }
        .unit {
          display: flex;
          font-size: $font-size-sm;
          line-height: 1;
          margin-left: 8rpx;
        }
      }
      .money-foot-text {
        display: flex;
        font-size: $font-size-sm;
        margin-top: 10rpx;
      }
    }
    .name-time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name-text {
        font-size: $font-size;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
      }
      .time-text {
        display: flex;
        font-size: $font-size-sm;
        margin-top: 10rpx;
      }
    }
  }
  .info-right {
    display: flex;
    align-items: center;
    width: 180rpx;
    justify-content: center;
    flex: none;
    height: 100rpx;
    border-left: 1rpx dashed #ffffff;
    position: relative;
    .semi-before,
    .semi-after {
      content: "";
      position: absolute;
      left: -16rpx;
      display: block;
      width: 30rpx;
      height: 30rpx;
      background: #ffffff;
      border-radius: 999rpx;
    }
    .semi-before {
      top: -46rpx;
    }
    .semi-after {
      bottom: -46rpx;
    }
  }
}
.coupon-item-red {
  background: linear-gradient(-37deg, #ff2828 0%, #ff642e 100%);
}
.coupon-item-blue {
  background: linear-gradient(-37deg, #3076fe 0%, #62b3fe 100%);
}
.coupon-item-white {
  background: #fff;
  color: #666;
  .info-right {
    color: #666;
    border-left: 1rpx dashed #666;
    .semi-before,
    .semi-after {
      background: #ffffff;
    }
  }
}
</style>
