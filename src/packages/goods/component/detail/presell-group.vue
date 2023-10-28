<template>
  <view class="presell-group card-group-box">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ title }}
      </view>
      <view class="value">
        <view class="value-title">每人限购{{ maxBuy }}件</view>
        <view> 尾款时间：{{ times.pay }} </view>
        <view> 发货时间：{{ times.send }} </view>
      </view>
    </lk-cell>
    <lk-popup v-model="show" position="bottom" round closeable title="预售规则">
      <view class="list">
        <lk-cell class="item" v-for="(item, index) in list" :key="index">
          <view class="title">{{ item.title }}</view>
          <view class="name">{{ item.value }}</view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
export default {
  data() {
    return {
      show: false,
      title: "预售"
    };
  },
  props: {
    titleColor: {
      type: String,
      default: "#606266"
    },
    info: {
      type: [Object, Array],
      default: () => {}
    },
    goodsInfo: Object
  },
  computed: {
    maxBuy() {
      return this.goodsInfo.maxBuy || this.info.max_buy || 0;
    },
    list() {
      const info = this.info;
      let list = [
        {
          title: "定金",
          value: `定金支付：${formatDate(
            info.start_time,
            "YYYY-MM-DD"
          )}至${formatDate(info.end_time, "YYYY-MM-DD")}支付定金${yuan(
            info.firstmoney
          )}，下单后请在${info.pay_limit_time}分钟内支付，超时将自动取消订单。`
        },
        {
          title: "尾款",
          value: `尾款支付：${formatDate(
            info.pay_start_time,
            "YYYY-MM-DD"
          )}至${formatDate(
            info.pay_end_time,
            "YYYY-MM-DD"
          )}支付尾款，超时订单关闭，且定金不予退还。`
        },
        {
          title: "发货",
          value: `发货时间：${formatDate(
            info.send_goods_time,
            "YYYY-MM-DD"
          )}开始发货。`
        }
      ];
      return list;
    },
    times() {
      return {
        pay: `${formatDate(
          this.info.pay_start_time,
          "YYYY-MM-DD"
        )}~${formatDate(this.info.pay_end_time, "YYYY-MM-DD")}`,
        send: `${formatDate(this.info.send_goods_time, "YYYY-MM-DD")}`
      };
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.presell-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    display: flex;
    flex-flow: column;
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }

  .value-title {
    line-height: 48rpx;
  }

  .item .title {
    width: auto;
    font-size: $font-size;
    color: $red;
  }

  .item .name {
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }
  .list{
    width: 100%;
    height: 70vh;
    overflow-y: auto;
  }
}
</style>
