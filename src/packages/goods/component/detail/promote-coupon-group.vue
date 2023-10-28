<template>
  <view class="cell-promote-coupon" v-if="isShow">
    <view class="promote-coupon" @click="show = true">
      <view class="cell-value">
        <view class="value">
          <text
            class="tag coupon-tag"
            :style="tagCouponStyles"
            v-for="(value, c) in couponValue"
            :key="c"
          >
            {{ value }}
          </text>
        </view>
        <view class="value">
          <text
            class="tag"
            :style="tagStyles"
            v-for="(value, f) in fullCutValue"
            :key="f"
          >
            {{ value }}
          </text>
        </view>
      </view>
      <view class="cell-right">
        <lk-icon name="arrow" color="#909399" />
      </view>
    </view>
    <lk-popup v-model="show" position="bottom" round closeable title="促销优惠">
      <view class="popup-group">
        <view class="fullcut-group" v-if="fullCutList.length">
          <view class="group-title">促销</view>
          <view class="group-list">
            <lk-cell
              class="item"
              v-for="(item, index) in fullCutList"
              :key="index"
            >
              <view class="title">{{ item.title }}</view>
              <view class="name">{{ item.name }}</view>
              <view class="time">{{ item.time }}</view>
            </lk-cell>
          </view>
        </view>
        <view class="coupon-group" v-if="couponList.length">
          <view class="group-title">优惠券</view>
          <view class="group-list">
            <lk-coupon-item
              v-for="(item, index) in couponList"
              :key="index"
              :bg-type="item.bgType"
              :money="item.moneyTxt"
              :unit="item.moneyTag"
              :label="item.label"
              :name="item.nameLabel"
              :time="item.timeText"
              :btn-disabled="!!item.disabled"
              :btn-loading="!!item.loading"
              :btn-text="item.btnText"
              @btn-click="couponReceive(item)"
            />
          </view>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { yuan, formatDate } from "@/common/utils";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { RECEIVE_COUPON } from "@/common/interface/coupon";
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    couponData: {
      type: [Object, Array],
      default: () => []
    },
    fullCutData: {
      type: [Object, Array],
      default: () => []
    }
  },
  computed: {
    tagCouponStyles() {
      return formatStyle({
        color: "#ffffff",
        background: "linear-gradient(to right, #f60, #f44)"
      });
    },
    tagStyles() {
      return formatStyle({
        color: this.theme.color,
        backgroundColor: this.theme.opacity
      });
    },
    cardCouponStyles() {
      return {
        color: formatStyle({ color: this.theme.color }),
        background: formatStyle({ background: this.theme.opacity })
      };
    },
    isShow() {
      return !!(this.couponList.length || this.fullCutList.length);
    },
    couponValue() {
      const data = this.couponData || [];
      let arr = [];
      data.forEach((e, i) => {
        if (i < 2) {
          var money = parseFloat(e.money),
            at_least = parseFloat(e.at_least),
            discount = parseFloat(e.discount);
          let value = "";
          if (e.coupon_genre == 1) {
            value = yuan(money);
          } else if (e.coupon_genre == 2) {
            value = yuan(money);
          } else if (e.coupon_genre == 3) {
            value = discount + "折";
          }
          value && (value = " | " + value);
          arr.push("优惠券" + value);
        }
      });
      return arr;
    },
    couponList() {
      const items = this.couponData || [];
      items.forEach(e => {
        var money = parseFloat(e.money),
          at_least = parseFloat(e.at_least),
          discount = parseFloat(e.discount);
        e.type = e.coupon_genre;
        e.loading = !!e.loading;
        e.disabled = !!e.selected;
        e.moneyTxt = "";
        e.bgType = e.coupon_genre == 3 ? "blue" : "red";
        e.nameLabel = e.shop_id == 0 ? "平台优惠券" : "店铺优惠券";
        e.btnText = "立即领取";
        if (e.coupon_genre == 1) {
          e.moneyTxt = money;
          e.moneyTag = "元";
          e.label = "无门槛";
        } else if (e.coupon_genre == 2) {
          e.moneyTxt = money;
          e.moneyTag = "元";
          e.label = at_least + "元可用";
        } else if (e.coupon_genre == 3) {
          e.moneyTxt = discount;
          e.moneyTag = "折";
          e.label = at_least + "元可用";
        }
        e.timeText = formatDate(e.end_time, "YYYY.MM.DD") + "前有效";
      });
      return items;
    },
    fullCutValue() {
      const data = this.fullCutData || [];
      let obj = {};
      data.forEach(e => {
        let rules = e.rules.forEach((r, i) => {
          let discount = parseFloat(r.discount);
          let free_shipping = parseInt(r.free_shipping);
          if (discount) {
            obj["jian"] = "满减";
          }
          if (free_shipping) {
            obj["you"] = "满邮";
          }
          if (r.coupon_type_id || r.gift_card_id || r.gift_id) {
            obj["song"] = "满送";
          }
        });
      });
      return obj;
    },
    fullCutList() {
      const data = this.fullCutData || [];
      const arr = data.map(e => {
        let rules = e.rules.map((r, i) => {
          let discount = parseFloat(r.discount);
          let price = parseFloat(r.price);
          let free_shipping = parseInt(r.free_shipping);
          let arrText = [];
          if (discount) {
            arrText.push(`满${price}减${discount}元`);
          }
          if (free_shipping) {
            arrText.push(`满${price}包邮`);
          }
          if (r.coupon_type_id) {
            arrText.push(`满${price}送优惠券(${r.coupon_type_name})`);
          }
          if (r.gift_card_id) {
            arrText.push(`满${price}送礼品券(${r.gift_voucher_name})`);
          }
          if (r.gift_id) {
            arrText.push(`满${price}送赠品(${r.gift_name})`);
          }
          return arrText.join("，");
        });
        let arrName = [];
        rules.forEach(r => arrName.push(r));
        e.title = e.mansong_name;
        e.name = arrName.join("；");
        e.time =
          "有效期限 " +
          formatDate(e.start_time) +
          " ~ " +
          formatDate(e.end_time);
        return e;
      });
      return arr;
    }
  },
  methods: {
    couponReceive(item) {
      const params = {};
      params.coupon_type_id = item.coupon_type_id;
      params.get_type = 5; // 商品详情获取
      item.loading = true;
      RECEIVE_COUPON(params)
        .then(res => {
          this.$Prompt.toast({ icon: "success", title: "领取成功" });
          item.loading = false;
          this.close();
        })
        .catch(() => {
          item.loading = false;
        });
    },
    close() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.promote-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
}
.cell-value {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}
.cell-right {
  margin-left: 10rpx;
  width: 32rpx;
  height: 48rpx;
}
.value {
  display: flex;
  align-items: center;
  height: 48rpx;
  overflow: hidden;
}

