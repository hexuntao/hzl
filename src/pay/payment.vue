<template>
  <view class="pages">
    <view class="payment-info">
      <view class="title">应付金额</view>
      <view class="money-text" :class="moneyClass">{{ payMoneyText }}</view>
      <view class="limit-time" v-if="pageType != 'integral'">
        <view>请在</view>
        <lk-count-down :time="endTime" @finish="onTimeEnd" />
        <view>内完成支付</view>
      </view>
    </view>
    <view>
      <lk-pay-action-group
        v-model="payType"
        @change="onPayTypeChange"
        :balance="balance"
        :bpay="isShowBPay"
        :adapaypay="isShowADAPAYPay"
        :wpay="isShowWPay"
        :apay="isShowAPay"
        :tlpay="isShowTlPay"
        :ppay="isShowPPay"
        :offline="isOffline"
        :bcpay="isBcpay"
        @select-bankcard="onSelectBankCard"
        @pay_voucher_src="onPay_voucher"
        @select-coin="onSelectCoin"
      />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :type="feeType"
      :money="payMoney"
      :money-title="chargeInfo.title"
      :money-text="chargeInfo.money"
      :charge="chargeInfo.charge"
      :charge-cpu="chargeInfo.cpu"
      :charge-net="chargeInfo.net"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <lk-popup-bankcard-sms
      v-model="showBankCardSms"
      :info="bankCardParams"
      type="pay"
      @success="bankCardPaySuccess"
      @close="bankCardPayClose"
    />
    <view class="foot-btn-group fixed">
      <view v-if="node_id">
        <lk-wx-open-subscribe :node_id="node_id" @success="success">
          <view slot="btn-subscribe">
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
        </lk-wx-open-subscribe>
      </view>
      <view v-else>
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
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import {
  GET_PAYINFO,
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS,
  PAY_OFFLINE
} from "@/common/interface/pay";
import { GET_ORDERPAYINFO } from "@/common/interface/order";
import { GET_CHANNELORDERPAYINFO } from "@/common/interface/channel";
import { GET_AGENTORDERPAYINFO } from "@/common/interface/agent";
import { GET_INTEGRALPAYINFO } from "@/common/interface/integral";
import {
  TRAN_BLOCKCHAINPAYMONEY,
  PAY_BLOCKCHAINCOIN
} from "@/common/interface/blockchain";
import { Base64 } from "@/common/lib/base64";
import { mapState, mapGetters, mapActions } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import PAY from "./pay";

