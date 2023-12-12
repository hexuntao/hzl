<template>
  <view class="pay-action-group">
    <lk-cell :title="title" />
    <lk-radio-group v-model="type" v-if="payAction">
      <view class="items">
        <block v-for="(item, index) in payAction" :key="index">
          <lk-cell :clickable="!item.disabled" @click="selectPayAction(item)">
            <lk-icon
              slot="icon"
              class="pay-icon"
              class-prefix="v-icon"
              :name="item.icon"
              :color="item.iconcolor"
              :size="item.size"
            />
            <view slot="title">
              <text class="title">{{ item.title }}</text>
              <text class="tip" v-if="item.tip">({{ item.tip }})</text>
            </view>
            <lk-radio
              slot="rightIcon"
              :active-color="theme.color"
              :name="item.name"
              :label-disabled="item.disabled"
              :disabled="item.disabled"
            />
          </lk-cell>
          <view
            v-if="showBcPay && item.name == 'bcpay'"
            v-show="type == 'bcpay'"
          >
            <lk-cell-account-item
              v-if="biInfo.id"
              is-link
              :title="biInfo.symbol"
              :image="biInfo.logo"
              :label="biInfo.label"
              @click="showBcPopup = true"
            />
            <lk-cell v-else is-link @click="showBcPopup = true">
              <text class="tlpay-tip">选择支付币种</text>
            </lk-cell>
          </view>
          <view
            v-if="showTlPay && item.name == 'tlpay'"
            v-show="type == 'tlpay'"
          >
            <lk-cell-account-item
              v-if="bankCardInfo.id"
              is-link
              :title="bankCardInfo.title"
              :image="bankCardInfo.logo"
              :label="bankCardInfo.label"
              :labelText="bankCardInfo.labelText"
              @click="showBankCard = true"
            />
            <lk-cell v-else is-link @click="showBankCard = true">
              <text class="tlpay-tip">选择银行卡</text>
            </lk-cell>
          </view>
        </block>
      </view>
    </lk-radio-group>
    <view class="empty" v-else>没有可用的支付方式</view>
    <offlineInfo
      v-if="type == 'offline_pay'"
      :offline_pay="payConfig.offline_pay"
      @pay_voucher_src="pay_voucher_src"
    />
    <view v-if="showBcPay && showPoundage">
      <poundage-group
        :type="biInfo.symbol"
        :info="poundage"
        @change="poundageChange"
      />
    </view>
    <popup-bankcard-list
      v-if="showTlPay"
      v-model="showBankCard"
      :card-id="bankCardInfo.id"
      @select="selectBankCard"
    />
    <popup-bc-list
      v-if="showBcPay"
      v-model="showBcPopup"
      :bi-id="biInfo.id"
      @select="selectBiInfo"
    />
  </view>
</template>

