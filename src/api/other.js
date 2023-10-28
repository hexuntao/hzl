/**
 *
 */

// #ifdef APP-PLUS
import { GET_APPVERSIONIFNO } from "@/common/interface/config";
import { isBrowser } from "@/common/utils";
/**
 * 版本号对比
 * @param {*} a  当前版本号
 * @param {*} b  线上版本号
 * return 是否需要更新
 */
function compare(a, b) {
  if (a === b) {
    return false;
  }
  var a_components = String(a).split(".");
  var b_components = String(b).split(".");
  var len = Math.min(a_components.length, b_components.length);
  for (var i = 0; i < len; i++) {
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return false;
    }
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return true;
    }
  }
  if (a_components.length > b_components.length) {
    return false;
  }
  if (a_components.length < b_components.length) {
    return true;
  }
  return false;
}
// #endif

export default {
  // 更新管理
  updateManager(options = {}) {
    return new Promise((resolve, reject) => {
      if (uni.canIUse("getUpdateManager")) {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          if (res.hasUpdate) {
            //小程序有新版本，则静默下载新版本，做好更新准备
            updateManager.onUpdateReady(function() {
              uni.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function(res) {
                  if (res.confirm) {
                    //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  } else if (res.cancel) {
                    // 如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                    uni.showModal({
                      title: "温馨提示~",
                      content:
                        "本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",
                      success: function(res) {
                        updateManager.applyUpdate();
                      }
                    });
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function() {
              uni.showModal({
                title: "已经有新版本了哟~",
                content:
                  "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
              });
            });
          }
        });
      } else {
        uni.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    });
  },
  // 跳转其他小程序
  toMiniProgram(options = {}) {
    // #ifdef MP
    uni.navigateToMiniProgram({
      appId: options.appid,
      path: options.path || "",
      extraData: {
        ...(options.extraData || {})
      },
      complete: res => {
        console.log(res);
      }
    });
    // #endif
    // #ifdef APP-PLUS
    plus.share.getServices(res => {
      if (res) {
        res.launchMiniProgram({
          id: options.appid,
          path: options.path || ""
        });
      } else {
        plus.nativeUI.alert("当前环境不支持微信操作!");
      }
    });
    // #endif
  },
  // app 热更新
  appUpdateManager(options = {}) {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
      console.log(widgetInfo);
      console.log(options);
      // uni.showToast({
      //   title: compare(widgetInfo.version, options.version)
      //     ? "需要更新"
      //     : "不用更新",
      //   position: "bottom"
      // });

      // uni.showModal({
      //   content: `${JSON.stringify(widgetInfo)}-${JSON.stringify(options)}`
      // });
      if (
        options.version &&
        options.wgturl &&
        compare(widgetInfo.version, options.version)
      ) {
        // 进行热更新
        uni.downloadFile({
          url: options.wgturl,
          success: downloadResult => {
            console.log(downloadResult);
            if (downloadResult.statusCode === 200) {
              plus.runtime.install(
                downloadResult.tempFilePath,
                {
                  force: false
                },
                function() {
                  console.log("install success...");
                  uni.showToast({
                    title: `更新完成`,
                    position: "bottom"
                  });
                  plus.runtime.restart();
                },
                function(e) {
                  console.error("install fail...");
                }
              );
            }
          }
        });
      }
      return false;
      // 其他方案，暂不使用
      GET_APPVERSIONIFNO({
        type: isBrowser("ios") ? 1 : 2,
        version: widgetInfo.version
      })
        .then(({ data }) => {
          var reg = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/;
          if (!reg.test(data.version_num)) {
            // 版本号格式不正确
            return false;
          }
          if (String(data.version_num) == String(widgetInfo.version)) {
            // 版本一致，无需更新
            return false;
          }
          let widgetVersions = String(widgetInfo.version).split("."); // 当前app版本号
          let resultVersions = String(data.version_num).split("."); // 服务端版本号
          if (widgetVersions[0] < resultVersions[0]) {
            // 大版本更新,需要重新下载整包
            uni.showModal({
              title: "更新提示",
              content: `${data.update_content || "暂无更新日志"}`,
              success: res => {
                let url = isBrowser("ios") ? data.ios_url : data.apk_url;
                if (url) {
                  plus.runtime.openURL(url);
                }
              },
              fail: () => {}
            });
          } else {
            if (data.wgt_url) {
              uni.downloadFile({
                url: data.wgt_url,
                success: downloadResult => {
                  console.log(downloadResult);
                  if (downloadResult.statusCode === 200) {
                    plus.runtime.install(
                      downloadResult.tempFilePath,
                      {
                        force: false
                      },
                      function() {
                        console.log("install success...");
                        uni.showToast({
                          title: `更新完成`,
                          position: "bottom"
                        });
                        plus.runtime.restart();
                      },
                      function(e) {
                        console.error("install fail...");
                      }
                    );
                  }
                }
              });
            }
          }
        })
        .catch(() => {});
    });
    // #endif
  }
};
