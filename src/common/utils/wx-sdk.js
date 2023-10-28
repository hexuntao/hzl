// #ifdef H5
import wx from "@/static/h5/weixin-min-js-sdk";
import $Prompt from "@/api/prompt";
import $Store from "@/store";
import { isWeixin, isBrowser } from "@/common/utils";
import { PAY_WECHAT } from "@/common/interface/pay";
import { GET_WXCONFIG } from "@/common/interface/config";

const jsApiList = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "onMenuShareAppMessage",
  "onMenuShareTimeline",
  "chooseImage",
  "uploadImage",
  "downloadImage",
  "getLocation",
  "scanQRCode",
  "chooseWXPay",
  "addCard",
  "openAddress",
  "openLocation"
];

let url = encodeURIComponent(window.location.href.split("#")[0]);

const wxConfig = () => {
  return new Promise((resolve, reject) => {
    if (isBrowser("android")) {
      url = encodeURIComponent(window.location.href.split("#")[0]);
    }
    GET_WXCONFIG({ url }).then(({ data }) => {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: jsApiList,
        openTagList: ["wx-open-subscribe"]
      });
      wx.ready(() => {
        resolve();
      });
      wx.error(error => {
        reject(error);
      });
    });
  });
};

export default {
  //设置微信分享
  wxShare(options) {
    return new Promise((reslove, reject) => {
      if (isWeixin()) {
        wxConfig()
          .then(() => {
            wx.updateAppMessageShareData({
              title: options.title,
              desc: options.desc,
              imgUrl: options.imgUrl,
              link: options.link,
              success() {
                // 设置成功
                reslove();
              },
              fail() {
                // 设置失败也返回成功
                reslove();
              }
            });
            wx.updateTimelineShareData({
              title: options.title,
              imgUrl: options.imgUrl,
              link: options.link,
              success() {
                // 设置成功
                reslove();
              },
              fail() {
                // 设置失败也返回成功
                reslove();
              }
            });
          })
          .catch(error => {
            reject("微信配置有误");
          });
      } else {
        reject("请在微信环境下分享");
      }
    });
  },
  // 微信扫码
  scanQRCode(scanType) {
    return new Promise((reslove, reject) => {
      if (isWeixin()) {
        wxConfig()
          .then(() => {
            wx.scanQRCode({
              needResult: 1,
              scanType,
              success(res) {
                reslove(res.resultStr);
              },
              fail(res) {
                reject("取消扫码");
              }
            });
          })
          .catch(error => {
            reject("微信配置有误");
          });
      } else {
        reject("请在微信环境下扫码");
      }
    });
  },
  // 获取经纬度（腾讯）
  wxGetLocation(options) {
    return new Promise((reslove, reject) => {
      wxConfig()
        .then(() => {
          wx.getLocation({
            type: "gcj02",
            complete(res) {
              reslove(res);
            }
          });
        })
        .catch(() => {
          reject();
        });
    });
  },
  // 微信支付
  wxPay(options = {}, config = {}) {
    return new Promise((reslove, reject) => {
      let params = Object.assign({}, { ...options });
      if (!params.type) {
        params.type = $Store.getters.orderFrom;
      }
      PAY_WECHAT(params, { ...config })
        .then(({ data }) => {
          if (data.mweb_url) {
            // h5微信支付
            reslove({ type: "h5" });
            window.location.href = data.mweb_url;
          } else {
            // 微信内唤起微信支付
            wxConfig()
              .then(() => {
                wx.chooseWXPay({
                  timestamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.package,
                  signType: data.signType,
                  paySign: data.paySign,
                  success(res) {
                    $Prompt.toast({ title: "支付成功", icon: "success" });
                    reslove({
                      type: "wechat",
                      result: "success",
                      out_trade_no: params.out_trade_no || data.out_trade_no
                    });
                  },
                  fail(res) {
                    $Prompt.modal({
                      title: "支付失败",
                      content: JSON.stringify(res)
                    });
                    reject({
                      type: "wechat",
                      result: "fail",
                      out_trade_no: params.out_trade_no || data.out_trade_no
                    });
                  },
                  cancel(res) {
                    $Prompt.toast("取消支付");
                    reject();
                  }
                });
              })
              .catch(() => {
                reject();
              });
          }
        })
        .catch(() => {
          reject();
        });
    });
  },
  // 微信内置地图查看位置
  openLocation(options = {}) {
    return new Promise((reslove, reject) => {
      wxConfig()
        .then(() => {
          wx.openLocation({
            ...options,
            complete: e => {
              reslove(e);
            }
          });
        })
        .catch(() => {
          reject();
        });
    });
  },
  // 添加微信卡券
  wxAddCard(options = {}) {
    return new Promise((reslove, reject) => {
      if (isWeixin()) {
        wxConfig()
          .then(() => {
            wx.addCard({
              cardList: options.cardList || [],
              success: res => {
                reslove(res);
              },
              fail: error => {
                reject(error);
              }
            });
          })
          .catch(error => {
            reject("微信配置有误");
          });
      } else {
        reject("请在微信环境下分享");
      }
    });
  }
};
// #endif
