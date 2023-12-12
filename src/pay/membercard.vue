<template>
  <view class="pages">
    <view>
      <lk-pay-action-group
        v-model="payType"
        @change="onPayTypeChange"
        :bpay="isShowBPay"
        :wpay="isShowWPay"
        :apay="isShowAPay"
        :tlpay="isShowTlPay"
        :balance="balance"
      />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :type="feeType"
      :money="payMoney"
      :charge-service-money="chargeServiceMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <view class="foot-btn-group fixed">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :disabled="disabledPay"
        :loading="isLoading"
        @click="onPay"
      >
        确认付款 ({{ payMoneyText }})
      </lk-button>
    </view>
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import {
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS,
  GET_PAYINFO
} from "@/common/interface/pay";
import { Base64 } from "@/common/lib/base64";
import { mapState, mapGetters } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import PAY from "./pay";
export default {
  name: "pay-membercard",
  data() {
    return {
      /**
       * 页面类型
       * buy        =>  普通购买支付
       */
      pageType: "buy",
      pay_money: 0,
      balance: 0,
      payType: null,
      isLoading: false,
      chargeServiceMoney: 0,
      isShowTlPay: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      payConfig: ({ config }) => config.payConfig,
      memberTexts: ({ member }) => member.texts
    }),
    // 支付密码弹窗手续费类型
    feeType() {
      let type = null;
      if (this.payType == "bpay") {
        type = 1;
      }
      return type;
    },
    // 支付密码弹窗显示支付金额
    payMoney() {
      let money = parseFloat(this.pay_money);
      return money;
    },
    // 是否显示余额支付
    isShowBPay() {
      return this.pageType != "recharge" && !this.is_proceeds_pay;
    },
    // 是否显示微信支付
    isShowWPay() {
      return !this.is_proceeds_pay;
    },
    // 是否显示支付宝支付
    isShowAPay() {
      return !this.is_proceeds_pay;
    },
    disabledPay() {
      return !this.payType;
    },
    payMoneyText() {
      let text = yuan(this.pay_money);
      if (this.payType == "ethpay" || this.payType == "eospay") {
        text = this[this.payType].paymoney + " " + this[this.payType].name;
      }
      return text;
    }
  },
  onLoad(query) {
    this.pageType = "buy";
    this.order_id = query.order_id || null; // 订单id
    this.out_trade_no = query.out_trade_no || null; // 外部交易号
    typeof this[this.pageType + "PayInfo"] === "function" &&
      this[this.pageType + "PayInfo"](query);
  },
  methods: {
    // 获取支付信息
    getPayInfo(res) {
      if (res.code === 1) {
        if (res.data.out_trade_no) {
          this.out_trade_no = res.data.out_trade_no;
        }
        this.endTime = parseFloat(res.data.end_time) * 1000;
        this.pay_money = res.data.pay_money;
        this.balance = parseFloat(res.data.balance);
        this.is_proceeds_pay = !!res.data.is_proceeds;
      } else if (res.code == 2) {
        this.$Prompt.toast(res.message).then(() => {
          setTimeout(() => {
            this.$Navigate.replace("/packages/membercard/index");
          }, 1000);
        });
      } else {
        this.$Prompt.toast(res.message).then(() => {
          setTimeout(() => {
            this.$Navigate.back();
          }, 500);
        });
      }
    },
    // 获取普通购买支付信息
    buyPayInfo(query) {
      GET_PAYINFO({ out_trade_no: this.out_trade_no })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },

    // 切换支付方式
    onPayTypeChange(e) {
      if (e == "bpay" && this.bpayPassword) {
        this.bpayPassword = null;
      }
      this.isLoading = false;
    },
    // 支付密码
    onPayPassword(password) {
      this.bpayPassword = password;
      this.onPay();
    },
    // 进行支付
    onPay() {
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
      this.validPayPassword(this.bpayPassword)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.payMoney
          };
          PAY_BALANCE(params).then(res => {
            if (res.code === 0) {
              this.bpayPassword = "";
              this.$Prompt
                .toast({ title: res.message, icon: "success" })
                .then(() => {
                  setTimeout(() => {
                    this.$Navigate.replace("/packages/membercard/index");
                    this.isLoading = false;
                  }, 500);
                });
            }
          });
        })
        .catch(error => {
          this.isLoading = false;
          this.bpayPassword = "";
        });
    },
    // 微信支付
    wechatFn() {
      let params = {
        out_trade_no: this.out_trade_no
      };
      this.isLoading = true;
      PAY.WXPAY(params)
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
            setTimeout(() => {
              this.$Navigate.replace("/packages/membercard/index");
            }, 500);
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
        out_trade_no: this.out_trade_no
      };
      this.isLoading = true;
      PAY.ALIPAY(params, { from: "membercard" })
        .then(({ type }) => {
          if (type == "alipay") {
            setTimeout(() => {
              this.$Navigate.replace("/packages/membercard/index");
            }, 500);
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.payment-info {
  line-height: 1.6;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
  .title {
    font-size: $font-size-lg;
  }
  .money-text {
    font-size: 40rpx;
    font-weight: 700;
    color: $red;
    margin-top: 12rpx;
  }
  .limit-time {
    color: $text-light;
    font-size: $font-size-sm;
    display: flex;
    flex-flow: row;
  }
}
</style>
