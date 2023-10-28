
<template>
<!-- 活动结束 -->
  <view class="popup" >
    <view class="popup-wrap">
      <view class="popup-main-end">
        <view class="txt-end-title">你来晚了~砍价已失效！</view> 
        <view class="end">
          <image :src="end">
        </view>
        <view type="flex" justify="center" class="btn-know">
          <lk-button type="danger" size="small" @click="close">知道了</lk-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
 
  computed:{
    //   活动结束图片
  end() {
      return this.$store.getters.static.baseImgPath + "end.png";
    },
  },
  methods: {
    close() {
      this.$Navigate.replace("/pages/mall/index");
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
  height: 100%;
  width: 100%;
  z-index: 2001;
  transition: all 0.2s;
}
.popup-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.popup-main-end {
  background-color: #fff;
  width: 86%;
  border-radius: 10rpx;
  padding: 20rpx;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.end {
  width: 100%;
  margin: auto;
  position: relative;
  padding: 20rpx;
}
.end  image {
  width: 100%;
  height: 100%;
}
.txt-end-title {
  text-align: center;
  color: #333333;
  padding: 28rpx;
  font-size: 36rpx;
  font-weight: normal;
}
.txt-end-follow {
  text-align: center;
  color: #999999;
  font-size: 28rpx;
}
.btn-know {
   width: 80%;
   height: 100%;
  margin: 0 auto; 
   display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
}
.btn-know  .lk-button {
  background: linear-gradient(to right, #ff6829, #fe1c41);
  /* height: 58px; */
  border-radius: 40rpx;
  font-size: 20rpx;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

