<template>
  <view>
    <view class="cell-group">
      <view class="blod">
        卖家已经同意退货，请把商品回寄到以下地址：
      </view>
      <lk-cell
        :title="shopInfo.consigner"
        :title-right="shopInfo.mobile"
        :label="shopInfo.address"
      >
      </lk-cell>
      <cell-express-company-popup
        v-if="returnGoodsType === 1"
        :name="refund_shipping_company_name || '请选择物流公司'"
        @select="onSelect"
      />
      <lk-field
        label="物流公司"
        disabled
        :value="
          info.refund_shipping_company_name || refund_shipping_company_name
        "
        v-else-if="returnGoodsType === 2"
      />
      <lk-field
        label="物流单号"
        clearable
        :placeholder="'请输入物流单号'"
        v-model="refund_shipping_code"
        v-if="returnGoodsType === 1"
      />
      <lk-field
        label="物流单号"
        disabled
        :value="
          info.refund_shipping_code
            ? info.refund_shipping_code
            : refund_shipping_code
        "
        v-else-if="returnGoodsType === 2"
      />
    </view>
    <view class="foot-btn-group" v-if="returnGoodsType === 1">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        @click="onSubmit"
      >
        提交
      </lk-button>
    </view>
  </view>
</template>

<script>
import { SUB_REFUNDEXPRESS } from "@/common/interface/order";
import cellExpressCompanyPopup from "../cell-express-company-popup";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      refund_shipping_code: null,
      refund_shipping_company: null,
      refund_shipping_company_name: null,
      columns: [],

      isLoading: false
    };
  },
  props: {
    info: {
      type: Object
    },
    companyList: {
      type: Array
    },
    shopInfo: {
      type: Object
    },
    returnGoodsType: {
      type: Number
    }
  },
  computed: {},
  methods: {
    ...mapActions(["setSubscribe"]),
    onSelect(item) {
      this.refund_shipping_company = item.co_id;
      this.refund_shipping_company_name = item.company_name;
    },
    onSubmit() {
      const info = this.info;
      if (!this.refund_shipping_company) {
        this.$Prompt.toast("请选择物流公司！");
        return false;
      }
      if (!this.refund_shipping_code) {
        this.$Prompt.toast("请填写物流单号！");
        return false;
      }
      let order_goods_id = [];
      info.goods_list.forEach(e => {
        order_goods_id.push(e.order_goods_id);
      });
      const params = {};
      params.order_id = info.order_id;
      params.order_goods_id = order_goods_id;
      params.refund_express_company = this.refund_shipping_company;
      params.refund_shipping_no = this.refund_shipping_code;
      // return console.log(params);
      this.isLoading = true;
      SUB_REFUNDEXPRESS(params)
        .then(res => {
          // 发送订阅消息
          this.setSubscribe({ type: 4 }).then(() => {
            this.$emit("init-data");
            this.isLoading = false;
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    cellExpressCompanyPopup
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.blod {
  padding: 20rpx 30rpx 0;
  background: #ffffff;
  font-weight: 800;
}
</style>
