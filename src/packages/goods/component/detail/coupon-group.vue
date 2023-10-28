<template>
  <view class="coupon-group" v-if="isShow">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ items.text }}
      </view>
      <view class="value">
        <text
          class="tag coupon-tag"
          :style="tagStyles"
          v-for="(value, t) in cellValue"
          :key="t"
        >
          {{ value }}
        </text>
      </view>
    </lk-cell>
    <lk-popup-coupon v-model="show" get-type="5" :items="couponList" />
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
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
      this.items.show = !!this.cellValue.length;
      return !!this.cellValue.length;
    },
    cellValue() {
      const data = this.items.data || [];
      let arr = [];
      data.forEach((e, i) => {
        if (i < 3) {
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
      return this.items.data || [];
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
.coupon-group {
  .title {
    width: 100rpx;
    color: $text-gray;
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
}
</style>
