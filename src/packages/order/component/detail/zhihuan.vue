<template>
  <view class="card-group-box">
    <lk-cell  title="置换详情" :label="info.zhihuan_note" :title-right="info.zhihuan_status_show"/>

    <lk-cell
      :title="info.zhihuan_order_no"
      :title-right="info.zhihuan_money"
      :label="info.zhihuan_goods_name"
    />

    <view v-if="info.zhihuan_status>=4">
      <view class="cell-group">
        <view class="blod">
          卖家已经同意置换，请把商品回寄到以下地址：
        </view>
        <lk-cell
            :title="info.zhihuan_shop_info.consigner"
            :title-right="info.zhihuan_shop_info.mobile"
            :label="info.zhihuan_shop_info.address"
        >
        </lk-cell>
        <cell-express-company-popup
            v-if="info.zhihuan_status == 4"
            :name="zhihuan_back_company_name || '请选择物流公司'"
            @select="onSelect"
        />

        <lk-field
            label="物流公司"
            disabled
            :value="info.zhihuan_back_company_name"
            v-if="info.zhihuan_status != 4"
        />

        <lk-field
            label="物流单号"
            clearable
            :placeholder="'请输入物流单号'"
            v-model="zhihuan_back_shipping_code"
            v-if="info.zhihuan_status == 4"
        />
        <lk-field
            label="物流单号"
            disabled
            :value="info.zhihuan_back_shipping_code"
            v-if="info.zhihuan_status != 4"
        />
      </view>
      <view class="foot-btn-group" v-if="info.zhihuan_status == 4">
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
  </view>
</template>

<script>

import cellExpressCompanyPopup from "../cell-express-company-popup";
import { SUB_ZHIHUANEXPRESS } from "@/common/interface/order";
export default {
  data() {
    return {
      zhihuan_back_shipping_code: null,
      zhihuan_shipping_company: null,
      zhihuan_back_company_name: null,
      columns: [],
      isLoading: false
    };
  },
  props: {
    detail: Object,
  },
  methods: {
    onSelect(item) {
      this.zhihuan_shipping_company = item.co_id;
      this.zhihuan_back_company_name = item.company_name;
    },
    onSubmit() {
      var info = this.info;
      if (!this.zhihuan_shipping_company) {
        this.$Prompt.toast("请选择物流公司！");
        return false;
      }
      if (!this.zhihuan_back_shipping_code) {
        this.$Prompt.toast("请填写物流单号！");
        return false;
      }
      const params = {};
      params.order_id = info.order_id;
      params.order_goods_id = info.zhihuan_order_goods_id;
      params.zhihuan_back_company_name = this.zhihuan_back_company_name;
      params.zhihuan_back_shipping_code = this.zhihuan_back_shipping_code;

      this.isLoading = true;

      SUB_ZHIHUANEXPRESS(params)
          .then(res => {
            // 发送订阅消息
            this.info.zhihuan_status = 6;
            this.info.zhihuan_status_show = '等待签收';
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
    }
  },
  components: {
    cellExpressCompanyPopup
  },
  computed: {
    info() {
      let info = this.detail;
      return info;
    }
  }
};
</script>

<style lang="scss" scoped>

.blod {
  padding: 20rpx 30rpx 0;
  background: #ffffff;
  font-weight: 800;
}
</style>
