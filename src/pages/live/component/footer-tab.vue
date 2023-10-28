<template>
  <view class="footer-tab">
    <view class="tabbar">
      <view
        class="item"
        :class="active == 0 ? 'active' : ''"
        :style="active == 0 ? 'color:' + theme.color : ''"
        @click="click(0)"
      >
        <view class="name">广场</view>
      </view>
      <view class="item" @click="click(1)" v-if="showPlayerBtn">
        <view class="icon">
          <image class="image" :src="tabIcon" />
        </view>
      </view>
      <view
        class="item"
        :class="active == 2 ? 'active' : ''"
        :style="active == 2 ? 'color:' + theme.color : ''"
        @click="click(2)"
      >
        <view class="name">我的</view>
      </view>
    </view>
    <view class="placeholder"></view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    active: {
      type: Number,
      default: 0
    },
    anchor_id: [String, Number]
  },
  computed: {
    ...mapGetters(["static"]),
    tabIcon() {
      return this.static.baseImgPath + "icon-tab-live.png";
    },
    showPlayerBtn() {
      // #ifdef H5
      return process.env.NODE_ENV == "development" ? !!this.anchor_id : false;
      // #endif
      return !!this.anchor_id;
    }
  },
  methods: {
    click(i) {
      let paths = [
        "/pages/live/index",
        "/packages/live/anchor/apply",
        "/packages/live/mine/index"
      ];
      if (this.active != i) {
        if (i === 1) {
          if (this.anchor_id) {
            paths[i] = {
              path: "/packages/live/anchor/apply",
              query: {
                anchor_id: this.anchor_id
              }
            };
          }
          this.$Navigate.push(paths[i]);
        } else {
          this.$Navigate.replace(paths[i]);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.placeholder {
  width: 100%;
  // height: 100rpx;
  // height: calc(100rpx + constant(safe-area-inset-bottom));
  // height: calc(100rpx + env(safe-area-inset-bottom));
}
.footer-tab {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tabbar {
  display: flex;
  flex-flow: row;
  z-index: 200;
  left: 0;
  right: 0;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
  .item {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    color: $text-gray;
  }
  .item.active {
    font-weight: 800;
  }
  .icon {
    padding: 20rpx;
    border-radius: 49999rpx;
    overflow: hidden;
    position: relative;
    margin-top: -40rpx;
    background: #fff;
    .image {
      width: 80rpx;
      height: 80rpx;
      display: block;
      border-radius: 49999rpx;
      background: $image-background;
    }
  }
}
</style>
