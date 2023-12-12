<template>
  <view class="bottom-bar">
    <view class="items items-left">
      <view class="icon-item" @click="action('write')">
        <lk-icon
          class-prefix="v-icon"
          color="inherit"
          size="18"
          square
          name="v-icon-edit-03"
        />
      </view>
    </view>
    <view class="items items-center">
      <view
        class="icon-item icon-item-goods"
        :class="value == 'goods' ? 'active' : ''"
        @click="action('goods')"
      >
        <lk-icon
          class-prefix="v-icon"
          :color="value == 'goods' ? '#EA2053' : '#ffffff'"
          size="18"
          square
          :name="value == 'goods' ? 'v-icon-gift-f-02' : 'v-icon-goods-03'"
        />
      </view>
      <view
        class="icon-item icon-item-msg"
        :class="value == 'msg' ? 'active' : ''"
        @click="action('msg')"
      >
        <lk-icon
          class-prefix="v-icon"
          :color="value == 'msg' ? '#5AB1F8' : '#ffffff'"
          size="18"
          square
          :name="value == 'msg' ? 'v-icon-msg-04' : 'v-icon-msg-05'"
        />
      </view>
      <view
        class="icon-item icon-item-tool"
        :class="value == 'tool' ? 'active' : ''"
        @click="action('tool')"
      >
        <lk-icon
          class-prefix="v-icon"
          :color="value == 'tool' ? '#3cdaa0' : '#ffffff'"
          size="18"
          square
          :name="value == 'tool' ? 'v-icon-fk-c' : 'v-icon-fk'"
        />
      </view>
    </view>
    <view class="items items-right">
      <view class="icon-item" @click="action('mute')">
        <lk-icon
          class-prefix="v-icon"
          color="inherit"
          size="18"
          square
          name="v-icon-msg-03"
        />
      </view>
      <view class="icon-item">
        <lk-button
          open-type="share"
          type="text"
          icon-square
          icon-prefix="v-icon"
          icon="v-icon-share-06"
          icon-size="18"
          :custom-style="{
            color: 'inherit'
          }"
        ></lk-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value: "msg"
    };
  },
  props: {},
  computed: {
    goodsIconStyle() {
      return this.value == "goods"
        ? {
            "background-image":
              "-webkit-linear-gradient(bottom, #ED4F25, #EA2053)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent"
          }
        : {};
    },
    msgIconStyle() {
      return this.value == "msg"
        ? {
            "background-image":
              "-webkit-linear-gradient(bottom, #9059F5, #5AB1F8)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent"
          }
        : {};
    }
  },
  methods: {
    action(e) {
      if (e == "goods" || e == "msg" || e == "tool") {
        this.value = e;
      }
      this.$emit("action", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed;
  width: 100%;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  .items {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  .icon-item {
    width: 70rpx;
    height: 70rpx;
    display: flex;
    margin: 0 10rpx;
    justify-content: center;
    align-items: center;
    border-radius: 99999rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
  }
  .items.items-left {
    justify-content: flex-start;
  }
  .items.items-right {
    justify-content: flex-end;
  }
  .items.items-center {
    border-radius: 99999rpx;
    background: rgba(0, 0, 0, 0.5);
    .icon-item {
      background: transparent;
    }
  }
  .items .icon-item.active {
    background: #ffffff;
  }
  .icon-item-tool .tool {
    font-size: 36rpx;
    width: 56rpx;
    height: 56rpx;
    color: inherit;
  }
}
</style>
