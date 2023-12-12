<template>
  <view class="pages">
    <view class="head">
      <image :src="membercardstyle(info.membercard_style)" />
      <view class="headinfo">
        <view class="img">
          <image :src="info.membercard_logo" />
        </view>
        <view class="headmoney">
          <view class="count">卡内余额（元）</view>
          <view class="money">{{info.membercard_balance}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    info: {},
  },
  computed: {
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
  },
  methods: {
    membercardstyle(v) {
      if (v == 1) return this.basepath + "membercardstyle1.png";
      if (v == 2) return this.basepath + "membercardstyle2.png";
      if (v == 3) return this.basepath + "membercardstyle3.png";
      if (v == 4) return this.basepath + "membercardstyle4.png";
      if (v == 5) return this.basepath + "membercardstyle5.png";
      if (v == 6) return this.basepath + "membercardstyle6.png";
      if (v == 7) return this.basepath + "membercardstyle7.png";
    },
  },
};
</script>
<style scoped lang="scss">
.pages {
  .head {
    position: relative;
    width: 700rpx;
    height: 320rpx;
    color: #fff;
    margin: 20rpx auto;
    border-radius: 20rpx;
    > image {
      width: 100%;
      height: 320rpx;
    }
    .headmoney {
      text-align: center;
      width: 640rpx;
    }
    .count {
      font-size: 30rpx;
    }
    .money {
      padding-top: 10rpx;
      font-size: 40rpx;
      font-weight: 800;
    }
  }
}
.img {
  image {
    width: 100rpx;
    border-radius: 50%;
    height: 100rpx;
  }
}

.headinfo {
  position: absolute;
  top: 15%;
  left: 5%;
}
</style>