<script>
import { mapState } from "vuex";
import { isEmpty, yuan, isWeixin } from "@/common/utils";
import offlineInfo from "./offline-info";
import popupBankcardList from "./popup-bankcard-list";
import popupBcList from "./popup-bc-list";
import poundageGroup from "./poundage-group";
import {
  GET_BLOCKCHAINGAS,
  GET_BLOCKCHAINGWEISIZE
} from "@/common/interface/blockchain";
const defaultBlockchain = {
  show: false,
  balance: 0,
  money: 0,
  paymoney: 0
};
export default {
  data() {
    return {
      type: this.value,

      showTlPay: false, // 是否显示银行卡支付
      bankCardInfo: {
        id: "",
        title: "",
        logo: "",
        label: "",
        labelText: ""
      },
      showBankCard: false,
      showBcPay: false, //是否显示虚拟币支付
      // 选中的币种信息
      biInfo: {
        id: "",
        symbol: "",
        publicLink: "",
        logo: "",
        balance: 0,
        label: ""
      },
      showBcPopup: false,
      showPoundage: false,
      // eth gwei
      poundage: {
        gMin: 0,
        gMax: 0,
        gasFee: 0,
        gasPrice: 0,
        unit: "",
        loadingInitText: "",
        loadingFlag: false
      }
    };
  },
  props: {
    value: String,
    title: {
      type: String,
      default: "支付方式"
    },
    balance: [String, Number], // 余额需为数值，为了兼容小程序情况，加上string类型，实际传入的应该为number类型
    /**
     * 显示支付方式(默认为开启,eth/eos默认不开启)
     * bpay ==> 余额支付
     * wpay ==> 微信支付
     * apay ==> 支付宝支付
     * tlpay ==> 通联(银行卡)支付
     * ppay ==> 渠道商货款支付
     * offline ==> 线下支付 // 默认不开启
     * bcpay ==> 区块链 虚拟币 支付 // 默认不开启
     */
    bpay: {
      type: Boolean,
      default: true
    },
    offline: {
      type: Boolean,
      default: false
    },
    wpay: {
      type: Boolean,
      default: true
    },
    apay: {
      type: Boolean,
      default: true
    },
    ethpay: {
      type: [Boolean, String, Object],
      default: () => defaultBlockchain
    },
    eospay: {
      type: [Boolean, String, Object],
      default: () => defaultBlockchain
    },
    tlpay: {
      type: Boolean,
      default: true
    },
    ppay: {
      type: Boolean,
      default: false
    },
    gpay: {
      type: Boolean,
      default: true
    },
    adapaypay:{
      type: Boolean,
      default: true
    },
    bcpay: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  computed: {
    ...mapState({
      payConfig: ({ config }) => config.payConfig,
      member: ({ member }) => member
    }),
    payAction() {
      const {
        aPay,
        wPay,
        bPay,
        dPay,
        eosPay,
        ethPay,
        tlPay,
        gPay,
        offline_pay,
        blockchainpay,
        adapaypay
      } = this.payConfig;
      const { balance } = this.member.info;
      const { balance_style } = this.member.texts;
      const balanceText =
        typeof this.balance == "number" ? this.balance : parseFloat(balance);
      let arr = [];
      if (bPay && this.bpay) {
        arr.push({
          name: "bpay",
          icon: "v-icon-balance3",
          size: "20",
          iconcolor: "#f44",
          title: `${balance_style}支付`,
          tip: `${balance_style} ${balanceText.toFixed(2)}元`,
          disabled: !balanceText
        });
      }
      if (wPay && this.wpay) {
        arr.push({
          name: "wechat",
          icon: "v-icon-wx-pay",
          iconcolor: "#00c403",
          size: "20",
          title: "微信支付",
          tip: "",
          disabled: false
        });
      }
      if (gPay && this.gpay) {
        arr.push({
          name: "gpay",
          icon: "v-icon-wx-pay",
          iconcolor: "#00c403",
          size: "20",
          title: "微信支付(跨境)",
          tip: "",
          disabled: false
        });
      }
      if (adapaypay && this.adapaypay) {
        arr.push({
          name: "adapaypay",
          icon: "v-icon-wx-pay",
          iconcolor: "#00c403",
          size: "20",
          title: "微信支付",
          tip: "",
          disabled: false
        });
      }
      if (aPay && this.apay) {
        arr.push({
          name: "alipay",
          icon: "v-icon-alipay",
          iconcolor: "#009fe8",
          size: "20",
          title: "支付宝支付",
          tip: isWeixin() ? "需使用系统浏览器" : "",
          disabled: false
        });
      }
      if (blockchainpay.is_use && this.bcpay) {
        this.showBcPay = true;
        arr.push({
          name: "bcpay",
          icon: "v-icon-btc",
          iconcolor: "#f9a815",
          size: "20",
          title: blockchainpay.pay_name || "虚拟币支付",
          tip: "",
          disabled: false
        });
      }
      if (tlPay && this.tlpay) {
        this.showTlPay = true;
        arr.push({
          name: "tlpay",
          icon: "v-icon-card",
          iconcolor: "#1a88ff",
          size: "16",
          title: "银行卡",
          tip: "",
          disabled: false
        });
      }
      if (this.ppay) {
        arr.push({
          name: "ppay",
          icon: "v-icon-balance3",
          iconcolor: "#f44",
          size: "20",
          title: `货款支付`,
          tip: `${balance_style} ${balanceText.toFixed(2)}元`,
          disabled: !balanceText
        });
      }
      if (offline_pay && offline_pay.is_use && this.offline) {
        arr.push({
          name: "offline_pay",
          icon: "v-icon-balance1",
          iconcolor: "#2c7ee9",
          size: "20",
          title: offline_pay.pay_name,
          tip: ``,
          disabled: false
        });
      }
      return isEmpty(arr) ? "" : arr;
    }
  },
  methods: {
    pay_voucher_src(e) {
      this.$emit("pay_voucher_src", e);
    },
    selectPayAction(item) {
      this.type = !item.disabled ? item.name : this.type;
      this.change(this.type);
    },
    change(e) {
      this.$emit("input", e);
      this.$emit("change", e);
      if (this.biInfo.id) {
        // 切换支付方式，清除 币种信息
        this.showPoundage = false;
        this.biInfo.id = "";
        this.initPoundage();
      }
    },
    selectBankCard(item) {
      this.bankCardInfo = item;
      this.$emit("select-bankcard", item);
    },
    selectBiInfo(item) {
      this.biInfo.id = item.id;
      this.biInfo.symbol = item.symbol;
      this.biInfo.publicLink = item.publicLink;
      this.biInfo.logo = item.logo;
      this.biInfo.balance = item.balance;
      this.biInfo.label = item.label;
      // 公链为eth
      if (item.publicLink == "ETH") {
        GET_BLOCKCHAINGWEISIZE({}, { isShowLoading: true })
          .then(({ data }) => {
            this.showPoundage = true;
            this.poundage.gMin = data.low;
            this.poundage.gMax = data.high;
            this.biInfo.gas = data.low || 1;
            this.$emit("select-coin", this.biInfo);
            this.getGas();
          })
          .catch(() => {
            this.showPoundage = false;
          });
      } else {
        this.showPoundage = false;
        this.biInfo.gas = "";
        this.$emit("select-coin", this.biInfo);
      }
    },
    // gwei 变化
    poundageChange(e) {
      this.biInfo.gas = e;
      this.$emit("select-coin", this.biInfo);
      this.getGas();
    },
    // 初始化手续费
    initPoundage() {
      this.poundage.loadingInitText = "";
      this.poundage.loadingFlag = false;
      this.notEnough = false;
    },
    // 获取gas费用
    getGas() {
      // 公链为eth
      if (this.biInfo.publicLink == "ETH") {
        this.initPoundage();
        GET_BLOCKCHAINGAS({
          gas: this.biInfo.gas,
          type: 5,
          symbol: this.biInfo.symbol
        })
          .then(({ code, data, msg }) => {
            if (code == 200) {
              this.poundage.gasFee = data.gasFee || 0;
              this.poundage.gasPrice = data.gasPrice || 0;
              this.poundage.unit = data.unit;
              this.poundage.loadingFlag = true;
            } else {
              this.poundage.loadingInitText = msg || "格式错误";
              if (code == 12008) {
                this.notEnough = true;
                this.$Prompt.toast(msg);
              }
            }
          })
          .catch(() => {
            this.initPoundage();
          });
      }
    }
  },
  components: {
    popupBankcardList,
    offlineInfo,
    popupBcList,
    poundageGroup
  }
};
</script>

<style lang="scss" scoped>
.pay-action-group {
  .items {
    width: 100%;
    .pay-icon {
      width: 60rpx !important;
      height: 48rpx !important;
      font-size: 40rpx;
    }
    .title {
      padding: 0 8rpx;
    }
    .tip {
      font-size: $font-size-sm;
      color: $text-light;
    }
  }
  .tlpay-tip {
    color: $text-gray;
    font-size: $font-size-sm;
    padding-left: 60rpx;
  }
}
</style>
