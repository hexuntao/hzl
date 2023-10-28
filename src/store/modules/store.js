// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
// #endif

import $Prompt from "@/api/prompt";

// 将腾讯/高德地图经纬度转换为百度地图经纬度
const txMapTransBMap = (lng, lat) => {
  if (!lng && !lat) {
    return {
      lng: "",
      lat: ""
    };
  }
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  let x = lng;
  let y = lat;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta) + 0.0065;
  let lats = z * Math.sin(theta) + 0.006;
  return {
    lng: lngs,
    lat: lats
  };
};

// 将百度地图经纬度转换为腾讯/高德地图经纬度
const bMapTransTxMap = (lng, lat) => {
  if (!lng && !lat) {
    return {
      lng: "",
      lat: ""
    };
  }
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta);
  let lats = z * Math.sin(theta);
  return {
    lng: lngs,
    lat: lats
  };
};

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    /**
     * 获取经纬度
     * @param {Object} options
     */
    getLocation({ rootState }, options = {}) {
      return new Promise((resolve, reject) => {
        if (options.showLoading) {
          $Prompt.loading("获取经纬度");
        }
        // #ifdef H5
        if (process.env.NODE_ENV === "development") {
          // h5开发环境默认返回空
          resolve({ lat: "", lng: "" });
          if (options.showLoading) {
            $Prompt.clear();
          }
          return false;
        }
        // #endif
        if (rootState.isWeixin) {
          wxSdk
            .wxGetLocation()
            .then(res => {
              // 最终转换成百度经纬度
              const location = txMapTransBMap(res.longitude, res.latitude);
              resolve(location);
              if (options.showLoading) {
                $Prompt.clear();
              }
            })
            .catch(() => {
              resolve({
                lat: "",
                lng: ""
              });
              if (options.showLoading) {
                $Prompt.clear();
              }
            });
        } else {
          uni.getLocation({
            // #ifdef H5
            type: "wgs84",
            // #endif
            // #ifndef H5
            type: "gcj02",
            // #endif
            // #ifdef APP-PLUS
            geocode: true,
            // #endif
            complete: res => {
              // 最终转换成百度经纬度
              const location = txMapTransBMap(res.longitude, res.latitude);
              resolve(location);
              if (options.showLoading) {
                $Prompt.clear();
              }
            }
          });
        }
      });
    }
  }
};
