<template>
  <view class="btn-group">
    <lk-button
    v-if="goodsData.can_bargain_money!=0"
      round
      type="warning"
      block
      class="btn"
      :color="theme.gradient"
      open-type="share"
      @click="onInvite"
    >
      邀请朋友砍一刀
    </lk-button>
    <lk-button
    v-if="goodsData.is_least_bargain==0"
      round
      type="danger"
      block
      class="btn"
      :color="theme.cart"
      @click="showSku = true"
    >
      {{goodsData.now_bargain_money==0?"免费领取":goodsData.now_bargain_money+"元购买"}}
    
    </lk-button>

    <lk-button
    v-if="goodsData.is_least_bargain==1&&goodsData.can_bargain_money==0"
      round
      type="danger"
      block
      class="btn"
      :color="theme.cart"
      @click="showSku = true"
    >
    {{goodsData.now_bargain_money==0?"免费领取":goodsData.now_bargain_money+"元购买"}}
    </lk-button>




    <lk-sku
      v-if="goodsData.id"
      v-model="showSku"
      :info="goodsData"
      action="buy"
      @action="onAction"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showSku: false
    };
  },
  props: {
    goodsData: Object
  },
  computed: {},
  methods: {
    onInvite() {
      // #ifdef H5
      this.$Prompt.toast(
        this.$store.state.isWeixin
          ? "微信环境下点击右上角分享"
          : "手机浏览器点击底部工具栏分享"
      );
      // #endif
    },
    onAction(action, data) {
      this.onBuyNow(data);
    },
    onBuyNow(data) {
      let params = {};
      params.order_tag = "buy_now";
      params.goodsType = data.goodsType;
      params.sku_list = [];
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum;
      sku_list_obj.sku_id = data.selectedSkuComb.id;
      sku_list_obj.bargain_id = this.goodsData.bargain_id;
      if (this.goodsData.anchor_id) {
        sku_list_obj.anchor_id = this.goodsData.anchor_id;
      }
      params.sku_list.push(sku_list_obj);
      // return console.log(params);
      this.$Navigate.push({
        path: "/packages/order/confirm",
        query: {
          params: JSON.stringify(params)
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.btn-group {
  padding: $cell-padding;
  .btn {
    margin-top: 20rpx;
  }
  .btn:first-child {
    margin-top: 0;
  }
}
</style>
