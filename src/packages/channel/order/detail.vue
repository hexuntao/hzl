<template>
  <view class="pages">
    <block v-if="buy_type == 'pickupgoods' || buy_type == 'retail'">
      <detail-address :detail="detail" />
      <detail-logistic
        :status="detail.order_status"
        :order_id="detail.order_id"
        :info="logistic_info"
      />
    </block>
    <detail-goods :buy_type="buy_type" :detail="detail" />
    <detail-message
      v-if="buy_type == 'pickupgoods' || buy_type == 'retail'"
      :detail="detail"
    />
    <detail-info :buy_type="buy_type" :detail="detail" />
    <detail-log :buy_type="buy_type" :detail="detail" />
    <view
      v-if="detail.order_status == 0 || detail.order_status == 2"
      class="footer"
    >
      <foot-operate
        :list="detail.member_operation"
        :buy_type="buy_type"
        :order_id="order_id"
        @init="getData"
      />
    </view>
  </view>
</template>

<script>
import { GET_ORDERDETAIL } from "@/common/interface/channel";
import { isEmpty } from "@/common/utils";
import detailLogistic from "../component/order-detail/logistic";
import detailAddress from "../component/order-detail/address";
import detailInfo from "../component/order-detail/info";
import detailGoods from "../component/order-detail/goods";
import detailMessage from "../component/order-detail/message";
import detailLog from "../component/order-detail/log";
import footOperate from "../component/foot-operate";
export default {
  name: "packages-channel-order-detail",
  data() {
    return {
      buy_type: "",
      order_id: "",

      detail: {},
      logistic_info: {}
    };
  },
  onLoad(query) {
    this.buy_type = query.type;
    this.order_id = query.order_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_ORDERDETAIL({
        order_id: this.order_id,
        order_type: this.buy_type
      })
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
    }
  },
  components: {
    detailLogistic,
    detailAddress,
    detailInfo,
    detailGoods,
    detailMessage,
    detailLog,
    footOperate
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
