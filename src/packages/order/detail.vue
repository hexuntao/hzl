<template>
  <view class="pages">
    <detail-head :detail="detail" />
    <detail-address :detail="detail" v-if="isShowAddress" />
	
    <detail-logistic
      v-if="isShowLogistic"
      :status="detail.order_status"
      :order_id="detail.order_id"
      :info="logistic_info"
    />
	
    <detail-take-code
      v-if="detail.store_id && detail.order_status == 1"
      :qrcode="detail.verification_qrcode"
      :code="detail.verification_code"
    />
    <detail-assemble
      v-if="detail.group_record_id"
      :record_id="detail.group_record_id"
    />
    <detail-card-secret v-if="detail.electroncard_msg" :detail="detail" />
    <detail-goods :detail="detail" />

    <detail-zhihuan :detail="detail" v-if="detail.is_zhihuan==1"/>

    <detail-message :detail="detail" />
    <detail-invoice
      v-if="detail.invoice && detail.invoice.type"
      :detail="detail"
    />
	
    <detail-info :detail="detail" v-if="detail.order_id" />
	
    <detail-log :detail="detail" />
	
	
    <view
      v-if="detail.member_operation && detail.member_operation.length"
      class="footer"
    >
      <foot-operate :info="detail" @init="toList" />
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_ORDERDETAIL } from "@/common/interface/order";
import { isEmpty } from "@/common/utils";
import detailCardSecret from "./component/detail/card-secret";
import detailHead from "./component/detail/head";
import detailZhihuan from "./component/detail/zhihuan";
import detailAddress from "./component/detail/address";
import detailLogistic from "./component/detail/logistic";
import detailTakeCode from "./component/detail/take-code";
import detailAssemble from "./component/detail/cell-assemble";
import detailGoods from "./component/detail/goods";
import detailMessage from "./component/detail/message";
import detailInvoice from "./component/detail/invoice";
import detailInfo from "./component/detail/info";
import detailLog from "./component/detail/log";
import footOperate from "@/pages/order/component/foot-operate";
export default {
  name: "packages-order-detail",
  data() {
    return {
      detail: {},
      logistic_info: {}
    };
  },
  computed: {
    isShowAddress() {
      const { card_store_id, order_type, is_virtual, goods_type } = this.detail;
      return (
        !card_store_id &&
        !is_virtual &&
        goods_type != 3 &&
        goods_type != 4 &&
        goods_type != 5 &&
        goods_type != 6
      );
    },
    isShowLogistic() {
      const {
        card_store_id,
        store_id,
        order_type,
        is_virtual,
        goods_type
      } = this.detail;
      return (
        !card_store_id &&
        !store_id &&
        !is_virtual &&
        goods_type != 3 &&
        goods_type != 4 &&
        goods_type != 5 &&
        goods_type != 6
      );
    }
  },
  onLoad(options) {
    this.order_id = options.order_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_ORDERDETAIL({ order_id: this.order_id }, { isShowLoading: true })
        .then(({ data }) => {
          this.detail = data;

          if (!isEmpty(this.detail.goods_packet_list)) {
            let shipping_info = this.detail.goods_packet_list[0].shipping_info;
            if (shipping_info) {
              const logistic_info = {};
              logistic_info.expTextName = shipping_info.expTextName;
              logistic_info.mailNo = shipping_info.mailNo;
              logistic_info.newestInfo = !isEmpty(shipping_info.data)
                ? shipping_info.data[0]
                : "";
              this.logistic_info = logistic_info;
            }
          }
        })
        .catch(() => {});
    },
    toList() {
      this.$Navigate.replace("/pages/order/list");
    }
  },
  components: {
    detailHead,
    detailZhihuan,
    detailAddress,
    detailLogistic,
    detailTakeCode,
    detailAssemble,
    detailGoods,
    detailMessage,
    detailInvoice,
    detailInfo,
    detailLog,
    footOperate,
    detailCardSecret
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 120rpx;
}
.footer {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  z-index: 100;
  padding: 0 30rpx;
  background: #ffffff;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}
</style>
