<template>
  <view class="image-panel">
    <view class="image-box">
    <view class="image">
      <image :src="info.content" />
    </view>
    <cover-view class="cover-mask" v-if="maskText">
        {{ maskText }}
    </cover-view>
    <cover-view
      class="cover-btn"
      :style="coverBtnStyle"
      v-if="maskText"
      @click="toBuy"
    >
      立即购买
    </cover-view>
    </view>
    <view class="info">
      <view class="title">{{ info.name }}</view>
      <!--此次需要做修改title标记-->
      <view class="tisp">
        <text v-if="info.sales!=0"><text class="tisp-icons icons icons-play"></text>{{info.sales}}人学习</text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatStyle } from "@/common/utils/stringify";
export default {
  props: {
    info: Object,
    getActive: [Number, String],
  },
  computed: {
    //显示
    showAudio() {
      let show = false;
      if (this.info.is_buy) {
        show = true;
      } else {
        show = this.info.is_see != -1;
      }
      return show;
    },
    maskText() {
      let text = "";
      if (!this.info.is_buy && this.info.is_see == -1) {
        text = "购买后查看完整版";
      }
      if (!this.info.is_buy && this.isShowTry) {
        text = "试学结束，购买后查看完整版";
      }
      return text;
    },
    // 是否试学
    isTry() {
      return this.isShowTry || (!this.info.is_buy && this.info.is_see == 0);
    },
    coverBtnStyle() {
      return formatStyle({
        background: this.theme.color,
        color: "#ffffff"
      });
    }
  },
  getActive(e) {
    this.isShowTry = false;
  },
  methods: {
    toBuy() {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: this.info.goods_id
        }
      });
    }  
  },
};
</script>

<style lang="scss" scoped>
.image-panel {
  .image {
    min-height: 430rpx;
    background-color: $image-background;
    image {
      width: 100%;
      height: 430rpx;
      display: block;
    }
  }
}
.image-box {
  width: 100%;
  min-height: 430rpx;
  position: relative;
}
.info {
  padding: $cell-padding;
  background-color: #ffffff;
  line-height: 48rpx;
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
    font-size: 32rpx;
  }
}
.cover-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  font-size: $font-size-lg;
  color: #ffffff;
  line-height: 360rpx;
  text-align: center;
}
.cover-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100rpx;
  z-index: 101;

  display: inline-flex;
  vertical-align: top;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 999rpx;
  min-width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  padding: 0 16rpx;
}
.tisp {
    line-height: 1.6;
    color: #B4B4B4;
    padding-bottom: 28rpx;
    border-bottom: 1px solid #E5E5E5;
    .tisp-icons {
     font-size: 12rpx;
    }
  }
</style>
