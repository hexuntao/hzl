<template>
  <view class="fullcut-group" v-if="isShow">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ items.text }}
      </view>
      <view class="value">
        <text class="tag" :style="tagStyles" v-for="(value, t) in cellValue" :key="t">
          {{ value }}
        </text>
      </view>
    </lk-cell>
    <lk-popup v-model="show" position="bottom" round closeable title="满减送">
      <view>
        <lk-cell class="item" v-for="(item, index) in list" :key="index">
          <view class="title">{{ item.title }}</view>
          <view class="name">{{ item.name }}</view>
          <view class="time">{{ item.time }}</view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import { formatStyle, formatClass } from "@/common/utils/stringify";
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    titleColor: {
      type: String,
      default: "#606266"
    },
    items: [Object, Array]
  },
  computed: {
    isShow() {
      this.items.show = !!this.list.length;
      return !!this.list.length;
    },
    cellValue() {
      const data = this.items.data || [];
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
    list() {
      const data = this.items.data || [];
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
          "使用期限 " +
          formatDate(e.start_time) +
          " ~ " +
          formatDate(e.end_time);
        return e;
      });
      return arr;
    },
    tagStyles() {
      return formatStyle({
        color: this.theme.color,
        backgroundColor: this.theme.opacity
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.fullcut-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }

  .value {
    display: flex;
    align-items: center;
    height: 48rpx;
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
