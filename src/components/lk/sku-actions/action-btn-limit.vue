<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn" v-if="showCart">
      <lk-button square type="warning" :color="theme.cart" @click="addCart">
        {{ cartBtnText }}
      </lk-button>
    </view>
    <view class="action-btn">
      <lk-button square type="danger" :color="theme.gradient" @click="buy">
        {{ btnText }}
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
      default: "加入购物车"
    },
    buyBtnText: {
      type: String,
      default: "立即购买"
    }
  },
  computed: {
    btnType() {
      return this.action == "addCart" ? "warning" : "danger";
    },
    btnText() {
      return this.params.status == 1 ? "立即抢购" : this.buyBtnText;
    },
    showCart() {
      return !(
        this.info.goodsType == 0 ||
        this.info.goodsType == 3 ||
        this.info.goodsType == 4
      );
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    addCart() {
      this.$emit("click", "addCart");
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
