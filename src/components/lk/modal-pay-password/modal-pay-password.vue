<template>
  <view class="modal-pay-password">
    <lk-popup
      v-model="show"
      round
      :title="title"
      prevent-touchmove
      :mask-close="false"
    >
      <view class="password-box">
<!--        <view class="cell-title" v-if="moneyTitleName">{{moneyTitleName }}</view>-->
        <view class="cell-money" v-if="moneyTextName">{{ moneyTextName }}</view>
        <view class="cell-fee-group">
          <!-- <view class="fee-item" v-if="chargeServiceName">
            <text>手续费</text>
            <text>{{ chargeServiceName }}</text>
          </view> -->
 
        </view>
        <lk-field
          v-model="password"
          label="支付密码"
          size="large"
          type="password"
          placeholder="请输入支付密码"
          autofocus
          clearable
        />
        <view class="tip">{{ pplText }}</view>
        <view class="forget-text">
          <text @click="isShowSetPayPassword = true">忘记密码？</text>
        </view>
      </view>
      <view class="password-btn-group">
        <lk-button class="btn" block square plain @click="cancel">
          取消
        </lk-button>
        <lk-button class="btn" block square theme-color @click="confirm">
          确定
        </lk-button>
      </view>
    </lk-popup>
    <lk-popup
      v-model="notifyInfo.show"
      round
      prevent-touchmove
      :mask-close="false"
    >
      <view class="notify-box" v-if="notifyInfo.show">
        <view class="message-text">{{ notifyInfo.message }}</view>
        <view class="tip-text">{{ notifyInfo.tip }}</view>
        <view class="foot">
          <lk-button
            class="btn"
            theme-color
            block
            round
            @click="notifyInfo.confirm()"
          >
            {{ notifyInfo.confirmText }}
          </lk-button>
          <lk-button class="btn" block round @click="notifyInfo.cancel()">
            {{ notifyInfo.cancelText }}
          </lk-button>
        </view>
      </view>
    </lk-popup>
    <lk-popup-set-pay-password v-model="isShowSetPayPassword" />
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import { validPayPassword } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
import focusout from "@/mixins/focusout";

/**
 * 添加余额符号或虚拟币符号
 * type ==> 类型 yuan/bi
 * num  ==> 金额
 */
