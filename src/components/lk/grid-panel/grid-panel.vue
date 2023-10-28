<template>
  <view class="grid-panel" :class="cardClasses" :style="panelStyle">
    <slot name="header">
      <lk-cell :title="title" v-if="title"></lk-cell>
    </slot>
    <swiper class="swiper" indicator-dots :style="swiperStyle" v-if="swiper">
      <swiper-item
          class="swiper-item"
          v-for="(items, s) in swiperList"
          :key="s"
      >
        <view
            class="grid-panel-group"
            ref="grid-panel-group"
            :class="colsClass"
        >
          <view
              class="item"
              v-for="(item, index) in items"
              :key="index"

          >
            <button  open-type="contact" class="box " style="border:0px;background-color:#fff;"  v-if="item.linkurl=='pages/service/index' || item.linkurl=='/pages/service/index'">


              <view class="icon" :style="item.iconStyle">
                <lk-icon
                    v-if="item.icon"
                    :name="item.icon"
                    :class-prefix="item.iconPrefix || iconPrefix"
                    :color="item.iconColor || iconColor"
                    :size="item.iconSize || iconSize"
                    :info="item.iconInfo"
                    square
                />
              </view>
              <view
                  class="title"
                  :style="item.titleColor ? { color: item.titleColor } : ''"
              >

                {{ item.title }}
              </view>
              <view
                  class="text"
                  v-if="item.text"
                  :style="item.textColor ? { color: item.textColor } : ''"
              >

                {{ item.text }}
              </view>


            </button>

            <view class="box" @click="click(item, index)" v-if="item.linkurl!='pages/service/index' && item.linkurl!='/pages/service/index'">


              <view class="icon" :style="item.iconStyle">
                <lk-icon
                    v-if="item.icon"
                    :name="item.icon"
                    :class-prefix="item.iconPrefix || iconPrefix"
                    :color="item.iconColor || iconColor"
                    :size="item.iconSize || iconSize"
                    :info="item.iconInfo"
                    square
                />
              </view>
              <view
                  class="title"
                  :style="item.titleColor ? { color: item.titleColor } : ''"
              >

                {{ item.title }}
              </view>
              <view
                  class="text"
                  v-if="item.text"
                  :style="item.textColor ? { color: item.textColor } : ''"
              >

                {{ item.text }}
              </view>


            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view
        class="grid-panel-group"
        :class="colsClass"
        v-if="!swiper && items.length"
    >
      <view
          class="item"
          v-for="(item, index) in items"
          :key="index"

      >
        <button class="box" open-type="contact" style="border:0px;background-color:#fff;" @click="click(item, index)" v-if="item.linkurl=='pages/service/index' || item.linkurl=='/pages/service/index'">
          <view class="icon" :style="item.iconStyle">
            <lk-icon
                v-if="item.icon"
                :name="item.icon"
                :class-prefix="item.iconPrefix || iconPrefix"
                :color="item.iconColor || iconColor"
                :size="item.iconSize || iconSize"
                :info="item.iconInfo"
                square
            />
          </view>
          <view
              class="title"
              :style="item.titleColor ? { color: item.titleColor } : ''"
          >

            {{ item.title }}
          </view>
          <view
              class="text"
              v-if="item.text"
              :style="item.textColor ? { color: item.textColor } : ''"
          >

            {{ item.text }}
          </view>
        </button>
        <view class="box" @click="click(item, index)" v-if="item.linkurl!='pages/service/index' && item.linkurl!='/pages/service/index'">
          <view class="icon" :style="item.iconStyle">
            <lk-icon
                v-if="item.icon"
                :name="item.icon"
                :class-prefix="item.iconPrefix || iconPrefix"
                :color="item.iconColor || iconColor"
                :size="item.iconSize || iconSize"
                :info="item.iconInfo"
                square
            />
          </view>
          <view
              class="title"
              :style="item.titleColor ? { color: item.titleColor } : ''"
          >

            {{ item.title }}
          </view>
          <view
              class="text"
              v-if="item.text"
              :style="item.textColor ? { color: item.textColor } : ''"
          >

            {{ item.text }}
          </view>
        </view>
      </view>
    </view>
    <slot name="footer" />
  </view>
