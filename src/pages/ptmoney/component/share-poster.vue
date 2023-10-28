<template>
  <view class="share-poster">
    <slot name="header">
      <view class="popup-poster-close" v-if="showClose">
        <lk-icon name="close" size="24" square color="#ffffff" @click="close" />
      </view>
    </slot>
    <view class="poster-box">
      <view class="poster">
        <view v-if="stateText" class="state-text">{{ stateText }}</view>
        <block v-if="isSuperPoster">
          <image
            class="image super-poster-image"
            v-if="!stateText && poster.path"
            :src="poster.path"
            mode="aspectFit"
            @click="previewImage"
          />
        </block>
        <block v-else>
          <!-- #ifndef H5 -->
          <image
            class="image"
            v-if="!stateText && poster.path"
            :src="poster.path"
            mode="widthFix"
            @click="previewImage"
          />
          <!--  #endif -->
          <!-- #ifdef H5 -->
          <img
            class="image"
            v-if="!stateText && poster.path"
            :src="poster.path"
            mode="widthFix"
            @click="previewImage"
          />
          <!--  #endif -->
        </block>
        <!-- #ifndef H5 -->
        <view class="btn-dow" v-if="!stateText && poster.path">
          <lk-icon
            class-prefix="v-icon"
            name="v-icon-download"
            size="16"
            color="#ffffff"
            @click="downloadImage"
          />
        </view>
        <!--  #endif -->
      </view>
    </view>
    <view class="btn-group">
      <view
        class="item"
        v-for="(item, index) in opItems"
        :key="index"
        @click="opClick(item.action)"
      >
        <lk-button type="text" open-type="share" v-if="item.action == 'wechat'">
          <view class="box">
            <image class="image" :src="item.src" />
            <view class="text">
              {{ item.text }}
            </view>
          </view>
        </lk-button>
        <block v-else>
          <image class="image" :src="item.src" />
          <view class="text">
            {{ item.text }}
          </view>
        </block>
      </view>
    </view>
    <view class="canvas-view">
      <canvas
        class="hide-canvas"
        canvas-id="distribute-canvas"
        :style="{
          width: (poster.width || 0) + 'px',
          height: (poster.height || 0) + 'px'
        }"
      ></canvas>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import getPoster from "@/common/utils/poster";
import $System from "@/api/system";
import { GET_IMGTOBASE64 } from "@/common/interface/config";

// #ifdef APP-PLUS
import $Plugins from "@/api/plugins";
// #endif

