<template>
  <view :class="items.id">
    <view class="swiper-box" :style="'height:' + height">
      <lk-swiper
        :height="height"
        :indicator-active-color="indicatorActiveColor"
        :list="list"
        :mode="mode"
        :autoplay="!video"
        :indicator-pos="indicatorPos"
        :video="video"
        @click="previewImage"
      >
      </lk-swiper>
    </view>
    <promote-info-panel
      v-if="promoteType"
      :type="promoteType"
      :params="items.params.promoteParams"
      :goods-info="goodsInfo"
      :price-color="items.style.promotecolor"
      :light-color="items.style.promotelightcolor"
      :rebate-commission="items.params.rebateCommission"
      :rebate-point="items.params.rebatePoint"
    />
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import promoteInfoPanel from "./promote-info-panel";
export default {
  data() {
    const systemInfo = uni.getSystemInfoSync();
    return {
      list: [],
      height: systemInfo.safeArea.width + "px"
    };
  },
  mixins: [reform],
  computed: {
    mode() {
      let obj = {
        round: "dot",
        square: "rect",
        rectangle: "round",
        number: "number"
      };
      return obj[this.items.style.shape];
    },
    indicatorActiveColor() {
      return this.items.style.color;
    },
    indicatorPos() {
      let obj = {
        left: "bottomLeft",
        center: "bottomCenter",
        right: "bottomRight"
      };
      return obj[this.items.style.position];
    },
    video() {
      return this.items.params.video;
    },
    goodsInfo() {
      return this.items.goodsInfo || {};
    },
    promoteType() {
      let type = null;
      const { promoteType, promoteParams } = this.items.params;
      if (
        (promoteType == "seckill" && promoteParams.seckill_status == "going") ||
        promoteType == "group" ||
        (promoteType == "presell" && promoteParams.state == 1) ||
        (promoteType == "bargain" && promoteParams.status == 1) ||
        (promoteType == "limit" && promoteParams.status == 1) ||
        (promoteType == "luckyspell")
      ) {
        type = promoteType;
      }
      return type;
    }
  },
  created() {
    let arr = [];
    if (this.video) {
      arr.push({ video: this.video });
    }
    for (let i in this.items.data) {
      arr.push({ image: addImgSrcDomain(this.items.data[i]) });
    }
    this.list = arr;
  },
  methods: {
    previewImage(index) {
      if (this.video && index == 0) {
        return;
      }
      const urls = this.list.filter(e => e.image).map(e => e.image);
      if (urls.length) {
        uni.previewImage({
          current: this.video ? index - 1 : index,
          urls: urls
        });
      }
    }
  },
  components: {
    promoteInfoPanel
  }
};
</script>

<style scoped lang="scss">
.swiper-box {
  position: relative;
}
.swiper-video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .video {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.foot-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.foot-tab {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100rpx;
  left: 0;
  bottom: 0;
  z-index: 10;
  justify-content: center;
  .item {
    display: flex;
    width: 100rpx;
    height: 48rpx;
    align-items: center;
    justify-content: center;
    color: $text-gray;
    font-size: $font-size-sm;
    border-radius: 99999rpx;
    background: #f2f3f5;
    margin: 0 20rpx;
  }
  .item.active {
    color: #ffffff;
    background: $red;
  }
}
</style>
