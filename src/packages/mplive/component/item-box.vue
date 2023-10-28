<template>
  <view class="box" @click="click">
    <view class="bg">
      <image :src="image" mode="aspectFill" />
    </view>
    <view class="head">
      <view class="tag">
        <text class="text" :style="stateBg" v-if="stateName">
          {{ stateName }}
        </text>
        <text class="num" v-if="tagTime">{{ tagTime }}</text>
      </view>
    </view>
    <view class="foot">
      <view class="title">
        {{ title }}
      </view>
      <view class="name-group">
        <view class="name">
          <lk-avatar :src="avatar" size="40" />
          <view class="text">{{ name }}</view>
        </view>
        <view></view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
const stateText = {
  101: "直播中",
  102: "预告",
  103: "回放",
  104: "禁播",
  105: "暂停中",
  106: "异常",
  107: "已过期"
};

const stateColor = {
  101: "#f44",
  102: "#06bf04",
  103: "#606266",
  104: "#606266",
  105: "#606266",
  106: "#606266",
  107: "#606266"
};
export default {
  props: {
    roomid: [Number, String],
    image: String,
    title: String,
    avatar: String,
    name: String,
    tagTime: String,
    state: [Number, String]
  },
  computed: {
    ...mapGetters({
      extendCode: "extendCode",
      shareParams: "shareParams"
    }),
    stateName() {
      return this.state ? stateText[this.state] || "" : "";
    },
    stateBg() {
      return this.state ? "background:" + stateColor[this.state] : "";
    }
  },
  methods: {
    click() {
      // #ifdef MP-WEIXIN
      let roomid = this.roomid;
      let customParams = encodeURIComponent(
        JSON.stringify({
          path: this.shareParams.pagePath,
          extend_code: this.extendCode
        })
      );
      console.log(roomid, customParams);
      uni.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}&custom_params=${customParams}`
      });
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  height: 400rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20rpx;
    image {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 20rpx;
    }
  }
  .head {
    position: absolute;
    padding: 20rpx;
    width: 100%;
    .tag {
      font-size: $font-size-xs;
      line-height: 1;
      .text {
        background-color: $gray-darker;
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
      }
      .num {
        background-color: rgba(0, 0, 0, 0.3);
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
      }
    }
  }
  .foot {
    flex-flow: column;
    padding: 20rpx;
    width: 100%;
    position: absolute;
    bottom: 0;
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 60rpx;
    }
    .name-group {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      font-size: $font-size-sm;
      .name {
        display: flex;
        flex-flow: row;
        align-items: center;
        .text {
          margin-left: 10rpx;
          width: 120rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
