import { PAY_WECHAT, PAY_ALIPAY } from "@/common/interface/pay";
import $Store from "@/store";
import $Prompt from "@/api/prompt";
import $Navigate from "@/api/navigate";

// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
import { Base64 } from "@/common/lib/base64";
// #endif

export default {
  WXPAY(options = {}, config = {}) {
    return new Promise((reslove, reject) => {
      // #ifdef H5
      wxSdk
        .wxPay(options, config)
        .then(res => {
          reslove(res);
        })
        .catch(error => {
          reject(error);
        });
      // #endif

      // #ifdef MP-WEIXIN
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }
      params.form_id = ""; //小程序消息模板id
      PAY_WECHAT(params, { ...config })
        .then(({ data }) => {
          uni.requestPayment({
            provider: "wxpay",
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: res => {
              $Prompt.toast({ title: "支付成功", icon: "success" });
              reslove({
                type: "wechat",
                result: "success",
                out_trade_no: params.out_trade_no || data.out_trade_no
              });
            },
            fail: err => {
              $Prompt.modal({
                title: "支付失败",
                showCancel: false,
                content: JSON.stringify(err)
              });
              reject({
                type: "wechat",
                result: "fail",
                out_trade_no: params.out_trade_no || data.out_trade_no
              });
            },
            complete: () => {}
          });
        })
        .catch(() => {
          reject();
        });
      // #endif
    });
  },
  ALIPAY(options = {}, config = {}) {
    return new Promise((reslove, reject) => {
      // #ifdef H5
      let baseUrl = document.location.href;
      let real = baseUrl.split("?")[1];
      let params = Object.assign({}, { ...options });
      PAY_ALIPAY(params, { ...config })
        .then(({ data }) => {
          if ($Store.state.isWeixin) {
            let param = Base64.encode(JSON.stringify(data));
            $Navigate.replace({
              path: "/packages/pay/guide",
              query: {
                param: param,
                real: real
              }
            });
          } else {
            const div = document.createElement("div");
            div.innerHTML = data;
            document.body.appendChild(div);
            document.forms[0].submit();
          }
          reslove();
        })
        .catch(() => {
          reject();
        });
      // #endif
    });
  }
};
