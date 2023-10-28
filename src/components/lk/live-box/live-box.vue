<template>
  <view class="live-box" @click="click">
    <div class="wrap">
      <view class="bg">
        <image class="image" :src="image" />
      </view>
      <view class="info">
        <view class="head">
          <view class="tags">
            <view class="box" :class="boxStateClass">
              <view class="text">{{ tagText }}</view>
              <view class="same" v-if="state == 'ing'">
                <text class="line1"></text>
                <text class="line2"></text>
                <text class="line3"></text>
              </view>
              <view class="text-icon" v-if="state == 'pre'">
                <lk-icon name="clock-o" size="12" />
              </view>
            </view>
            <view class="box box-extra" v-if="stateText">
              <view class="text">{{ stateText }}</view>
            </view>
          </view>
        </view>
        <view class="foot">
          <view class="title">{{ title }}</view>
          <view class="bottom">
            <view class="avatar-name">
              <image class="avatar" :src="avatar" mode="aspectFit" />
              <view class="name">{{ name }}</view>
            </view>
            <view class="like-text" v-if="likeText || likeText === 0">
              <lk-icon
                v-if="state == 'ing'"
                name="like"
                size="12"
                color="#ffffff"
              />
              <view class="text">{{ likeText }}</view>
            </view>
          </view>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
// -1-拒绝 0-待审核 1-直播预告 2-直播中 3-已审核 4-已下播
const tagsObj = {
  "-1": {
    text: "拒绝"
  },
  "0": {
    text: "待审核"
  },
  "1": {
    text: "预告"
  },
  "2": {
    text: "直播中"
  },
  "3": {
    text: "已审核"
  },
  "4": {
    text: "已下播"
  }
};
export default {
  props: {
    image: String,
    title: [String, Number],
    avatar: String,
    name: [String, Number],
    state: String, // ing直播中，ed 已下播 ,pre 预告
    stateText: String,
    likeText: [Number, String],
    to: [String, Object]
  },
  computed: {
    boxStateClass() {
      return this.state ? `box-state-${this.state}` : "";
    },
    tagText() {
      let obj = {
        ing: "直播中",
        pre: "预告",
        ed: "已下播"
      };
      return obj[this.state] || "";
    }
  },
  methods: {
    click(e) {
      if (this.to) {
        this.$Navigate.push(this.to);
      } else {
        this.$emit("click");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.live-box {
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 177.77%;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  .wrap {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
    .image {
      position: relative;
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 20rpx;
    }
  }
  .info {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 30%;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.001)
      );
    }
  }
  .head {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 2;
    padding: 10rpx;
  }
  .foot {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 16rpx;
    z-index: 2;
    .title {
      height: 40rpx;
      margin-bottom: 10rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #ffffff;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
    }
    .avatar-name {
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      color: #ffffff;
      .avatar {
        width: 40rpx;
        height: 40rpx;
        display: block;
        border-radius: 999rpx;
      }
      .name {
        padding: 0 10rpx;
        width: 160rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .like-text {
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      color: #ffffff;
      .text {
        max-width: 140rpx;
        padding-left: 6rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .tags {
    display: flex;
    .box {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: 9999rpx;
      background: rgba(0, 0, 0, 0.15);
      color: #fff;
      height: 32rpx;
    }
    .text {
      height: 20rpx;
      line-height: 1.3;
    }
    .box.box-state-ing {
      background: linear-gradient(to right, #fb454f, #ff5187);
    }
    .box.box-state-pre {
      background: linear-gradient(to right, #18b118, #69cd83);
    }
    .box.box-state-ed {
      background: linear-gradient(to right, #ccc, #e5e5e5);
    }
    .text-icon {
      display: flex;
      width: 28rpx;
      height: 28rpx;
      align-items: center;
      justify-content: center;
      margin-left: 8rpx;
    }
    .box.box-extra {
      position: relative;
      left: -24rpx;
      padding-left: 36rpx;
      z-index: 1;
    }
  }
}
.same {
  display: inline-block;
  height: 20rpx;
  overflow: hidden;
  margin-left: 10rpx;
}
.same text {
  display: inline-block;
  width: 4rpx;
  height: 20rpx;
  margin-bottom: 0;
  background-color: #ffffff;
  margin-left: 4rpx;
}
.same text.line1 {
  -webkit-animation: line 0.6s infinite ease-in-out alternate;
  -moz-animation: line 0.6s infinite ease-in-out alternate;
  animation: line 0.6s infinite ease-in-out alternate;
}
.same text.line2 {
  -webkit-animation: line 0.6s 0.2s infinite ease-in-out alternate;
  -moz-animation: line 0.6s 0.2s infinite ease-in-out alternate;
  animation: line 0.6s 0.2s infinite ease-in-out alternate;
}
.same text.line3 {
  -webkit-animation: line 0.6s 0.3s infinite ease-in-out alternate;
  -moz-animation: line 0.6s 0.3s infinite ease-in-out alternate;
  animation: line 0.6s 0.3s infinite ease-in-out alternate;
}
.same text.line4 {
  -webkit-animation: line 0.6s 0.15s infinite ease-in-out alternate;
  -moz-animation: line 0.6s 0.15s infinite ease-in-out alternate;
  animation: line 0.6s 0.15s infinite ease-in-out alternate;
}
@keyframes line {
  0% {
    height: 2rpx;
  }

  to {
    height: 20rpx;
  }
}

@-webkit-keyframes line {
  0% {
    height: 2rpx;
  }

  to {
    height: 20rpx;
  }
}
</style>
