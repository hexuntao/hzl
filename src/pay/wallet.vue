<template>
  <view class="pages">
    <block v-if="!creating">
      <view class="head-tip">{{ tip }}</view>
      <view class="cell-group">
        <lk-field
          label="账户名"
          clearable
          maxlength="12"
          placeholder="请输入a-z与数字1-5组合的账户名"
          autocomplete="off"
          v-model="params.account_name"
          @blur="onAccountNameBlur"
        />
        <lk-field
          label="支付密码"
          clearable
          type="password"
          placeholder="请输入商城的支付密码"
          autocomplete="new-password"
          v-model="params.password"
          @blur="onPasswordBlur"
          v-if="isPayPassword"
        />
        <lk-cell title="支付密码" field v-else>
          <text class="text-link" @click="onSetPayPassword"
            >未设置支付密码，点击设置</text
          >
        </lk-cell>
      </view>
      <view class="cell-group" v-if="!isPaymented">
        <lk-cell title="内存空间" field>
          <text class="text-red">{{ moneyText }}</text>
          <text class="not-enough-text" v-if="notEnoughFlag">{{
            notEnoughText
          }}</text>
        </lk-cell>
      </view>
      <view class="cell-group" v-if="!isPaymented">
        <lk-pay-action-group
          v-model="payType"
          :tlpay="false"
          @change="onPayTypeChange"
        />
      </view>
      <lk-modal-pay-password
        v-if="!isPayPassword"
        ref="modalPayPassword"
        v-model="isShowModalPayPassword"
        @cancel="isLoading = false"
      />
      <view class="foot-btn-group">
        <lk-button
          round
          theme-color
          block
          :disabled="isDisabled"
          :loading="isLoading"
          @click="onCreate"
        >
          创建钱包
        </lk-button>
      </view>
    </block>
    <block v-else>
      <view class="empty-creat">
        <lk-icon
          class-prefix="v-icon"
          name="v-icon-wait-creat"
          size="120"
          color="#606266"
        />
        <text class="text">{{ creatText }}</text>
      </view>
    </block>
  </view>
</template>

