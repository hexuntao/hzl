<template>
  <view class="audio-panel">
    <view class="audio-box">
      <view class="imt-audio">
      <view class="cover-warp">
        <image :src="info.goods_picture"  class="cover-img"></image>
      </view>
      <view class="audio-wrapper">
        <view class="audio-number">{{format(current)}}</view>
        <slider class="audio-slider" :activeColor="color" block-size="16" :value="current" :max="duration" @changing="seek=true,current=$event.detail.value" @change="audio.seek($event.detail.value)"></slider>
        <view class="audio-number">{{format(duration)}}</view>
      </view>
      <view class="audio-control-wrapper" :style="{color}">
        <view class="audio-control audio-control-prev icons icons-arrow-left" @click="prev"></view>
        <view class="audio-control audio-control-switch icons" :class="paused==true?' icons-play':'icons-pause'"  @click="audio.paused?handleBtnClick():audio.pause()"></view>
        <view class="audio-control icons icons-arrow" @click="next"></view>
      </view>
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
export default {
  data() {
    return {
      isShowTry: false,
      audio: uni.createInnerAudioContext(),
      duration:0,
      current:0, //当前进度(s)
      seek: false, //是否处于拖动状态
      paused: true,
    };
  },
  props: {
    info: Object,
    getActive: [Number, String],
    src: {
      type: String
    },
    color: {
      type: String,
      default: '#169af3'
    }, //主色调
  },
  created() {
    if (this.src) {
				this.audio.src = this.src
			  this.audio.autoplay && this.handleBtnClick()
			}
			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
        let timer = this.format(this.info.is_see*60);
        if(this.info.is_buy==false) {
          if(timer== this.format(this.audio.currentTime)) {
            if (this.nameTag) {
              this.isShowTry = true;
              this.current = 0;
              this.audio.currentTime = 0; 
              this.paused = true;
              this.audio.stop();
            }
          }
        }
				if (!this.seek) {
          this.current = this.audio.currentTime
          this.duration = this.audio.duration
          if(this.info.is_buy==false) {
            if(timer<=this.format(this.current)) {
              if (this.nameTag) {
                this.isShowTry = true;
                this.current = 0;
                this.audio.currentTime = 0; 
                this.paused = true;
                this.audio.stop();
              } 
            }
          }
				}
				if (!this.duration) {
					this.duration = this.audio.duration
				}
			})
			//音频播放事件
			this.audio.onPlay(() => {
				this.paused = false
			})
			//音频暂停事件
			this.audio.onPause(() => {
        this.paused = true
        this.audio.pause();
			})
			//音频结束事件
			this.audio.onEnded(() => {
        if (this.nameTag) {
          this.isShowTry = true;
          this.current = 0;
          this.paused = true
          this.audio.stop();
        }
      })
      //获取音频时间
      this.audio.onCanplay(()=>{
        this.duration = this.audio.duration;
      });
			//音频完成更改进度事件
			this.audio.onSeeked(() => {
        this.seek = false
        if(this.audio.currentTime==this.audio.duration) {
          this.audio.stop()
        } else {
          this.audio.play();
        }
			})
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
  methods: {
    toBuy() {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: this.info.goods_id
        }
      });
    },
    //返回prev事件
    prev() {
      this.$emit('prev')
    },
    //返回next事件
    next() {
      this.$emit('next')
    },
		handleBtnClick() {
			this.audio.play()
    },
    format(num) {
      return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)
    },
    onPlay() {
      this.isShowTry = false;
      this.audio.play();
    },
  },
  watch: {
    play(n) {
			if (n) {
				this.audio.play();
			} else {
				this.audio.pause();
			}
		},
		src() {
			this.audio.destroy();
    },
    getActive(e) {
      this.isShowTry = false;
    },
  },
  beforeDestroy() {
    this.audio.destroy();
	},
  components: {}
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
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 32rpx;
  }
}
.audio-box {
  width: 100%;
  min-height: 430rpx;
  position: relative;
  padding: $cell-padding;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  .audio {
    display: block;
    padding: 40rpx 0;
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
  line-height: 460rpx;
  text-align: center;
}
.cover-btn {
  position: absolute;
  left: 50%;
  top: 55%;
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
.tisp {
  line-height: 1.6;
  color: #B4B4B4;
  padding-bottom: 28rpx;
  border-bottom: 1px solid #E5E5E5;
  .tisp-icons {
    font-size: 12rpx;
  }
}
.cover-warp {
  height: 320rpx;
  margin: 20rpx auto;
  border-radius: 10rpx;
  .cover-img {
		width: 640rpx;
    height: 320rpx;
    border-radius: 10rpx;
	}
}
	.imt-audio {
		padding: 30rpx 0;
		background: #fff;
		border-radius: 20rpx;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
	}

	.audio-number {
		width: 120rpx;
		font-size: 24rpx;
		line-height: 1;
		color: #333;
		text-align: center;
	}

	.audio-slider {
		flex: 1;
		margin: 0;
	}

	.audio-control-wrapper {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
    touch-action: none;
	}

	.audio-control {
		font-size: 32rpx;
		line-height: 1;
    background: #7f8c90;
    color: #FFFFFF;
		border-radius: 50%;
		padding: 12rpx;
	}

	.audio-control-switch {
		font-size: 38rpx;
		margin: 0 60rpx;
	}

</style>
