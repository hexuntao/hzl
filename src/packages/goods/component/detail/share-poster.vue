<template>
  <view class="share-poster">
    <lk-popup v-model="showPoster" round prevent-touchmove>
      <view
        class="poster-image"
        :style="{
          width: (poster.width || 0) + 'rpx',
          height: (poster.height || 0) + 'rpx'
        }"
      >
        <!-- #ifndef H5 -->
        <image
          :src="poster.path"
          class="image"
          mode="aspectFit"
          @click="previewImage"
          @error="onPosterError"
        />
        <!--  #endif -->
        <!-- #ifdef H5 -->
        <img
          :src="poster.path"
          class="image"
          mode="aspectFit"
          @click="previewImage"
          @error="onPosterError"
        />
        <!--  #endif -->
      </view>
      <!-- #ifdef H5 -->
      <view class="poster-foot">
        <view class="tip">{{ posterTip.save }}</view>
        <view class="tip">{{ posterTip.share }}</view>
      </view>
      <!--  #endif -->
      <!-- #ifndef H5 -->
      <view class="poster-foot poster-foot-btn">
        <lk-button
          class="btn"
          size="small"
          round
          block
          type="danger"
          :color="theme.color"
          @click="onSavePoster"
        >
          保存海报
        </lk-button>
        <lk-button
          class="btn"
          size="small"
          round
          block
          type="danger"
          :color="theme.color"
          open-type="share"
          @click="onSharePoster"
        >
          分享海报
        </lk-button>
      </view>
      <!--  #endif -->
    </lk-popup>
    <view class="canvas-view">
      <canvas
        class="hide-canvas"
        canvas-id="goods-canvas"
        :style="{
          width: (poster.width || 0) + 'px',
          height: (poster.height || 0) + 'px'
        }"
      ></canvas>
    </view>
  </view>
</template>

<script>
import getPoster from "@/common/utils/poster";
import { yuan } from "@/common/utils";
import { mapActions, mapGetters } from "vuex";
import { isWeixin } from "@/common/utils";
import { GET_IMGTOBASE64 } from "@/common/interface/config";

// #ifdef APP-PLUS
import $Plugins from "@/api/plugins";
// #endif

var isSuperPoster = false; // 是否超级海报

