<template>
  <view
    class="shortcut-entry"
    v-show="isShow"
    :class="showMenuClass"
    :style="entryStyle"
  >
    <view class="menu">
      <view
        class="item"
        v-for="(item, index) in items"
        :key="index"
        @click="toLink(item.path)"
      >
        <lk-icon size="20" class="icon" :name="item.icon" />
        <text class="text">{{ item.name }}</text>
      </view>
    </view>
    <view class="box" @click="show = !show">
      <lk-icon size="24" :name="iconClass" />
    </view>
  </view>
</template>

<script>
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      show: false,
      items: [
        {
          icon: "wap-home-o",
          name: "首页",
          path: "/pages/mall/index"
        },
        {
          icon: "apps-o",
          name: "分类",
          path: "/pages/goods/category"
        },
        {
          icon: "cart-o",
          name: "购物车",
          path: "/pages/mall/cart"
        },
        {
          icon: "contact",
          name: "我的",
          path: "/pages/member/index"
        }
      ]
    };
  },
  props: {
    bottom: String
  },
  computed: {
    ...mapGetters({
      routeInfo: "route"
    }),
    isShow() {
      let show = this.routeInfo.meta && this.routeInfo.meta.isTabBar;
      return !show;
    },
    showMenuClass() {
      return this.show ? "show" : "";
    },
    iconClass() {
      return this.show ? "cross" : "apps-o";
    },
    entryStyle() {
      let styles = {};
      if (this.bottom) {
        styles.bottom = this.bottom + "rpx";
      }
      return formatStyle(styles);
    }
  },
  methods: {
    toLink(link) {
      this.$Navigate.push(link);
    }
  }
};
</script>

<style lang="scss" scoped>
.shortcut-entry {
  position: fixed;
  background-color: #fff;
  color: $text-gray;
  z-index: 200;
  box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.12);
  right: 30rpx;
  bottom: 150rpx;
  bottom: calc(150rpx + constant(safe-area-inset-bottom));
  bottom: calc(150rpx + env(safe-area-inset-bottom));
  border-radius: 40rpx;
  opacity: 0.7;
  transition: 0.3s;
}

.menu {
  display: flex;
  width: 80rpx;
  flex-direction: column;
}

.menu .item {
  width: 80rpx;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: 0.2s ease-out;
}

.shortcut-entry.show {
  opacity: 1;
}

.shortcut-entry.show .menu .item {
  height: 80rpx;
}

.menu .item .text {
  font-size: $font-size-xs;
  line-height: 1.4;
}

.box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4rpx rgba(0, 0, 0, 0.12);
  font-size: $font-size;
}
</style>
