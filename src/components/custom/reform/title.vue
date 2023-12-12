<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="vui-title" :style="styles">
        <view v-if="!items.params.style">
          <text :style="textStyle">{{ items.params.title }}</text>
        </view>
        <view class="title-style-1" v-if="items.params.style == 1">
          <image class="img" :src="styleImgs.l" />
          <view class="text" :style="textStyle">
            <image class="bg" :src="styleImgs.bg" />
            <text>{{ items.params.title }}</text>
          </view>
          <image class="img" :src="styleImgs.r" />
        </view>
        <view class="title-style-2" v-if="items.params.style == 2">
          <image class="img img-l" :src="styleImgs.l" />
          <view class="text" :style="textStyle">
            <image class="bg" :src="styleImgs.bg" />
            <text>{{ items.params.title }}</text>
          </view>
          <image class="img img-r" :src="styleImgs.r" />
        </view>
        <view class="title-style-3" v-if="items.params.style == 3">
          <image class="img img-l" :src="styleImgs.l" />
          <view class="text" :style="textStyle">
            <image class="bg" :src="styleImgs.bg" />
            <text>{{ items.params.title }}</text>
          </view>
          <image class="img img-r" :src="styleImgs.r" />
        </view>
        <view class="title-style-4" v-if="items.params.style == 4">
          <image class="img img-l" :src="styleImgs.l" />
          <view class="text" :style="textStyle">
            <image class="bg" :src="styleImgs.bg" />
            <text>{{ items.params.title }}</text>
          </view>
          <image class="img img-r" :src="styleImgs.r" />
        </view>
        <view class="title-style-5" v-if="items.params.style == 5">
          <view class="line" :style="'background:' + items.style.color"></view>
          <view class="text" :style="textStyle">
            <text>{{ items.params.title }}</text>
          </view>
        </view>
        <view class="title-style-6" v-if="items.params.style == 6">
          <view class="text" :style="textStyle">
            <text>{{ items.params.title }}</text>
            <view
              class="line"
              :style="'background:' + items.style.color"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      styleImgs: {
        l: "",
        bg: "",
        r: ""
      }
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["static"]),
    styles() {
      return formatStyle({
        background: this.items.style.background,
        textAlign: this.items.style.textalign,
        padding:
          pxTorpx(this.items.style.paddingtop) +
          " " +
          pxTorpx(this.items.style.paddingleft)
      });
    },
    textStyle() {
      return formatStyle({
        color: this.items.style.color,
        fontSize: pxTorpx(this.items.style.fontsize)
      });
    }
  },
  mounted() {
    this.initIntersection().then(() => {
      this.styleImgs.l = `${this.static.baseImgPath}style/title-style-${this.items.params.style}-l.png`;
      this.styleImgs.bg = `${this.static.baseImgPath}style/title-style-${this.items.params.style}-bg.png`;
      this.styleImgs.r = `${this.static.baseImgPath}style/title-style-${this.items.params.style}-r.png`;
    });
  }
};
</script>

<style scoped lang="scss">
.title-style-1 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .text {
    display: inline-block;
    min-width: 198rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: relative;
    text-align: center;
    text {
      position: relative;
      z-index: 1;
      padding: 0 20rpx;
    }
  }
  .img {
    width: 37rpx;
    height: 40rpx;
  }
  .bg {
    width: 198rpx;
    height: 17rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -99rpx;
  }
}
.title-style-2 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .text {
    display: inline-block;
    min-width: 233rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: relative;
    text-align: center;
    text {
      position: relative;
      z-index: 1;
      padding: 0 20rpx;
    }
  }
  .img-l {
    width: 32rpx;
    height: 53rpx;
    position: relative;
    right: -20rpx;
  }
  .img-r {
    width: 24rpx;
    height: 30rpx;
    position: relative;
    left: -20rpx;
  }
  .bg {
    width: 233rpx;
    height: 38rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -116.5rpx;
  }
}
.title-style-3 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .text {
    display: inline-block;
    min-width: 157rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: relative;
    text-align: center;
    text {
      position: relative;
      z-index: 1;
      padding: 0 20rpx;
    }
  }
  .img-l {
    width: 70rpx;
    height: 12rpx;
    position: relative;
    top: -16rpx;
  }
  .img-r {
    width: 48rpx;
    height: 12rpx;
    position: relative;
    top: -14rpx;
  }
  .bg {
    width: 157rpx;
    height: 45rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -78.5rpx;
  }
}
.title-style-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    display: inline-block;
    min-width: 290rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: relative;
    text-align: center;
    text {
      position: relative;
      z-index: 1;
      padding: 0 20rpx;
    }
  }
  .img-l {
    width: 18rpx;
    height: 21rpx;
  }
  .img-r {
    width: 18rpx;
    height: 21rpx;
  }
  .bg {
    width: 290rpx;
    height: 50rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -145rpx;
  }
}
.title-style-5 {
  position: relative;
  display: flex;
  align-items: center;
  .line {
    width: 4rpx;
    height: 36rpx;
    left: 0;
    top: 0;
    background: #333;
    margin-right: 12rpx;
  }
}
.title-style-6 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    padding: 0 20rpx;
    border-bottom-width: 4rpx;
    border-bottom-style: solid;
    position: relative;
  }
  .line {
    position: absolute;
    width: 180%;
    height: 2rpx;
    left: 50%;
    bottom: -4rpx;
    transform: translateX(-50%);
  }
}
</style>
