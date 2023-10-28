<template>
  <view class="bottom-action-bar">
    <view class="warp">
      <view class="goods-input-group">
        <view class="goods-bg" @click="action('goods')">
          <image :src="goodsCartBg" mode="aspectFit" />
        </view>
        <view class="say-box" @click="action('write')">
          <text>聊点什么吧</text>
        </view>
      </view>
      <view class="icon-action-group">
        <view class="item">
          <view class="more" :class="actionMoreClass">
            <view class="more-item" @click="toReport">
              <text>举报</text>
            </view>
          </view>
          <lk-icon
            :name="actionMoreIcons.name"
            color="inherit"
            size="28"
            @click="actionMore = !actionMore"
          />
        </view>
        <view class="item">
          <image class="gift-icon" :src="giftIcon" @click="action('gift')" />
        </view>
        <!-- #ifdef MP -->
        <view class="item" v-if="showShareBtn">
          <lk-button
            open-type="share"
            type="text"
            icon-square
            icon="share"
            icon-size="28"
            :custom-style="{
              color: 'inherit'
            }"
            @click="action('share')"
          ></lk-button>
        </view>
        <!--  #endif -->
        <view class="item">
          <like-bubble :count="count" />
          <view class="like-num">{{ likeNumText }}</view>
          <lk-button
            bing-mobile
            type="text"
            icon="like"
            icon-square
            icon-size="28"
            :custom-style="{
              color: 'inherit'
            }"
            @click="clickLike"
          >
          </lk-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { wan, throttle } from "@/common/utils";
import likeBubble from "./like-bubble";
let likeFlag = 1;

export default {
  data() {
    return {
      content: "",
      actionMore: false,
      likeNum: 0,
      count: this.likeCount
    };
  },
  watch: {
    likeCount(e) {
      this.count = e;
    }
  },
  props: {
    anchor_id: [String, Number],
    likeCount: {
      // 点赞总数
      type: [String, Number],
      default: 0
    },
    // 是否禁言
    isMute: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["static"]),
    showShareBtn() {
      // #ifdef H5
      return process.env.NODE_ENV == "development";
      // #endif
      return true;
    },
    giftIcon() {
      return this.static.baseImgPath + "gift-icon.png";
    },
    goodsCartBg() {
      return this.static.baseImgPath + "live-goods-cart.png";
    },
    actionMoreClass() {
      return this.actionMore ? "show" : "";
    },
    actionMoreIcons() {
      return {
        name: this.actionMore ? "cross" : "weapp-nav"
      };
    },
    likeNumText() {
      return wan(this.count);
    }
  },
  mounted() {},
  methods: {
    showActionMore() {
      this.actionMore = !this.actionMore;
    },
    toReport() {
      this.$Navigate.push({
        path: "/packages/live/report",
        query: {
          anchor_id: this.anchor_id
        }
      });
    },
    action(e, data) {
      this.$emit("action", e, data);
    },
    clickLike() {
      const obj = {
        like_count: this.count + 1,
        like_num: (this.likeNum += 1)
      };
      this.action("like", obj);
    }
  },
  components: {
    likeBubble
  }
};
</script>

<style lang="scss" scoped>
.bottom-action-bar {
  position: fixed;
  width: 100%;
  z-index: 40;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  .warp {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
  }
}
.goods-input-group {
  flex: none;
  display: flex;
  align-items: center;
  .goods-bg {
    display: flex;
    image {
      width: 71rpx;
      height: 86rpx;
    }
  }
  .say-box {
    position: relative;
    background: transparent;
    border: none;
    flex: 1;
    font-size: $font-size;
    padding: 10rpx;
    line-height: 40rpx;
    margin: 0 20rpx;
    color: #ffffff;
    border-bottom: 1rpx solid #ffffff;
  }
}
.icon-action-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  .item {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 70rpx;
    height: 70rpx;
    margin: 0 20rpx;
    color: #ffffff;
  }
  .more {
    position: absolute;
    top: -80rpx;
    left: 0;
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: 0.3s;
    &.show {
      opacity: 1;
      height: auto;
    }
    .more-item {
      border-radius: 9999rpx;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.8);
      text-align: center;
      width: 70rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: $font-size-sm;
    }
  }
  .like-num {
    color: #ffffff;
    font-size: $font-size-xs;
    position: absolute;
    border-radius: 20rpx;
    text-align: center;
    top: -20rpx;
    left: 0;
    width: 70rpx;
    height: 20rpx;
    line-height: 26rpx;
    background: $red;
  }
  .gift-icon {
    display: block;
    width: 54rpx;
    height: 52rpx;
  }
}
</style>
