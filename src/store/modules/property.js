import {
  GET_BANKSIGNINGSMS,
  SIGNING_BANKCARD,
  GET_PROPERTYCHARGESERVICE
} from "@/common/interface/property";
import { GET_BANKCARDSMS, PAY_BANKCARD } from "@/common/interface/pay";
import $Prompt from "@/api/prompt";

export default {
  state: {},
  actions: {
    /**
     * 获取银行签约短信
     * @param {String} params  签约申请返回的信息
     */
    getSigningSms(context, params) {
      return new Promise((resolve, reject) => {
        GET_BANKSIGNINGSMS(params)
          .then(({ message }) => {
            setTimeout(() => {
              $Prompt.toast({
                title: message,
                icon: "success",
                duration: 1000
              });
            }, 100);
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 签约银行卡
     * @param {String} params
     */
    signingBankCard(context, params) {
      return new Promise((resolve, reject) => {
        SIGNING_BANKCARD(params)
          .then(({ message }) => {
            $Prompt.toast({ title: message, icon: "success" });
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 获取银行支付短信
     * @param {String} params  支付申请返回的信息
     */
    getBankPaySms(context, params) {
      return new Promise((resolve, reject) => {
        GET_BANKCARDSMS(params)
          .then(res => {
            setTimeout(() => {
              $Prompt.toast({
                title: res.message,
                icon: "success",
                duration: 1000
              });
            }, 100);
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 银行卡支付
     * @param {String} params
     */
    payBankCard(context, params) {
      return new Promise((resolve, reject) => {
        PAY_BANKCARD(params)
          .then(({ message }) => {
            $Prompt.toast({ title: message, icon: "success" });
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },

  }
};
