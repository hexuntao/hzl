<template>
  <view class="pages">
    <lk-cell
      title="账号类型"
      field
      v-if="pageType == 'add' && addType != 'bank'"
    >
      <lk-radio-group v-model="type" :active-color="theme.color">
        <lk-radio
          :name="item.type"
          v-for="(item, index) in columns"
          :key="index"
        >
          {{ item.text }}
        </lk-radio>
      </lk-radio-group>
    </lk-cell>
    <form-account-group
      v-if="type == 3"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <form-bank-auto-group
      v-if="type == 1"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <form-bank-manual-group
      v-if="type == 4"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <lk-popup-bankcard-sms
      v-model="showBankCardSms"
      type="signing"
      :info="info"
      @success="signingSuccess"
      @close="signingClose"
    />
  </view>
</template>

<script>
import { mapState } from "vuex";
import { SET_ASSETACCOUNT } from "@/common/interface/property";
import formAccountGroup from "./component/form-account-group";
import formBankAutoGroup from "./component/form-bank-auto-group";
import formBankManualGroup from "./component/form-bank-manual-group";
export default {
  name: "packages-property-account-post",
  data() {
    return {
      pageType: null,
      addType: "",
      type: "",
      info: {},
      isLoading: false,
      showBankCardSms: false,
      q1_OrderNo: "", //汇聚签约
      joinpaycode: false, //汇聚签约银行卡，显示输入验证码框
    };
  },
  watch: {
    type(e) {
      if (this.pageType == "add") {
        this.info = {};
      }
    },
    withdrawConfig() {
      this.changeType();
    },
  },
  computed: {
    ...mapState({
      payConfig: ({ config }) => config.payConfig,
      withdrawConfig: ({ config }) => config.withdraw_conf, //提现配置
    }),
    columns() {
      const withdrawType = this.withdrawConfig.withdraw_message || [];
      let arr = [];
      withdrawType.forEach((e) => {
        if (e == 3) {
          arr.push({
            text: "支付宝",
            type: e,
          });
        }
        if (e == 1 || e == 4) {
          arr.push({
            text: "银行卡",
            type: this.payConfig.tlPay ? 1 : e, // 开启通联支付情况，添加类型都是自动类型
          });
        }
      });
      return arr;
    },
  },
  onLoad(query) {
    this.info = query.info ? JSON.parse(query.info) : {};
    this.pageType = query.hash;
    this.addType = query.addtype || "";
    this.onbackevent = query.onbackevent || "";
    this.changeType();
  },
  methods: {
    changeType() {
      const withdrawType = this.withdrawConfig.withdraw_message || [];
      let type = this.info.type || "";
      if (this.pageType == "add") {
        withdrawType.some((e) => {
          if (e == 3 && this.addType != "bank") {
            type = e;
            return true;
          }
          if (e == 1 || e == 4) {
            type = this.payConfig.tlPay ? 1 : e;
            return true;
          }
        });
      } else {
        withdrawType.forEach((e) => {
          if (type == 4 && (e == 1 || this.payConfig.tlPay)) {
            // 如果编辑类型为手动打款，而平台提现设置开启自动打款，则type修改为自动打款类型
            // 开启通联支付情况，编辑情况都是自动类型,为升级账号
            type = 1;
          }
        });
      }
      // console.log(type);
      this.type = type;
    },
    //关闭签约
    signingClose() {
      this.isLoading = false;
    },
    //签约成功
    signingSuccess() {
      setTimeout(() => {
        this.onBackEvent();
      }, 500);
    },
    // 返回触发自定义事件
    onBackEvent() {
      if (this.onbackevent) {
        uni.$emit(this.onbackevent, true);
      }
      this.$Navigate.back();
    },
    onSave(info) {
      this.info = info;
      info.type = this.type;
      // return console.log(info);
      this.isLoading = true;
      SET_ASSETACCOUNT(info, { type: this.pageType })
        .then(({ code, data, message }) => {
          if (code == 1) {
            if (data.q1_OrderNo) {
              this.joinpaycode = true;
              this.q1_OrderNo = data.q1_OrderNo;
              this.$Prompt.toast({ title: message, icon: "success" });
            } else if (data.thpinfo) {
              this.info.thpinfo = data.thpinfo;
              this.showBankCardSms = true;
            } else {
              this.$Prompt.toast("获取短信验证失败");
              this.isLoading = false;
            }
          } else {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              this.onBackEvent();
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
  components: {
    formAccountGroup,
    formBankAutoGroup,
    formBankManualGroup,
  },
};
</script>

<style lang="scss" scoped></style>
