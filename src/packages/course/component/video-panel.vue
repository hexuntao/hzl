<template>
  <view class="video-panel">
    <view class="video-box">
      <video
        v-if="showVideo"
        id="couresVideo"
        class="video"
        object-fit="fill"
        :src="info.content"
        @ended="onVideoEnded"
        @play="onPlay"
        @timeupdate="timeupdate"
      ></video>
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
      <cover-view v-if="maskText && info.is_see!=-1" class="cover-tisp" @click="onPlay"><text class="icons icons-tisp icons-play"></text><text class="tisp-tit">重新播放</text></cover-view>
    </view>
    <view class="info">
      <view class="title">
<!--        <lk-tag class="tag" :color="theme.color" size="medium" v-if="nameTag">-->
<!--          {{ nameTag }}-->
<!--        </lk-tag>-->
        <text class="name">
          {{ info.name }}
        </text>
      </view>
      <view class="tisp">
        <text v-if="info.sales!=0"><text class="tisp-icons icons icons-play"></text>{{info.sales}}人学习</text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatStyle } from "@/common/utils/stringify";
function sToHs(s) {
	//计算分钟
	//算法：将秒数除以60，然后下舍入，既得到分钟数
	let h;
	h = Math.floor(s / 60);
	//计算秒
	//算法：取得秒%60的余数，既得到秒数
	s = s % 60;
	//将变量转换为字符串
	h += '';
	s += '';
	//如果只有一位数，前面增加一个0
	h = (h.length === 1) ? '0' + h : h;
	s = (s.length === 1) ? '0' + s : s;
	return h + ':' + s;
}
export default {
  data() {
    return {
      isShowTry: false
    };
  },
  props: {
    info: Object,
    getActive: [Number, String],
  },
  computed: {
    //显示视频
    showVideo() {
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
      return this.isShowTry || (!this.info.is_buy && this.info.is_see != -1);
    },
    nameTag() {
      let text = "";
      if (this.info.is_see > 0) {
        text = "试学" + this.info.is_see + "分钟";
      }
      return text;
    },
    coverBtnStyle() {
      return formatStyle({
        background: this.theme.color,
        color: "#ffffff"
      });
    }
  },
  watch: {
    getActive(e) {
      this.isShowTry = false;
    }
  },
  methods: {
    toBuy() {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: this.info.goods_id
        }
      });
    },
    onVideoEnded(e) {
      //试学视频播放结束
      if (this.nameTag) {
        this.isShowTry = true;
      }
    },
    onPlay() {
      this.isShowTry = false;
      uni.createVideoContext('couresVideo').play();
    },
    timeupdate(e) {
      if((sToHs(Math.floor(this.info.is_see*60)))==sToHs(Math.floor(e.detail.currentTime))) {
          if (this.nameTag) {
            this.isShowTry = true;
            uni.createVideoContext('couresVideo').pause();
          }
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  padding:20rpx 30rpx 0 30rpx;
  background-color: #ffffff;
  line-height: 48rpx;
  .tag {
    margin-right: 12rpx;
  }
  .name {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /*要显示的行数*/
    -webkit-box-orient: vertical;
    margin-bottom: 20rpx;
    font-size:32rpx;
  }
}
.video-box {
  width: 100%;
  min-height: 430rpx;
  position: relative;
  .video {
    height: 430rpx;
    width: 100%;
    overflow: hidden;
    background-color: #ffffff;
    display: block;
    video {
      display: block;
      width: 100%;
      height: 430rpx;
      border: none;
    }
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
.cover-tisp {
  position: absolute;
  left: 40rpx;
  bottom: 40rpx;
  z-index: 100;
  color: $white;
  font-size: 24rpx;
  .icons-tisp {
    position: absolute;
    top:50%;
    transform: translate(0,-50%);
  }
  .tisp-tit {
    margin-left: 35rpx;
  }
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
