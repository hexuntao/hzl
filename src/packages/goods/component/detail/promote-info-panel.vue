<template>
  <view class="promote-info-panel">
    <image :src="imageBg" class="image" />
    <view class="box">
      <view class="price-group">
        <view class="price">
          <view class="text first-letter">
            {{ info.price }}
          </view>
          <lk-tag
            custom-class="price-tag"
            :custom-style="{ marginLeft: '20rpx' }"
            round
            size="medium"
            color="rgba(0,0,0,.15)"
            text-color="#ffffff"
            v-if="info.priceTag"
          >
            {{ info.priceTag }}
          </lk-tag>
        </view>
        <view class="origin-price">
          <view
            class="first-letter price"
            :class="type == 'presell' ? 'no-through' : ''"
          >
            {{ info.originPrice }}
          </view>

          <view class="rebate-group">
            <view class="item" v-if="rebateCommissionText">
              <text class="fan">CC</text>
              <text class="text">{{ rebateCommissionText }}</text>
            </view>
            <view class="item" v-if="rebatePointText">
              <text class="fan">返</text>
              <text class="text">{{ rebatePointText }}</text>
            </view>
          </view>

          <!-- <view class="seckill-progress">
            <lk-progress-bar
              v-if="type == 'seckill'"
              bg="#FFD5D2"
              :bar-bg="progressBarBg"
              :value="info.buyNumPercent"
            >
              <view slot="progress-text">{{ info.buyNumPercentText }}</view>
            </lk-progress-bar>
          </view> -->
        </view>
      </view>
      <view class="right-time" v-if="type != 'group' && type != 'luckyspell'">
        <view class="time-box" :style="{ color: promoteColor }">
          <view class="text">
            <lk-icon name="clock-o" size="12" :color="promoteColor" />
            <text>距结束剩余</text>
          </view>
          <lk-count-down
            :time="countTime"
            :background="promoteColor"
            color="#ffffff"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { yuan } from '@/common/utils';
import { formatStyle, formatClass } from '@/common/utils/stringify';
import { mapGetters, mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  props: {
    type: String,
    params: Object,
    goodsInfo: Object,
    priceColor: String,
    lightColor: String,
    rebateCommission: [String, Number],
    rebatePoint: [String, Number],
  },
  computed: {
    ...mapState({
      memberText: ({ member }) => member.texts,
      distributeText: ({ distribute }) => distribute.texts,
    }),
    ...mapGetters(['static']),
    imageBg() {
      return this.static.baseImgPath + 'promote-' + this.type + '.png';
    },
    promoteColor() {
      let color = '';
      if (this.type == 'seckill') {
        color = '#EA463D';
      } else if (this.type == 'group') {
        color = '#FC5424';
      } else if (this.type == 'presell') {
        color = '#E93359';
      } else if (this.type == 'bargain') {
        color = '#FF4B1C';
      } else if (this.type == 'limit') {
        color = '#FF3419';
      }
      return color;
    },
    // 活动信息
    info() {
      const type = this.type;
      const params = this.params;
      const goodsInfo = this.goodsInfo;
      let info = {};
      info.price = yuan(goodsInfo.goodsPrice);
      info.priceTag = null;
      info.originPrice = yuan(goodsInfo.marketPrice);
      if (type == 'seckill' && params.seckill_status == 'going') {
        info.price = yuan(goodsInfo.goodsPrice);
        info.priceTag = '已售' + params.robbed_num + '件';
        info.originPrice = yuan(goodsInfo.marketPrice);
        info.buyNumPercent = parseFloat(params.robbed_percent);
        info.buyNumPercentText =
          '已抢' + parseFloat(params.robbed_percent) + '%';
      }
      if (type == 'group') {
        info.price = yuan(goodsInfo.groupGoodsPrice);
        info.priceTag = '已有' + params.regiment_count + '人成团';
        info.originPrice = yuan(goodsInfo.goodsPrice);
      }
      if (type == 'presell' && params.state == 1) {
        info.price = yuan(goodsInfo.allMoney);
        info.priceTag = '已订' + params.vrnum + '件';
        info.originPrice = '定金 ' + yuan(goodsInfo.frontMoney);
      }
      if (type == 'bargain' && params.status == 1) {
        info.price = yuan(goodsInfo.goodsPrice);
        info.priceTag = '已砍成功' + params.bargain_sales + '件';
        info.originPrice = yuan(goodsInfo.marketPrice);
      }
      if (type == 'limit') {
        info.price = yuan(goodsInfo.goodsPrice);
        info.originPrice = yuan(goodsInfo.marketPrice);
      }
      if (type == 'luckyspell') {
        //幸运拼团
        info.price = yuan(goodsInfo.groupGoodsPrice);
        info.priceTag = '已拼成' + params.luckyspell_suc_count + '次';
      }
      if (
        !parseFloat(info.price.substring(1)) <
        parseFloat(info.originPrice.substring(1))
      ) {
        info.originPrice = '';
      }
      return info;
    },

    countTime() {
      let time = 0;
      if (this.type == 'seckill') {
        time = parseFloat(this.params.end_time) || 0;
      } else if (this.type == 'group') {
      } else if (this.type == 'presell') {
        time = parseFloat(this.params.end_time) || 0;
      } else if (this.type == 'bargain') {
        time = parseFloat(this.params.end_bargain_time) || 0;
      } else if (this.type == 'limit') {
        time = parseFloat(this.params.end_time) || 0;
      } else if (this.type == 'luckyspell') {
        time = parseFloat(this.params.end_time) || 0;
      }
      time = time * 1000;
      return time;
    },
    progressBarBg() {
      return (
        'url(' +
        this.static.baseImgPath +
        'promote-progress-bg.png) center center'
      );
    },
    rebatePointText() {
      return this.rebatePoint
        ? `${this.rebatePoint}${this.memberText.point_style}`
        : '';
    },
    rebateCommissionText() {
      return this.rebateCommission ? `${this.rebateCommission} 积分` : '';
    },
  },
  methods: {},
  components: {},
};
</script>

