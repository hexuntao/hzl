<template>
  <view class="pages">
    <anchor-top-bar
      :avatar="info.avatar"
      :name="info.name"
      :label="info.label"
    />
    <image :src="info.image" class="bg" mode="aspectFit" />
    <view class="mask"></view>
    <view class="notice-box">
      <view class="info">
        <view class="title">{{ info.title }}</view>
        <view class="count-down-box" v-if="info.countDownTime">
          <view class="text">直播倒计时</view>
          <lk-count-down
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
        <view class="foot-btn-group" v-if="info.countDownTime">
          <lk-button class="btn" theme-color round @click="onConfirm">
            {{ remindText }}
          </lk-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  GET_LIVEANCHORADVANCEINFO,
  SET_LIVEREMIND,
  GET_LIVEROOMSTATUS
} from "./interface";
import { dateToTimestamp, formatDate, wan } from "@/common/utils";
import anchorTopBar from "./component/anchor-top-bar";
export default {
  name: "packages-live-notice",
  data() {
    return {
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
      is_remind: 0,
      isLoading: false
    };
  },
  computed: {
    remindText() {
      return this.is_remind ? "取消提醒" : "开播提醒";
    }
  },
  onLoad(query) {
    this.live_id = query.live_id || "";
    this.getData();
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

        this.is_remind = info.is_remind;
      });
    },
    onCountDownChange(e) {
      this.info.times = e;
      this.info.times.d = parseInt(e.d);
    },
    onFinish() {
      // 预告时间到
      this.$Navigate.replace({
        path: "/packages/live/player",
        query: {
          live_id: this.live_id,
          anchor_id: this.anchor_id
        }
      });
    },
    onConfirm() {
      let params = {
        live_id: this.live_id,
        anchor_id: this.anchor_id
      };
      this.isLoading = true;
      SET_LIVEREMIND(params, { isRemind: !this.is_remind })
        .then(({ data, message }) => {
          this.$Prompt.toast({ title: message, icon: "success" });
          this.isLoading = false;
          this.getData();
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    anchorTopBar
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
</style>
