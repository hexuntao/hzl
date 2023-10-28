<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn">
      <lk-button
        square
        type="warning"
        :color="theme.cart"
        :disabled="btnDisabled"
        @click="bargain"
      >
        {{ btnText }}
      </lk-button>
    </view>
    <view class="action-btn">
      <lk-button
        square
        type="danger"
        :color="theme.gradient"
        :disabled="btnBuyDisabled"
        @click="buy"
      >
        {{ btnBuyTexts }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
export default {
  data() {
    return {};
  },
  props: {
    // 活动相关参数
    params: Object,
    // 商品基本信息
    info: Object,
    action: String,
    cartBtnText: {
      type: String,
      default: "我要砍价"
    },
    buyBtnText: {
      type: String,
      default: "立即购买"
    }
  },
  computed: {
    // 砍价状态
    state() {
      return this.params.status;
    },
    btnText() {
      let text = "";
      if (this.info.bargainGoodsState != 1 && this.info.bargainGoodsStateText) {
        return this.info.bargainGoodsStateText;
      }
      if (this.params.bargain_id) {
        if (this.state) {
          text = this.params.is_join_bargain ? "邀请砍价" : this.cartBtnText;
        } else {
          text = this.cartBtnText;
        }
      }
      return text;
    },
    btnDisabled() {
      if (this.info.bargainGoodsState != 1 && this.info.bargainGoodsStateText) {
        return true;
      }
      return !this.state;
    },
    btnBuyDisabled() {
      return !!(this.info.goodsState != 1 && this.info.goodsStateText);
    },
    btnBuyTexts() {
      if (this.info.goodsState != 1 && this.info.goodsStateText) {
        return this.info.goodsStateText;
      }
      return this.buyBtnText;
    },
    btnType() {
      return this.action == "bargain" ? "warning" : "danger";
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    bargain() {
      this.$emit("click", "bargain", {
        bargain_id: this.params.bargain_id,
        bargain_uid: this.params.bargain_uid
      });
    },
    buy() {
      this.$emit("click", "buy");
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped></style>