export default {
  name: "pay-payment",
  data() {
    return {
      /**
       * 页面类型
       * buy        =>  普通购买支付
       * order      =>  订单付款支付
       * recharge   =>  充值支付
       * channel    =>  渠道商采购支付
       * agent      =>  代理渠道商采购支付
       * integral   =>  积分商城支付
       */
      pageType: "buy",
      pay_voucher: "",
      endTime: "",
      pay_money: 0,
      balance: 0,

      payType: null,
      isLoading: false,
      ethpay: {
        show: false,
        balance: 0,
        money: 0,
        paymoney: 0,
        loadingText: null
      },
      eospay: {
        show: false,
        balance: 0,
        money: 0,
        paymoney: 0,
        loadingText: null
      },

      bankCardParams: {},
      showBankCardSms: false,

      chargeServiceMoney: 0,
      is_proceeds_pay: false, //是否货款支付

      coinInfo: null, //选中币种信息
      chargeInfo: {
        // 支付弹窗显示手续费相关
        title: "",
        money: "",
        charge: "",
        title: "",
        cpu: "",
        net: ""
      },
      node_id: "" //订阅消息类型
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      payConfig: ({ config }) => config.payConfig,
      memberTexts: ({ member }) => member.texts
    }),
    ...mapGetters(["orderFrom"]),
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
      // if (this.payType == "ethpay" || this.payType == "eospay") {
      //   this.chargeServiceMoney = parseFloat(this.pay_money);
      //   money = this[this.payType].paymoney;
      // }
      return money;
    },
    // 是否显示余额支付
    isShowBPay() {
      return this.pageType != "recharge" && !this.is_proceeds_pay;
    },
    // 是否显示微信支付
    isShowADAPAYPay() {
      return !this.is_proceeds_pay;
    },
    // 是否显示微信支付
    isShowWPay() {
      return !this.is_proceeds_pay;
    },
    // 是否显示支付宝支付
    isShowAPay() {
      return !this.is_proceeds_pay;
    },
    // 是否显示银行卡支付
    isShowTlPay() {
      return this.pageType != "integral" && !this.is_proceeds_pay;
    },
    // 是否显示货款支付
    isShowPPay() {
      return !!this.is_proceeds_pay;
    },
    // 是否显示线下支付
    isOffline() {
      return this.pageType == "buy" || this.pageType == "order";
    },
    // 是否显示区块链币种支付
    isBcpay() {
      return this.pageType == "buy" || this.pageType == "order";
    },
    disabledPay() {
      return !this.payType;
    },
    moneyClass() {
      return this.payType == "bcpay" && this.coinInfo ? "" : "first-letter";
    },
    payMoneyText() {
      let text = yuan(this.pay_money);
      if (this.payType == "bcpay" && this.coinInfo) {
        text = `${this.coinInfo.pay_money} ${this.coinInfo.symbol}`;
      }
      return text;
    }
  },
  onLoad(query) {
    if (query.node_id) {
      this.node_id = query.node_id;
    }
    this.pageType = query.hash || "buy";
    this.out_trade_no = query.out_trade_no || null; // 支付单号
    this.order_id = query.order_id || null; // 订单id
    typeof this[this.pageType + "PayInfo"] === "function" &&
      this[this.pageType + "PayInfo"](query);
  },
  methods: {
    ...mapActions(["setSubscribe"]),

    success() {
      this.onPay();
    },
    // 获取支付信息
    getPayInfo(res) {
      if (res.data && res.data.node_id) {
        this.node_id = res.data.node_id; //订阅消息类型
      }

      if (res.data && res.data.out_trade_no) {
        this.out_trade_no = res.data.out_trade_no;
      }
      if (res.code === 1) {
        this.endTime = parseFloat(res.data.end_time) * 1000;
        this.pay_money = res.data.pay_money;
        this.balance = parseFloat(res.data.balance);
        this.is_proceeds_pay = !!res.data.is_proceeds;
      } else if (res.code == 2) {
        this.$Prompt.toast(res.message).then(() => {
          this.$Navigate.replace({
            path: "/packages/pay/result",
            query: {
              out_trade_no: this.out_trade_no
            }
          });
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
    // 获取充值支付信息
    rechargePayInfo(query) {
      GET_PAYINFO({ out_trade_no: this.out_trade_no })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取订单支付信息
    orderPayInfo(query) {
      GET_ORDERPAYINFO({ order_id: this.order_id })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取渠道商采购订单支付信息
    channelPayInfo(query) {
      if (this.order_id) {
        GET_CHANNELORDERPAYINFO({ order_id: this.order_id })
          .then(res => {
            this.getPayInfo(res);
          })
          .catch(error => {
            // this.$Navigate.back();
          });
      } else {
        GET_PAYINFO({ out_trade_no: this.out_trade_no })
          .then(res => {
            this.getPayInfo(res);
          })
          .catch(error => {
            // this.$Navigate.back();
          });
      }
    },
    // 获取代理渠道商采购订单支付信息
    agentPayInfo(query) {
      GET_AGENTORDERPAYINFO({ order_id: this.order_id })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取积分商城订单支付信息
    integralPayInfo(query) {
      this.integral_data = JSON.parse(Base64.decode(query.integral_data));
      this.pay_money = query.pay_money;
      GET_INTEGRALPAYINFO()
        .then(res => {
          this.balance = parseFloat(res.data.balance);
          this.point = res.data.point;
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
      this.coinInfo = "";
      // 清除币种手续费金额
      this.chargeInfo.title = "";
      this.chargeInfo.money = "";
      this.chargeInfo.charge = "";
      this.chargeInfo.cpu = "";
      this.chargeInfo.net = "";
      this.isLoading = false;
    },
    // 获取虚拟币相关支付信息
    getBlockchainPayInfo() {
      if (
        this.addons.blockchain &&
        !this.is_proceeds_pay &&
        this.pageType != "integral" &&
        (this.payConfig.ethPay || this.payConfig.eosPay)
      ) {
        this.ethpay.show = !!this.payConfig.ethPay;
        this.eospay.show = !!this.payConfig.eosPay;
        this.ethpay.loadingText = "ETH余额加载中...";
        this.eospay.loadingText = "EOS余额加载中...";
        this.$store
          .dispatch("getBlockchainPayInfo", this.out_trade_no)
          .then(data => {
            this.ethpay.loadingText = null;
            this.ethpay.balance = data.eth_balance;
            this.ethpay.money = data.eth_money;
            this.ethpay.paymoney = data.eth_paymoney;
            this.ethpay.name = "ETH";

            this.eospay.loadingText = null;
            this.eospay.balance = data.eos_balance;
            this.eospay.money = data.eos_money;
            this.eospay.paymoney = data.eos_paymoney;
            this.eospay.name = "EOS";
          });
      }
    },
    // 支付倒计时结束
    onTimeEnd() {
      this.$Prompt.toast("支付有效时间已过！").then(() => {
        this.$Navigate.back();
      });
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
    onPay_voucher(e) {
      this.pay_voucher = e;
    },
    // 余额支付
    bpayFn() {
      if (this.balance < parseFloat(this.pay_money)) {
        this.$Prompt.toast(
          this.memberTexts.balance_style + "不足，请选择其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.pay_money,
            type: this.orderFrom
          };
          if (this.pageType == "integral") {
            // 积分商城 余额支付
            this.integral_data.pay_type = 5;
            params = {
              order_data: this.integral_data,
              password: this.bpayPassword,
              type: this.orderFrom
            };
          }
          PAY_BALANCE(params, { isIntegral: this.pageType == "integral" })
            .then(res => {
              // 发送订阅消息
              this.setSubscribe({ node_id: this.node_id }).then(() => {
                const out_trade_no =
                  params.out_trade_no || res.data.out_trade_no;
                if (res.code == 0) {
                  this.$Navigate.replace({
                    path: "/packages/pay/result",
                    query: {
                      out_trade_no
                    }
                  });
                } else {
                  this.$Prompt.toast(res.message);
                  this.isLoading = false;
                  this.bpayPassword = null;
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // 银行卡支付
    tlpayFn() {
      if (!this.bankCardInfo) {
        this.$Prompt.toast("请选择银行卡！");
        return false;
      }
      this.bankCardParams.out_trade_no = this.out_trade_no;
      this.bankCardParams.id = this.bankCardInfo.id;
      this.bankCardParams.mobile = this.bankCardInfo.mobile;
      this.isLoading = true;
      APPLY_BANKCARDSMS(this.bankCardParams)
        .then(({ code, data, message }) => {
          if (code == 1) {
            if (data.thpinfo) {
              this.bankCardParams.thpinfo = data.thpinfo;
              this.showBankCardSms = true;
            } else {
              this.$Prompt.toast(message);
              this.isLoading = true;
            }
          } else {
            this.$Prompt.toast(message).then(() => {
              setTimeout(() => {
                this.$Navigate.replace("/pages/order/list");
              }, 500);
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 银行卡支付成功
    bankCardPaySuccess() {
      this.$Navigate.replace({
        path: "/packages/pay/result",
        query: {
          out_trade_no: this.out_trade_no
        }
      });
    },
    // 银行卡支付关闭
    bankCardPayClose() {
      this.bankCardParams = {};
      this.isLoading = false;
    },
    // 选择银行卡
    onSelectBankCard(info) {
      //银行卡信息
      this.bankCardInfo = info;
    },
    // 选中币种
    onSelectCoin(info) {
      //币种信息
      // console.log(info);
      let param = {
        out_trade_no: this.out_trade_no,
        symbol: info.symbol
      };
      if (info.gas) {
        param.gas = info.gas;
      }
      TRAN_BLOCKCHAINPAYMONEY(param, { isShowLoading: true })
        .then(({ data }) => {
          this.coinInfo = "";
          info.pay_money = data.pay_money || 0;
          this.chargeInfo.title = `${info.symbol}支付`;
          this.chargeInfo.money = `${info.pay_money} ${info.symbol}`;
          if (info.symbol == "EOS") {
            this.chargeInfo.cpu = `${data.cpucharge || 0}ms`;
            this.chargeInfo.net = `${data.netcharge || 0}kb`;
            this.chargeInfo.charge = "";
          } else {
            this.chargeInfo.charge = `${data.getGasPrice} ${data.unit}`;
            this.chargeInfo.cpu = "";
            this.chargeInfo.net = "";
          }
          this.coinInfo = info;
        })
        .catch(() => {
          this.coinInfo = "";
          if (info.gas) {
            this.chargeInfo.charge = "";
          }
          if (info.symbol == "EOS") {
            this.chargeInfo.cpu = "";
            this.chargeInfo.net = "";
          }
        });
    },
    adapaypayFn() {
      let params = {
        out_trade_no: this.out_trade_no
      };
      if (this.pageType == "integral") {
        // 积分商城 微信支付
        this.integral_data.pay_type = 1;
        params = {
          order_data: this.integral_data
        };
      }
      this.isLoading = true;
      PAY.ADAPAYWXPAY(params, { isIntegral: this.pageType == "integral" })
          .then(({ type, out_trade_no }) => {
            if (type == "wechat") {
              // 发送订阅消息
              this.setSubscribe({ node_id: this.node_id }).then(() => {
                this.$Navigate.replace({
                  path: "/packages/pay/result",
                  query: {
                    out_trade_no
                  }
                });
              });
            } else {
              this.isLoading = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
    },
    // 微信支付
    wechatFn() {
      let params = {
        out_trade_no: this.out_trade_no
      };
      if (this.pageType == "integral") {
        // 积分商城 微信支付
        this.integral_data.pay_type = 1;
        params = {
          order_data: this.integral_data
        };
      }
      this.isLoading = true;
      PAY.WXPAY(params, { isIntegral: this.pageType == "integral" })
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
            // 发送订阅消息
            this.setSubscribe({ node_id: this.node_id }).then(() => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no
                }
              });
            });
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
      if (this.pageType == "integral") {
        // 积分商城 支付宝支付
        this.integral_data.pay_type = 2;
        params = {
          order_data: this.integral_data
        };
      }
      this.isLoading = true;
      PAY.ALIPAY(params, { isIntegral: this.pageType == "integral" })
        .then(({ type, out_trade_no }) => {
          if (type == "alipay") {
            this.$Navigate.replace({
              path: "/packages/pay/result",
              query: {
                out_trade_no
              }
            });
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 货款支付
    ppayFn() {
      if (this.balance < parseFloat(this.pay_money)) {
        this.$Prompt.toast(
          this.memberTexts.balance_style + "不足，请选择其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.pay_money,
            type: this.orderFrom
          };
          if (this.pageType == "integral") {
            // 积分商城 货款支付
            this.integral_data.pay_type = 4;
            params = {
              order_data: this.integral_data,
              password: this.bpayPassword
            };
          }
          PAY_PROCEEDS(params, { isIntegral: this.pageType == "integral" })
            .then(res => {
              const out_trade_no = params.out_trade_no || res.data.out_trade_no;
              if (res.code == 0) {
                // 发送订阅消息
                this.setSubscribe({ node_id: this.node_id }).then(() => {
                  this.$Navigate.replace({
                    path: "/packages/pay/result",
                    query: {
                      out_trade_no
                    }
                  });
                });
              } else {
                this.$Prompt.toast(res.message);
                this.isLoading = false;
                this.bpayPassword = null;
              }
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // 线下支付
    offline_payFn() {
      if (this.pay_voucher == "") {
        this.$Prompt.toast("请上传支付凭证");
        return false;
      }
      let out_trade_no = this.out_trade_no;
      let params = {
        out_trade_no,
        pay_voucher: this.pay_voucher
      };
      if (this.rechargeType) {
        params.type = this.rechargeType - 4;
      }
      PAY_OFFLINE(params)
        .then(res => {
          if (res.code == 0) {
            this.$Navigate.replace({
              path: "/packages/pay/result",
              query: {
                out_trade_no
              }
            });
          } else {
            this.$Prompt.toast(res.message);
            this.isLoading = false;
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // 数字资产钱包相关支付
    onBlockchainPay() {
      const payType = this.payType;
      const type = payType == "ethpay" ? "eth" : "eos";
      const balance = parseFloat(this[payType].balance);
      const pay_money = parseFloat(this[payType].paymoney);
      if (balance < pay_money) {
        this.$Prompt.toast(type + "余额不足，请选择其他支付方式！");
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword, true)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            password: this.bpayPassword
          };
          PAY_BLOCKCHAIN(params, { type })
            .then(res => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no,
                  blockchain_order: 1
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // globe pay跨境支付
    gpayFn() {
      let params = {
        out_trade_no: this.out_trade_no,
        type: this.orderFrom
      };
      this.isLoading = true;
      PAY.GLOBEPAY(params)
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
            // 发送订阅消息
            this.setSubscribe({ node_id: this.node_id }).then(() => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no
                }
              });
            });
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 币种支付
    bcpayFn() {
      // console.log(this.coinInfo);
      if (!this.coinInfo) {
        this.$Prompt.toast("请选择币种！");
        return false;
      }
      const balance = parseFloat(this.coinInfo.balance);
      const pay_money = parseFloat(this.coinInfo.pay_money);
      if (balance < pay_money) {
        this.$Prompt.toast(
          this.coinInfo.symbol + "余额不足，请选择其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword, true)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            gas: this.coinInfo.gas,
            symbol: this.coinInfo.symbol,
            password: this.bpayPassword
          };
          PAY_BLOCKCHAINCOIN(params)
            .then(res => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no: this.out_trade_no,
                  blockchain_order: 1
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 160rpx;
}
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
  .charge-text {
    margin-bottom: 10rpx;
    line-height: 28rpx;
    color: $text-light;
    font-size: $font-size-sm;
  }
}
.foot-btn-group {
  z-index: 10;
}
</style>
