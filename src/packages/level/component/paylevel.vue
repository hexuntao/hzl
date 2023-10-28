<template>
  <view class="swiper-group">
    <swiper class="swiper" 
		    interval="5000"
        next-margin = "24px"
        previous-margin = "24px"
		    duration="1500"
        @change ="change"
    >  
		<swiper-item v-for="(item , index) in list" :key="index">
			<image class="swiper-image" :src="item.image" mode="aspectFill"></image>
        <view class="swiper-title">
            <text class="title" :style="{'color':item.color}">{{item.title}}</text>
            <text class="tisp" :style="{'background':item.bgColor}">当前等级</text>
        </view>
        <view class="swiper-date" v-if="paygrade_info.end_time" :style="{'color':item.dateColor}">到期日期:{{paygrade_info.end_time}}</view>
		</swiper-item>
	</swiper>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    paygrade_info: Object,
  },
  computed: {
    showLevel() {
      let flag = false;
      return !!(this.paygrade_info.end_time);
    },
  },
  methods: {
    change(e) {
      this.$emit('onchage', e)
    },
  }
};
</script>

<style lang="scss" scoped>
.swiper-group {
    margin: 0 auto;
    text-align: center;
}
.swiper-image {
    width: 620rpx;
    height: 300rpx;
    border-radius: 20rpx 20rpx 0 0;
}
.swiper-title {
    position: absolute;
    left: 64rpx;
    top: 64rpx;
    display: flex;
    align-items: center;
    .title {
        font-size: 50rpx;
    }
    .tisp {
        margin-left: 10rpx;
        width: 128rpx;
        height: 40rpx;
        border-radius: 20rpx 20rpx 20rpx 0;
        text-align: center;
        line-height: 40rpx;
        font-size: 20rpx;
        color: white;
        display: inline-block;
    }
}
.swiper-date {
    position: absolute;
    left: 64rpx;
    bottom: 52rpx;
    font-size: 20rpx;
}
</style>