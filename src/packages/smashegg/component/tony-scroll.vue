<template>
  <!-- 无缝滚动 -->
  <view class="home">
    <view class="list uni-flex uni-column">
      <view class="wrap-item">
        <view class="lis uni-flex uni-column" :animation="animationData">
          <view class="uni-flex uni-column" v-for="(item, index) in list" :key="index">
            <view class="swiper-item">
              <view class="time">{{ item.user_tel|telvague }}</view>
              <view class="phone">{{ item.term_name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    list: {}
  },
  data() {
    return {
      scrollHeight: 0, //向上滚动距离
      height: 0, //.lis高度（滚动框高度）
      animationData: {} //动画对象
    };
  },

  mounted() {
    setTimeout(() => {
      this.prizeScroll();
    }, 2000);
  },
  methods: {
    getHeight(Class) {
      let query = uni.createSelectorQuery().in(this);
      query
        .selectAll(Class)
        .boundingClientRect(data => {
          this.height = data[0].height;
        })
        .exec();
    },
    prizeScroll() {
      let speed = 50;
          if (this.list.length <= 5) {
        //如果数据无6条以上不执行无缝滚动
        return false;
      }
      let animation = uni.createAnimation({
        duration: this.getHeight(".lis") / speed,
        timingFunction: "linear",
        delay: 0
      });
      this.animation = animation;
      setInterval(() => {
        if (this.scrollHeight >= this.height) {
          animation.translateY(0).step();
          this.scrollHeight = 0;
          this.animationData = animation.export();
        } else {
          this.scrollHeight = this.scrollHeight + 1;
          animation.translateY(-this.scrollHeight).step();
          this.animationData = animation.export();
        }
      }, speed);
    }
  },
  filters: {
    telvague(val) {
      return val ? val.substr(0, 3) + "****" + val.substr(7) : "匿名";
    }
  }
};
</script>

<style lang="scss" scoped>
.home,
.list {
  width: 100%;
  /* padding-top: 30rpx; */
  /* height: 1000upx; */
}
.swiper-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
.time {
  width: 160rpx;
  /* height: 36rpx; */
  padding-top: 5rpx;
  padding-left: 15rpx;
}
.phone {
  /* height: 64rpx; */
   height: 64rpx;
  width: 180rpx;
  line-height: 64rpx;

  /* padding-top: 20rpx; */
  /* padding-right: 20rpx; */
}
</style>
