/**
 * 设置导航条
 */

export default {
  // 设置当前页面的标题
  setTitle(options) {
    if (!options) return;
    const { title } = Object.assign(
      {},
      options.title ? options : { title: options }
    );
    return new Promise((resolve, reject) => {
      uni.setNavigationBarTitle({
        title,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 设置页面导航条颜色
  setColor(options = {}) {
    const { frontColor, backgroundColor, animation } = Object.assign(
      {},
      options
    );
    return new Promise((resolve, reject) => {
      uni.setNavigationBarColor({
        frontColor,
        backgroundColor,
        animation,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 设置页面导航条颜色
  showLoading(options = {}) {
    return new Promise((resolve, reject) => {
      uni.showNavigationBarLoading({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 设置页面导航条颜色
  hideLoading(options = {}) {
    return new Promise((resolve, reject) => {
      uni.hideNavigationBarLoading({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 隐藏返回首页按钮
  hideHomeButton(options = {}) {
    return new Promise((resolve, reject) => {
      uni.hideHomeButton({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  }
};
