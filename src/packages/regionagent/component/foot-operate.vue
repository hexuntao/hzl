<template>
  <view class="btn-group">
    <lk-button
      class="btn"
      size="small"
      round
      :color="item.color"
      v-for="(item, index) in list"
      :key="index"
      @click="onOperation(item.no)"
    >
      {{ item.name }}
    </lk-button>
  </view>
</template>

<script>
import { CLOSE_ORDER } from "@/common/interface/agent";
import { CONFIRM_TAKEDELIVERY } from "@/common/interface/order";
export default {
  data() {
    return {};
  },
  props: {
    list: Array,
    buy_type: String,
    order_id: [String, Number]
  },
  computed: {},
  methods: {
    onOperation(type) {
      const order_id = this.order_id;
      if (type === "pay") {
        // 支付
        this.onPay(order_id);
      } else if (type === "getdelivery") {
        // 确认收货
        this.onTakeDelivery(order_id);
      } else if (type === "logistics") {
        // 查看物流信息
        this.$Navigate.push({
          path: "/packages/order/logistics",
          query: {
            order_id
          }
        });
      } else if (type === "close") {
        // 关闭订单
        this.onCloseOrder(order_id);
      } else if (type === "detail") {
        // 订单详情
        this.$Navigate.push({
          path: "/packages/agent/order/detail",
          query: {
            type: this.buy_type,
            order_id
          }
        });
      }
    },
    onPay(order_id) {
      let hash = this.buy_type == "purchase" ? "channel" : "order"; // 采购订单支付hash为channel
      this.$Navigate.push({
        path: "/pay/payment",
        query: { order_id, hash: "order" }
      });
    },
    onTakeDelivery(order_id) {
      this.$Prompt
        .modal({
          content: "确定收货吗？"
        })
        .then(() => {
          CONFIRM_TAKEDELIVERY({ order_id }).then(res => {
            this.$emit("init", res);
          });
        });
    },
    onCloseOrder(order_id) {
      this.$Prompt
        .modal({
          content: "确定关闭该订单吗？"
        })
        .then(() => {
          CLOSE_ORDER({
            order_id,
            order_type: this.buy_type
          }).then(res => {
            this.$emit("init", res);
          });
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
}

.btn-group .btn {
  margin-left: 12rpx;
}
</style>
