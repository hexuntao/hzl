<template>
  <view class="goods-card" :class="goodsCardClass" :style="goodsCardStyle">
    <view class="content">
      <view class="image-box">
        <image class="image" :src="image" mode="aspectFill" @click="click" />
        <slot name="imageTags" />
      </view>
      <view class="info">
        <view>
          <slot name="title">
            <view class="title" @click="click">
              <view class="text">
                <lk-tag
                  v-if="tag"
                  type="danger"
                  :color="theme.color"
                  :custom-style="{ marginRight: '5px' }"
                >
                  {{ tag }}
                </lk-tag>
                {{ title }}
              </view>
              <view class="title-right" v-if="$slots['titleRight']">
                <slot name="titleRight" />
              </view>
            </view>
          </slot>
          <slot name="desc">
            <view class="desc" v-if="desc">{{ desc }}</view>
          </slot>
          <slot name="tags" />
        </view>
        <slot name="bottom">
          <view class="bottom">
            <view class="price-group">
              <slot name="price">
                <view class="price" :class="priceClass">
                  {{ priceText }}{{ptmoneyText}}
                </view>
              </slot>

              <view class="origin-price first-letter" v-if="originPriceText">
                {{ originPriceText }}
              </view>
            </view>
            <slot name="num">
              <view class="num" v-if="num">x{{ num }}</view>
            </slot>
          </view>
        </slot>
      </view>
    </view>
    <view v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script>
import { yuan, isDef } from "@/common/utils";
import mixinPriceText from "@/mixins/price-text";
import { formatClass, formatStyle } from "@/common/utils/stringify";
export default {
  data() {
    return {
      cname: "goods-card",
      stepperNum: Number(this.num || 1)
    };
  },
  mixins: [mixinPriceText],
  props: {
    to: {
      type: [String, Object]
    },
    goodsId: [String, Number],
    // 是否积分商品
    isPointGoods: Boolean,
    image: [String, Number],
    title: [String, Number],
    tag: [String, Number],
    desc: [String, Number],
    price: [String, Number],
	ptmoney: [String, Number],
    originPrice: [String, Number],
    num: [String, Number],
    point: [String, Number],
    cellPadding: Boolean,
    // 步进器
    stepper: {
      type: Boolean,
      default: false
    },
    cardSize: {
      type: String
    },
    // 自定义样式
    customStyle: {
      type: [Object],
      default: () => {}
    }
  },
  computed: {
    goodsCardClass() {
      let classs = [this.cardSize, this.cellPadding ? "cell-goods-card" : ""];
      return formatClass(classs);
    },
    goodsCardStyle() {
      let styles = {
        ...this.customStyle
      };
      return formatStyle(styles);
    },
    priceClass() {
      return this.firstLetterClass(this.price, this.point);
    },
    priceText() {
      return this.formatPriceText(this.price, this.point);
    },
	ptmoneyText() {
		if(this.ptmoney!=0 && this.ptmoney!=null){
			return '+'+this.ptmoney+'积分';
		}else{
			return '';
		}
	  
	},
    originPriceText() {
      return this.formatPriceText(this.originPrice);
    }
  },
  methods: {
    stepperChange(e) {
      this.$emit("stepper-change", e);
    },
    click() {
      if (this.to) {
        return this.$Navigate.push(this.to);
      }
      if (this.goodsId) {
        let to = {
          path: this.isPointGoods
            ? "/packages/integral/goods/detail"
            : "/packages/goods/detail",
          query: {
            goods_id: this.goodsId
          }
        };
        return this.$Navigate.push(to);
      }
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
$width: 160rpx;
$height: 160rpx;
$smwidth: 120rpx;
$smheight: 120rpx;
$xswidth: 80rpx;
$xsheight: 80rpx;

.goods-card {
  position: relative;
  box-sizing: border-box;
  padding: 0;
  color: $text-color;
  font-size: $font-size-sm;
  background-color: $white;
  width: 100%;
  .content {
    display: flex;
    flex-flow: row;
    .image-box {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex: none;
      width: $width;
      height: $height;
      margin-right: 16rpx;
      border-radius: 10rpx;
      overflow: hidden;
      .image {
        display: flex;
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
    .info {
      position: relative;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      min-height: $height;
    }
    .title {
      display: flex;
      .text {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        max-height: 64rpx;
        font-weight: 600;
        line-height: 32rpx;
        margin-bottom: 8rpx;
        flex: 1;
      }
      &-right {
        flex: none;
        max-width: 100rpx;
        margin-left: 10rpx;
      }
    }
    .desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-wrap: break-word;
      max-height: 40rpx;
      color: $gray-darker;
      line-height: 40rpx;
    }
    .bottom {
      display: flex;
      flex-flow: row;
      line-height: 40rpx;
      justify-content: space-between;
      align-items: center;
      .price-group {
        display: flex;
        flex-flow: row;
      }
      .price {
        color: $red;
        font-size: $font-size;
      }
      .origin-price {
        color: $gray-dark;
        margin-left: 20rpx;
        text-decoration: line-through;
        font-size: $font-size-xs;
      }
      .num {
        color: $gray-dark;
      }
    }
  }
  .footer {
    flex: none;
    text-align: right;
  }
}

.goods-card.sm .image-box {
  width: $smwidth;
  height: $smheight;
}
.goods-card.sm .info {
  min-height: $smheight;
}
.goods-card.xs .image-box {
  width: $xswidth;
  height: $xsheight;
}
.goods-card.xs .info {
  min-height: $xsheight;
  .title .text {
    -webkit-line-clamp: 1;
  }
}
.cell-goods-card {
  padding: $cell-padding;
}
.cell-goods-card::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
