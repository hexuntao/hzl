<template>
  <view class="category-nav" :style="[styleTop, styleBottom]">
    <view class="nav">
      <slot name="nav">
        <view
          class="item"
          :class="active == index ? 'active' : ''"
          :style="active == index ? activeColor : ''"
          v-for="(item, index) in navs"
          :key="index"
          @click="click(index)"
        >
          <text class="text-line" :style="{ background: theme.color }"></text>
          <text class="text">{{ item[navNameKey] || item }}</text>
        </view>
      </slot>
    </view>
    <view class="content">
      <slot />
    </view>
  </view>
</template>

<script>
import { pxTorpx } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cname: "category-nav",
      winTop: 0,
      winBottom: 0
    };
  },
  watch: {
    active(e) {
      this.$emit("change", e);
    }
  },
  props: {
    // 导航选中状态
    value: Number,
    // 距离顶部位置(无需加上导航栏高度)
    top: [String, Number],
    // 距离底部位置(无需加上tabbar高度)
    bottom: [String, Number],
    navs: Array,
    navNameKey: {
      type: String,
      default: "name"
    }
  },
  computed: {
    ...mapGetters(["windowBottom"]),
    active: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    activeColor() {
      return formatStyle({
        color: this.theme.color,
        backgroup: "#ffffff"
      });
    },
    numTop() {
      return pxTorpx(Number(this.top || 0) + this.winTop);
    },
    numBottom() {
      let num = this.windowBottom || this.winBottom;
      return pxTorpx(Number(this.bottom || 0) + num);
    },
    styleTop() {
      return { top: this.numTop };
    },
    styleBottom() {
      return { bottom: this.numBottom };
    }
  },
  created() {
    uni.getSystemInfo({
      success: res => {
        if (res.windowTop) this.winTop = res.windowTop;
        if (res.windowBottom) this.winBottom = res.windowBottom;
      }
    });
  },
  methods: {
    click(i) {
      this.active = i;
      this.$emit("click", i);
    }
  }
};
</script>

<style scoped lang="scss">
.category-nav {
  display: flex;
  flex-flow: row;
  background-color: $white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  .nav {
    width: 180rpx;
    flex: none;
    background-color: $background-color;
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      color: $text-color;
      display: flex;
      align-items: center;
      height: 92rpx;
      justify-content: center;
      position: relative;
      .text {
        white-space: pre-line;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        max-height: 64rpx;
        padding: 0 10rpx;
      }
      &.active {
        color: $red;
        background: $white;
      }
      &.active .text-line {
        position: absolute;
        display: block;
        width: 4rpx;
        height: 32rpx;
        background: $red;
        left: 0;
        top: 50%;
        margin-top: -16rpx;
      }
    }
  }
  .content {
    flex: 1;
    background-color: $white;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
