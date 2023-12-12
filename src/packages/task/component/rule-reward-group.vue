<template>
  <view>
    <view class="cell-group">
      <view class="title">任务规则</view>
      <view class="content">
        <view
          v-for="(item, rule) in rulesArr"
          :key="rule"
          class="cell-item"
          :class="item.finish ? 'positive' : 'negative'"
        >
          ● {{ item.name }}
          <text class="cell-value">{{ item.value }}</text>
          {{ item.unit }}
        </view>
      </view>
    </view>
    <view class="cell-group">
      <view class="title">任务奖励</view>
      <view class="content">
        <view
          class="cell-item"
          v-for="(item, reward) in rewardsArr"
          :key="reward"
        >
          {{ reward + 1 }}、{{ item.value }} {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    items: Object
  },
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    }),
    rulesArr() {
      const rules = this.items.task_rule || [];
      let arr = [];
      rules.forEach(item => {
        for (let key in item) {
          const value = item[key];
          if (key != "is_complete" && key != "goods_name" && value) {
            let obj = {};
            obj.value = value;
            obj.finish = item["is_complete"];
            switch (key) {
              case "referrals":
                obj.name = "推荐人数达";
                obj.unit = "人";
                break;
              case "distribution_commission":
                obj.name = "分销佣金达";
                obj.unit = "元";
                break;
              case "distribution_orders":
                obj.name = "分销订单达";
                obj.unit = "笔";
                break;
              case "pay_order_total_num":
                obj.name = "支付订单达";
                obj.unit = "笔";
                break;
              case "order_total_money":
                obj.name = "订单满额";
                obj.unit = "元";
                break;
              case "order_total_sum":
                obj.name = "订单累计";
                obj.unit = "元";
                break;
              case "goods_comment_num":
                obj.name = "累计评价";
                obj.unit = "次";
                break;
              case "total_recharge":
                obj.name = "累计充值达";
                obj.unit = "元";
                break;
              case "single_recharge":
                obj.name = "单次充值满";
                obj.unit = "元";
                break;
              case "goods_id":
                obj.name = "购买";
                obj.goods_id = value;
                obj.value = item["goods_name"];
                obj.unit = "商品";
                break;
            }
            arr.push(obj);
          }
        }
      });
      return arr;
    },
    rewardsArr() {
      const rules = this.items.task_reward || [];
      const { balance_style, point_style } = this.memberTexts;
      let arr = [];
      for (let key in rules) {
        const value = rules[key];
        if (key != "gift_voucher_name" && key != "coupon_name" && value) {
          let obj = {};
          obj.value = value;
          switch (key) {
            case "point":
              obj.text = "个" + point_style;
              break;
            case "balance":
              obj.text = "元" + balance_style;
              break;
            case "wchat_red_packet":
              obj.text = "元微信红包";
              break;
            case "growth":
              obj.text = "成长值";
              break;
            case "gift_voucher_id":
              obj.text = "礼品券";
              obj.value = rules["gift_voucher_name"];
              break;
            case "coupon_type_id":
              obj.text = "优惠券";
              obj.value = rules["coupon_name"];
              break;
          }
          arr.push(obj);
        }
      }
      return arr;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  line-height: 1.6;
  overflow: hidden;
  padding: $cell-padding;

  .title,
  .content {
    color: $text-gray;
  }
}
.cell-item {
  padding: 10rpx 0;
  color: $text-gray;
  line-height: 28rpx;
}
.positive {
  color: $green;
}

.negative {
  color: $red;
}

.cell-value {
  padding: 0 8rpx;
}
</style>
