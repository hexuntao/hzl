<template>
  <view class="goods-info-panel">
    <lk-cell>
      <slot name="header">
        <view class="header" :class="headerClasses">
          <view class="price-group" v-if="showPrice">
            <view class="price">
              <view
                class="text"
                :class="priceClass"
                :style="{ color: priceColor }"
              >
                {{ priceText }}
				<text v-if="ptmoney!=0 && ptmoney!=null">+{{ptmoney}}积分</text>
              </view>
              <lk-tag
                custom-class="price-tag"
                round
                size="medium"
                :color="theme.opacity"
                :text-color="theme.color"
                v-if="priceTag"
              >
                {{ priceTag }}
              </lk-tag>
            </view>
            <view class="price-rebate">
              <slot name="originPrice">
                <view
                  class="origin-price first-letter"
                  :style="{ color: priceLightColor }"
                >
                  {{ originPriceText }}
                </view>
              </slot>
              <view class="rebate-group">
                <view class="item" v-if="rebateCommissionText">
                  <text class="fan">CC</text>
                  <text class="text">{{ rebateCommissionText }}</text>
                </view>
                <view class="item" v-if="rebatePointText">
                  <text class="fan">可分配</text>
                  <text class="text">{{ rebatePointText }}</text>
                </view>
              </view>
            </view>
          </view>
          <slot name="headerRight" />
        </view>
      </slot>
      <slot name="promote">
        <view class="promote-text" v-if="promoteText">
          {{ promoteText }}
        </view>
      </slot>
      <slot name="label" />
      <view class="name-group">
        <view class="name-box">
          <lk-tag
            custom-class="name-tag"
            :custom-style="{ marginRight: '10rpx' }"
            :color="theme.color"
            size="medium"
            v-if="nameTag"
          >
            {{ nameTag }}
          </lk-tag>
          <text class="name" :style="{ color: nameColor }">
            {{ name }}
          </text>
        </view>
        <slot name="nameRight" />
      </view>
      <view class="sub-name" v-if="subName">
        <text class="name" :style="{ color: subNameColor }">
          {{ subName }}
        </text>
      </view>
    </lk-cell>
    <lk-cell v-if="(footInfo && footInfo.length) || $slots.footer">
      <slot name="footer">
        <view class="foot">
          <view class="item" span="8" v-for="(f, i) in footInfo" :key="i">
            <text class="foot-name">{{ f.name }}</text>
            <text class="foot-value">{{ f.value }}</text>
          </view>
        </view>
      </slot>
    </lk-cell>
  </view>
</template>

<script>
import { formatClass } from "@/common/utils/stringify";
import { yuan, isDef,bi } from "@/common/utils";
import { mapState } from "vuex";
const defaultInfo = {
  name: "", //商品名称
  nameTag: "", //商品名称标签
  price: "", //商品价格
  
  
  
  originPrice: "", //商品原价
  priceTag: "", //商品价格标签
  showPrice: true, //显示价格（默认显示）
  promoteText: "", //活动额外文案
  subName: "", //副标题
  rebateCommission: "", //反返佣金
  rebatePoint: "", //反返积分
  footInfo: [
    {
      name: "运费",
      value: ""
    },
    {
      name: "销量",
      value: ""
    }
  ] //商品底部信息
};
export default {
  data() {
    return {};
  },
  props: {
	  ptmoney:[String, Number],
    name: [String, Number],
    nameTag: [String, Number],
    subName: [String, Number],
    price: [String, Number],
    originPrice: [String, Number],
    point: [String, Number],
    priceTag: [String, Number],
    showPrice: {
      type: Boolean,
      default: true
    },
    promoteText: [String, Number],
    footInfo: [Array, String],
    priceColor: String,
    priceLightColor: String,
    nameColor: String,
    subNameColor: String,
    rebateCommission: [String, Number],
    rebatePoint: [String, Number]
  },
  computed: {
    ...mapState({
      memberText: ({ member }) => member.texts,
      distributeText: ({ distribute }) => distribute.texts
    }),
    headerClasses() {
      return formatClass({ "header-block": !this.showPrice });
    },
    priceClass() {
      return formatClass([
        parseFloat(this.point) > 0 && parseFloat(this.price) <= 0
          ? ""
          : "first-letter"
      ]);
    },
    priceText() {

      let arr = [];
      if (parseFloat(this.point) > 0) {
        if (parseFloat(this.price) > 0) {
          arr.push(yuan(this.price));
        }
        arr.push(`${this.point}${this.memberText.point_style}`);
      } else {
        if (isDef(this.price)) {
          arr.push(yuan(this.price));
        }
      }
      return arr.join("+");
    },
    originPriceText() {
      let text = "";
      if (isDef(this.originPrice)&&parseFloat(this.price)<parseFloat(this.originPrice)) {
        text = yuan(this.originPrice);
      }
      return text;
    },
    rebatePointText() {
      return this.rebatePoint
        ? `${this.rebatePoint}${this.memberText.point_style}`
        : "";
    },
    rebateCommissionText() {
      return this.rebateCommission
        ? `${this.rebateCommission}`+'积分'
        : "";
    }
  }
};
</script>

<style scoped lang="scss">
.goods-info-panel {
  .header {
    display: flex;
    .price-group {
      flex: auto;
      display: flex;
      flex-flow: column;
    }

    .price-group .price {
      display: flex;
      align-items: center;
    }

    .price-group .price .text {
      color: $red;
      font-weight: 800;
      font-size: 40rpx;
    }

    .price-group .price-tag {
      margin-left: 20rpx;
      display: flex;
      font-size: $font-size-xs;
    }

    .origin-price {
      font-size: $font-size-sm;
      color: $text-light;
      text-decoration: line-through;
      line-height: 40rpx;
    }
    .price-rebate {
      display: flex;
      align-items: center;
    }
    .rebate-group {
      display: flex;
      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-xs;
        height: 28rpx;
        line-height: 1.6;
        border: 1rpx solid $red;
        border-radius: 4rpx;
        overflow: hidden;
        margin-left: 20rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 200rpx;
        .fan {
          background-color: $red;
          color: #ffffff;
          padding: 0 4rpx;
        }
        .text {
          color: $red;
        }
      }
    }
  }
  .header-block {
    display: block;
  }
  .promote-text {
    color: $red;
    font-size: $font-size-sm;
  }
  .name-group {
    display: flex;
    justify-content: space-between;
  }
  .name-box {
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: $font-size-lg;
    line-height: 1.6;
  }

  .name-group .name-tag {
    margin-right: 10rpx;
  }

  .name-group .name {
    color: $text-color;
    font-weight: 700;
  }

  .sub-name {
    color: $text-light;
    font-size: $font-size-sm;
    line-height: 40rpx;
  }

  .foot {
    line-height: 32rpx;
    font-size: $font-size-sm;
    color: $text-light;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 33.33333334%;
    }
  }

  .foot-value {
    margin-left: 10rpx;
  }
}
</style>
