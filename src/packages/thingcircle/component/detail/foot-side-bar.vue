<template>
  <view class="foot-side-bar">
    <view class="placeholder" v-if="type == 'imgtext'"></view>
    <view :class="'foot-side-bar-' + type" v-if="type == 'imgtext'">
      <view class="input-box" @click="onSay">
        <lk-icon name="edit" color="#999" />
        <view class="text">说点什么...</view>
      </view>
      <view class="item">
        <view class="icon">
          <lk-button
            bing-mobile
            type="text"
            icon-prefix="v-icon"
            :icon="likeIcon.name"
            icon-size="20"
            :custom-style="{
              color: likeIcon.color
            }"
            @click="onLike"
          >
          </lk-button>
        </view>
        <view class="text">{{ likesText }}</view>
      </view>
      <view class="item">
        <view class="icon">
          <lk-button
            bing-mobile
            type="text"
            icon-prefix="v-icon"
            :icon="collectIcon.name"
            icon-size="20"
            :custom-style="{
              color: collectIcon.color
            }"
            @click="onCollect"
          >
          </lk-button>
        </view>
        <view class="text">{{ collectText }}</view>
      </view>
      <view class="item">
        <view class="icon">
          <lk-icon
            class-prefix="v-icon"
            name="v-icon-evaluate-02"
            size="20"
            square
            @click="onSay"
          />
        </view>
        <view class="text">{{ commentCountText }}</view>
      </view>
    </view>
    <view :class="'foot-side-bar-' + type" v-if="type == 'video'">
      <view class="input-box" @click="onSay">
        <lk-icon name="edit" color="#fff" />
        <view class="text">说点什么...</view>
      </view>
      <view class="item avatar-attent">
        <lk-avatar class="avatar" :src="info.user_headimg" size="90" />
        <lk-tag class="attent" :color="attentbtn.color" round @click="onAttent">
          {{ attentbtn.text }}
        </lk-tag>
      </view>
      <view class="item">
        <view class="icon">
          <lk-button
            bing-mobile
            type="text"
            icon-prefix="v-icon"
            :icon="likeIcon.name"
            icon-size="28"
            :custom-style="{
              color: likeIcon.color
            }"
            @click="onLike"
          >
          </lk-button>
        </view>
        <view class="text">{{ likesText }}</view>
      </view>
      <view class="item">
        <view class="icon">
          <lk-button
            bing-mobile
            type="text"
            icon-prefix="v-icon"
            :icon="collectIcon.name"
            icon-size="28"
            :custom-style="{
              color: collectIcon.color
            }"
            @click="onCollect"
          >
          </lk-button>
        </view>
        <view class="text">{{ collectText }}</view>
      </view>
      <view class="item">
        <view class="icon" @tap="onComment">
          <lk-icon name="chat" size="28" square />
        </view>
        <view class="text">{{ commentCountText }}</view>
      </view>
      <view class="item">
        <view class="icon">
          <lk-button
            open-type="share"
            type="text"
            square
            icon="share"
            icon-size="28"
          ></lk-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import {
  GET_THINGCIRCLEFOLLOW,
  GET_THINGCIRCLELIKES,
  GET_THINGCIRCLECOLLECTION
} from "@/common/interface/thingcircle";
import { wan } from "@/common/utils";
let attentFlag = true;
let likeFlag = true;
let collectFlag = true;
export default {
  data() {
    return {
      isAttented: this.info.is_attention,

      isCollect: this.info.is_collect,
      collects: this.info.collects || 0,

      likes: this.info.likes || 0,
      isLike: this.info.is_like
    };
  },
  watch: {
    "info.id"(e) {
      this.isAttented = this.info.is_attention;

      this.isCollect = this.info.is_collect;
      this.collects = this.info.collects;

      this.isLike = this.info.is_like;
      this.likes = this.info.likes;
    }
  },
  props: {
    type: String,
    info: Object,
    active: Number
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    attentbtn() {
      let obj = {
        show: false,
        text: ""
      };
      if (this.memberInfo.uid && this.memberInfo.uid != this.info.user_id) {
        obj.show = true;
        obj.text = this.isAttented ? "已关注" : "关注";
        obj.color = this.isAttented ? "" : this.theme.color;
      }
      return obj;
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
    collectIcon() {
      return {
        color: this.isCollect ? "#f44" : "",
        name: this.isCollect ? "v-icon-star" : "v-icon-star-01"
      };
    },
    collectText() {
      return wan(this.collects);
    },
    commentCountText() {
      return wan(this.info.evaluates);
    }
  },
  methods: {
    action(data) {
      this.$emit("action", this.active, data);
    },
    onSay() {
      this.$emit("say", {
        params: {
          thing_id: this.info.id,
          topic_id: this.info.topic_id
        },
        action: "add"
      });
    },
    onAttent() {
      if (!attentFlag) {
        return;
      }
      attentFlag = false;
      GET_THINGCIRCLEFOLLOW({
        thing_auid: this.info.user_id
      })
        .then(res => {
          this.isAttented = !this.isAttented;
          attentFlag = true;
          this.action({ is_attention: this.isAttented });
        })
        .catch(() => {
          attentFlag = true;
        });
    },
    onLike() {
      if (!likeFlag) {
        return;
      }
      likeFlag = false;
      GET_THINGCIRCLELIKES({
        thing_id: this.info.id
      })
        .then(res => {
          this.likes = res.count;
          this.isLike = !this.isLike;
          likeFlag = true;
          this.action({ likes: this.likes, is_like: this.isLike });
        })
        .catch(() => {
          likeFlag = true;
        });
    },
    onCollect() {
      if (!collectFlag) {
        return;
      }
      collectFlag = false;
      GET_THINGCIRCLECOLLECTION({
        thing_id: this.info.id
      })
        .then(res => {
          this.collects = res.count;
          this.isCollect = !this.isCollect;
          collectFlag = true;
          this.action({ collects: this.collects, is_collect: this.isCollect });
        })
        .catch(() => {
          collectFlag = true;
        });
    },
    onComment() {
      this.$emit("show-comment", this.active);
    }
  }
};
</script>

<style lang="scss" scoped>
.placeholder {
  width: 100%;
  height: 100rpx;
}
.foot-side-bar-imgtext {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
  .input-box {
    flex: 1;
    display: flex;
    flex-flow: row;
    align-items: center;
    color: $text-light;
    font-size: $font-size-sm;
    border-radius: 1000rpx;
    padding: 10rpx 20rpx;
    background-color: $background-color;
    line-height: 40rpx;
    .text {
      margin-left: 10rpx;
    }
  }
  .item {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    margin-left: 20rpx;
    color: $text-light;
    .icon {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;
    }
    .text {
      font-size: $font-size-sm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80rpx;
    }
  }
}
.foot-side-bar-video {
  position: fixed;
  right: 20rpx;
  bottom: 60rpx;
  z-index: 100;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
  width: 100rpx;
  background-color: transparent;
  .input-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    color: #fff;
    .text {
      margin-left: 10rpx;
    }
  }
  .avatar-attent {
    display: flex;
    flex-flow: column;
    align-items: center;
    position: relative;
    .avatar {
    }
    .attent {
      font-size: $font-size-xs;
      position: relative;
      z-index: 1;
      margin-top: -10rpx;
    }
  }
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    margin-top: 20rpx;
    .icon {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;
    }
    .text {
      font-size: $font-size-sm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80rpx;
    }
  }
}
</style>
