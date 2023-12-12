<template>
  <view class="carddetail">
    <image :src="membercardstyle(info.membercard_style)" />
    <view class="infohead">
      <view class="item1">
        <view class="img">
          <image :src="info.membercard_logo" />
        </view>
        <view>
          <view class="text">
            <view>{{ info.membercard_name }}</view>
            <view class="upgrade" @click="upgrade">{{
              cardstatus(info.status)
            }}</view>
          </view>
          <view class="shopcard">{{ mallConfig.mall_name }}</view>
        </view>
      </view>
      <span class="balance"
        >卡内余额(元)：{{
          info.membercard_balance ? info.membercard_balance : 0
        }}</span
      >
    </view>
  </view>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    info: {}
  },
  mounted() {},

  computed: {
    ...mapState({
      mallConfig: ({ config }) => config
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    }
  },

  methods: {
    cardstatus(v) {
      if (v == 0) {
        return "续费";
      } else {
        return "升级";
      }
    },
    membercardstyle(v) {
      if (v == 1) return this.basepath + "membercardstyle1.png";
      if (v == 2) return this.basepath + "membercardstyle2.png";
      if (v == 3) return this.basepath + "membercardstyle3.png";
      if (v == 4) return this.basepath + "membercardstyle4.png";
      if (v == 5) return this.basepath + "membercardstyle5.png";
      if (v == 6) return this.basepath + "membercardstyle6.png";
      if (v == 7) return this.basepath + "membercardstyle7.png";
    },

    upgrade() {
      this.$Navigate.push("/packages/membercard/upgrade");
    }
  }
};
</script>
<style scoped lang="scss">
.carddetail {
  width: 700rpx;
  height: 320rpx;
  margin: 20rpx auto;
  border-radius: 20rpx;
  color: #fff;
  font-weight: 600;
  position: relative;
  image {
    width: 100%;
    height: 320rpx;
  }
}

.infohead {
  position: absolute;
  top: 0%;
  padding: 40rpx;
}
.img image {
  width: 100rpx;
  height: 100rpx;
  background-color: #fb4343;
  border-radius: 50%;
}
.item1 {
  display: flex;
  align-items: center;
}
.upgrade {
  font-size: 26rpx;
  width: 100rpx;
  height: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffc000;
  margin-left: 40rpx;
  background-color: #737373;
  border-radius: 20rpx;
  opacity: 0.8;
}
.text {
  display: flex;
  padding-left: 20rpx;
}
.shopcard {
  margin: 10rpx 20rpx;
}
.balance {
  width: auto;
  background-color: #737373;
  border-radius: 20rpx;
  opacity: 0.8;
  padding: 4rpx 20rpx;
  position: absolute;
  top: 240rpx;
}
</style>
