<template>
  <view class="s-tabs" :class="tabsClasses">
    <view class="s-tabs-nav-wrap lk-hairline--top-bottom" :style="navStyles">
      <scroll-view
        class="scroll-wrap"
        :show-scrollbar="false"
        scroll-with-animation
        scroll-x
        :scroll-left="scrollLeft"
      >
        <view class="scroll-view">
          <view class="s-tab-nav-view">
            <block v-if="!slotTitle">
              <view
                v-for="(item, index) of navInfoList"
                :class="[
                  's-tab-nav',
                  { 'is-disabled': item.disabled },
                  { 'is-active': active == index }
                ]"
                :style="
                  navWidth +
                    'color:' +
                    (active == index
                      ? themeColor
                        ? theme.color
                        : activeColor
                      : color)
                "
                :key="index"
                @click="navClick(index, item)"
              >
                {{ item.title }}
              </view>
            </block>
            <slot v-else></slot>
          </view>
          <view v-if="line" class="s-tab-line" :style="lineStyles"></view>
        </view>
      </scroll-view>
    </view>
    <view v-if="!slotTitle" class="s-tabs-content-wrap" :style="contentStyles">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { basic } from "../../mixin";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    this.navContextList = [];
    return {
      active: 0,
      diffLeft: 0,
      scrollLeft: 0,
      lineWidth: 0,
      lineLeft: 0,
      navInfoList: []
    };
  },
  props: {
    // v-model双向绑定
    value: {
      type: Number,
      default: 0
    },
    // 使子组件s-tab的slot成为导航的填充内容
    slotTitle: {
      type: Boolean,
      default: false
    },
    // 导航颜色
    color: {
      type: String,
      default: "#323233"
    },
    // 导航选中颜色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 导航高度 px
    height: {
      type: Number,
      default: 44
    },
    // 导航自适应宽度还是百分比等分
    navPerView: {
      type: [Number, String],
      default: "auto"
    },
    // 内容部分是否动画切换
    effect: {
      type: Boolean,
      default: false
    },
    // 内容部分动画切换时间
    duration: {
      type: Number,
      default: 0.3
    },
    // 内容部分是否开启延迟渲染（首次切换到标签时才触发内容渲染）
    lazyRender: {
      type: Boolean,
      default: true
    },
    // 是否显示底部条
    line: {
      type: Boolean,
      default: true
    },
    // 底部条颜色
    lineColor: {
      type: String,
      default: "#f44"
    },
    // 底部条高度 px
    lineHeight: {
      type: Number,
      default: 2
    },
    // 底部条宽度相对于标签宽度比例
    lineScale: {
      type: Number,
      default: 0.6
    },
    themeColor: Boolean
  },
  mixins: [basic],
  computed: {
    tabsClasses() {
      return formatClass([this.customClass]);
    },
    navStyles() {
      return formatStyle({
        height: pxTorpx(this.height),
        background: this.background || ""
      });
    },
    lineStyles() {
      return formatStyle({
        width: this.lineWidth + "px",
        height: pxTorpx(this.lineHeight),
        background: this.themeColor ? this.theme.color : this.lineColor,
        transform: "translateX(" + this.lineLeft + "px)"
      });
    },
    contentStyles() {
      return formatStyle({
        transform: `translate3d(${-100 * this.active}%, 0, 0)`,
        transitionDuration: this.effect ? `${this.duration}s` : ""
      });
    },
    navWidth() {
      const perView = parseInt(this.navPerView);
      return isNaN(perView) ? "" : "width:" + 100 / perView + "%;";
    }
  },
  provide() {
    return {
      $tabs: this
    };
  },
  watch: {
    value(index) {
      this.active = this.value;
      this.renderContent();
      this.refreshNavScroll();
    }
  },
  created() {
    this.active = this.value;
  },
  mounted() {
    this.renderContent();
    this.refreshNavScroll(true);
  },
  methods: {
    navClick(index, item) {
      if (index != this.active && !item.disabled) {
        this.active = index;
        this.$emit("input", index);
        this.$emit("change", index);
        this.renderContent();
        this.refreshNavScroll();
      }
    },
    renderContent() {
      this.$nextTick(() => {
        const item = this.navContextList[this.active];
        if (item && !item.info.isRender) {
          item.info.isRender = true;
          this.$emit("render", this.active);
        }
      });
    },
    refreshNavScroll(isInit) {
      this.$nextTick(() => {
        const query = () => uni.createSelectorQuery().in(this);
        query()
          .select(".s-tabs-nav-wrap")
          .boundingClientRect()
          .exec(([wrap]) => {
            query()
              .select(".s-tab-nav-view")
              .boundingClientRect()
              .exec(([view]) => {
                if (isInit) {
                  this.diffLeft = view.left - wrap.left;
                }
                const setNavScroll = item => {
                  if (item) {
                    const centerLeft = (wrap.width - item.width) / 2;
                    this.scrollLeft =
                      Math.abs(view.left - wrap.left - this.diffLeft) +
                      (item.left - centerLeft - wrap.left);
                    this.lineWidth = item.width * this.lineScale;
                    this.lineLeft =
                      this.scrollLeft +
                      centerLeft +
                      (item.width - this.lineWidth) / 2;
                  }
                };
                if (this.slotTitle) {
                  uni
                    .createSelectorQuery()
                    .in(this.navContextList[this.active])
                    .select(".s-tab-nav")
                    .boundingClientRect()
                    .exec(([item]) => {
                      setNavScroll(item);
                    });
                } else {
                  query()
                    .selectAll(".s-tab-nav")
                    .boundingClientRect()
                    .exec(([list]) => {
                      setNavScroll(list[this.active]);
                    });
                }
              });
          });
      });
    }
  }
};
</script>

<style lang="scss">
.s-tabs {
  width: 100%;
  position: relative;
  overflow-x: hidden;
  &-nav-wrap {
    width: 100%;
    height: 88rpx;
    display: flex;
    white-space: nowrap;
    background: #fff;
    .scroll-wrap {
      height: 100%;
      ::-webkit-scrollbar {
        display: none;
      }
      // #ifdef H5
      /deep/ {
        & .uni-scroll-view > div {
          height: 100%;
        }
      }
      // #endif
    }
    .scroll-view {
      height: 100%;
      position: relative;
    }
    .s-tab-nav-view {
      height: 88rpx;
    }
  }
  .s-tab-nav {
    display: inline-flex;
    height: 100%;
    font-size: $font-size;
    padding: 0 30rpx;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    &.is-disabled {
      color: #c8c9cc !important;
    }
  }
  .s-tab-line {
    position: absolute;
    bottom: 0;
    border-radius: 6rpx;
    transition: all 0.3s;
  }
  &-content-wrap {
    display: flex;
    white-space: nowrap;
    lk-tab {
      width: 100%;
      flex-shrink: 0;
      box-sizing: border-box;
    }
  }
}
</style>