<script>
import { PAY_ALIPAY, GET_PAYRESULT } from "@/common/interface/pay";
import {
  CHECK_BLOCKCHAINEOSACCOUNTNAME,
  CREATE_BLOCKCHAINEOSWALLET,
  PAY_BLOCKCHAINEOSBALANCEPAY,
  CREATE_BLOCKCHAINEOSWALLETUNPAY
} from "@/common/interface/blockchain";
import mixinPayPassword from "@/mixins/valid-pay-password";
import { mapState, mapActions } from "vuex";
import { isWeixin, yuan } from "@/common/utils";
import { validPayPassword } from "@/common/utils/validator";
import PAY from "./pay";
export default {
  name: "pay-wallet",
  data() {
    return {
      creating: false,
      creatText: "钱包创建中，请稍等...",

      isPaymented: false, //是否购买过内存

      money: "",
      moneyText: "",
      tip:
        "EOS钱包向商城购买小部分内存空间才能完成创建，若支付成功创建钱包失败，重新创建则无需要重新购物内存。",
      payType: "",
      params: {
        password: "",
        account_name: ""
      },
      accountNameFlag: false,
      passwordFlag: false,
      isLoading: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      config: ({ config }) => config,
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts
    }),
    //是否有设置支付密码
    isPayPassword() {
      return this.memberInfo.is_password_set;
    },
    isDisabled() {
      let flag = true;
      if (!this.isPayPassword) return flag;
      if (!this.isPaymented) {
        if (this.accountNameFlag && this.passwordFlag && this.payType) {
          flag = false;
          if (
            this.payType == "bpay" &&
            parseInt(this.memberInfo.balance) < this.money
          ) {
            flag = true;
          }
        }
      } else {
        if (this.accountNameFlag && this.passwordFlag) {
          flag = false;
        }
      }
      return flag;
    },
    notEnoughFlag() {
      let flag = false;
      if (
        this.payType == "bpay" &&
        parseInt(this.memberInfo.balance) < this.money
      ) {
        flag = true;
      }
      return flag;
    },
    notEnoughText() {
      return "(" + this.memberTexts.balance_style + "不足)";
    }
  },
  onLoad(query) {
    this.out_trade_no = query.out_trade_no || "";
    this.getData();
  },
  methods: {
    ...mapActions(["getBlockchainSet", "getMemberInfo", "getEosInfo"]),
    getData() {
      this.getBlockchainSet()
        .then(({ wallet_type, eos_money, password_is_set }) => {
          this.money = eos_money;
          this.moneyText = yuan(eos_money || 0);
          const arr = wallet_type.split(",");
          if (arr[0] == 2 || arr[1] == 2) {
            if (this.out_trade_no) {
              // h5或支付宝支付完成回调
              this.getPayResult(this.out_trade_no).then(({ data }) => {
                if (data.pay_status != 2) {
                  this.$Prompt.toast("支付失败，请重新支付创建钱包！");
                }
                this.getEos();
              });
            } else {
              this.getEos();
            }
          } else {
            this.$Navigate.replace("/pages/blockchain/list");
          }
        })
        .catch(() => {});
    },
    // 获取eos信息
    getEos() {
      this.getEosInfo({ update: true, noShowMessage: true })
        .then(({ code, data, message }) => {
          if (code == 2) {
            this.params.pay_type = "";
            this.params.pay_from = isWeixin() ? 1 : 2;
          } else if (code == 3) {
            this.creating = true;
            this.creatText = message;
          } else if (code == 4) {
            this.isPaymented = true;
            this.creating = false;
          } else {
            this.$Navigate.replace("/pages/blockchain/list");
          }
        })
        .catch(error => {
          this.$Prompt
            .modal({
              content: error.message || error.msg || "未知错误信息",
              showCancel: false
            })
            .then(() => {
              this.$Navigate.back();
            });
        });
    },
    // 设置支付密码
    onSetPayPassword() {
      this.$refs.modalPayPassword.isShowSetPayPassword = true;
    },
    // 获取支付结果
    getPayResult(out_trade_no) {
      return new Promise((resolve, reject) => {
        GET_PAYRESULT({ out_trade_no })
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    onCreate() {
      let params = this.validatore();
      if (params) {
        this.isLoading = true;
        if (this.isPaymented) {
          this.createNotPay(params);
        } else {
          this.createPay(params);
        }
      }
    },
    // 需要支付创建
    createPay(params) {
      CREATE_BLOCKCHAINEOSWALLET(params)
        .then(({ data }) => {
          if (this.payType == "bpay") {
            this.balancePay(data.out_trade_no);
            this.isLoading = false;
            this.creating = true;
          } else if (this.payType == "wechat") {
            this.wechatPay(data.out_trade_no);
          } else if (this.payType == "alipay") {
            this.aliPay(data.out_trade_no);
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 无需支付直接创建
    createNotPay(params) {
      this.creating = true;
      CREATE_BLOCKCHAINEOSWALLETUNPAY(params)
        .then(({ code, message }) => {
          this.$Prompt.toast(message).then(() => {
            this.$Navigate.replace("/pages/blockchain/list").then(() => {
              this.isLoading = false;
            });
          });
        })
        .catch(() => {
          this.$Navigate.replace("/pages/blockchain/list").then(() => {
            this.isLoading = false;
          });
        });
    },
    // 余额支付
    balancePay(out_trade_no) {
      PAY_BLOCKCHAINEOSBALANCEPAY({ out_trade_no })
        .then(({ code, message }) => {
          this.$Prompt.toast(message);
          if (code == 1) {
            this.getEosInfo({ update: true });
            this.$Navigate.replace("/pages/blockchain/list");
          } else if (code == 4) {
            this.getEosInfo({ update: true });
            this.$Navigate.replace({
              path: "/blockchain/index",
              query: { type: "eos" }
            });
          } else {
            this.getData();
          }
        })
        .catch(() => {
          this.creating = false;
        });
    },
    // 微信支付
    wechatPay(out_trade_no) {
      let params = {
        out_trade_no: out_trade_no
      };
      this.isLoading = true;
      PAY.WXPAY(params)
        .then(({ type }) => {
          if (type == "wechat") {
            this.isLoading = false;
            this.creating = true;
            this.getData();
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 支付宝支付
    aliPay(out_trade_no) {
      let params = {
        out_trade_no: out_trade_no
      };
      this.isLoading = true;
      PAY.ALIPAY(params)
        .then(({ type }) => {
          if (type == "alipay") {
            this.isLoading = false;
            this.creating = true;
            this.getData();
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    onAccountNameBlur(e) {
      this.checkAccountName(e);
    },
    onPasswordBlur(e) {
      this.checkPaypassword(e);
    },
    onPayTypeChange(e) {
      this.params.pay_type = this.tranPayType(e);
    },
    tranPayType(e) {
      let type = "";
      if (e == "bpay") {
        type = 1;
      } else if (e == "wechat") {
        type = 2;
      } else if (e == "alipay") {
        type = 3;
      }
      return type;
    },
    // 验证账号名称
    checkAccountName(name) {
      if (name && this.validUsername(name)) {
        CHECK_BLOCKCHAINEOSACCOUNTNAME({ account_name: name })
          .then(({ code, message }) => {
            if (code == 2) {
              this.accountNameFlag = true;
            } else {
              this.passwordFlag = false;
              this.$Prompt.toast(message);
            }
          })
          .catch(() => {
            this.passwordFlag = false;
          });
      } else {
        this.passwordFlag = false;
      }
    },
    //验证支付密码
    checkPaypassword(password) {
      if (password) {
        if (validPayPassword(password, this.config.ppl)) {
          this.$store
            .dispatch("checkPayPassword", password)
            .then(() => {
              this.passwordFlag = true;
            })
            .catch(() => {
              this.passwordFlag = false;
            });
        } else {
          this.passwordFlag = false;
        }
      } else {
        this.passwordFlag = false;
      }
    },
    //验证
    validatore() {
      const params = this.params;
      if (!params.account_name) {
        this.$Prompt.toast("请输入账户名！");
        return false;
      }
      if (!this.validUsername(params.account_name)) {
        return false;
      }
      if (!this.isPaymented) {
        if (!params.password) {
          this.$Prompt.toast("请输入商城的支付密码！");
          return false;
        }
        if (!params.pay_type) {
          this.$Prompt.toast("请选择支付方式！");
          return false;
        }
      }
      return params;
    },
    validUsername(value) {
      var reg = /^([1-5]{12}$)|(^[a-z]{12}$)|(^[1-5a-z]{12})$/;
      if (!reg.test(value)) {
        this.$Prompt.toast("由a-z与数字1-5组合，长度为12位");
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.head-tip {
  padding: 20rpx;
  color: #f56723;
  font-size: $font-size-sm;
  line-height: 1.5;
  background-color: #fff7cc;
}
.not-enough-text {
  font-size: $font-size-sm;
  color: $text-light;
}
.empty-creat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  .text {
    font-size: $font-size-sm;
    padding: 20rpx;
  }
}
</style>
