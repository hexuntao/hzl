import {ADAPAYPAY_WECHAT, PAY_WECHAT, PAY_ALIPAY, PAY_GLOPAY } from "@/common/interface/pay";
import $Store from "@/store";
import $Prompt from "@/api/prompt";
import $Navigate from "@/api/navigate";

// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
// #endif

export default {
  ADAPAYWXPAY(options = {}, config = {}) {
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

      // #ifndef H5
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }

      console.log(34242344234234);

      ADAPAYPAY_WECHAT(params, { ...config })
          .then(({ data }) => {
            uni.requestPayment({
              provider: "wxpay",

              // #ifdef APP-PLUS
              orderInfo: data || {},
              // #endif

              // #ifdef MP
              timeStamp: String(data.timeStamp),
              nonceStr: String(data.nonceStr),
              package: String(data.package),
              signType: String(data.signType),
              paySign: String(data.paySign),
              // #endif

              success: res => {
                $Prompt.toast({ title: "支付成功", icon: "success" });
                reslove({
                  type: "wechat",
                  result: "success",
                  out_trade_no: data.out_trade_no || params.out_trade_no
                });
              },
              fail: err => {
                console.log(err.errMsg);
                if (err.errMsg != "requestPayment:fail cancel") {
                  $Prompt.modal({
                    title: "提示",
                    showCancel: false,
                    content: JSON.stringify(err.errMsg)
                  });
                }
                reject({
                  type: "wechat",
                  result: "fail",
                  out_trade_no: data.out_trade_no || params.out_trade_no
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

      // #ifndef H5
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }
      PAY_WECHAT(params, { ...config })
        .then(({ data }) => {
          uni.requestPayment({
            provider: "wxpay",

            // #ifdef APP-PLUS
            orderInfo: data || {},
            // #endif

            // #ifdef MP
            timeStamp: String(data.timeStamp),
            nonceStr: String(data.nonceStr),
            package: String(data.package),
            signType: String(data.signType),
            paySign: String(data.paySign),
            // #endif

            success: res => {
              $Prompt.toast({ title: "支付成功", icon: "success" });
              reslove({
                type: "wechat",
                result: "success",
                out_trade_no: data.out_trade_no || params.out_trade_no
              });
            },
            fail: err => {
              console.log(err.errMsg);
              if (err.errMsg != "requestPayment:fail cancel") {
                $Prompt.modal({
                  title: "提示",
                  showCancel: false,
                  content: JSON.stringify(err.errMsg)
                });
              }
              reject({
                type: "wechat",
                result: "fail",
                out_trade_no: data.out_trade_no || params.out_trade_no
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
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }
      // #ifdef H5
      let real = encodeURIComponent(location.search);
      if ($Store.state.isWeixin) {
        $Navigate.replace({
          path: "/packages/pay/guide",
          query: {
            params: JSON.stringify(params),
            config: JSON.stringify(config),
            real: real,
            from: config.from
          }
        });
      } else {
        PAY_ALIPAY(params, { ...config })
          .then(({ data }) => {
            const div = document.createElement("div");
            div.innerHTML = data;
            document.body.appendChild(div);
            document.forms[0].submit();
            reslove();
          })
          .catch(() => {
            reject();
          });
      }
      // #endif

      // #ifdef APP-PLUS
      PAY_ALIPAY(params, { ...config })
        .then(({ data }) => {
          uni.requestPayment({
            provider: "alipay",
            orderInfo: data || "",
            success: res => {
              $Prompt.toast({ title: "支付成功", icon: "success" });
              reslove({
                type: "alipay",
                result: "success",
                out_trade_no: data.out_trade_no || params.out_trade_no
              });
            },
            fail: err => {
              console.log("err", err);
              $Prompt.modal({
                title: "提示",
                showCancel: false,
                content: JSON.stringify(err)
              });
              reject({
                type: "alipay",
                result: "fail",
                out_trade_no: data.out_trade_no || params.out_trade_no
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
  // globe 跨境支付
  GLOBEPAY(options = {}, config = {}) {
    return new Promise((reslove, reject) => {
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }
      PAY_GLOPAY(params, { ...config })
        .then(({ data }) => {
          // #ifdef H5
          window.location.href = data.pay_url;
          // #endif

          // #ifndef H5
          uni.requestPayment({
            provider: "wxpay",

            // #ifdef APP-PLUS
            orderInfo: data.sdk_params || {},
            // #endif

            // #ifdef MP
            timeStamp: data.sdk_params.timeStamp,
            nonceStr: data.sdk_params.nonceStr,
            package: data.sdk_params.package,
            signType: data.sdk_params.signType,
            paySign: data.sdk_params.paySign,
            // #endif

            success: res => {
              $Prompt.toast({ title: "支付成功", icon: "success" });
              reslove({
                type: "wechat",
                result: "success",
                out_trade_no: data.out_trade_no || params.out_trade_no
              });
            },
            fail: err => {
              console.log(err.errMsg);
              if (err.errMsg != "requestPayment:fail cancel") {
                $Prompt.modal({
                  title: "提示",
                  showCancel: false,
                  content: JSON.stringify(err.errMsg)
                });
              }
              reject({
                type: "wechat",
                result: "fail",
                out_trade_no: data.out_trade_no || params.out_trade_no
              });
            },
            complete: () => {}
          });
          // #endif
        })
        .catch(() => {
          reject();
        });
    });
  }
};
