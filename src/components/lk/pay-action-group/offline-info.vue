<template>
  <view>
    <view class="opayBox">
      <view class="opayCode">
        <image mode="widthFix" :src="offline_pay.collection_code"></image>
      </view>
      <view class="opayVoucher">
        <lk-upload
          uploadText="请上传转账凭证"
          height="250"
          width="600"
          :maxCount="1"
          @on-success="voucherSuccess"
        ></lk-upload>
      </view>

      <view class="opaytext">{{ offline_pay.collection_memo }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    offline_pay: {
      type: Object,
    },
  },
  methods: {
    voucherSuccess(e) {
      this.$emit("pay_voucher_src", e.src);
    },
  },
};
</script>

<style lang="scss" scoped>
.opayBox {
  background-color: #fff;
  padding: 10rpx 0 120rpx 0;
  .opayCode {
    width: 400rpx;
    margin: 20rpx auto;
    image {
      width: 100%;
    }
  }
  .opayVoucher {
    width: 600rpx;
    margin: 20rpx auto;
  }
  .opaytext {
    width: 500rpx;
    margin: 40rpx auto;
    color: #666;
  }
}
</style>
