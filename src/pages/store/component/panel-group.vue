<template>
  <view class="panel-group card-group-box">
    <lk-cell >
      <view class="info">
        <view class="logo-box" >
          <view class="logo">
            <image  @tap="toLink(to)" class="image"  :src="logo" mode="aspectFit" />
          </view>
        </view>
        <view class="text-box">
          <view>
            <view class="title"  @tap="toLink(to)" >
              {{ title }}
            </view>
            <view class="score">
              <lk-star :value="score" />
              <view class="distance" v-if="distance">{{ distance }}</view>
            </view>
          </view>
          <slot name="tag" >
            <view class="desc" @click="showMap" clickable>{{ desc }}</view>
          </slot>
        </view>
      </view>

      <!-- <view class="time">
        <view>{{ time }}</view>
        <lk-icon
            name="v-icon-phone"
            class-prefix="v-icon"
            size="16"
            @click="clickTel"
        />
      </view> -->

    </lk-cell>
    <lk-cell v-if="goods.length">
      <view class="goods-list">
        <view class="item" v-for="(item, index) in goods" :key="index">
          <lk-goods-box
              :image="item.image"
              :price="item.price"
              :goods-id="item.goods_id"
          >
            <view slot="info" class="price">{{ item.price | yuan }}</view>
          </lk-goods-box>
        </view>
      </view>
    </lk-cell>
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
    to: [Object, String],
    logo: [Number, String],
    title: [Number, String],
    distance: [Number, String],
    desc: [Number, String],
    score: [Number, String],
    tel: [Number, String],
    time: [Number, String],

    lng: [Number, String],
    lat: [Number, String],

    goods: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  methods: {
    clickTel() {
      uni.makePhoneCall({
        phoneNumber: this.tel
      });
    },
	toLink(link) {
		this.$Navigate.push(link);
	},
    showMap() {
      const txLocation = bMapTransTxMap(this.lng, this.lat);
      if (isWeixin()) {
        wxSdk.openLocation({
          latitude: parseFloat(txLocation.lat),
          longitude: parseFloat(txLocation.lng),
          name: this.title,
          address: this.desc,
          scale: 18
        });
      } else {
        uni.openLocation({
          latitude: parseFloat(txLocation.lat),
          longitude: parseFloat(txLocation.lng),
          name: this.title,
          address: this.desc,
          infoUrl: "",
          complete: e => {
            console.log(e);
          }
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.time {
  height: 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-group {
  .info {
    display: flex;
    align-items: center;
  }

  .info .logo-box {
    margin-right: 20rpx;
    width: 200rpx;
  }

  .info .logo {
    padding-bottom: 56%;
    width: 100%;
    position: relative;
    // background: #fafafa;
    margin-right: 20rpx;
  }

  .info .logo .image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background: $image-background;
  }

  .info .text-box {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    flex: 1;
  }

  .info .tag {
    line-height: 1.2;
  }

  .info .score {
    line-height: 32rpx;
    height: 32rpx;
    display: flex;
    justify-content: space-between;
  }
  .info .distance {
    font-size: $font-size-sm;
    color: $text-light;
  }
  .info .desc {
    font-size: $font-size-sm;
    color: $text-gray;
    line-height: 40rpx;
  }

  .info .group-name {
    color: #666;
  }

  .goods-list {
    margin: 0 -8rpx;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    .item {
      position: relative;
      width: calc(25% - 16rpx);
      margin: 8rpx;
      font-size: $font-size-sm;
      .price {
        color: $red;
      }
    }
  }
}
</style>
