/**
 * storage
 */

import $Store from "@/store";
import envConfig from "@/config";

export default {
  /**
   * 存储
   * @param {string} key 键
   * @param {any} data 值
   * @param {boolean} isAsyn 是否异步(默认false)
   */
  set(k, data, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默认加上app应用名称
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.setStorage({
          key,
          data,
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      uni.setStorageSync(key, data);
    }
  },
  // h5浏览器session
  setSession(k, data) {
    // #ifdef H5
    const appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默认加上app应用名称
    const key = (appName + k).toUpperCase();
    sessionStorage.setItem(key, JSON.stringify(data));
    // #endif
  },
  /**
   * 获取存储
   * @param {string} key 键
   * @param {boolean} isAsyn 是否异步(默认false)
   */
  get(k, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默认加上app应用名称
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key,
          success(res) {
            resolve(res);
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      return uni.getStorageSync(key);
    }
  },
  // h5浏览器session
  getSession(k) {
    // #ifdef H5
    const appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默认加上app应用名称
    const key = (appName + k).toUpperCase();
    return JSON.parse(sessionStorage.getItem(key));
    // #endif
  },
  /**
   * 删除存储
   * @param {string} key 键
   * @param {boolean} isAsyn 是否异步(默认false)
   */
  remove(k, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默认加上app应用名称
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.removeStorage({
          key,
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      return uni.removeStorageSync(key);
    }
  },
  /**
   * 清空存储
   * @param {boolean} isAsyn 是否异步(默认false)
   */
  clear(isAsyn) {
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.clearStorage({
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      uni.clearStorageSync();
    }
  }
};
