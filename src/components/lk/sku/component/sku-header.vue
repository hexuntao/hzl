<template>
  <view class="sku-header">
    <view class="img-wrap">
      <image
        :src="goodsImg"
        class="image"
        mode="aspectFit"
        @click="previewImage"
      />
    </view>
    <view class="goods-info">
      <slot />
      <view class="stock-quota">
        <view v-if="!hideStock" class="sku__stock">{{ stockText }}</view>
        <view v-if="!hideQuotaText && quotaText" class="sku__quota">
          {{ quotaText }}
        </view>
      </view>
      <view class="spec-text" v-if="!info.noEditNum">
        {{ specText }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "sku-header",

  props: {
    sku: Object,
    info: Object,
    selectedSku: Object,
    action: String,
    specText: String,

    skuStockNum: Number,
    quota: Number,
    quotaUsed: Number,
    hideStock: Boolean,
    hideQuotaText: Boolean,
    customStepperConfig: Object
  },

  computed: {
    goodsImg() {
      const sId = this.selectedSku.s1 ? "s1" : "s0";
      let s1Id = this.selectedSku[sId];
      const skuImg = this.getSkuImg(s1Id, sId);
      // 优先使用选中sku的图片
      return skuImg || this.info.picture;
    },

    stock() {
      const { stockNum } = this.customStepperConfig;
      if (stockNum !== undefined) {
        return stockNum;
      }
      // if (this.selectedSkuComb) {
      //   return this.selectedSkuComb.stock || 0;
      // }
      return this.skuStockNum;
    },

    stockText() {
      const { stockFormatter } = this.customStepperConfig;
      if (stockFormatter) return stockFormatter(this.stock);

      return `库存${this.stock}件`;
    },

    quotaText() {
      const { quotaText, hideQuotaText } = this.customStepperConfig;

      if (hideQuotaText) return "";

      let text = "";

      if (quotaText) {
        text = quotaText;
      } else if (this.quota > 0) {
        text = `限购${this.quota}件`;
      }

      return text;
    }

    // specText() {
    //   return "请选择规格";
    // }
  },

  methods: {
    getSkuImg(id, s) {
      if (!id) return;

      // 目前skuImg都挂载在skuTree中s那类sku上
      const treeItem =
        this.sku.tree.filter(treeItem => treeItem.k_s === s)[0] || {};

      if (!treeItem.v) {
        return;
      }

      const matchedSku = treeItem.v.filter(skuValue => skuValue.id === id)[0];
      if (matchedSku && matchedSku.imgUrl) {
        return matchedSku.imgUrl;
      }
    },
    previewImage() {
      if (this.goodsImg) {
        uni.previewImage({
          urls: [this.goodsImg]
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sku-header {
  margin-left: 30rpx;
  padding-top: 30rpx;
  display: flex;
  position: relative;
  // &::after {
  //   content: " ";
  //   position: absolute;
  //   pointer-events: none;
  //   box-sizing: border-box;
  //   left: 30rpx;
  //   right: 0;
  //   bottom: 0;
  //   transform: scaleY(0.5);
  //   border-bottom: 2rpx solid $border-color;
  // }
  .img-wrap {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 4rpx;
    flex: none;
    .image {
      position: absolute;
      border-radius: 4rpx;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .goods-info {
    flex: 1;
    padding: 10rpx 100rpx 10rpx 20rpx;
    min-height: 160rpx;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .goods-name {
    font-size: $font-size-sm;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .price-symbol {
    vertical-align: middle;
  }
  .price-num {
    font-size: $font-size-lg;
    vertical-align: middle;
  }
  .goods-price {
    color: $red;
    margin-top: 20rpx;
    vertical-align: middle;
  }
  .btn-close-icon {
    top: 20rpx;
    right: 30rpx;
    font-size: 20px;
    color: $text-light;
    position: absolute;
    text-align: center;
  }
  .stock-quota {
    display: flex;
    margin: 12rpx 0;
  }

  .sku__stock {
    display: inline-flex;
    margin-right: 20rpx;
    color: $text-light;
    font-size: $font-size-sm;
  }

  .sku__quota {
    display: inline-flex;
    color: $red;
    font-size: $font-size-sm;
  }
  .spec-text {
    font-size: $font-size-sm;
    color: $text-gray;
  }
}
</style>
