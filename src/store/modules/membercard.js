import { MEMBERCARD_CREATERECHARGEORDER } from "@/common/interface/membercard"; //会员卡
import $Prompt from "@/api/prompt";
export default {
  state: {},
  mutations: {},
  actions: {
    // 充值订单
    membercardceeateorder(context, params) {
      return new Promise((resovle, reject) => {
        MEMBERCARD_CREATERECHARGEORDER(params)
          .then(res => {
            if (res.code == 1) {
              resovle(res.data.out_trade_no);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
