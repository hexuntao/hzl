<template>
  <view class="pages">
    <view class="cell-group">
      <lk-goods-card
        cell-padding
        v-for="(item, index) in goods_list"
        :key="index"
        :desc="item.sku_name"
        :title="item.goods_name"
        :image="item.pic_cover"
      />
    </view>
    <view class="cell-group">
      <lk-cell v-if="info.receiver_name">
        <view class="">收货信息</view>
        <view class="info-item">
          {{ info.receiver_name }}，电话{{ info.receiver_mobile }}
        </view>
        <view class="info-item">
          {{ info.pcd_address }}{{ info.receiver_address }}
        </view>
      </lk-cell>
      <cell-express-company-popup
        :name="params.express_name || '请选择物流公司'"
        @select="onSelect"
      />
      <lk-field
        v-model="params.express_no"
        label="物流单号"
        clearable
        placeholder="请输入物流单号"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :loading="isLoading"
        @click="onSubmit"
      >
        确定发货
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_BONUSTEAMDELIVERYDETAIL,
  SET_BONUSTEAMDELIVERY
} from "@/common/interface/bonus";
import bonusMixin from "@/mixins/bonus";
import cellExpressCompanyPopup from "../component/cell-express-company-popup";
export default {
  name: "packages-bonus-delivery-post",
  data() {
    return {
      order_id: "",
      goods_list: [],
      info: {},
      isLoading: false,
      params: {
        order_id: "",
        order_goods_id_array: "",
        express_name: "",
        shipping_type: "",
        express_company_id: "",
        express_no: ""
      }
    };
  },
  mixins: [bonusMixin],
  onLoad(query) {
    this.order_id = query.order_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_BONUSTEAMDELIVERYDETAIL({
        order_id: this.order_id
      })
        .then(({ data }) => {
          const info = data.delivery_data || {};
          this.info = info;
          this.goods_list = info.order_goods || [];
          this.params.order_id = info.order_id;
          this.params.order_goods_id_array = this.goods_list
            .map(e => e.order_goods_id)
            .join(",");
          this.params.shipping_type = info.shipping_type;

          this.params.express_name = info.express_info.express_company || "";
          this.params.express_company_id =
            info.express_info.express_company_id || "";
          this.params.express_no = info.express_info.express_no || "";
        })
        .catch(() => {});
    },
    onSelect(item) {
      this.params.express_name = item.company_name;
      this.params.express_company_id = item.co_id;
    },
    onSubmit() {
      if (!this.params.express_company_id) {
        return this.$Prompt.toast("请选择物流公司");
      }
      if (!this.params.express_no) {
        return this.$Prompt.toast("请输入物流单号");
      }
      this.isLoading = true;
      SET_BONUSTEAMDELIVERY(this.params)
        .then(() => {
          this.$Navigate.replace("/packages/bonus/delivery/list");
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

.info-item {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
</style>