<style lang="scss">
.promote-info-panel {
  position: relative;
  background: $red;
  height: 140rpx;
  .image {
    width: 100%;
    height: 100%;
    display: block;
  }

  .box {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: transparent;
  }

  .price-group {
    flex: auto;
    display: flex;
    flex-flow: column;
    padding: 0rpx 30rpx;
    line-height: 48rpx;
  }

  .price-group .price {
    display: flex;
    align-items: center;
  }

  .price-group .price .text {
    color: #fff;
    font-weight: 800;
    font-size: 40rpx;
  }

  .price-group .price-tag {
    margin-left: 20rpx;
    display: flex;
    font-size: $font-size-xs;
  }

  .price-group .origin-price {
    font-size: $font-size-sm;
    color: #fff;
    line-height: 40rpx;
    display: flex;
    align-items: center;
    .price {
      text-decoration: line-through;
    }
  }

  .price-group .origin-price {
    .no-through {
      text-decoration: initial;
    }
  }

  .rebate-group {
    //display: flex;
    display: none;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-xs;
      height: 28rpx;
      line-height: 1.6;
      border: 1rpx solid #ffffff;
      border-radius: 4rpx;
      overflow: hidden;
      margin-left: 20rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 200rpx;
      .fan {
        background-color: #ffffff;
        color: $red;
        padding: 0 4rpx;
      }
      .text {
        color: #ffffff;
      }
    }
  }

  .right-time {
    display: flex;
    align-items: flex-end;
    padding: 10rpx 20rpx;
    height: 100%;
    min-width: 240rpx;
    justify-content: center;
  }

  .time-box {
    display: flex;
    flex-flow: column;
    font-size: $font-size-xs;
    color: $red;
  }

  .time-box .text {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.2;
    margin-bottom: 8rpx;
    color: inherit;
    font-size: $font-size-sm;
  }

  .time-box .time-icon {
    margin-right: 4rpx;
    color: inherit;
  }

  .seckill-progress {
    margin: 0 40rpx;
    flex: 1;
    height: 28rpx;
    line-height: 28rpx;
    font-size: $font-size-sm;
  }
}
</style>
