<template>
  <scroll-view
    scroll-y
    scroll-with-animation
    class="notice-list"
    :scroll-top="scrollTop"
  >
    <block v-for="(item, index) in queues" :key="index">
      <view class="item" :class="item.class" v-if="item.show">
        <view class="content" :class="item.type">
          <text class="name" v-if="item.name"> {{ item.name }} </text>
          {{ item.type | content }}
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
      maxTimestamp: 5000 // 效果时间戳，动画时间
    };
  },
  watch: {
    list(val) {
      let item = Object.assign({}, { ...val[val.length - 1] }); //当前新加的通知
      item.timer = null;
      item.show = true;
      item.class = "fadeInLeft";

      clearTimeout(item.timer);
      item.timer = setTimeout(() => {
        item.class = "fadeOutLeft";
        setTimeout(() => {
          item.show = false;
        }, 500);
      }, this.maxTimestamp);

      this.queues.push(item);
      // console.log(this.queues);
      this.wordBottom();
    }
  },
  filters: {
    content(e) {
      const obj = {
        follow: "关注了主播",
        share: "分享了直播",
        join: "进入了直播间",
        quit: "退出了直播间",
        shopping: "正在去购买"
      };
      return obj[e] || "";
    }
  },
  props: {
    list: Array
  },
  computed: {
    filterList() {
      const items = [];
      this.list.forEach((e, i) => {
        if (i > 9) {
          items.splice(0, 1);
        }
        items.push(e);
      });
      return items;
    }
  },
  methods: {
    wordBottom() {
      this.$nextTick(() => {
        this.scrollTop = this.list.length * 100 + this.scrollTop;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-list {
  padding: 0 30rpx;
  height: 248rpx;
  position: relative;
  overflow: hidden;
  .item {
    position: relative;
    .content {
      margin: 10rpx 0;
      display: inline-block;
      vertical-align: top;
      max-width: 80%;
      padding: 8rpx 16rpx;
      border-radius: 28rpx;
      background: rgba(0, 0, 0, 0.5);
      font-size: $font-size-sm;
      color: #ffffff;
      line-height: 40rpx;
    }
    .content.follow {
      background: rgba(197, 143, 95, 0.8);
    }
    .content.share {
      background: rgba(123, 197, 95, 0.8);
    }
    .content.join {
      background: rgba(95, 96, 197, 0.8);
    }
    .content.quit {
      background: rgba(153, 153, 153, 0.8);
    }
    .content.shopping {
      background: rgba(181, 52, 52, 0.8);
    }
    .name {
      display: inline-block;
      vertical-align: top;
      max-width: 140rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #ffffff;
      padding-right: 10rpx;
    }
  }
}

.fadeInLeft {
  animation: fadeInLeft 0.8s ease 0s 1 both;
  -webkit-animation: fadeInLeft 0.8s ease 0s 1 both;
}
.fadeOutLeft {
  animation: fadeOutLeft 0.8s ease 0s 1 both;
  -webkit-animation: fadeOutLeft 0.8s ease 0s 1 both;
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeOutLeft {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
