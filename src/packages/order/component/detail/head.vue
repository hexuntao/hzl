<template>
  <view class="head" :style="{ background: theme.gradient }">
    <view class="box">
      <view class="text-box" v-if="stateType">
        <block v-if="stateType == 1">
          <view class="title">等待买家付款</view>
          <view class="text">逾期未付款，订单将自动取消</view>
        </block>
        <steps
          v-if="stateType == 2"
          :list="numList"
          :active="stepsActive"
          active-color="#ffcc64"
          un-active-color="#ffffff"
        />
      </view>
      <view class="image-box">
        <view class="image">
          <image :src="stateImage" mode="aspectFit" />
        </view>
        <view class="message" v-if="stateText">{{ stateText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import steps from "../steps";
export default {
  data() {
    return {
      numList: [{ name: "已付款" }, { name: "已发货" }, { name: "已签收" }]
    };
  },
  props: {
    detail: Object
  },
  computed: {
    ...mapGetters(["static"]),
    stateType() {
      const { order_status } = this.detail;
      let type = null;
      if (order_status === 0) {
        type = 1;
      }
      if (order_status === 1 || order_status === 2 || order_status === 3) {
        type = 2;
      }
      return type;
    },
    stepsActive() {
      const { order_status } = this.detail;
      let active = 0;
      if (order_status === 1 || order_status === 2 || order_status === 3) {
        active = order_status - 1;
      }
      return active;
    },
    stateText() {
      const { order_status, status_name } = this.detail;
      let obj = {
        "-1": "售后中",
        4: "交易完成",
        5: "订单关闭",
        6: status_name
      };
      return obj[order_status] || "";
    },
    stateImage() {
      let src = "";
      if (this.detail.order_status != undefined) {
        if (this.detail.order_status === 6) {
          src = this.static.baseImgPath + "result-pay-success.png";
        } else {
          src =
            this.static.baseImgPath +
            "order-detail-" +
            this.detail.order_status +
            ".png";
        }
      }
      return src;
    }
  },
  components: {
    steps
  }
};
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  height: 200rpx;
  background: $red;
  color: #fff;
  display: flex;
  flex-flow: row;
}
.box {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
}
.text-box {
  color: #fff;
  flex: 1;
  .title {
    font-size: $font-size-lg;
  }
  .text {
    line-height: 1.6;
    font-size: $font-size-sm;
  }
}
.image-box {
  flex: none;
}
.image {
  display: flex;
  width: 200rpx;
  height: 100rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.message {
  text-align: center;
  margin-top: 20rpx;
  color: #ffffff;
}
</style>
