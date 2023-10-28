import { authSign, platform, strNumToNmber } from "@/common/utils";
import $Store from "@/store";
import $Prompt from "./prompt";
import $Navigate from "./navigate";

let requestTask = null;

const program = {
  H5: "wap",
  APP: "app",
  APPNVUE: "app",
  WEIXIN: "miniProgram"
};

const http = {
  config: {
    baseUrl: "",
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest"
    },
    data: {},
    method: "POST",
    dataType: "json",
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    request: null,
    response: null
  },
  request(options) {
    if (!options) {
      options = {};
    }
    if (options.isShowLoading || options.loadingText) {
      const loadingText = options.loadingText || "";
      $Prompt.loading(loadingText);
    }
    const signUrl = options.url.split("/")[options.url.split("/").length - 1];
    options.baseUrl = options.baseUrl || $Store.getters.apiBaseUrl;
    options.dataType = options.dataType || http.config.dataType;
    options.url = options.baseUrl + options.url;
    options.data = options.data || {};
    options.method = options.method || http.config.method;
    options.header = Object.assign({}, http.config.header);
    options.header["sign"] =
      options.sign || authSign(signUrl, $Store.state.authKey);
    if ($Store.state.appName == "shopdds" || $Store.state.appName == "dds") {
      options.header["Program"] = "miniProgram";
      options.header["website-id"] = $Store.state.website_id;
    } else {
      options.header["Program"] = program[platform()];
      if (platform("WEIXIN")) {
        options.header["website-id"] = $Store.state.website_id;
      }
    }

    $Store.getters.token &&
      (options.header["user-token"] = $Store.getters.token);

    // #ifdef APP-PLUS
    options.sslVerify = false; // 不校验ssl证书
    // #endif

    // #ifdef H5
    // h5微信环境 接口验证是否需要登录情况才请求（部分接口不需要）
    if ($Store.state.isWeixin && !options.noLogin && !$Store.getters.token) {
      return new Promise(() => {
        if (options.isShowLoading || options.loadingText) {
          $Prompt.clear();
        }
      });
    }
    // #endif

    return new Promise((resolve, reject) => {
      let _config = null;
      let mallConfig = null;

      options.complete = response => {
        let statusCode = response.statusCode;
        response.config = _config;

        if (http.interceptor.response) {
          let newResponse = http.interceptor.response(response);
          if (newResponse) {
            response = newResponse;
          }
        }

        if (options.isShowLoading || options.loadingText) {
          $Prompt.clear();
        }

        if (response.data && typeof response.data == "object") {
          response.data.config = mallConfig;
        }

        if (statusCode === 200) {
          const data = strNumToNmber(response.data);
          const code = Number(data.code);

          if (code >= 0) {
            resolve(data);
          } else {
            if (code === -1000) {
              // 登录信息过期

              // #ifdef H5
              if (
                $Store.state.isWeixin &&
                $Store.state.config.is_wchat &&
                process.env.NODE_ENV != "development"
              ) {
                // 登录信息过期,微信环境自动授权登录(开发环境不自动授权登录)
                $Store.dispatch("logout").then(() => {
                  $Store.commit(
                    "setLoginBeforePath",
                    $Store.getters.route.fullPath
                  );
                  $Store.dispatch("authLogin", {
                    type: "WCHAT",
                    redirect_url: $Store.getters.route.fullPath
                  });
                });
              } else {
                $Prompt
                  .modal({
                    content: data.message || "未知错误信息",
                    showCancel: false
                  })
                  .then(() => {
                    $Store.commit(
                      "setLoginBeforePath",
                      $Store.getters.route.fullPath
                    );
                    $Store.dispatch("logout").then(() => {
                      $Navigate.replace("/packages/login/index");
                    });
                  });
              }
              // #endif

              // #ifndef H5
              $Prompt
                .modal({
                  content: data.message || "未知错误信息",
                  showCancel: false
                })
                .then(() => {
                  $Store.commit(
                    "setLoginBeforePath",
                    $Store.getters.route.fullPath
                  );
                  $Store.dispatch("logout").then(() => {
                    $Navigate.replace("/packages/login/index");
                  });
                });
              // #endif
              reject(data);
            } else if (code === -10000 || code === -10001) {
              // 商城已过期或未运营
              if ($Store.getters.route.name != "packages-mall-notice") {
                // uni.reLaunch({ url: "/packages/mall/notice?type=unopened" });
              }
              reject(data);
            } else {
              // noShowMessage 表示不提示相关出错信息
              if (!options.noShowMessage) {
                $Prompt
                  .modal({
                    content: data.message || data.msg || "未知错误信息",
                    showCancel: false
                  })
                  .then(() => {
                    if (options.errorCallback) {
                      $Navigate.back();
                    }
                    console.log("confirm--cancel");
                    reject(data);
                  });
              } else {
                reject(data);
              }
            }
          }
        } else if (
          statusCode == 502 ||
          statusCode == 500 ||
          statusCode == 403
        ) {
          reject(response.data);
          console.log(
            "服务器出错:" + statusCode,
            response.config.url,
            response.data
          );
        } else {
          if (response.data) {
            console.log(response.data);
          }
          if (response.errMsg) {
            console.log(response.config.url, response.errMsg);
          }
          if (response.errMsg === "request:fail timeout") {
            $Prompt.toast("请求超时");
            reject({ message: "网络请求超时" });
          }
        }
      };

      _config = Object.assign({}, http.config, options);
      _config.requestId = new Date().getTime();

      if (http.interceptor.request) {
        http.interceptor.request(_config);
      }

      if (options.premise) {
        uni.request(_config);
      } else {
        $Store.dispatch("getConfig").then(resCon => {
          mallConfig = resCon;
          requestTask = uni.request(_config);
          if (!options.noCancel) {
            $Store.commit("setRequestList", requestTask);
          }
        });
      }
    });
  }
};

export default http.request;
