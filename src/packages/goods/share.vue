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
      <lk-goods-info-panel
        :name="info.title"
        :price="info.goodsPrice"
        :origin-price="info.marketPrice"
      />
    </view>
    <view class="canvas-view">
      <canvas
        class="hide-canvas"
        canvas-id="goods-share-canvas"
        :style="{
          width: (poster.width || 0) + 'px',
          height: (poster.height || 0) + 'px'
        }"
      ></canvas>
    </view>
  </view>
</template>

<script>
import { GET_GOODSSHAREINFO } from "@/common/interface/goods";
import getPoster from "@/common/utils/poster";
import { mapActions, mapGetters } from "vuex";
import { GET_IMGTOBASE64 } from "@/common/interface/config";
export default {
  name: "packages-goods-share",
  data() {
    return {
      params: {
        goods_id: 0
      },
      info: {
        title: "",
        goodsPrice: "",
        marketPrice: ""
      },
      loading: true,
      poster: {
        width: 0,
        height: 0,
        path: ""
      },
      canvasId: "goods-share-canvas"
    };
  },
  computed: {
    ...mapGetters({
      static: "static"
    })
  },
  onLoad(query) {
    this.params.goods_id = query.goods_id || "";
    this.getData();
  },
  methods: {
    ...mapActions(["getMpCode"]),
    getData() {
      GET_GOODSSHAREINFO(this.params).then(({ data }) => {
        this.info.title = data.goods_name;
        this.info.goodsPrice = data.price;
        this.info.marketPrice = data.market_price;
        this.info.image = data.image;
        this.setWxShare({
          title: data.goods_name,
          imgUrl: data.image,
          path: "packages/goods/detail",
          desc: `发现了一个很不错的商品，赶快来看看吧。`
        });
        this.buildPoster();
      });
    },
    async buildPoster() {
      const picture = await this.getBase64Src({ img: this.info.image });
      getPoster({
        _this: this,
        type: "posterType",
        formData: {},
        posterCanvasId: this.canvasId,
        delayTimeScale: 20,
        backgroundImage: picture,
        drawArray: ({ bgObj, type, bgScale }) => {
          return new Promise((resolve, reject) => {
            console.log(this.shareParams);
            let imgW = bgObj.width / 4;
            let arr = [];
            // #ifdef MP-WEIXIN
            this.getMpCode({
              page: this.shareParams.pagePath,
              scene: this.shareParams.scene,
              width: 180
            }).then(src => {
              arr.push({
                type: "image",
                url: src,
                dWidth: imgW,
                dHeight: imgW,
                dx: bgObj.width - imgW,
                dy: bgObj.height - imgW
              });
              resolve(arr);
            });
            // #endif

            // #ifndef MP-WEIXIN
            arr.push({
              type: "qrcode",
              text: this.shareParams.link,
              size: imgW,
              dx: bgObj.width - imgW,
              dy: bgObj.height - imgW
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
.cell-group {
  margin: 20rpx 0;
}
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
