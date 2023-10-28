<template>
  <scroll-view
    scroll-y
    scroll-with-animation
    class="gift-list"
    :scroll-top="scrollTop"
  >
    <block v-for="(item, index) in queues" :key="index">
      <view class="item" :class="item.class" v-if="item.show">
        <view class="wrap">
          <image class="avatar" :src="item.avatar" mode="aspectFill" />
          <view class="info">
            <view class="name">{{ item.name }}</view>
            <view class="label">{{ item.label }}</view>
          </view>
          <view class="right">
            <image class="right-img" :src="item.resource" mode="aspectFill" />
          </view>
        </view>
        <view class="tip-num">
          <text class="x">x</text>
          <text class="num">{{ item.frequency || 1 }}</text>
        </view>
      </view>
    </block>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 9999,
      queues: [], // 队列消息
      maxTimestamp: 5000, // 效果时间戳，动画时间
      activeItem: {}, //当前正在显示的消息
      activeItems: {}
    };
  },
  watch: {
    // list(val) {
    //   let item = Object.assign({}, { ...val[val.length - 1] }); //当前新加的礼物
    //   // console.log(item.uid,item.name,item.id)
    //   console.log('watch',asd++)
    //   item.frequency = 1;
    //   item.timer = null;
    //   item.show = true;
    //   item.class = "bounceInLeft";
    //   item.timestamp = Date.parse(new Date());
    //   let activeItem = this.activeItems[item.uid];
    //   // console.log(activeItem);
    //   if (
    //     activeItem &&
    //     item.uid === activeItem.uid &&
    //     item.id === activeItem.id
    //   ) {
    //     // 同个用户，同个礼物
    //     if (
    //       parseInt(item.timestamp) - parseInt(activeItem.timestamp) <=
    //       this.maxTimestamp
    //     ) {
    //       // 动画时间范围内
    //       this.queues.forEach((e, i) => {
    //         if (e.uid == item.uid && e.id == item.id) {
    //           e.frequency = e.frequency + 1;
    //           this.timerClose(e);
    //         }
    //       });
    //     } else {
    //       // 动画结束，新加入对列
    //       this.timerClose(item);
    //       this.queues.push(item);
    //     }
    //   } else {
    //     // 不同礼物,加入到队列中
    //     this.timerClose(item);
    //     this.queues.push(item);
    //   }
    //   this.activeItems[item.uid] = item;
    //   // console.log(this.queues);
    //   this.wordBottom();
    // }
  },
  filters: {},
  props: {
    list: [Array]
  },
  computed: {},
  methods: {
    push(obj) {
      let item = Object.assign({}, { ...obj }); //当前新加的礼物
      item.frequency = 1;
      item.timer = null;
      item.show = true;
      item.class = "bounceInLeft";
      item.timestamp = Date.parse(new Date());
      let activeItem = this.activeItems[item.uid];
      // console.log(activeItem);
      if (
        activeItem &&
        item.uid === activeItem.uid &&
        item.id === activeItem.id
      ) {
        // 同个用户，同个礼物
        if (
          parseInt(item.timestamp) - parseInt(activeItem.timestamp) <=
          this.maxTimestamp
        ) {
          // 动画时间范围内
          this.queues.forEach((e, i) => {
            if (e.uid == item.uid && e.id == item.id) {
              e.frequency = e.frequency + 1;
              this.timerClose(e);
            }
          });
        } else {
          // 动画结束，新加入对列
          this.timerClose(item);
          this.queues.push(item);
        }
      } else {
        // 不同礼物,加入到队列中
        this.timerClose(item);
        this.queues.push(item);
      }
      this.activeItems[item.uid] = item;
      // console.log(this.queues);
      this.wordBottom();
    },
    timerClose(item) {
      clearTimeout(item.timer);
      item.timer = setTimeout(() => {
        item.class = "bounceOutLeft";
        setTimeout(() => {
          item.show = false;
        }, 500);
      }, this.maxTimestamp);
    },
    wordBottom() {
      this.$nextTick(() => {
        this.scrollTop = this.list.length * 100 + this.scrollTop;
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.gift-list {
  padding: 0 30rpx;
  position: relative;
  max-height: 500rpx;
  overflow-y: auto;
  .item {
    color: #ffffff;
    position: relative;
    display: flex;
    align-items: center;
    .wrap {
      margin: 10rpx 0;
      display: flex;
      align-items: center;
      width: 400rpx;
      height: 100rpx;
      border-radius: 100rpx;
      padding: 10rpx;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.5);
      position: relative;
    }
    .avatar {
      display: block;
      width: 80rpx;
      height: 80rpx;
      flex: none;
      border-radius: 50%;
    }
    .info {
      flex: 1;
      padding: 0 10rpx;
      width: 200rpx;
    }
    .name {
      font-size: $font-size;
      line-height: 48rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .label {
      font-size: $font-size-sm;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .right {
      flex: none;
    }
    .right-img {
      display: block;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    .tip-num {
      margin-left: 40rpx;
      font-weight: 700;
      font-style: italic;
      color: #ffffff;
      .x {
        font-size: 40rpx;
      }
      .num {
        font-size: 56rpx;
        padding: 0 10rpx;
      }
    }
  }
}
@keyframes bounceInLeft {
  0%,
  60%,
  75%,
  90%,
  100% {
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-6000rpx, 0, 0);
    transform: translate3d(-6000rpx, 0, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(50rpx, 0, 0);
    transform: translate3d(50rpx, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(-20rpx, 0, 0);
    transform: translate3d(-20rpx, 0, 0);
  }
  90% {
    -webkit-transform: translate3d(10rpx, 0, 0);
    transform: translate3d(10rpx, 0, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes bounceOutLeft {
  20% {
    opacity: 1;
    -webkit-transform: translate3d(40rpx, 0, 0);
    transform: translate3d(40rpx, 0, 0);
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-6000rpx, 0, 0);
    transform: translate3d(-6000rpx, 0, 0);
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.fade {
  animation: fade;
  animation-duration: 2s;
}
.bounceInLeft {
  animation: bounceInLeft 0.8s ease 0s 1 both;
  -webkit-animation: bounceInLeft 0.8s ease 0s 1 both;
}
.bounceOutLeft {
  animation: bounceOutLeft 0.8s ease 0s 1 both;
  -webkit-animation: bounceOutLeft 0.8s ease 0s 1 both;
}
</style>
