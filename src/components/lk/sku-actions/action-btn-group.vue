<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn">
      <lk-button square type="warning" :color="theme.cart" @click="buy">
        <view class="btn-flex-column">
          <view>{{ goodsPrice }}</view>
          <view>{{ cartBtnText }}</view>
        </view>
      </lk-button>
    </view>
    <view class="action-btn">
      <lk-button square type="danger" :color="theme.gradient" @click="group">
        <view class="btn-flex-column">
          <view>{{ groupGoodsPrice }}</view>
          <view>{{ btnText }}</view>
        </view>
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
import { yuan } from "@/common/utils";
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
      default: "单独购买"
    },
    buyBtnText: {
      type: String,
      default: "发起拼团"
    }
  },
  computed: {
    btnText() {
      return this.params.record_id ? "参与拼团" : this.buyBtnText;
    },
    btnType() {
      return this.action == "buy" ? "warning" : "danger";
    },
    goodsPrice() {
      return yuan(this.info.goodsPrice);
    },
    groupGoodsPrice() {
      return yuan(this.info.groupGoodsPrice);
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    buy() {
      this.$emit("click", "buy");
    },
    group() {
      this.$emit("click", "group", {
        group_id: this.params.group_id,
        record_id: this.params.record_id
      });
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped lang="scss">
.btn-flex-column {
  display: flex;
  flex-flow: column;
  line-height: 1.2;
  font-size: $font-size-sm;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  view {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
}
</style>
