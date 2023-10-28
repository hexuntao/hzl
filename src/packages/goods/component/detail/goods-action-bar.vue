<template>
  <lk-goods-action-bar>

    <lk-goods-action-icon
      :icon="homeOrShop.icon"
      :text="homeOrShop.text"
      :color="theme.color"
      :to="homeOrShop.to"
	  
	  v-if="goodsInfo.shopId>0"
    />
    <lk-goods-action-icon
      v-if="seller_code"
      :icon="kefuInfo.icon"
      :text="kefuInfo.text"
      :to="kefuInfo.to"
    />
    <lk-goods-action-icon
      :icon="cartInfo.icon"
      :text="cartInfo.text"
      :to="cartInfo.to"
      :badge="cartInfo.badge"
    />


    <lk-sku-actions
      :info="goodsInfo"
      :promote-type="promoteType"
      :promote-params="promoteParams"
      direct-click
      @action="action"
    />


  </lk-goods-action-bar>
</template>

<script>
import { GET_QLKEFUINFO } from "@/common/interface/message";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      seller_code: ""
    };
  },
  props: {
    goodsInfo: Object,
    promoteType: {
      type: String,
      default: "normal"
    },
    // 活动相关参数
    promoteParams: Object
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      cartNum: ({ config }) => config.cartNum
    }),
    homeOrShop() {

      return {
        icon: this.addons.shop ? "shop-o" : "wap-home-o",
        text: this.addons.shop ? "店铺" : "首页",
        to: this.addons.shop
          ? {
              path: "/packages/shop/home",
              query: {
                shop_id: this.goodsInfo.shopId
              }
            }
          : "/pages/mall/index"
      };
    },
    kefuInfo() {
      return {
        icon: "chat-o",
        text: "客服",
        to: {
          path: "/packages/message/chat",
          query: {
            seller_code: this.seller_code,
            goods: JSON.stringify({
              id: this.goodsInfo.id,
              img: this.goodsInfo.picture,
              name: this.goodsInfo.title,
              price: this.goodsInfo.goodsPrice
            })
          }
        }
      };
    },
    cartInfo() {
      return {
        icon: "cart-o",
        text: "购物车",
        to: "/pages/mall/cart",
        badge: this.cartNum || ""
      };
    }
  },
  mounted() {

    if (this.addons.qlkefu) {
      GET_QLKEFUINFO({
        shop_id: this.goodsInfo.shopId,
        goods_id: this.goodsInfo.id
      })
        .then(({ data }) => {
          if (data.is_use) {
            this.seller_code = data.seller_code;
          }
        })
        .catch(() => {});
    }
  },
  methods: {
    action(action, data) {
      this.$emit("action", action, data);
    }
  }
};
</script>

<style scoped lang="scss"></style>
