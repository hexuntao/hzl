<template>
  <view class="packtype">
    <view>套餐类型</view>
    <view>
      <view class="recharge">
        <view
          class="recharge-item"
          v-for="(item, index) in spec_list"
          :key="index"
          @click="rechargeChange(index, item)"
          :class="current == index ? 'recharge-item-active' : ''"
        >
          <view class="recharge-tag" v-if="item.is_first_buy == 1">
            <text class="recharge-tag-text">首次开通</text>
          </view>
          <text v-if="item.is_first_buy == 1" class="recharge-item-duration">
            <text class="firstletter">￥</text>
            {{ parseFloat(item.first_buy_price) }}/
            <text class="firstletter"> {{parseInt(item.limit_time) }}{{ timetype(item.time_type) }}</text>
          </text>
          <text v-else class="recharge-item-duration">
            <text class="firstletter">￥</text> {{ item.price }}/
            <text class="firstletter">{{parseInt(item.limit_time) }}{{ timetype(item.time_type) }}</text>
          </text>
          <view class="recharge-item-price">
            <text class="recharge-item-price-text"
              >原价:￥{{ parseFloat(item.market_price) }}</text
            >
          </view>
        </view>
      </view>
    </view>
    <view class="cell">
      <lk-checkbox-group active-color="#1f2553">
        <lk-checkbox v-model="checked">我已经阅读并同意</lk-checkbox>
      </lk-checkbox-group>
      <text class="text-link" @tap="onContract">《{{ content_title }}》</text>
    </view>
    <view class="btn-group">
      <lk-button
        size="normal"
        block
        round
        color="#1f2553"
        class="btn"
        :disabled="checked ? false : true"
        @click="dredge"
        >立即开通</lk-button
      >
    </view>
    <lk-popup
      v-model="showContract"
      class="contract-popup"
      :title="content_title"
      round
    >
      <view class="contract">
        <lk-parser show-with-animation lazy-load v-html="content"></lk-parser>
      </view>
    </lk-popup>
    <!-- 充值 -->
    <lk-popup v-model="show" position="bottom" round closeable>
      <lk-pay-action-group :tlpay="false" @change="onPayTypeChange" />
      <lk-button
        size="normal"
        block
        :color="theme.color"
        @click="onpay"
        :loading="isLoading"
        >确定</lk-button
      >
    </lk-popup>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :type="feeType"
      :money="payMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
  </view>
</template>

<script>
import {
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS,
} from "@/common/interface/pay";
import mixinPayPassword from "@/mixins/valid-pay-password";
import { MEMBERCARD_BUYMEMBERCARD } from "@/common/interface/membercard";
import PAY from "../../pay/pay";
export default {
  props: {
    content_title: {},
    content: {},
    spec_list: {},
    tabindex: {},
  },
  data() {
    return {
      params: {
        membercard_id: "",
        membercard_spec_id: "",
      },
      current: -1,
      payType: "bpay",
      payMoney: "",
      feeType: 1,
      isLoading: false,
      checked: false,
      showContract: false,
      contractContent: "",
      show: false,
    };
  },
  mixins: [mixinPayPassword],
  onLoad() {},
  watch: {
    tabindex(e) {
      this.current = -1;
    },
  },
  methods: {
    timetype(v) {
      if (v == 1) return "年";
      if (v == 2) return "季";
      if (v == 3) return "月";
      if (v == 4) return "天";
    },
    rechargeChange(index, item) {
      this.params.membercard_id = item.membercard_id;
      this.params.membercard_spec_id = item.spec_id;
      this.current = index;
      if (item.is_first_buy == 1) {
        this.payMoney = item.first_buy_price;
      } else {
        this.payMoney = item.price;
      }
    },
    onContract() {
      this.showContract = true;
    },
    dredge() {
      if (!this.params.membercard_id) {
        this.$Prompt.toast("请选择套餐类型");
        return false;
      }
      // this.show = true;
      MEMBERCARD_BUYMEMBERCARD(this.params).then((res) => {
        // this.out_trade_no = res.data.out_trade_no;
        this.$Navigate.replace({
          path: "/pay/membercard",
          query: { out_trade_no: res.data.out_trade_no },
        });
      });
    },
    onPayTypeChange(e) {
      this.payType = e;
    },
    onPayPassword(e) {
      this.password = e;
      this.onpay();
    },
    onpay() {
      //确定
      typeof this[this.payType + "Fn"] === "function" &&
        this[this.payType + "Fn"]();
    },
    // 余额支付
    bpayFn() {
      if (
        Number(this.payMoney) > Number(this.$store.state.member.info.balance)
      ) {
        this.$Prompt.toast("余额不足！");
        return false;
      }

      this.isLoading = true;
      this.validPayPassword(this.password)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.payMoney,
          };
          PAY_BALANCE(params).then((res) => {
            this.$Prompt.toast(res.message);
            this.password = "";
            this.isLoading = false;
            this.show = false;
            setTimeout(() => {
              this.$Navigate.back();
            }, 1200);
          });
        })
        .catch((error) => {
          this.isLoading = false;
          this.password = "";
        });
    },
    // 微信支付
    wechatFn() {
      let params = {
        out_trade_no: this.out_trade_no,
      };

      this.isLoading = true;
      PAY.WXPAY(params)
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 支付宝支付
    alipayFn() {
      let params = {
        out_trade_no: this.out_trade_no,
      };
      this.isLoading = true;
      PAY.ALIPAY(params)
        .then(() => {})
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.packtype {
  width: 95%;
  height: 450rpx;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 30rpx;
}
.firstletter {
  font-size: 20rpx;
}
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: $font-size-sm;
  margin: 20rpx 0;
}
.btn {
  width: 99%;
}
.recharge-item-active {
  border: 2rpx solid #ffc544 !important;
  background-color: #fdf5ef;
  color: #c68854 !important;
}

.recharge-item-duration {
  padding: 10rpx;
  font-weight: 600;
  font-size: 40rpx;
  min-width: 190rpx;
  overflow: auto;
}

.recharge {
  position: relative;
  margin-bottom: 35rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 35rpx;
  overflow-x: auto;

  .recharge-tag {
    position: absolute;
    top: -2rpx;
    left: 0rpx;
    width: 140rpx;
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #ea693a, #e14140);
    border-top-left-radius: 14rpx;
    border-bottom-right-radius: 14rpx;
    color: #fff;
  }
  .recharge-item-price-text {
    color: #989898;
    padding-top: 20rpx;
    font-size: 22rpx;
    text-decoration: line-through;
  }
  .recharge-item {
    border: 2rpx solid #eee;
    position: relative;
    padding: 36rpx 0;
    margin-left: 15rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12rpx;
    text-align: center;
  }
}
</style>
