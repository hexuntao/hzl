<template>
  <view class="item" :class="isRoot ? 'item-padding' : ''">
    <view class="avatar">
      <lk-avatar :src="info.user_headimg" :size="isRoot ? 80 : 60" />
    </view>
    <view class="wrapper">
      <view class="info">
        <view class="name-like">
          <view class="name-time">
            <view class="name">
              <view class="text">{{ info.thing_user_name || "匿名" }}</view>
              <lk-tag v-if="info.is_author" round :color="theme.color">
                作者
              </lk-tag>
            </view>
            <view class="time">{{ createTimeText }}</view>
          </view>
          <view class="like">
            <lk-button
              bing-mobile
              type="text"
              icon-size="12"
              icon-prefix="v-icon"
              :icon="likeIcon.name"
              :custom-style="{
                color: likeIcon.color
              }"
              @click="onLike"
            >
              <view class="text">{{ likesText }}</view>
            </lk-button>
          </view>
        </view>
        <view class="content">
          <view class="text">
            <view
              class="tooltip"
              :style="{ display: showTooltip ? 'flex' : 'none' }"
            >
              <view class="mask" @click="showTooltip = false"></view>
              <view
                class="tooltip-item"
                v-for="(tool, tidx) in tooltipItems"
                :key="tidx"
                @tap="onTool(tool.name)"
              >
                <lk-icon :name="tool.icon" size="20" square color="#ffffff" />
                <view>{{ tool.text }}</view>
              </view>
            </view>
            <block v-if="!isRoot && info.to_thing_user_name">
              <text>回复</text>
              <text class="reply-name"> {{ info.to_thing_user_name }}： </text>
            </block>
            <text @click="onShowTooltip">
              {{ info.content }}
            </text>
          </view>
        </view>
      </view>
      <slot />
    </view>
  </view>
</template>

<script>
import { wan, timeText } from "@/common/utils";
import {
  GET_THINGCIRCLELIKESCOMMENT,
  DEL_THINGCIRCLECOMMENT
} from "@/common/interface/thingcircle";
import { mapState } from "vuex";
let likeFlag = true;
export default {
  data() {
    return {
      likes: this.info.comment_likes || 0,
      isLike: this.info.is_like,

      showTooltip: false,
      tooltipPosition: {
        x: 0,
        y: 0
      }
    };
  },
  props: {
    info: Object,
    isRoot: Boolean,
    name: [String, Number]
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    tooltipItems() {
      let arr = [
        {
          name: "reply",
          icon: "more-o",
          text: "回复"
        }
      ];
      if (this.memberInfo.uid == this.info.from_uid) {
        arr.push({
          name: "delete",
          icon: "delete",
          text: "删除"
        });
      } else {
        arr.push({
          name: "report",
          icon: "warn-o",
          text: "举报"
        });
      }
      return arr;
    },
    likeIcon() {
      return {
        color: this.isLike ? "#f44" : "",
        name: this.isLike ? "v-icon-love-02-f" : "v-icon-love-02"
      };
    },
    likesText() {
      return wan(this.likes);
    },
    createTimeText() {
      return timeText(this.info.create_time);
    }
  },
  methods: {
    action(data) {
      this.$emit("action", this.name, data);
    },
    onLike() {
      if (!likeFlag) {
        return;
      }
      likeFlag = false;
      GET_THINGCIRCLELIKESCOMMENT({
        comment_id: this.info.id
      })
        .then(res => {
          this.likes = res.count;
          this.isLike = !this.isLike;
          likeFlag = true;
          this.action({ comment_likes: res.count, is_like: !this.isLike });
        })
        .catch(() => {
          likeFlag = true;
        });
    },
    onShowTooltip(e) {
      // this.tooltipPosition = { x: e.target.x - 177, y: e.target.y - 207 };
      this.showTooltip = !this.showTooltip;
    },
    onTool(name) {
      this.showTooltip = false;
      typeof this[name + "Fn"] == "function" && this[name + "Fn"]();
    },
    replyFn() {
      this.$emit("reply", {
        params: {
          comment_pid: this.info.comment_pid,
          topic_id: this.info.topic_id,
          thing_id: this.info.thing_id,
          to_uid: this.info.from_uid
        },
        action: "reply",
        placeholder: "回复：" + this.info.to_placeholder_name
      });
    },
    deleteFn() {
      DEL_THINGCIRCLECOMMENT(
        { comment_id: this.info.id },
        { isShowLoading: true }
      ).then(() => {
        this.$emit("init", this.name);
      });
    },
    reportFn() {
      this.$Navigate.push({
        path: "/packages/thingcircle/report",
        query: {
          comment_id: this.info.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-flow: row;
  line-height: 48rpx;
  position: relative;
}
.item-padding {
  padding: $cell-padding;
  background: #ffffff;
}
.item-padding::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.avatar {
  margin-right: 20rpx;
  flex: none;
}
.wrapper {
  flex: 1;
  width: 100%;
  height: auto;
  font-size: $font-size-sm;
  word-break: break-all;
  .name-like {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    line-height: 40rpx;
    .name-time {
      display: flex;
      flex-flow: column;
      font-size: $font-size-sm;
      .name {
        display: flex;
        flex-flow: row;
        .text {
          font-size: $font-size-sm;
          color: $text-gray;
          padding-right: 10rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 400rpx;
        }
      }
      .time {
        font-size: $font-size-xs;
        color: $text-light;
      }
    }
    .like {
      display: flex;
      flex-flow: column;
      align-items: center;
      line-height: 1;
      color: $text-light;
      .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 80rpx;
        font-size: $font-size-xs;
        line-height: 28rpx;
      }
    }
  }
  .content {
    display: flex;
    margin: 10rpx 0;
    font-size: $font-size;
    .text {
      position: relative;
      line-height: 40rpx;
    }
    .tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      position: absolute;
      border-radius: 8rpx;
      padding: 10rpx 20rpx;
      z-index: 10;
      font-size: $font-size-sm;
      line-height: 1.2;
      min-width: 20rpx;
      word-wrap: break-word;
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;
      top: -110rpx;
      left: 0;
      // display: none;
      .tooltip-item {
        display: flex;
        flex-flow: column;
        align-items: center;
        color: #ffffff;
        width: 100rpx;
        height: 80rpx;
        white-space: nowrap;
        justify-content: center;
        position: relative;
        z-index: 1001;
      }
      .mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background: transparent;
      }
    }
    .tooltip::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 10rpx;
      left: 50%;
      border-top-color: rgba(0, 0, 0, 0.8);
      border-bottom-width: 0;
      position: absolute;
      bottom: -10rpx;
      margin-left: -10rpx;
    }
  }
  .reply-name {
    padding: 0 8rpx;
    color: $blue;
  }
}
</style>
