<template>
  <view class="pages">
    <view v-if="loading" class="loading-text">海报获取中...</view>
    <view class="poster-image" v-else>
      <!-- #ifndef H5 -->
      <image
        :src="poster.path"
        class="image"
        mode="widthFix"
        @click="previewImage"
      />
      <!--  #endif -->
      <!-- #ifdef H5 -->
      <img
        :src="poster.path"
        class="image"
        mode="widthFix"
        @click="previewImage"
      />
      <!--  #endif -->
    </view>
    <view class="canvas-view">
      <canvas
        class="hide-canvas"
        canvas-id="microshop-canvas"
        :style="{
          width: (poster.width || 0) + 'px',
          height: (poster.height || 0) + 'px'
        }"
      ></canvas>
    </view>
    <view class="cell-group">
      <lk-cell :value="tips" />
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import $System from "@/api/system";
import getPoster from "@/common/utils/poster";
export default {
  name: "packages-microshop-qrcode",
  data() {
    return {
      loading: true,
      poster: {
        width: 0,
        height: 0,
        path: ""
      },
      canvasId: "microshop-canvas",
      tips:
        "微店小提示：可以通过二维码或微店链接邀请朋友购买微店商品，成交后你将会获得相应比例的返利。"
    };
  },
  computed: {
    ...mapGetters({
      extendCode: "extendCode",
      shareParams: "shareParams",
      static: "static"
    }),
    codeText() {
      return "我的邀请码 " + this.extendCode;
    },
    linkText() {
      return "邀请链接 " + this.shareParams.link;
    }
  },
  onLoad() {
    this.getConfig().then(() => {
      this.getMicroshopInfo().then(info => {
        this.setWxShare({
          title: info.microshop_name,
          imgUrl: info.microshop_logo,
          path: "packages/microshop/home",
          desc: `发现了一个很不错的小店，赶快来看看吧。`,
          query: {
            shopkeeper_id: info.uid
          }
        });
      });
      this.getPosterImg({
        poster_type: 4,
        // #ifdef MP-WEIXIN
        mp_page: this.shareParams.pagePath
        // #endif
      })
        .then(({ path, width, height }) => {
          this.poster.path = path;
          this.loading = false;
        })
        .catch(() => {
          // 默认海报
          this.getMemberInfo().then(() => {
            this.buildPoster();
          });
        });
    });
  },
  methods: {
    ...mapActions([
      "getConfig",
      "getMicroshopInfo",
      "getMemberInfo",
      "getPosterImg",
      "getMpCode"
    ]),
    onCopy(data) {
      $System.setClipboardData(data);
    },
    buildPoster() {
      getPoster({
        _this: this,
        type: "posterType",
        formData: {},
        posterCanvasId: this.canvasId,
        delayTimeScale: 20,
        backgroundImage: this.static.baseImgPath + "poster.jpg",
        drawArray: ({ bgObj, type, bgScale }) => {
          return new Promise((resolve, reject) => {
            console.log(this.shareParams.link);
            let arr = [];
            // #ifdef MP-WEIXIN
            this.getMpCode({
              page: this.shareParams.pagePath,
              scene: this.shareParams.scene,
              width: 260
            }).then(src => {
              arr.push({
                type: "image",
                url: src,
                dWidth: 260,
                dHeight: 260,
                dx: bgObj.width / 2 - 130,
                dy: bgObj.width / 2 - 155
              });
              resolve(arr);
            });
            // #endif

            // #ifndef MP-WEIXIN
            arr.push({
              type: "qrcode",
              text: this.shareParams.link,
              size: 260,
              dx: bgObj.width / 2 - 130,
              dy: bgObj.width / 2 - 155
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
          this.loading = false;
          this.$Prompt.clear();
        })
        .catch(error => {
          this.$Prompt.modal({
            showCancel: false,
            content: JSON.stringify(error)
          });
          this.poster.path = "";
          this.$Prompt.clear();
        });
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
.poster-image {
  width: 100%;
  max-width: 100%;
  .image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.loading-text {
  width: 100%;
  height: 100vw;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}
.cell-group {
  margin: 20rpx 0;
}
.cell-item {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .title {
    color: $red;
    text-align: center;
    font-weight: 800;
    padding-bottom: 20rpx;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
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
</style>