export default {
  data() {
    return {
      poster: {
        width: 0,
        height: 0,
        path: ""
      },
      showPoster: false,
      canvasId: "goods-canvas"
    };
  },
  props: {
    info: Object
  },
  watch: {
    "info.id"(e) {
      if (e) {
        this.poster = {};
      }
    }
  },
  computed: {
    ...mapGetters({ routeInfo: "route", static: "static" }),
    posterTip() {
      return {
        save: isWeixin() ? "长按图片可保存图片或分享" : "长按图片可保存图片",
        share: isWeixin()
          ? "如需链接分享，请点击右上角进行分享"
          : "如需链接分享，请点击下方进行分享"
      };
    }
  },
  methods: {
    ...mapActions(["getPosterImg", "getMpCode"]),
    buildPoster() {
      const $this = this;
      if ($this.poster.path) {
        $this.showPoster = true;
        return false;
      }

      $this.$Prompt.loading("海报生成中");

      // 超级海报
      $this
        .getPosterImg({
          poster_type: 2,
          goods_id: $this.info.id,
          // #ifdef MP-WEIXIN
          mp_page: this.shareParams.pagePath
          // #endif
        })
        .then(({ path, width, height }) => {
          isSuperPoster = true;
          $this.poster = {
            width: width == 640 ? width : width / 2,
            height: height == 1008 ? height : height / 2,
            path: path
          };
          $this.showPoster = true;
          $this.$Prompt.clear();
        })
        .catch(() => {
          isSuperPoster = false;
          $this.getGoodsPoster();
        });
    },
    // 商品海报
    getGoodsPoster() {
      getPoster({
        _this: this,
        type: "posterType",
        formData: {},
        posterCanvasId: this.canvasId,
        delayTimeScale: 20,
        background: {
          width: 600,
          height: 800,
          backgroundColor: "#ffffff"
        },
        drawArray: ({ bgObj, type, bgScale }) => {
          const fontSize = 0.0467 * bgObj.width;
          const lineHeight = fontSize * 1.2;
          let posterPriceW = 40;
          return new Promise(async (resolve, reject) => {
            console.log(this.shareParams.link);
            const picture = await this.getBase64Src({ img: this.info.picture });
            let arr = [
              {
                type: "image",
                url: picture,
                dx: 0,
                dy: 0,
                dWidth: bgObj.width,
                dHeight: bgObj.width
              },
              {
                type: "text",
                text: this.info.title,
                size: fontSize,
                color: "#323233",
                dx: 25,
                dy: bgObj.width + 50,
                fontFamily: "Helvetica Neue, Helvetica, sans-serif",
                lineFeed: {
                  maxWidth: bgObj.width - 220,
                  lineHeight: lineHeight,
                  lineNum: 2,
                  dx: -1
                }
              },
              {
                type: "text",
                text: "¥",
                size: fontSize * 0.9,
                color: "#f44",
                dx: 25,
                dy: bgObj.width + 80 + lineHeight * 2,
                fontWeight: "bold",
                infoCallBack(text) {
                  posterPriceW = text;
                }
              },
              {
                type: "text",
                text: parseFloat(this.info.posterPrice) || 0,
                size: fontSize * 1.5,
                color: "#f44",
                dx: 50,
                dy: bgObj.width + 80 + lineHeight * 2,
                fontWeight: "bold",
                infoCallBack(text) {
                  posterPriceW = text + 10;
                }
              },
              {
                type: "text",
                text: yuan(this.info.marketPrice),
                size: fontSize * 0.8,
                color: "#909399",
                dy: bgObj.width + 80 + lineHeight * 2,
                lineThrough: {
                  style: "#909399"
                },
                infoCallBack(text) {
                  return {
                    dx: posterPriceW + 70
                  };
                }
              }
            ];
            // #ifdef MP-WEIXIN
            this.getMpCode({
              page: this.shareParams.pagePath,
              scene: this.shareParams.scene,
              width: 150
            }).then(src => {
              arr.push({
                type: "image",
                url: src,
                dx: bgObj.width - 175,
                dy: bgObj.width + 25,
                dWidth: 150,
                dHeight: 150
              });
              resolve(arr);
            });
            // #endif

            // #ifndef MP-WEIXIN
            arr.push({
              type: "qrcode",
              text: this.shareParams.link,
              size: 150,
              dx: bgObj.width - 175,
              dy: bgObj.width + 25
            });
            resolve(arr);
            // #endif
          });
        },
        setCanvasWH: ({ bgObj, type, bgScale }) => {
          this.poster = bgObj;
        }
      })
        .then(res => {
          this.poster.path = res.poster.tempFilePath;
          this.showPoster = true;
          this.$Prompt.clear();
        })
        .catch(error => {
          this.$Prompt.modal({ content: error });
          this.$Prompt.clear();
        });
    },
    getBase64Src(option = {}) {
      return new Promise((resolve, reject) => {
        GET_IMGTOBASE64(option)
          .then(({ data }) => {
            resolve(data || this.static.baseImgPath + "no-avatar.png");
          })
          .catch(() => {
            resolve(this.static.baseImgPath + "no-avatar.png");
          });
      });
    },
    // 海报图片出错时
    onPosterError(e) {
      this.poster.path = "";
    },
    // 保存海报
    onSavePoster() {
      const $this = this;
      if (isSuperPoster) {
        uni.downloadFile({
          url: $this.poster.path,
          success(res) {
            // console.log(res, $this.poster.path);
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(e) {
                  $this.$Prompt.toast("保存成功");
                },
                fail(err) {
                  // #ifdef MP-WEIXIN
                  uni.getSetting({
                    complete: ({ authSetting }) => {
                      if (!authSetting["scope.writePhotosAlbum"]) {
                        $this.$Prompt
                          .modal({
                            title: "提示",
                            content:
                              "检测到您保存到相册权限未开启，是否前往设置开启？"
                          })
                          .then(() => {
                            uni.openSetting({
                              complete: set => {}
                            });
                          });
                      } else {
                        $this.$Prompt.toast(err.errMsg);
                      }
                    }
                  });
                  // #endif
                }
              });
            } else {
              $this.$Prompt.toast(res.errMsg);
            }
          },
          fail({ errMsg }) {
            $this.$Prompt.toast(errMsg);
          }
        });
      } else {
        uni.saveImageToPhotosAlbum({
          filePath: this.poster.path,
          success() {
            $this.$Prompt.toast("保存成功");
          },
          fail(err) {
            // #ifdef MP-WEIXIN
            uni.getSetting({
              complete: ({ authSetting }) => {
                if (!authSetting["scope.writePhotosAlbum"]) {
                  $this.$Prompt
                    .modal({
                      title: "提示",
                      content:
                        "检测到您保存到相册权限未开启，是否前往设置开启？"
                    })
                    .then(() => {
                      uni.openSetting({
                        complete: set => {}
                      });
                    });
                } else {
                  $this.$Prompt.toast(err.errMsg);
                }
              }
            });
            // #endif
          }
        });
      }
    },
    // app分享
    onSharePoster() {
      // #ifdef APP-PLUS
      $Plugins.shareWithSystem({
        type: "image",
        summary: this.info.title,
        imageUrl: this.poster.path,
        href: this.shareParams.link
      });
      // #endif
    },
    toCart() {
      this.$Navigate.push("/pages/mall/cart");
    },
    previewImage() {
      if (this.poster.path) {
        uni.previewImage({
          urls: [this.poster.path]
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.share-poster {
  position: relative;
}

.poster-image {
  width: 100%;
  .image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.btn-cart {
  right: 120rpx;
  top: 30rpx;
}

.btn-share {
  right: 30rpx;
  top: 30rpx;
}

.canvas-view {
  position: relative;
}

.hide-canvas {
  position: fixed;
  top: -99999rpx;
  left: -99999rpx;
  z-index: -99999;
}

.poster-foot {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 30rpx;
  background: #fff;
  .tip {
    line-height: 32rpx;
    color: $text-light;
    font-size: $font-size-sm;
  }
}
.poster-foot-btn {
  flex-flow: row;
  .btn {
    margin: 0 20rpx;
    flex: 1;
  }
}
</style>
