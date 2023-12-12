/**
 * 交互反馈
 */

export default {
  toast(options = {}) {
    if (!options) return;
    const { title, icon, image, mask, duration, position } = Object.assign(
      {},
      options.title ? options : { title: options }
    );
    return new Promise((resolve, reject) => {
      uni.showToast({
        title,
        icon: icon || "none",
        image,
        mask,
        duration: duration || 2000,
        position,
        success(res) {
          setTimeout(() => {
            resolve(res);
          }, 100);
        },
        fail() {
          reject();
        }
      });
    });
  },
  loading(options) {
    const { title, mask } = Object.assign(
      {},
      typeof options == "string" ? { title: options } : { ...options }
    );
    return new Promise((resolve, reject) => {
      uni.showLoading({
        title: title || "",
        mask: typeof mask == "boolean" ? mask : true,
        success(res) {
          resolve(res);
        },
        fail() {
          reject();
        }
      });
    });
  },
  clear(options = {}) {
    if (!options) return;
    uni.hideLoading();
  },
  modal(options = {}) {
    if (!options) return;
    const {
      title,
      content,
      showCancel,
      cancelText,
      cancelColor,
      confirmText,
      confirmColor
    } = Object.assign({}, options.content ? options : { content: options });
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title || "",
        content: String(content),
        showCancel: typeof showCancel == "boolean" ? showCancel : true,
        cancelText: cancelText || "取消",
        cancelColor: cancelColor || "#323233",
        confirmText: confirmText || "确定",
        confirmColor: confirmColor || "#3388ff",
        complete(res) {
          if (res.confirm) {
            resolve(res);
          } else {
            reject();
          }
        }
      });
    });
  }
};
