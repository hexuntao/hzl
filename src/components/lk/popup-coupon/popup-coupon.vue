<template>
  <lk-popup v-model="show" position="bottom" round closeable :title="title">
    <view class="popup-coupon">
      <lk-coupon-item
        v-for="(item, index) in list"
        :key="index"
        :bg-type="item.bgType"
        :money="item.moneyTxt"
        :unit="item.moneyTag"
		    :last_count="item.last_count"
        :label="item.label"
        :name="item.nameLabel"
        :time="item.timeText"
        :btn-disabled="!!item.disabled"
        :btn-loading="!!item.loading"
        :btn-text="item.btnText"
        @btn-click="click(item)"
      />
    </view>
  </lk-popup>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
import { RECEIVE_COUPON } from "@/common/interface/coupon";
import { formatStyle, formatClass } from "@/common/utils/stringify";
export default {
  data() {
    return {};
  },
  props: {
    items: {
      type: Array
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "优惠券"
    },
    /**
     * 获取类型
     * 1 ==> 订单获取
     * 2 ==> 首页获取
     * 3 ==> 注册营销获取
     * 4 ==> 购物车获取
     * 5 ==> 商品详情获取
     */
    getType: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    styles() {
      return {
        color: formatStyle({ color: this.theme.color }),
        background: formatStyle({ background: this.theme.opacity })
      };
    },
    list() {
      const items = this.items || [];
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
        e.btnText = this.getType == 1 ? "使用" : "立即领取";
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
    }
  },
  methods: {
    click(item) {
      if (this.getType == 1) {
        if (item.selected) {
          this.$emit("cancel", item);
        } else {
          this.$emit("use", item);
        }
      } else {
        const params = {};
        params.coupon_type_id = item.coupon_type_id;
        params.get_type = this.getType;
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
      }
    },
    close() {
      this.$emit("input", false);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.popup-coupon {
  width: 100%;
  height: 70vh;
  overflow-y: auto;

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
</style>
