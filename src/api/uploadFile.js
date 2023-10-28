import { authSign, platform } from "@/common/utils";
import $Store from "@/store";
import $Prompt from "./prompt";
import $Navigate from "./navigate";

const program = {
  H5: "wap",
  APP: "app",
  APPNVUE: "app",
  WEIXIN: "miniProgram"
};

const http = {
  config: {
    url: "",
    header: {},
    name: "",
    files: [],
    fileType: "image",
    filePath: "",
    formData: {},
    abort: e => {},
    constructor: e => {},
    offProgressUpdate: e => {},
    onProgressUpdate: e => {},
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    uploadFile: null,
    response: null
  },
  uploadFile(options) {
    if (!options) {
      options = {};
    }
    if (options.isShowLoading || options.loadingText) {
      const loadingText = options.loadingText || "";
      $Prompt.loading(loadingText);
    }
    const signUrl = options.url.split("/")[options.url.split("/").length - 1];
    const baseUrl = options.baseUrl || $Store.getters.apiBaseUrl;
    options.dataType = options.dataType || http.config.dataType;
    options.url = baseUrl + options.url;
    options.name = options.name || http.config.name;
    options.files = options.files || http.config.files;
    options.fileType = options.fileType || http.config.fileType;
    options.formData = options.formData || http.config.formData;
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

    options.abort = options.abort || http.config.abort;
    options.constructor = options.constructor || http.config.constructor;
    options.offProgressUpdate =
      options.offProgressUpdate || http.config.offProgressUpdate;
    options.onProgressUpdate =
      options.onProgressUpdate || http.config.onProgressUpdate;

    return new Promise((resolve, reject) => {
      let _config = null;

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

        if (statusCode === 200) {
          const data = JSON.parse(response.data);
          const code = Number(data.code);
          if (code >= 0) {
            resolve(data);
          } else {
            reject(data);
          }
        } else {
          reject(response);
        }
      };

      _config = Object.assign({}, http.config, options);
      _config.uploadId = new Date().getTime();

      if (http.interceptor.uploadFile) {
        http.interceptor.uploadFile(_config);
      }

      const uploadTask = uni.uploadFile(_config);
      // uploadTask.abort(e => {
      //   options.abort(e);
      // });
      // uploadTask.constructor(e => {
      //   options.constructor(e);
      // });
      // uploadTask.offProgressUpdate(e => {
      //   options.offProgressUpdate(e);
      // });
      uploadTask.onProgressUpdate(e => {
        options.onProgressUpdate(e);
      });
    });
  }
};

export default http.uploadFile;