.value .tag {
  white-space: nowrap;
  margin-right: 10rpx;
  font-size: $font-size-sm;
  display: flex;
  align-items: center;
  line-height: normal;
  overflow: hidden;
  border-radius: 0.8em;
  padding: 0.1em 0.6em;
  color: $red;
  background-color: #fae9e6;
}

.value .tag.coupon-tag {
  display: block;
  position: relative;
  border-radius: 0;
}

.value .tag.coupon-tag::before,
.value .tag.coupon-tag::after {
  content: "";
  background: #fff;
  position: absolute;
  top: 50%;
  margin-top: -10rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 100%;
}

.value .tag.coupon-tag::before {
  left: -10rpx;
}

.value .tag.coupon-tag::after {
  right: -10rpx;
}

.popup-group {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
}
.coupon-group {
  width: 100%;
  height: auto;
  overflow-y: auto;
  .group-title {
    padding: 20rpx 30rpx 0;
    font-weight: 700;
  }
  .card {
    display: flex;
    margin: 20rpx 30rpx;
    color: $red;
    line-height: 1.2;
    .info {
      display: flex;
      background: rgba(255, 68, 68, 0.2);
      flex: 1;
      padding: 20rpx;
      border-top-left-radius: 16rpx;
      border-bottom-left-radius: 16rpx;
      border-top-right-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      color: inherit;
    }
    .info-box {
      display: flex;
      flex-flow: column;
      flex: 1;
    }
    .info .name-group {
      display: flex;
      align-items: center;
      line-height: 44rpx;
    }

    .info .money-box {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100rpx;
      width: 160rpx;
      margin-right: 10rpx;
      .money {
        font-size: 48rpx;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        .money-label {
          font-size: 24rpx;
          font-weight: 400;
        }
      }
    }

    .info .name-label {
      font-size: $font-size-lg;
      color: $text-color;
    }

    .info .label {
      font-size: $font-size-sm;
      color: $text-gray;
    }

    .info .time {
      font-size: $font-size-xs;
      margin-top: 8rpx;
      color: $text-light;
    }

    .right-box {
      background: rgba(255, 68, 68, 0.2);
      padding: 20rpx;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 12rpx;
      border-bottom-left-radius: 12rpx;
      border-top-right-radius: 16rpx;
      border-bottom-right-radius: 16rpx;
      color: inherit;
      position: relative;
      overflow: hidden;
      width: 190rpx;
    }

    .right-box::before {
      content: " ";
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      display: block;
      width: 2rpx;
      height: 100%;
      left: 0;
      border-left: 2rpx dashed;
      border-color: inherit;
    }

    .right-box .btn {
      background: transparent;
      color: inherit;
      border: none;
      padding: 0;
    }

    .right-box .btn:active::before {
      opacity: 0;
    }
  }
}
.fullcut-group {
  width: 100%;
  overflow-y: auto;
  .group-title {
    padding: 20rpx 30rpx 0;
    font-weight: 700;
  }
  .item .title {
    width: auto;
    font-size: $font-size;
    color: $red;
  }

  .item .name {
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }

  .item .time {
    font-size: $font-size-xs;
    color: $text-light;
    margin-top: 8rpx;
    line-height: 1.2;
  }
}
</style>
