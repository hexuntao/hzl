<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <scroll-view v-if="viewLoaded" scroll-x>
        <view class="coupon-list" :style="itemStyle" v-if="list.length">
          <view class="item" v-for="(item, index) in list" :key="index">
            <view class="box">
              <image
                class="bg"
                :class="'box-bg-' + items.params.style"
                :src="infoBoxBg"
              />
              <view class="info info-style-1" v-if="items.params.style == 1">
                <view class="yuan-label">
                  <view class="yuan">{{ item.yuan }}</view>
                  <view class="unit">{{ item.unit }}</view>
                </view>
                <view class="man-label">
                  {{ item.man_text }}
                </view>
                <view class="btn">
                  <lk-button
                    block
                    bing-mobile
                    type="text"
                    @click="onReceive(index)"
                  >
                    <view class="btn-text-hidden">领取</view></lk-button
                  >
                </view>
              </view>
              <view class="info info-style-2" v-if="items.params.style == 2">
                <view class="info-label">
                  <view class="yuan-label">
                    <view class="yuan">{{ item.yuan }}</view>
                    <view class="unit">{{ item.unit }}</view>
                  </view>
                  <view class="man-label">
                    {{ item.man_text }}
                  </view>
                  <view class="man-label">
                    {{ item.shopgoods_text }}
                  </view>
                </view>
                <view class="btn">
                  <lk-button
                    block
                    bing-mobile
                    type="text"
                    @click="onReceive(index)"
                  >
                    领取
                  </lk-button>
                </view>
              </view>
              <view class="info info-style-3" v-if="items.params.style == 3">
                <view class="info-label">
                  <view class="man-label">
                    {{ item.shopgoods_text }}
                  </view>
                  <view class="time-label">
                    {{ item.time_text }}
                  </view>
                </view>
                <view class="btn-label">
                  <view class="yuan-label">
                    <view class="yuan">{{ item.yuan }}</view>
                    <view class="unit">{{ item.unit }}</view>
                  </view>
                  <view class="man-label">
                    {{ item.man_text }}
                  </view>
                  <lk-button
                    block
                    bing-mobile
                    type="text"
                    @click="onReceive(index)"
                  >
                    <view class="btn">领取</view>
                  </lk-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain, formatDate } from "@/common/utils";
import { GET_COUPONFORID, RECEIVE_COUPON } from "@/common/interface/coupon";

export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [reform],
  computed: {
    ...mapGetters({
      routeInfo: "route",
      static: "static"
    }),
    itemStyle() {
      return formatStyle({
        padding: pxTorpx(this.items.style.padding) + " " + 0
      });
    },
    infoBoxBg() {
      return `${this.static.baseImgPath}style/coupon-style-${this.items.params.style}-bg.png`;
    },
    couponIds() {
      let arr = [];
      for (const key in this.items.data) {
        const item = this.items.data[key];
        arr.push(item.coupon_type_id);
      }
      return arr.join(",");
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getCouponList()
        .then(list => {
          this.viewLoading = false;
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getCouponList() {
      return new Promise((resovle, reject) => {
        if (this.couponIds) {
          GET_COUPONFORID({ coupon_type_id: this.couponIds })
            .then(({ data }) => {
              let list = data.data || [];
              list.forEach(e => {
                var money = parseFloat(e.money),
                  at_least = parseFloat(e.at_least),
                  discount = parseFloat(e.discount);
                e.btnLoading = false;
                if (e.coupon_genre == 1) {
                  e.man_text = "无门槛";
                  e.unit = "元";
                } else if (e.coupon_genre == 2) {
                  e.man_text = "减" + at_least + "可用";
                  e.unit = "元";
                } else if (e.coupon_genre == 3) {
                  e.man_text = "减" + at_least + "可用";
                  e.unit = "折";
                }
                e.yuan = money;
                e.shopgoods_text = `${
                  e.shop_range_type == 1 ? "全平台" : "店铺"
                }-${e.range_type == 1 ? "全部商品" : "部分商品"}`;
                e.time_text = formatDate(e.end_time, "YYYY.MM.DD") + "到期";
              });
              resovle(list);
            })
            .catch(() => {
              reject();
            });
        } else {
          resovle([]);
        }
      });
    },
    onReceive(index) {
      const item = this.list[index];
      let params = {
        coupon_type_id: item.coupon_type_id,
        get_type: 15 // 接口规定领取标识
      };
      item.btnLoading = true;
      RECEIVE_COUPON(params)
        .then(() => {
          this.$Prompt.toast({ title: "领取成功", icon: "success" });
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

<style scoped lang="scss">
.coupon-list {
  display: flex;
  margin: 0 10rpx;
}
.item {
  position: relative;
  padding: 0 10rpx;
  .box {
    position: relative;
  }
  .bg {
    display: block;
  }
  .box-bg-1 {
    width: 220rpx;
    height: 104rpx;
  }
  .box-bg-2 {
    width: 238rpx;
    height: 138rpx;
  }
  .box-bg-3 {
    width: 357rpx;
    height: 138rpx;
  }
  .info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
  .yuan-label {
    display: flex;
    align-items: flex-end;
    color: #ffffff;
    .yuan {
      font-weight: 700;
      font-size: 36rpx;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120rpx;
    }
    .unit {
      font-size: $font-size-sm;
      line-height: 1.6;
      margin-left: 8rpx;
    }
  }
  .man-label {
    color: #ffffff;
    font-size: $font-size-sm;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info.info-style-1 {
    justify-content: center;
    padding-left: 20rpx;
    margin-right: 60rpx;
    .btn {
      position: absolute;
      right: -60rpx;
      width: 60rpx;
      height: 100%;
      top: 0;
    }
  }
  .info.info-style-2 {
    flex-direction: row;
    right: 8rpx;
    .info-label {
      width: 180rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 10rpx;
    }
    .yuan-label {
      color: $red;
    }
    .man-label {
      color: $text-gray;
      width: 100%;
      text-align: center;
    }
    .btn {
      width: 50rpx;
      font-size: $font-size-xs;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10rpx;
    }
  }
  .info.info-style-3 {
    flex-direction: row;
    right: 8rpx;
    .info-label {
      width: 220rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 10rpx;
    }
    .man-label {
      color: $text-gray;
      width: 100%;
      text-align: center;
    }
    .btn-label {
      width: 130rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .man-label {
        color: $red;
      }
    }
    .yuan-label {
      color: $red;
    }
    .time-label {
      color: $text-light;
      font-size: $font-size-xs;
      margin-top: 10rpx;
    }
    .btn {
      width: 100rpx;
      font-size: $font-size-xs;
      color: #fff;
      background: $red;
      border-radius: 20rpx;
      text-align: center;
    }
  }
}
.btn-text-hidden {
  visibility: hidden;
  width: 100%;
  height: 104rpx;
}
</style>
