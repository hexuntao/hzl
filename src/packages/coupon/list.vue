<template>
  <view class="pages">
    <view class="header">
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="4"
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">{{
          tab.name
        }}</lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="item-group">
        <lk-coupon-item
          v-for="(item, index) in list"
          :key="item.coupon_id"
          :bg-type="item.bgType"
          :defectBg="item.defectBg"
          :money="item.moneyText"
          :unit="item.coupon_genre == 3 ? '折' : '元'"
          :label="item.discountText"
		  :coupon_name="item.coupon_name"
		  :last_count="item.last_count"
          :name="item.show_name"
          :time="item.timeText"
          btn-text="去使用"
          @click="toDetail(index)"
        >
          <view slot="right">
            <view class="info-btn" v-if="item.state == 1">
              <view class="btn" @click="toDetail(index)">
                去使用
              </view>
            </view>
            <view class="icon-bg" v-if="item.state != 1">
              <lk-icon
                class-prefix="v-icon"
                color="#999"
                size="50"
                :name="(item.state == 2 || item.state == 4) ? 'v-icon-coupon-use' : 'v-icon-overdue'"
              /> 
            </view>
          </view>
        </lk-coupon-item>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_COUPONLIST } from "@/common/interface/coupon";
import loadMixin from "@/mixins/load-list";
import { formatDate, yuan } from "@/common/utils";
function genreTxt({ coupon_genre, money, discount }) {
  let text = "";
  if (coupon_genre == 3) {
    text = parseFloat(discount);
  } else {
    text = parseFloat(money);
  }
  return text;
}
function genreClass({ coupon_genre, money, discount }) {
  let text = "";
  if (coupon_genre == 3) {
    text = "last-letter";
  } else {
    text = "first-letter";
  }
  return text;
}
export default {
  data() {
    return {
		
      tabs: [
        {
          name: "未使用",
          state: 1
        },
        {
          name: "已使用",
          state: 2
        },
        {
          name: "已过期",
          state: 3
        },
        {
          name: "已赠送",
          state: 4
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        state: 1,
		shop_id:0
      },
      upOption: {
        empty: {
          type: "coupon",
          tip: "暂无优惠券",
          btnText: "去领券",
          to: "/pages/coupon/index"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    basepath() {
      return this.$store.getters.static.baseImgPath;
    }
  },
  onLoad(query) {
	  this.params.shop_id = query.shop_id;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COUPONLIST(this.params)
        .then(({ data }) => {
          let list = data.list || [];
          list.forEach(e => {
            e.moneyClass = genreClass(e);
            e.moneyText = genreTxt(e);
            e.discountText =
              e.coupon_genre == 1
                ? "无门槛"
                : `${parseFloat(e.at_least)}元可用`;
            e.timeText = `${formatDate(e.start_time)}~${formatDate(
              e.end_time
            )}`;
            e.bgType = e.coupon_genre == 3 ? "blue" : "red";
            if (e.state != 1) {
              e.bgType = "white";
            }
            e.defectBg = "#f8f8f8";
            // if(e.is_send_friend!=0){
            //   e.giveSrc = `${this.$store.getters.static.baseImgPath}give_icon.png`
            // }
            // e.moneyText = e.moneyText.length>6 ? `${e.moneyText.substring(0,6)}..`:e.moneyText
          });
          this.concatList(list, data.total_count);
        })
        .catch(error => {
          this.$load.endErr();
        });
    },
    toDetail(index) {
      const { coupon_id, coupon_type_id, is_send_friend } = this.list[index];
      let query = {
        coupon_type_id
      };
      if (coupon_id) {
        query.coupon_id = coupon_id;
      }
      this.$Navigate.push({
        path: "/packages/coupon/detail",
        query: query
      });
    },
    onTab(index) {
      this.params.state = this.tabs[index].state;
      this.resetList();
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  z-index: 1000;
}
.item-group {
  margin-top: 118rpx;
}
.item {
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  margin: 30rpx;
  padding: 30rpx 0;
  position: relative;
}
.item-bg-default {
  background: #ffffff !important;
}
.item-bg-color {
  background: linear-gradient(-37deg, #ff2828 0%, #ff642e 100%);
}
.item-bg {
  background: linear-gradient(-37deg, #3076fe 0%, #62b3fe 100%);
}
.item::after {
  content: "";
  display: block;
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #f8f8f8;
  border-radius: 50%;
  left: 496rpx;
  top: 0;
  margin-top: -16rpx;
}
.item::before {
  content: "";
  display: block;
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #f8f8f8;
  border-radius: 50%;
  left: 496rpx;
  bottom: 0;
  margin-bottom: -16rpx;
}

.item::after {
  right: -16rpx;
}

.item .info {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 100rpx;
}

.item .info .money {
  min-width: 180rpx;
  color: $white;
  text-align: center;
}

.item .info .money .num {
  font-size: 44rpx;
  margin-bottom: 8rpx;
  display: flex;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: flex-end;
  justify-content: center;
  line-height: 1;
}

.item .info .text {
  min-width: 332rpx;
}

.item .info .text .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16rpx;
  line-height: 1.4;
  color: $white;
}

.item .info .text .time {
  font-size: 24rpx;
  color: $white;
}
.icon-bg {
  // position: absolute;
  z-index: 1;
  right: 20rpx;
}
.info-right {
  width: 210rpx;
  height: 100rpx;
  border-left: 1px dashed #ffffff;
  position: relative;
  .info-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
  .btn {
    border: 2rpx solid #ffffff;
    background: transparent;
    width: 120rpx;
    height: 52rpx;
    font-size: 26rpx;
    text-align: center;
    line-height: 52rpx;
    border-radius: 52rpx;
    color: #ffffff;
  }
}
.info-image {
  position: absolute;
  width: 96rpx;
  height: 96rpx;
  right: -4rpx;
  top: -4rpx;
  .image {
    width: 96rpx;
    height: 96rpx;
  }
}
.item .info .font-color,
.item .info .text .font-color {
  color: #5f5f5f;
}
.tisp-color {
  color: #999999 !important;
}
.tisp-border {
  border-left: 1px dashed #cccccc;
}
.money-text {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  max-width: 150rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.2;
}
.tisp {
  font-size: $font-size-sm;
  margin-left: 6rpx;
  line-height: 1.6;
}
</style>