export default {
  data() {
    return {
      loading: true,
      loadErr: false,
      isSuperPoster: false,
      poster: {
        width: 0,
        height: 0,
        path: ""
      },
      canvasId: "distribute-canvas"
    };
  },
  props: {
    showClose: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts,
      memberInfo: ({ member }) => member.info
    }),
    ...mapGetters({
      extendCode: "extendCode",
      shareParams: "shareParams",
      routeInfo: "route",
      static: "static"
    }),
    shareLink() {
      // 分享链接为商城首页链接
      return (
        this.routeInfo.origin + "/pages/mall/index?" + this.shareParams.query
      );
    },
    stateText() {
      let text = "";
      if (this.loading) {
        text = "海报生成中...";
      }
      if (this.loadErr) {
        text = "海报生成失败";
      }
      return text;
    },
    opItems() {
      let arr = [];
      // #ifndef H5
      arr.push(
        {
          src: this.static.baseImgPath + "poster-icon-wechat.png",
          text: "分享到微信",
          action: "wechat"
        },
        {
          src: this.static.baseImgPath + "poster-icon-invite.png",
          text: "复制邀请码",
          action: "code"
        }
      );
      // #endif
      // #ifdef H5
      arr.push(
        {
          src: this.static.baseImgPath + "poster-icon-link.png",
          text: "复制链接",
          action: "link"
        },
        {
          src: this.static.baseImgPath + "poster-icon-invite.png",
          text: "复制邀请码",
          action: "code"
        }
      );
      // #endif
      return arr;
    }
  },
  methods: {
    ...mapActions(["getPosterImg", "getConfig", "getMemberInfo", "getMpCode"]),
    init() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.getMemberInfo().then(() => {
          this.getPosterImg({
            poster_type: 1,
            // #ifdef MP-WEIXIN
            mp_page: this.shareParams.pagePath
            // #endif
          })
            .then(({ path, width, height }) => {
              this.poster.path = path;
              this.poster.width = width == 640 ? width : width / 2;
              this.poster.height = height == 1008 ? height : height / 2;
              this.loading = false;
              this.isSuperPoster = true;
              resolve();
            })
            .catch(() => {
              // 默认海报
              this.isSuperPoster = false;
              this.buildPoster()
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            });
        });
      });
    },
    reset() {
      this.loading = true;
      this.loadErr = false;
      this.isSuperPoster = false;
      this.poster = {
        width: 0,
        height: 0,
        path: ""
      };
    },
    close() {
      if (!this.loading) {
        this.$emit("close");
      }
    },
    buildPoster() {
      return new Promise((resolve, reject) => {
        getPoster({
          _this: this,
          type: "posterType",
          formData: {},
          posterCanvasId: this.canvasId,
          delayTimeScale: 20,
          backgroundImage:
            this.static.baseImgPath + "distribute-poster-bg.png?t=20201215",
          drawArray: ({ bgObj, type, bgScale }) => {
            let fontSize = 0.04 * bgObj.width;
            let fontFamily = "Helvetica Neue, Helvetica, sans-serif";
            let lineHeight = fontSize * 1.2;
            let qrW = 180; // 二维码宽度
            let tW = 100; // 头像宽度
            let tAddTextW = 50 + tW + 15; //头像 与文案宽
            let textW = 150; // 文案宽度
            return new Promise((resolve, reject) => {
              // console.log(this.shareParams, this.routeInfo);
              let arr = [];
              arr.push(
                {
                  type: "text",
                  text: this.memberInfo.name,
                  size: fontSize,
                  color: "#323233",
                  dx: tAddTextW,
                  dy: bgObj.height - 185,
                  fontFamily: fontFamily,
                  lineFeed: {
                    maxWidth: bgObj.width - tW - qrW - 150,
                    lineHeight: lineHeight,
                    lineNum: 1,
                    dx: -1
                  }
                },
                {
                  type: "text",
                  text: "邀请与您一起",
                  size: fontSize * 0.85,
                  color: "#606266",
                  dx: tAddTextW,
                  dy: bgObj.height - 140,
                  fontFamily: fontFamily,
                  infoCallBack(w) {
                    textW = w;
                  }
                },
                {
                  type: "text",
                  text: "分享赚钱",
                  size: fontSize * 0.85,
                  color: "#e4812b",
                  dy: bgObj.height - 140,
                  fontFamily: fontFamily,
                  infoCallBack(w) {
                    return {
                      dx: tAddTextW + textW + 5
                    };
                  }
                }
              );
              this.getBase64Src({ img: this.memberInfo.member_img }).then(
                avatar => {
                  arr.push({
                    type: "image",
                    url: avatar,
                    dWidth: tW,
                    dHeight: tW,
                    dx: 50,
                    dy: bgObj.height - 215
                  });
                  // #ifdef MP-WEIXIN
                  this.getMpCode({
                    page: "pages/mall/index",
                    scene: this.shareParams.scene,
                    width: qrW
                  }).then(src => {
                    arr.push({
                      type: "image",
                      url: src,
                      dWidth: qrW,
                      dHeight: qrW,
                      dx: bgObj.width - qrW - 60,
                      dy: bgObj.height - qrW - 75
                    });
                    resolve(arr);
                  });
                  // #endif

                  // #ifndef MP-WEIXIN
                  arr.push({
                    type: "qrcode",
                    text: this.shareLink,
                    size: qrW,
                    dx: bgObj.width - qrW - 60,
                    dy: bgObj.height - qrW - 75
                  });
                  resolve(arr);
                  // #endif
                }
              );
            });
          },
          setCanvasWH: ({ bgObj, type, bgScale }) => {
            this.poster.width = bgObj.width;
            this.poster.height = bgObj.height;
          }
        })
          .then(res => {
            this.poster.path = res.poster.tempFilePath;
            this.loading = false;
            this.$Prompt.clear();
            resolve();
          })
          .catch(error => {
            this.loadErr = true;
            this.loading = false;
            this.poster.path = "";
            // this.$Prompt.modal({ content: JSON.stringify(error) });
            this.$Prompt.clear();
            reject();
          });
      });
    },
    previewImage() {
      if (this.poster.path) {
        uni.previewImage({
          urls: [this.poster.path]
        });
      }
    },
    downloadImage() {
      if (this.isSuperPoster) {
        uni.downloadFile({
          url: this.poster.path,
          success: res => {
            // console.log(res, $this.poster.path);
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  this.$Prompt.toast("保存成功");
                },
                fail: err => {
                  // #ifdef MP-WEIXIN
                  uni.getSetting({
                    complete: ({ authSetting }) => {
                      if (!authSetting["scope.writePhotosAlbum"]) {
                        this.$Prompt
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
                        this.$Prompt.toast(err.errMsg);
                      }
                    }
                  });
                  // #endif
                }
              });
            } else {
              this.$Prompt.toast(res.errMsg);
            }
          },
          fail: ({ errMsg }) => {
            this.$Prompt.toast(errMsg);
          }
        });
      } else {
        uni.saveImageToPhotosAlbum({
          filePath: this.poster.path,
          success: () => {
            this.$Prompt.toast("保存成功");
          },
          fail: err => {
            // #ifdef MP-WEIXIN
            uni.getSetting({
              complete: ({ authSetting }) => {
                if (!authSetting["scope.writePhotosAlbum"]) {
                  this.$Prompt
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
                  this.$Prompt.toast(err.errMsg);
                }
              }
            });
            // #endif
          }
        });
      }
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
    opClick(action) {
      if (action == "link") {
        if (!this.extendCode) {
          return this.$Prompt.toast("加载中，请稍后重试。。。");
        }
        $System.setClipboardData(this.shareLink);
      }
      if (action == "code") {
        if (!this.extendCode) {
          return this.$Prompt.toast("加载中，请稍后重试。。。");
        }
        $System.setClipboardData(this.extendCode);
      }
      if (action == "wechat") {
        if (!this.poster.path) {
          return this.$Prompt.toast("加载中，请稍后重试。。。");
        }
        // #ifdef APP-PLUS
        uni.share({
          provider: "weixin",
          scene: "WXSceneSession",
          type: 2,
          imageUrl: this.poster.path,
          success: res => {
            this.$Prompt.toast("分享成功");
          },
          fail: err => {
            this.$Prompt.modal({
              content: JSON.stringify(err),
              showCanlane: false
            });
          }
        });
        // #endif
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.share-poster {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
}

.popup-poster-close {
  display: flex;
  justify-content: center;
}

.poster-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.poster {
  width: 72%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
    display: block;
  }
  .super-poster-image {
    width: 540rpx;
    height: 828rpx;
    display: block;
  }
  .state-text {
    width: 540rpx;
    height: 828rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
  }
  .btn-dow {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    right: 10rpx;
    top: 10rpx;
    width: 80rpx;
    height: 40rpx;
  }
}
.btn-group {
  display: flex;
  justify-content: center;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 40rpx;
    .image {
      width: 90rpx;
      height: 90rpx;
      margin: 20rpx;
    }
    .text {
      color: #ffffff;
      font-size: $font-size;
    }
  }
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.canvas-view {
  position: absolute;
  left: -99999rpx;
}

.hide-canvas {
  position: fixed;
  top: -99999rpx;
  left: -99999rpx;
  z-index: -99999;
}
</style>