</template>

<script>
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {
      cname: "grid-panel",
      swiperHeight: ""
    };
  },
  props: {
    title: String,
    items: {
      type: Array,
      default: () => []
    },
    cols: {
      type: [String, Number],
      default: 0
    },
    iconPrefix: String,
    iconColor: String,
    iconSize: {
      type: [Number, String],
      default: 32
    },
    center: {
      type: Boolean,
      default: true
    },
    background: {
      type: String
    },
    // 尺寸大小  sm 小
    size: {
      type: String,
      default: ""
    },
    // 是否卡片式
    card: {
      type: Boolean,
      default: false
    },
    // 是否分页滑动
    swiper: {
      type: Boolean,
      default: false
    },
    // 行数（swiper开启情况才生效）
    row: {
      type: [Number, String],
      default: 1
    }
  },
  computed: {
    colsClass() {
      return formatClass([
        this.cols ? "cols-" + this.cols : "",
        this.size == "sm" ? "size-sm" : ""
      ]);
    },
    cardClasses() {
      return this.card ? "card-group-box" : "";
    },
    panelStyle() {
      let styles = {};
      if (this.background) {
        styles.background = this.background;
      }
      return formatStyle(styles);
    },
    swiperStyle() {
      let pH = this.size == "sm" ? 20 : 40;
      let itH = this.size == "sm" ? 52 : 80;
      let textH = this.items.some(({ text }) => text)
          ? this.size == "sm"
              ? 18
              : 20
          : 0;
      let iconH = (parseInt(this.iconSize) + 10) * 2;
      let height = (itH + textH + iconH) * parseInt(this.row) + pH;
      height = this.size == "sm" ? height + 30 : height + 10;
      return formatStyle({
        height: height + "rpx"
      });
    },
    swiperList() {
      let list = [];
      let total = parseInt(this.row) * parseInt(this.cols); //每页总条数
      let size = Math.ceil(this.items.length / total); //页码数
      for (var i = 0; i < this.items.length; i += total) {
        list.push(this.items.slice(i, i + total));
      }
      return list;
    }
  },
  methods: {
    click(item, index) {
      console.log(item, index)
      if (item.to) {
        return this.$Navigate.push(item.to);
      }
      this.$emit("item-click", item, index);
    }
  }
};
</script>

<style scope lang="scss">
.grid-panel {
  background-color: #fff;
}
button::after {
  border:0px;
}
.grid-panel-group {
  display: flex;
  padding-top: 20rpx;
  padding-left: 0;
  padding-bottom: 20rpx;
  padding-right: 0;
  .item {
    flex: 1;
    text-align: center;
    position: relative;
    padding-top: 20rpx;
    padding-left: 0;
    padding-bottom: 20rpx;
    padding-right: 0;
  }
  .box {
    display: flex;
    flex-flow: column;
    align-items: center;
    position: relative;
  }
  .icon {
  }
  .title {
    padding-top: 0;
    padding-left: 10rpx;
    padding-bottom: 0;
    padding-right: 10rpx;
    height: 40rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    line-height: 40rpx;
    font-size: $font-size;
  }
  .text {
    color: $text-light;
    font-size: $font-size-xs;
    max-width: 80%;
    line-height: 20rpx;
    margin: 0 auto;
    height: 20rpx;
    position: absolute;
    bottom: -20rpx;
    left: 0;
    right: 0;
  }
  &[class*="cols-"] {
    flex-flow: row wrap;
  }
  &[class*="cols-"] .item {
    flex: none;
  }
  &.cols-1 .item {
    width: 100%;
  }
  &.cols-2 .item {
    width: 50%;
  }
  &.cols-3 .item {
    width: 33.33333334%;
  }
  &.cols-4 .item {
    width: 25%;
  }
  &.cols-5 .item {
    width: 20%;
  }
}
.grid-panel-group.size-sm {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  .item {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }
  .title {
    line-height: 32rpx;
    height: 32rpx;
    font-size: $font-size-sm;
  }
  .text {
    line-height: 18rpx;
    height: 18rpx;
  }
}
</style>
