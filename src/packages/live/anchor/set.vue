<template>
  <view class="pages">
    <anchor-top-bar
      :avatar="info.avatar"
      :name="info.name"
      :label="info.label"
    />
    <image :src="info.image" class="bg" mode="aspectFill" />
    <view class="mask"></view>
    <view class="notice-box" v-if="pageType == 1">
      <view class="info">
        <view class="title">{{ info.title }}</view>
        <view class="count-down-box" v-if="info.countDownTime">
          <view class="text">{{ countDownText }}</view>
          <lk-count-down
            v-if="!isCountDowned"
            ref="countCown"
            :time="info.countDownTime"
            @change="onCountDownChange"
            @finish="onFinish"
          >
            <view class="time-box">
              <text v-if="info.times.d">{{ info.times.d }}</text>
              <text v-if="info.times.d">天</text>
              <text>{{ info.times.h }}</text>
              <text>时</text>
              <text>{{ info.times.m }}</text>
              <text>分</text>
              <text>{{ info.times.s }}</text>
              <text>秒</text>
            </view>
          </lk-count-down>
        </view>
        <view class="foot-btn-group flex-space-between">
          <lk-button class="btn" theme-color round block @click="playLive">
            发起直播
          </lk-button>
          <lk-button class="btn" theme-color round plain block :to="toAddGoods">
            直播商品
          </lk-button>
        </view>
      </view>
    </view>
    <view class="set-box" v-if="pageType == 2">
      <!-- #ifdef MP-WEIXIN -->
      <camera
        class="camera"
        :device-position="toolParams.devicePosition"
        flash="off"
      ></camera>
      <!--  #endif -->
      <tool-group v-model="toolParams" />
      <view class="foot-btn-group">
        <lk-button
          theme-color
          round
          block
          :loading="isLoading"
          @click="onConfirm"
        >
          确认开始
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import {
  GET_LIVEANCHORADVANCEINFO,
  APPLY_LIVEANCHORAPPLYPLAY
} from "../interface";
import { dateToTimestamp, formatDate, wan } from "@/common/utils";
import anchorTopBar from "../component/anchor-top-bar";
import toolGroup from "./component/tool-group";
export default {
  name: "packages-live-anchor-set",
  data() {
    return {
      pageType: 1,
      anchor_id: 0,
      info: {
        avatar: "",
        name: "",
        label: "",
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
      },
      // 工具参数
      toolParams: {
        mode: "SD", //视频模式 SD（标清）, HD（高清）, FHD（超清）
        beauty: 5, //美颜
        whiteness: 5, //美白
        devicePosition: "front", //前置front或后置back
        enableMic: true //麦克风
      },
      isLoading: false,
      isCountDowned: false
    };
  },
  computed: {
    toAddGoods() {
      return {
        path: "/packages/live/anchor/goods",
        query: { anchor_id: this.anchor_id }
      };
    },
    countDownText() {
      return this.isCountDowned ? "预告时间已到" : "直播倒计时";
    }
  },
  onLoad(query) {
    this.live_id = query.live_id || "";
    this.getData();
  },
  onShow() {},
  onHide() {
    // #ifndef H5
    uni.setKeepScreenOn({
      keepScreenOn: false
    });
    // #endif
    if (this.$refs.countCown) {
      this.$refs.countCown.clearTimer();
    }
  },
  methods: {
    getData() {
      GET_LIVEANCHORADVANCEINFO({
        live_id: this.live_id
      }).then(({ data }) => {
        const info = data || {};
        this.anchor_id = info.anchor_id;
        this.info.image = info.live_img;
        this.info.title = info.live_title;
        this.info.num = wan(info.wantsee_num);
        this.info.time = formatDate(info.advance_limit_time, "MM-DD hh:mm");
        this.info.countDownTime = parseInt(info.advance_limit_time)
          ? parseInt(info.advance_limit_time) * 1000
          : 0;
        this.info.avatar = info.user_headimg;
        this.info.name = info.uname;
        this.info.label = wan(info.wantsee_num) + "订阅";
      });
    },
    playLive() {
      this.pageType = 2;
      // #ifndef H5
      // 保持屏幕常亮
      uni.setKeepScreenOn({
        keepScreenOn: true
      });
      // #endif
    },
    onCountDownChange(e) {
      this.info.times = e;
      this.info.times.d = parseInt(e.d);
    },
    onFinish() {
      // 预告时间到
      if (this.pageType == 1) {
        this.isCountDowned = true;
      }
    },
    onConfirm() {
      let params = {
        status: 2,
        anchor_id: this.anchor_id,
        tool_options: this.toolParams
      };
      // return console.log(params);
      this.isLoading = true;
      APPLY_LIVEANCHORAPPLYPLAY(params)
        .then(({ data, message }) => {
          this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            this.$Navigate
              .replace({
                path: "/packages/live/anchor/player",
                query: {
                  live_id: this.live_id,
                  anchor_id: this.anchor_id
                }
              })
              .catch(() => {
                this.isLoading = false;
              });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    anchorTopBar,
    toolGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: relative;
}
.notice-box {
  width: 100%;
  height: 100%;
  .info {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #ffffff;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      font-size: 40rpx;
    }
    .count-down-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 40rpx;
      .text {
        padding: 20rpx 0;
        font-size: $font-size-sm;
      }
      .time-box {
        color: #ffffff;
        font-size: 40rpx;
      }
    }
  }
  .flex-space-between {
    display: flex;
    justify-content: space-between;
  }

  .flex-space-between .btn {
    margin: 0 20rpx;
    flex: 1;
  }
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
}
.bg {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.set-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  .tool-box {
    position: relative;
  }
}
.slider-box {
  padding: $cell-padding;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 116rpx;
  .slider {
    flex: 1;
  }
  .text {
    flex: none;
    width: 80rpx;
    text-align: center;
    white-space: nowrap;
  }
}
.mode-box {
  padding: $cell-padding;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 116rpx;
  display: flex;
  justify-content: space-between;
  .active {
    color: $red;
    font-weight: 800;
  }
}
.camera {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
