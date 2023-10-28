<template>
  <view class="header">
    <image class="bg" :src="info.images ? info.images[0] : ''" />
    <view class="info-panel card-group-box">
      <view class="title">{{ info.title }}</view>
      <view class="info">
        <view class="image" @click="previewImage">
          <image :src="info.images ? info.images[0] : ''" />
          <text class="num">{{ info.images ? info.images.length : 0 }}</text>
        </view>
        <view class="content">
          <view>
            <lk-star :value="info.score" />
          </view>
          <view class="address" @click="showMap">{{ info.address }}</view>
        </view>
      </view>
      <view class="time">
        <view>{{ info.time }}</view>
        <lk-icon
          name="v-icon-phone"
          class-prefix="v-icon"
          size="16"
          @click="clickTel"
        />
      </view>
    </view>
  </view>
</template>

<script>
// 将百度地图经纬度转换为腾讯/高德地图经纬度
const bMapTransTxMap = (lng, lat) => {
  if (!lng && !lat) {
    return {
      lng: "",
      lat: ""
    };
  }
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta);
  let lats = z * Math.sin(theta);
  return {
    lng: lngs,
    lat: lats
  };
};
// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
// #endif
import { isWeixin } from "@/common/utils";
export default {
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        title: "",
        address: "",
        tel: "",
        time: `营业时段 00:00 - 00:00`,
        images: []
      })
    }
  },
  computed: {},
  methods: {
    clickTel() {
      uni.makePhoneCall({
        phoneNumber: this.info.tel
      });
    },
    previewImage() {
      if (this.info.images) {
        uni.previewImage({
          urls: this.info.images
        });
      }
    },
    showMap() {
      const txLocation = bMapTransTxMap(this.info.lng, this.info.lat);
      if (isWeixin()) {
        wxSdk.openLocation({
          latitude: parseFloat(txLocation.lat),
          longitude: parseFloat(txLocation.lng),
          name: this.info.title,
          address: this.info.address,
          scale: 18
        });
      } else {
        uni.openLocation({
          latitude: parseFloat(txLocation.lat),
          longitude: parseFloat(txLocation.lng),
          name: this.info.title,
          address: this.info.address,
          infoUrl: "",
          complete: e => {
            console.log(e);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  .bg {
    width: 100%;
    height: 400rpx;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(10rpx);
    background-color: $image-background;
  }
}
.info-panel {
  width: 100%;
  position: relative;
  padding: $cell-padding;
  background-color: #ffffff;
  display: flex;
  flex-flow: column;
  line-height: 48rpx;
  color: $text-gray;
  .title {
    color: $text-color;
    height: 48rpx;
  }
  .info {
    display: flex;
    flex-flow: row;
    padding: 20rpx 0;
    .image {
      position: relative;
      width: 120rpx;
      height: 120rpx;
      margin-right: 20rpx;
      flex: none;
      image {
        width: 100%;
        height: 100%;
        background-color: $image-background;
      }
      .num {
        position: absolute;
        display: block;
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        color: #fff;
        font-size: $font-size-xs;
        bottom: 0;
        right: 0;
      }
    }
    .content {
      flex: 1;
    }
    .address {
      font-size: $font-size-sm;
      line-height: 40rpx;
    }
  }
  .time {
    height: 48rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
