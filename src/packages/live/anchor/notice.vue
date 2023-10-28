<template>
  <view class="pages">
    <view class="cell-group card-group-box" @click="toSet('push')">
      <view class="image">
        <image :src="image" mode="aspectFit" />
        <view class="mask">
          <view class="mask-text" v-if="countDownTime">直播倒计时</view>
          <lk-count-down
            v-if="countDownTime"
            ref="countCown"
            :time="countDownTime"
            @change="onCountDownChange"
            @finish="onFinish"
          >
            <view class="mask-time">
              <text v-if="times.d">{{ times.d }}</text>
              <text v-if="times.d">天</text>
              <text>{{ times.h }}</text>
              <text>时</text>
              <text>{{ times.m }}</text>
              <text>分</text>
              <text>{{ times.s }}</text>
              <text>秒</text>
            </view>
          </lk-count-down>
        </view>
      </view>
      <view class="info">
        <view class="title">{{ title }}</view>
        <view class="time">
          直播预告时间
          <text>{{ time }}</text>
        </view>
        <view class="label">
          订阅数
          <text>{{ num }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_LIVEANCHORADVANCEINFO } from "../interface";
import { dateToTimestamp, formatDate, wan } from "@/common/utils";
export default {
  name: "packages-live-anchor-notice",
  data() {
    return {
      image: "",
      title: "",
      time: "",
      num: "",
      countDownTime: 0,
      times: {
        d: 0,
        h: 0,
        m: 0,
        s: 0
      }
    };
  },
  computed: {},
  onLoad(query) {
    this.live_id = query.live_id || "";
  },
  onShow() {
    setTimeout(() => {
      this.getData();
    });
  },
  onHide() {
    // if (this.$refs.countCown) {
    //   this.$refs.countCown.clearTimer();
    // }
  },
  methods: {
    getData() {
      GET_LIVEANCHORADVANCEINFO({
        live_id: this.live_id
      }).then(({ data }) => {
        const info = data || {};
        if (info.advance_limit_time) {
          this.anchor_id = info.anchor_id;
          this.image = info.live_img;
          this.title = info.live_title;
          this.num = wan(info.wantsee_num);
          this.time = formatDate(info.advance_limit_time, "MM-DD hh:mm");
          this.countDownTime = parseInt(info.advance_limit_time) * 1000;
        } else {
          this.$Prompt.toast("直播已结束").then(() => {
            setTimeout(() => {
              this.$Navigate.back();
            }, 500);
          });
        }
      });
    },
    onCountDownChange(e) {
      this.times = e;
      this.times.d = parseInt(e.d);
    },
    onFinish() {
      // 预告时间到
      this.toSet("replace");
    },
    toSet(method = "push") {
      this.$Navigate['replace']({
        path: "/packages/live/anchor/set",
        query: {
          live_id: this.live_id,
          anchor_id: this.anchor_id
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  .image {
    width: 100%;
    height: 400rpx;
    overflow: hidden;
    position: relative;
    image {
      display: block;
      width: 100%;
      height: 100%;
      background: $image-background;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: #ffffff;
      z-index: 1;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mask-text {
        padding: 20rpx 0;
      }
      .mask-time {
        color: #ffffff;
        font-size: 40rpx;
      }
    }
  }
  .info {
    background: #ffffff;
    padding: $cell-padding;
  }
  .title {
    font-size: $font-size;
    color: $text-gray;
    line-height: 48rpx;
    height: 48rpx;
  }
  .time,
  .label {
    font-size: $font-size-sm;
    color: $text-light;
    line-height: 40rpx;
    text {
      padding: 0 20rpx;
    }
  }
}
</style>
