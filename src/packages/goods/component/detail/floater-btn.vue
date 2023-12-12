<template>
  <view class="floater-btn">
    <view
      class="floater-btn-icon btn-share"
      @click="buildPoster"
      v-if="info.id"
    >
      <lk-icon name="qr" color="#ffffff" square />
    </view>
    <lk-popup v-model="showPoster" round prevent-touchmove>
      <view
        class="poster-image"
        :style="{
          width: (poster.width * 2 || 0) + 'rpx',
          height: (poster.height * 2 || 0) + 'rpx'
        }"
      >
        <image
          :src="poster.path"
          class="image"
          mode="aspectFit"
          @error="onPosterError"
        />
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
    ...mapGetters({ routeInfo: "route" }),
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
            width: width == 640 ? width / 2 : width / 4,
            height: height == 1008 ? height / 2 : height / 4,
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
          width: 400,
          height: 510,
          backgroundColor: "#ffffff"
        },
        drawArray: ({ bgObj, type, bgScale }) => {
          const fontSize = 0.0373334 * bgObj.width;
          const lineHeight = fontSize * 1.8;
          let posterPriceW = 15;
          return new Promise((resolve, reject) => {
            console.log(this.shareParams.link);
            let arr = [
              {
                type: "image",
                url: this.info.picture,
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
                dx: 15,
                dy: bgObj.width + 18,
                fontFamily: "Helvetica Neue, Helvetica, sans-serif",
                lineFeed: {
                  maxWidth: bgObj.width - 100,
                  lineHeight: lineHeight,
                  lineNum: 2,
                  dx: -1
                }
              },
              {
                type: "text",
                text: yuan(this.info.posterPrice),
                size: fontSize * 1.2,
                color: "#f44",
                dx: 15,
                dy: bgObj.width + 65,
                fontWeight: "bold",
                infoCallBack(text) {
                  posterPriceW = text;
                }
              },
              {
                type: "text",
                text: yuan(this.info.marketPrice),
                size: fontSize * 0.9,
                color: "#909399",
                dx: 65,
                dy: bgObj.width + 65,
                lineThrough: {
                  style: "#909399"
                },
                infoCallBack(text) {
                  return {
                    dx: posterPriceW + 20
                  };
                }
              }
            ];
            // #ifdef MP-WEIXIN
            this.getMpCode({
              page: this.shareParams.pagePath,
              scene: this.shareParams.scene,
              width: 60
            }).then(src => {
              arr.push({
                type: "image",
                url: src,
                dx: bgObj.width - 75,
                dy: bgObj.width + 10,
                dWidth: 60,
                dHeight: 60
              });
              resolve(arr);
            });
            // #endif

            // #ifndef MP-WEIXIN
            arr.push({
              type: "qrcode",
              text: this.shareParams.link,
              size: 60,
              dx: bgObj.width - 75,
              dy: bgObj.width + 10
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
            console.log(res, $this.poster.path);
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(e) {
                  $this.$Prompt.toast("保存成功");
                },
                fail({ errMsg }) {
                  $this.$Prompt.toast(errMsg);
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
          fail({ errMsg }) {
            $this.$Prompt.toast(errMsg);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.floater-btn {
  position: relative;
}

.poster-image {
  width: 100%;
  image {
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
