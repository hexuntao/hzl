/**
 * 调起设置媒体相关
 */

export default {
  //从本地相册选择图片或使用相机拍照。
  chooseImage(options = {}) {
    const { count, sizeType, sourceType } = Object.assign({}, options);
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: count || 1, //默认1
        sizeType: sizeType || ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: sourceType || ["album", "camera"],
        success(res) {
          console.log(JSON.stringify(res));
          resolve(res);
        },
        fail() {
          reject();
        }
      });
    });
  }
};
