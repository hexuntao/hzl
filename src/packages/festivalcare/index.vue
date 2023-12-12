<template>
  <!-- 节日关怀 -->
  <view class="pages">
    <image :src="followgift" />

    <view class="wrap">
      <view class="main">
        <view class="img">
          <image :src="info.prize_pic" mode="widthFix" />
        </view>
        <view class="txt">
          <view class="h3">{{ info.prize_name ? info.prize_name : "" }}</view>
          <view class="p">{{ info.name ? info.name : "" }}</view>
        </view>
      </view>
      <view class="tip">奖品已放置在列表当中</view>
      <view class="jump" @click="receive">前往领取</view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import { GET_ACCEPTFESTIVALCARE } from "@/common/interface/festivalcare";
export default {
  name: "",
  data() {
    return {
      info: {},
      id: ""
    };
  },
  onLoad(option) {
    this.id = option.festivalcare_id;
    GET_ACCEPTFESTIVALCARE({ prize_id: option.festivalcare_id }).then(res => {
      this.info = res.data;
    });
  },
  computed: {
    followgift() {
      return this.$store.getters.static.baseImgPath + "festivalcare-bg.jpg";
    }
  },
  methods: {
    receive() {
      this.$Navigate.push(`/packages/prize/list?prize_id=${this.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.pages {
  width: 100vw;
  height: 100vh;

  image {
    width: 100%;
    height: 100%;
  }
}

.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -10%);
  width: 100%;
}
.main {
  position: relative;
  background-color: #ffffff;
  display: flex;
  padding: 40rpx;
  margin: 0px 32rpx;
  border-radius: 12rpx;
}
.main:before {
  content: "";
  width: 32rpx;
  height: 32rpx;
  background-color: #ee5859;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: -16rpx;
  transform: translateY(-50%);
  z-index: 10;
}
.main:after {
  content: "";
  width: 32rpx;
  height: 32rpx;
  background-color: #ee5859;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: -16rpx;
  transform: translateY(-50%);
  z-index: 10;
}
.main .img {
  width: 120rpx;
  height: 120rpx;
}
.main .img image {
  width: 100%;
  height: 100%;
}
.main .txt {
  font-size: 28rpx;
  flex: 1;
  padding-left: 20rpx;
}
.main .txt .h3 {
  font-size: 28rpx;
  font-weight: normal;
}
.main .txt .p {
  font-size: 24rpx;
  line-height: 60rpx;
  color: #9e9e9e;
}
.wrap .tip {
  text-align: center;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #fff;
}
.wrap .jump {
  text-align: center;
  font-size: 28rpx;
  color: #fff542;
  margin-top: 12rpx;
  position: relative;
  display: block;
}
.wrap .jump:after {
  content: "";
  width: 12rpx;
  height: 12rpx;
  border-top: 1px solid #fff542;
  border-right: 1px solid #fff542;
  display: inline-block;
  transform: rotate(45deg) translateY(-1px);
}
</style>
