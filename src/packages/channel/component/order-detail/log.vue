<template>
  <lk-cell-info-list :list="columns" card align="right" />
</template>

<script>
import { yuan } from "@/common/utils";
export default {
  props: {
    buy_type: String,
    detail: Object
  },
  computed: {
    columns() {
      const type = this.buy_type;
      const {
        goods_money,
        shipping_fee,
        order_money,
        order_status,
        pay_status
      } = this.detail;
      let arr = [
        {
          title: order_status == 0 && pay_status == 0 ? "待付款" : "实付",
          value: yuan(order_money),
          color: "#f44"
        }
      ];
      if (type === "pickupgoods" || type == "retail") {
        arr.unshift(
          { title: "商品总价", value: yuan(goods_money), color: "#f44" },
          { title: "运费", value: yuan(shipping_fee), color: "#f44" }
        );
      }
      return arr;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
