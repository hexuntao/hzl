<template>
  <view class="pages">
    <view class="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="list">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="item card-group-box"
        >
          <view class="info">
            <view class="image">
              <image :src="item.shop_logo" mode="aspectFit"/>
            </view>
            <view class="text">
              <view class="name">{{ item.coupon_name }}</view>
              <view class="price">
                <view class="price-color" :class="item.priceClass">
                  {{ item.priceText }}
                </view>
                <view v-if="item.leastText" :class="item.leastClass">{{ item.leastText }}</view>
              </view>
              <view class="time">{{ item.timeText }}</view>
            </view>
          </view>
          <view class="receive-btn">
            <lk-circle-progress
              :active-color="theme.color"
              :percent="item.rate"
              width="120"
            >
              <view class="progress-box">
                <text>{{ item.rateText }}</text>
                <text v-if="item.rateFixed">{{ item.rateFixed }}</text>
              </view>
            </lk-circle-progress>
            <lk-button
              size="mini"
              bing-mobile
              round
              type="danger"
              :color="theme.gradient"
              :disabled="item.btnDisabled"
              :loading="item.btnLoading"
              @click="onReceive(index)"
            >
              领取
            </lk-button>
          </view>
        </view>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
import loadMixin from "@/mixins/load-list";
import { GET_COUPONCENTRE, RECEIVE_COUPON } from "@/common/interface/coupon";
import { mapGetters } from "vuex";
function discount(value) {
  return parseFloat(value) + "折";
}
function getRate(count, receive_times) {
  const c = parseInt(count);
  const r = parseInt(receive_times);
  let rate = (r / c) * 100;
  return c > 0 ? rate : 0;
}
export default {
  name: "pages-coupon-index",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          type: "coupon",
          tip: "暂无优惠券"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapGetters(["static"]),
    banner() {
      return this.static.baseImgPath + "coupon-adv.png";
    }
  },
  onLoad() {},
  methods: {
    upCallback() {
      GET_COUPONCENTRE(this.params)
        .then(({ data }) => {
          let list = data.list || [];
          list.forEach(e => {
            if (e.coupon_genre != 3) {
              e.priceClass = "first-letter";
              e.priceText = yuan(e.money);
            } else {
              e.priceText = discount(e.discount);
            }
            if (e.coupon_genre != 1) {
              e.leastClass = "least-text";
              e.leastText = `满${e.at_least}可用`;
            }
            e.timeText = `有限期${formatDate(e.start_time)}至${formatDate(
              e.end_time
            )}`;
            e.rate = getRate(e.count, e.receive_times);
            e.btnLoading = false;
            if (parseInt(e.count) > 0) {
              if (e.rate >= 100) {
                e.rateText = "已抢光";
                e.btnDisabled = true;
              } else {
                e.btnDisabled = false;
                e.rateText = "已抢";
                e.rateFixed = e.rate.toFixed(0) + "%";
              }
            } else {
              e.btnDisabled = false;
              e.rateText = "无限制";
            }
          });
          this.concatList(list, data.total_count);
        })
        .catch(error => {
          this.$load.endErr();
        });
    },
    onReceive(index) {
      const item = this.list[index];
      let params = {
        coupon_type_id: item.coupon_type_id,
        get_type: 10 // 接口规定领券中心领取标识
      };
      item.btnLoading = true;
      RECEIVE_COUPON(params)
        .then(() => {
          this.resetList();
          item.btnLoading = false;
        })
        .catch(() => {
          item.btnLoading = false;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.card-group-box{
  box-shadow: none;
}
.banner {
  width: 100%;
  height: 500rpx;
  background-color: $image-background;
  image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.item {
  display: flex;
  flex-flow: row;
  .info {
    flex: 1;
    display: flex;
    flex-flow: row;
    align-items: center;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 15rpx;
    .image {
      flex: none;
      margin-right: 22rpx;
      width: 148rpx;
      height: 148rpx;
      image {
        width: 100%;
        height: 100%;
        background-color: $image-background;
      }
    }
    .text {
      display: flex;
      flex-flow: column;
    }
    .name {
      font-size: 26rpx;
    }
    .price {
      display: flex;
      flex-flow: row;
      margin: 30rpx 0;
      text {
        padding-right: 20rpx;
      }
      .price-color {
        font-size: 36rpx;
        font-weight: bold;
        margin-right: 12rpx;
      }
      .least-text {
        height: 40rpx;      
        background: #FDF4ED;
        border-radius: 8rpx;
        line-height: 40rpx;
        color: #FF454E;
        padding: 0 10rpx;
      }
    }
    .time {
      font-size: $font-size-sm;
      color: $text-light;
      line-height: 24rpx;
    }
  }
  .receive-btn {
    flex: none;
    width: 160rpx;
    margin-left: 4rpx;
    padding: 20rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
    text-align: center;
  }
  .progress-box {
    display: flex;
    flex-flow: column;
    line-height: 24rpx;
    font-size: $font-size-sm;
  }
}
</style>
