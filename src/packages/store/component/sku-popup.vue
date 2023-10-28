<template>
  <lk-sku
    v-model="show"
    :info="info"
    :promote-type="promoteType"
    :promote-params="promoteParams"
    @action="onAction"
    @close="close"
  ></lk-sku>
</template>

<script>
import { ADD_STOREGOODSTOCART } from "@/common/interface/store";

let addCartFlag = true; // 防止重复点击添加多次购物车

export default {
  data() {
    return {};
  },
  props: {
    value: Boolean,
    store_id: [String, Number],
    store_name: String,
    info: [Object, String],
    promoteType: String,
    promoteParams: Object
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    onAction(action, data) {
      if (
        action === "buy" ||
        action === "group" ||
        action === "seckill" ||
        action === "presell" ||
        action === "luckyspell"
      ) {
        this.onBuyNow(data);
      } else if (action === "addCart") {
        this.onAddCart(data);
      } else if (action == "bargain") {
        this.onBargain(data);
      } else {
        console.log("暂无后续操作" + action);
      }
    },
    close() {
      this.$emit("close");
    },
    // 立即购买
    onBuyNow(data) {
      let params = {};
      params.order_tag = "buy_now";
      params.goodsType = data.goodsType;
      params.shipping_type = 2;
      params.sku_list = [];
      if (data.presell_id) params.presell_id = data.presell_id;
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum;
      sku_list_obj.sku_id = data.selectedSkuComb.id;
      sku_list_obj.store_id = this.store_id;
      sku_list_obj.store_name = this.store_name;
      sku_list_obj.shop_id = data.shopId;
      if (data.seckill_id) sku_list_obj.seckill_id = data.seckill_id;
      if (data.channel_id) sku_list_obj.channel_id = data.channel_id;
      if (data.group_id) {
        params.group_id = data.group_id;
        if (data.record_id) {
          params.record_id = data.record_id;
        }
      }
      if (data.luckyspell_id) {
        // 幸运拼团
        params.luckyspell_id = data.luckyspell_id;
      }
      params.sku_list.push(sku_list_obj);
      // return console.log(params);
      this.show = false;
      this.$Navigate.push({
        path: "/packages/order/confirm",
        query: {
          params: JSON.stringify(params)
        }
      });
    },
    // 添加购物车
    onAddCart(data) {
      if (!addCartFlag) return;
      addCartFlag = false;
      let params = {};
      params.store_id = this.store_id;
      params.goods_id = data.id;
      params.num = data.selectedNum;
      params.sku_id = data.selectedSkuComb.id;
      if (data.seckill_id) params.seckill_id = data.seckill_id;
      // return console.log(params);
      ADD_STOREGOODSTOCART(params)
        .then(({ message }) => {
          this.$Prompt.toast({ icon: "success", title: message });
          if (this.show) {
            this.show = false;
            setTimeout(() => {
              addCartFlag = true;
            }, 200);
          }
          this.$emit("init-cart");
        })
        .catch(() => {
          addCartFlag = true;
        });
    },
    // 砍价
    onBargain(data) {
      this.$Navigate.push({
        path: "/packages/bargain/detail",
        query: {
          goods_id: data.id,
          bargain_id: data.bargain_id,
          bargain_uid: data.bargain_uid
        }
      });
    }
  }
};
</script>
