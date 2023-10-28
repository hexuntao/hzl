<template>
  <view class="item">
    <view class="text-group">
      <view class="name">{{ items.task_name }}</view>
      <view class="rule">
        <view class="text" v-for="(r, rInd) in ruleItem" :key="rInd">
          {{ r.name }}
          <text class="price-color" v-if="r.goods_id" @click="toLink(r.to)">
            {{ r.value }}
          </text>
          <text class="price-color" v-else>{{ r.value }}</text>
          {{ r.unit }}
        </view>
      </view>
      <view class="text-link">
        <text @click="toDetail">任务详情 ></text>
      </view>
    </view>
    <view class="right-group">
      <slot name="right" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    items: Object
  },
  computed: {
    ruleItem() {
      let arr = [];
      this.items.task_rule.forEach(item => {
        for (let key in item) {
          const value = item[key];
          if (key != "goods_name" && value) {
            let obj = {};
            obj.value = value;
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
                obj.to = "/packages/goods/detail?goods_id=" + value;
                break;
            }
            arr.push(obj);
          }
        }
      });
      return arr;
    }
  },
  methods: {
    toLink(to) {
      this.$Navigate.push(to);
    },
    toDetail() {
      const { general_poster_id, user_task_id } = this.items;
      const route = {
        path: "/packages/task/detail",
        query: {
          general_poster_id: general_poster_id
        }
      };
      if (user_task_id) {
        route.query.user_task_id = user_task_id;
      }
      this.$Navigate.push(route);
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: space-between;
  padding: $cell-padding;
  background-color: #ffffff;
  line-height: 48rpx;
  position: relative;
  .text-group {
    width: 70%;
  }
  .name {
    font-weight: 800;
  }
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
    color: $text-gray;
    display: flex;
    text {
      padding: 0 8rpx;
      max-width: 320rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
  .right-group {
    width: 30%;
    text-align: center;
  }
}

.item::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
