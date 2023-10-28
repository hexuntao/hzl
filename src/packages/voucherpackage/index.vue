<template>
  <view class="pages">
    <view class="bgc">
      <view class="img-bg" :style="{ backgroundImage: backgroundImg }"></view>

      <view class="pag">
        <view class="img" v-if="!isSuccess">
          <image :src="buttonimg" mode="widthFix" />
          <view class="name">券包详情</view>

          <view class="btn-box">
            <lk-button
              class="vslbtn"
              @click="getUnclaimed"
              type="danger"
              :loading="isLoading"
              loading-text="领取"
            ></lk-button>
          </view>
        </view>
        <!-- 券包详情 -->
        <view class="success-box" v-if="isSuccess">
          <view class="text">
            <text>恭喜你，成功领取</text>
            <text class="name">{{ name }}</text>
          </view>
          <view class="list-box">
            <view class="list-group">
              <view
                class="item"
                v-for="(item, index) in couponList"
                :key="item.coupon_type_id"
              >
                <view class="info">
                  <view class="title">
                    <text
                      class="letter-price price"
                      v-if="item.coupon_genre !== 3"
                      >{{ item.money | yuan }}</text
                    >
                    <text class="price" v-else>{{ item.discount }}</text>
                    <text v-if="item.coupon_genre !== 1"
                      >满{{ item.at_least }}可用</text
                    >
                  </view>
                  <view class="name">
                    <text>{{ item.shop_name }}</text>
                    <text class="fs-12 text-regular">{{
                      item.goods_range
                    }}</text>
                  </view>
                  <view class="time">
                    <text>{{ item.start_time | formatDate }}</text
                    >~
                    <text>{{ item.end_time | formatDate }}</text>
                  </view>
                </view>
              </view>
              <view
                class="item"
                v-for="(items, indexs) in giftList"
                :key="items.gift_voucher_id"
              >
                <view class="info">
                  <view class="title">
                    <text class="letter-price price">{{
                      items.gift_voucher_name
                    }}</text>
                  </view>
                  <view class="name">
                    <text>{{ items.shop_name }}</text>
                  </view>
                  <view class="time">
                    <text>{{ items.start_time | formatDate }}</text
                    >~
                    <text>{{ items.end_time | formatDate }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 券包详情结束 -->
      </view>
      <!-- 活动时间说明 -->
      <view class="cell-group">
        <view class="cell">
          <view>
            <text class="tag">活动时间</text>
          </view>
          <view>{{ startime }} ~ {{ endtime }}</view>
        </view>
        <view class="cell">
          <view>
            <text class="tag">活动说明</text>
          </view>
          <view>{{ detail }}</view>
        </view>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import {
  GET_VOUCHERPACKAGEDETAIL,
  RECEIVE_VOUCHERPACKAGE
} from "@/common/interface/voucherpackage";
import { formatDate } from "@/common/utils";

export default {
  data() {
    return {
      couponList: [],
      name: "",
      route: "",
      detail: "",
      isLoading: false,
      isSuccess: false,
      endtime: "",
      startime: "",
      couponList: [],
      giftList: [],
      voucher_package_id: ""
    };
  },
  filters: {
    formatDate
  },

  computed: {
    // 金钱背景图
    backgroundImg() {
      return (
        "url(" +
        this.$store.getters.static.baseImgPath +
        "voucherpackage-bg-01.png)"
      );
    },

    // 领取图片
    buttonimg() {
      return (
        this.$store.getters.static.baseImgPath + "voucherpackage-bg-02.png"
      );
    }
  },
  methods: {
    callLoad(query) {
      this.voucher_package_id = query.voucher_package_id;
      GET_VOUCHERPACKAGEDETAIL({ voucher_package_id: this.voucher_package_id })
        .then(res => {
          this.startime = formatDate(res.data.start_time);
          this.endtime = formatDate(res.data.end_time);
          this.detail = res.data.desc;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 领取券包
    getUnclaimed() {
      const that = this;
      that.isLoading = true;
      RECEIVE_VOUCHERPACKAGE({ voucher_package_id: that.voucher_package_id })
        .then(res => {
          console.log(res);
          if (res.code >= 1) {
            this.couponList = res.data.coupon_type_list;
            this.giftList = res.data.gift_voucher_list;
            this.isSuccess = true;
          }
          that.isLoading = false;
        })
        .catch(err => {
          that.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.bgc {
  width: 100vw;
  height: 100vh;
  background-color: rgb(245, 66, 68);
  .img-bg {
    width: 100%;
    height: 400rpx;
    background-size: contain;
    background-position: top center;
    background-repeat: no-repeat;
  }
  .img {
    width: 84%;
    display: block;
    height: auto;
    margin: 0 auto;
    position: relative;
    top: -150upx;
    image {
      width: 100%;
      height: auto;
      display: block;
    }
    .name {
      color: #ff454e;
      text-align: center;
      position: absolute;
      top: 0;
      width: 100%;
      font-size: 40rpx;
      font-weight: 800;
      padding: 80rpx 0;
    }
    .btn-box {
      position: absolute;
      width: 100%;
      bottom: 0;
      margin-bottom: 20rpx;
    }
    .vslbtn {
      border-radius: 50rpx;
      width: 84%;
      height: 5%;
      background-color: #f54244;
      color: #fff;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.cell-group {
  width: 84%;
  margin: 60rpx auto;
}

.cell-group .cell {
  color: #fff;
  margin-bottom: 20rpx;
  line-height: 1.6;
}

.cell-group .cell .tag {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  color: #ff4444;
  background: #feda6f;
  display: inline-block;
  font-size: 24rpx;
  margin-bottom: 8rpx;
  line-height: 1;
}

.success-box {
  width: 84%;
  margin: 0rpx auto;
}

.success-box .text {
  display: flex;
  flex-direction: column;
  line-height: 1.6;
  text-align: center;
  color: #fff;
}

.success-box .text .name {
  font-weight: 800;
  font-size: 40rpx;
  color: #feda6f;
}

.list-box {
  min-height: 400rpx;
  max-height: 800rpx;
  overflow-y: auto;
  margin: 60rpx 0;
  background: #f8f8f8;
}

.list-group {
  border-radius: 12rpx;
  overflow: hidden;
}

.item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 8rpx;
  margin: 30rpx;
  padding: 20rpx 30rpx;
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
  line-height: 1.6;
}

.item .title {
  color: #f54244;
}

.item .title .price {
  font-weight: 800;
  font-size: 32rpx;
  padding-right: 8rpx;
}

.item .time {
  font-size: 24rpx;
  color: #909399;
  display: flex;
  margin: 0 -8rpx;
}

.item .time text {
  padding: 0 8rpx;
}
</style>