function addSymbol(type, num) {
  return type == "yuan" ? yuan(num) : num + type;
}
export default {
  data() {
    return {
      password: "",
      isShowSetPayPassword: false,
      chargeService: null, // 手续费
      // chargeCpu: null, // 损耗cpu
      // chargeNet: null, // 损耗net

      notifyInfo: {
        show: false
      }
    };
  },
  mixins: [focusout],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "请输入支付密码"
    },
    type: [Number, String],
    money: [Number, String],
    chargeServiceMoney: [Number, String], //虚拟币支付时需要用余额金额计算手续费
    address: String, //虚拟币转账时需要转账地址

    moneyTitle: String,
    moneyText: String,
    charge: [String, Number],
    chargeCpu: String, // 损耗cpu
    chargeNet: String // 损耗net
  },
  watch: {
    show(e) {
      if (e && this.type && this.money) {
        this.getChargeService();
      }
    }
  },
  computed: {
    ...mapState(["member", "distribute", "config"]),
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    moneyTitleName() {
      if (this.moneyTitle) {
        return this.moneyTitle;
      }
      return this.typeTextObj(this.type).text;
    },
    moneyTextName() {
      if (this.moneyText) {
        return this.moneyText;
      }
      const symbol = this.typeTextObj(this.type).symbol;
      const type = this.typeTextObj(this.type).type;
      let text = null;
      symbol && this.money && (text = addSymbol(symbol, this.money));
      if (symbol && this.money) {
        text = type == "point" ? this.money : addSymbol(symbol, this.money);
      }
      return text;
    },
    chargeServiceName() {
      if (this.charge) {
        return this.charge;
      }
      return this.chargeService;
    },
    pplText() {
      let text = "由9-20个字母、数字、普通字符组成";
      if (this.config.ppl == 6) {
        text = "长度为6位，由字母、数字、普通字符组成";
      }
      if (this.config.ppl == 9) {
        text = "长度为9位，由字母、数字、普通字符组成";
      }
      return text;
    }
  },
  mounted() {
    if (process.env.NODE_ENV != "development") {
      this.getConfig({ update: true });
    }
  },
  methods: {
    typeTextObj(type) {
      const { balance_style, point_style } = this.member.texts;
      const { commission } = this.distribute.texts;
      let item = {
        text: null
      };
      const obj = {
        1: {
          text: balance_style + "支付",
          symbol: "yuan"
        },
        2: {
          text: balance_style + "提现",
          symbol: "yuan"
        },
        3: {
          text: balance_style + "转账",
          symbol: "yuan"
        },
        4: {
          text: balance_style + "兑换" + point_style,
          symbol: "yuan"
        },
        5: {
          text: point_style + "兑换" + balance_style,
          symbol: "yuan",
          type: "point"
        },
        6: {
          text: commission + "提现",
          symbol: "yuan"
        },
        7: {
          text: "收益提现",
          symbol: "yuan"
        },

        16: {
          text: commission + "提现",
          symbol: "yuan"
        }
      };
      type && (item = obj[type]);
      return item;
    },
    clearPassword() {
      this.password = "";
    },
    getChargeService() {
      let params = {
        types: this.type,
        money: this.money || 0
      };
      if (this.chargeServiceMoney) {
        params.money = this.chargeServiceMoney || 0;
      }
      if (this.address) {
        params.address = this.address;
      }
      const symbol = this.typeTextObj(this.type).symbol;
      this.chargeService = "获取中";
      // if (symbol == "EOS") {
      //   this.chargeCpu = "获取中";
      //   this.chargeNet = "获取中";
      // }
      this.$store
        .dispatch("getPropertyChargeService", params)
        .then(data => {
          this.chargeService = addSymbol(symbol, data.charge || 0);
          // if (symbol == "EOS") {
          //   this.chargeCpu = addSymbol("ms", data.cpucharge || 0);
          // }
          // if (symbol == "EOS") {
          //   this.chargeNet = addSymbol("kb", data.netcharge || 0);
          // }
        })
        .catch(() => {
          this.chargeService = "获取失败";
          // if (symbol == "EOS") {
          //   this.chargeCpu = "获取失败";
          //   this.chargeNet = "获取失败";
          // }
        });
    },
    close() {
      this.show = false;
    },
    cancel() {
      this.close();
      this.$emit("cancel");
    },
    confirm() {
      if (!validPayPassword(this.password, this.config.ppl)) {
        return false;
      }
      this.close();
      this.$emit("confirm", this.password);
    },
    notify(option = {}) {
      this.notifyInfo = {
        show: true,
        message: option.message || "为了您账号安全，建议您立即设置支付密码",
        tip:
          option.tip || '您也可以到"会员中心"-"设置"-"设置支付密码"中自行设置',
        confirmText: option.confirmText || "立即设置",
        cancelText: option.cancelText || "暂不设置",
        confirm: e => {
          this.notifyInfo.show = false;
          typeof option.confirm == "function" && option.confirm("confirm");
        },
        cancel: e => {
          this.notifyInfo.show = false;
          typeof option.cancel == "function" && option.cancel("cancel");
        }
      };
    }
  },
  beforeDestroy() {
    this.show = false;
    this.isShowSetPayPassword = false;
  },
  deactivated() {
    this.show = false;
    this.isShowSetPayPassword = false;
  }
};
</script>

<style lang="scss" scoped>
.modal-pay-password {
  .password-box {
    padding: 30rpx 0px 30rpx;
    width: 80vw;
  }

  .cell-title {
    text-align: center;
    font-size: $font-size-sm;
    color: $text-gray;
  }

  .cell-money {
    text-align: center;
    color: $red;
    font-weight: 800;
    font-size: $font-size-lg;
    padding: 10rpx 0;
    line-height: 48rpx;
  }

  .cell-fee-group {
    margin: 10rpx 0;
  }

  .fee-item {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $text-light;
    padding: 4rpx 30rpx;
    line-height: 1;
  }

  .tip {
    color: $text-light;
    text-align: center;
    font-size: $font-size-sm;
    margin-top: 20rpx;
  }

  .forget-text {
    margin-top: 20rpx;
    font-size: $font-size-sm;
    text-align: center;
    color: $blue;
  }
  .password-btn-group {
    display: flex;
    .btn {
      flex: 1;
    }
    .confirm-color {
      color: $red;
    }
  }

  .notify-box {
    display: flex;
    flex-direction: column;
    padding: $cell-padding;
    width: 80vw;
    .message-text {
      font-weight: 700;
      color: $text-gray;
      font-size: $font-size-lg;
      margin: 10rpx 0;
      text-align: center;
      line-height: 48rpx;
    }
    .tip-text {
      font-size: $font-size-xs;
      color: $text-light;
      line-height: 1.2;
      text-align: center;
      margin: 10rpx 0;
    }
    .foot {
      display: flex;
      flex-direction: column;
      padding: 20rpx 80rpx;
      .btn {
        margin: 10rpx 0;
      }
    }
  }
}
</style>
