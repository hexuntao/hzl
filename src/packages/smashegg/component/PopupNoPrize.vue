<template>
<!-- 未中奖弹出框 -->
  <view class="popup"  :style="{transform:isShow ? 'scale(1)' : 'scale(0)'}">
    <view class="popup-no-prize-wrap">
      <view class="prize">
        <image :src="no_prize_one">
      </view>
      <view class="prize">
        <image :src="win_prize_two">
        <view class="prize-sad">
          <image :src="no_prize_two">
        </view>
      </view>
      <view class="prize">
        <image :src="win_prize_three">
        <view class="prize-win-txt">
          <view>差一点点就中奖了！</view>
        </view>
      </view>
      <view class="prize">
        <image :src="win_prize_four">
        <view class="prize-win-txt">
          <view type="flex" justify="center" class="btn-wrap">
            <lk-button type="default" size="small" open-type="share" @click="share">立即分享</lk-button>
            <lk-button type="danger" size="small" @click="close">知道了</lk-button>
          </view>
        </view>
      </view>
      <view class="close" @click="close"></view>
    </view>
  </view>
</template>
<script>

export default {
  props: {
    //是否弹出
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
computed:{
	no_prize_one(){
		return this.$store.getters.static.baseImgPath + 'no_prize_01.png'
	},
	no_prize_two(){
		return this.$store.getters.static.baseImgPath + 'no_prize_02.png'
	},
	win_prize_two(){
		return this.$store.getters.static.baseImgPath + 'win_prize_02.png'
	},
	win_prize_three(){
		return this.$store.getters.static.baseImgPath + 'win_prize_03.png'
	},
	win_prize_four(){
		return this.$store.getters.static.baseImgPath + 'win_prize_04.png'
	},
},
  methods: {
    close() {
      this.$emit("close");
    },
    share() {
      this.$emit("share");
    }
  }
};
</script>

<style scoped>
.popup {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  height: 100vh;
  width: 100vw;
  z-index: 100;
  transition: all 0.2s;
}
.popup-no-prize-wrap {
  position: relative;
  width: 70%;

  top: 20%;
  left: 15%;
  
}
.prize {
  position: relative;
  overflow: hidden;
  width: 100%;
  line-height: 0;
}
.prize image {
  width: 100%;
  height: 180rpx;
  display: block;
}
.prize-sad {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 18%;
  z-index: 99;
}
.prize-win-txt {
  position: absolute;
  top: 2%;
  left: 10%;
  width: 80%;
  z-index: 99;
  line-height: 60rpx;
  font-size: 24rpx;
  text-align: center;
  color: #fff;
}
.btn-wrap {
  width: 100%;
  margin: auto;
}
.btn-wrap .lk-button:first-child {
  margin-right: 5%;
  color: #f33559;
  border: 1px solid #fff;
}
.btn-wrap .lk-button:last-child {
  background-color: #f33559;
  color: #fff;
  border: 1px solid #f33559;
}
.btn-wrap  .lk-button {
  width: 45%;
}
 .close {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 2px solid #fff;
  display: block;
 
  margin: auto;
  margin-top: 40rpx;
  background-color: #fff;
  
} 
.close:before {
  content: "";
  position: absolute;
  left: 24rpx;
  top: 8rpx;
  width: 4rpx;
  height: 40rpx;
  background-color: #333;
  transform: rotate(45deg);
   display: flex;
  justify-content: center;
  align-items: center;
}
.close:after {
  content: "";
  position: absolute;
  left: 24rpx;
  top: 8rpx;
  width: 4rpx;
  height: 40rpx;
  background-color: #333;
  transform: rotate(-45deg);
} 
</style>

