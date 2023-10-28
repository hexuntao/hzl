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
    <popup-take-code
      v-model="takeCodeShow"
      :code="info.verification_code"
      :qrcode="info.verification_qrcode"
      v-if="info.verification_code && info.order_status == 1"
    />
  </view>
</template>

<script>
import {
  CLOSE_ORDER,
  CONFIRM_TAKEDELIVERY,
  EDLETE_ORDER,
  ADD_BUYAGAIN,
  GET_TAILMONEYNO
} from "@/common/interface/order";
import { Base64 } from "@/common/lib/base64";
import popupTakeCode from "./popup-take-code";
import { mapActions } from "vuex";
const defaultInfo = {
  order_id: null,
  out_trade_no:null,
  order_status: null,
  promotion_status: null,
  order_refund_status: null,
  is_evaluate: null,
  member_operation: [],
  order_goods: [],
  unrefund: null,
  unrefund_reason: null
};
function operationText(value, is_evaluate) {
  let name = value.name;
  if (value.no === "evaluation" && is_evaluate == 1) name = "追加评价";
  if (value.no === "evaluation" && is_evaluate == 2) name = "已追加评价";
  if (value.no === "pay") name = "立即付款";
  if (value.no === "last_money") name = "付尾款";
  return name;
}
export default {
  data() {
    return {
      takeCodeShow: false
    };
  },
  props: {
    /**
     * 所需pros ==> info
     * order_id ==> 订单id
     * order_status ==> 订单状态
     * promotion_status ==> 优惠状态
     * order_refund_status ==> 订单售后状态
     * member_operation ==> 订单操作列表
     * order_goods ==> 订单商品列表
     * is_evaluate ==> 订单评价状态
     * unrefund ==> 订单是否可以退款标识 1为不能退款 其他可以
     * unrefund_reason ==> 订单不能退款原因
     */
    info: {
      type: Object,
      required: true,
      default: defaultInfo
    }
  },
  computed: {
    list() {
      const operates = this.info.member_operation;
      let arr = [];
      operates.forEach(e => {
        if (e.no == "pay" || e.no == "last_money") {
          e.color = this.theme.color;
        }
        if (e.no === "evaluation") {
          if (this.info.is_evaluate == 1) {
            e.name = "追加评价";
          } else if (this.info.is_evaluate == 2) {
            e.name = "已追加评价";
          }
        }
        if (e.no === "pay") e.name = "立即付款";
        if (e.no === "last_money") e.name = "付尾款";

        if (this.info.is_evaluate == 2) {
          if (e.no != "evaluation") {
            arr.push(e);
          }
        } else {
          arr.push(e);
        }
      });
      return arr;
    }
  },
  methods: {
    ...mapActions(["setSubscribe"]),
    onOperation(type) {
      const order_id = this.info.order_id;
      const node_id = this.info.node_id;
	  const out_trade_no = this.info.out_order_no;

      if (type === "pay") {
        // 支付
		this.$Navigate.push({
          path: "/pay/payment",
          query: { out_trade_no}
        });
		
        /* this.$Navigate.push({
          path: "/pay/payment",
          query: { order_id, node_id, hash: "order" }
        }); */
      } else if (type === "getdelivery") {
        // 确认收货
        this.onTakeDelivery(order_id);
      } else if (type === "logistics") {
        // 查看物流信息
        this.$Navigate.push({
          path: "/packages/order/logistics",
          query: { order_id }
        });
      } else if (type === "close") {
        // 关闭订单
        this.onCloseOrder(order_id);
      } else if (type === "detail") {
        // 订单详情
        this.$Navigate.push({
          path: "/packages/order/detail",
          query: { order_id }
        });
      } else if (type === "evaluation") {
        // 评价
        this.onEvaluation();
      } else if (type === "delete_order") {
        // 删除订单
        this.onDeleteOrder(order_id);
      } else if (type === "buy_again") {
        // 再次购买
        this.onBuyAgain(order_id);
      } else if (
        type === "refund" ||
        type === "return" ||
        type === "refund_detail"
      ) {
        // 退款/退货/售后情况
        const { unrefund, unrefund_reason } = this.info;
        if (unrefund == 1) {
          return this.$Prompt.modal({
            content: unrefund_reason,
            showCancel: false
          });
        }
        this.onResult(order_id);
      } else if (type == "last_money") {
        // 付尾款
        const { can_presell_pay, can_presell_pay_reason } = this.info;
        if (!can_presell_pay) {
          return this.$Prompt.modal({
            content: can_presell_pay_reason,
            showCancel: false
          });
        }
        this.onPayTailMoney(order_id, node_id);
      } else if (type == "pickup") {
        this.onTakeCode();
      } else if (type == "use_card") {
        this.$Navigate.push("/packages/consumercard/list");
      } else if (type == "luckyspell_detail") {
        this.$Navigate.push({
          path: "/packages/lucklyspell/detail",
          query: { order_id }
        });
      } else {
        this.$Toast("暂无后续逻辑");
      }
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
        })
        .catch(() => {});
    },
    onCloseOrder(order_id) {
      this.$Prompt
        .modal({
          content: "确定关闭该订单吗？"
        })
        .then(() => {
          CLOSE_ORDER({ order_id }).then(res => {
            this.setSubscribe({ type: 2 }).then(() => {
              this.$emit("init", res);
            });
          });
        })
        .catch(() => {});
    },
    onDeleteOrder(order_id) {
      this.$Prompt
        .modal({
          content: "确定删除该订单吗？"
        })
        .then(() => {
          EDLETE_ORDER({ order_id }).then(res => {
            this.$emit("init", res);
          });
        })
        .catch(() => {});
    },
    onEvaluation() {
      let obj = {};
      obj.shop = {
        shop_id: this.info.shop_id,
        shop_name: encodeURIComponent(this.info.shop_name)
      };
      obj.goods = [];
      this.info.order_goods.forEach(e => {
        let goodsObj = {};
        if (e.order_goods_id) {
          goodsObj.id = e.order_goods_id;
          goodsObj.img = e.pic_cover;
          goodsObj.name = encodeURIComponent(e.goods_name);
          goodsObj.score = 5;
          goodsObj.evaluate = "";
          goodsObj.arrImg = [];
          obj.goods.push(goodsObj);
        }
      });
      if (this.info.store_id || this.info.card_store_id) {
        obj.store_id = this.info.store_id || this.info.card_store_id;
      }
      this.$Navigate.push({
        path: "/packages/order/evaluate",
        query: {
          order_id: this.info.order_id,
          order_info: JSON.stringify(obj),
          hash: this.info.is_evaluate == 1 ? "again" : ""
        }
      });
    },
    onBuyAgain(order_id) {
      const cart = [];
      this.info.order_goods.forEach(e => {
        let obj = {};
        obj.sku_id = e.sku_id;
        obj.num = e.num;
        cart.push(obj);
      });
      ADD_BUYAGAIN({
        cart,
        old_order_id:order_id
      }).then(res => {
        this.$Prompt.toast("添加成功，请到购物车结算").then(() => {
          setTimeout(() => {
            this.$Navigate.push("/pages/mall/cart");
          }, 500);
        });
      });
    },
    onResult(order_id) {
      this.$Navigate.push({
        path: "/packages/order/post",
        query: { order_id }
      });
    },
    onPayTailMoney(order_id, node_id) {
      GET_TAILMONEYNO({ order_id }).then(({ data }) => {
        this.$Navigate.push({
          path: "/pay/payment",
          query: { out_trade_no: data.out_trade_no, node_id: node_id }
        });
      });
    },
    onTakeCode() {
      this.takeCodeShow = true;
    }
  },
  components: {
    popupTakeCode
  }
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
