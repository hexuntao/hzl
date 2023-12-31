<template>
  <view
    class="u-swiper-wrap"
    :style="{
      borderRadius: `${borderRadius}rpx`
    }"
  >
    <swiper
      :current="current"
      @change="change"
      @animationfinish="animationfinish"
      :interval="interval"
      :circular="circular"
      :duration="duration"
      :autoplay="autoplay"
      :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :style="{
        height: height
      }"
    >
      <swiper-item
        class="u-swiper-item"
        v-for="(item, index) in list"
        :key="index"
        @tap="listClick(index)"
      >
        <view
          class="u-list-image-wrap"
          :class="[current != index ? 'u-list-scale' : '']"
          :style="{
            borderRadius: `${borderRadius}rpx`,
            transform:
              effect3d && current != index ? 'scaleY(0.9)' : 'scaleY(1)',
            margin: effect3d && current != index ? '0 20rpx' : 0
          }"
        >
          <!-- #ifndef APP-PLUS -->
          <video
            v-if="item.video"
            id="itemVideo"
            ref="itemVideo"
            class="u-swiper-video"
            :src="item.video"
            :poster="list[1] && list[1] ? list[1][name] : ''"
            :show-fullscreen-btn="false"
            :enable-progress-gesture="false"
            object-fit="contain"
            play-btn-position="center"
            @play="videoPlay"
          />
          <image
            v-else
            class="u-swiper-image"
            :src="item[name]"
            :mode="imgMode"
          ></image>
          <!--  #endif -->
          <!-- #ifdef APP-PLUS -->
          <lk-iframe-video
            v-if="item.video"
            class="u-swiper-video"
            :src="item.video"
            :poster="list[1] && list[1] ? list[1][name] : ''"
          >
          </lk-iframe-video>
          <image
            v-else
            class="u-swiper-image"
            :src="item[name]"
            :mode="imgMode"
          ></image>
          <!--  #endif -->
          <view
            v-if="title"
            class="u-swiper-title u-line-1"
            :style="{
              'padding-bottom': titlePaddingBottom
            }"
          >
            {{ item.title }}
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view
      class="u-swiper-indicator"
      :style="{
        top:
          indicatorPos == 'topLeft' ||
          indicatorPos == 'topCenter' ||
          indicatorPos == 'topRight'
            ? '12rpx'
            : 'auto',
        bottom:
          indicatorPos == 'bottomLeft' ||
          indicatorPos == 'bottomCenter' ||
          indicatorPos == 'bottomRight'
            ? '12rpx'
            : 'auto',
        justifyContent: justifyContent,
        padding: `0 ${effect3d ? '74rpx' : '24rpx'}`
      }"
    >
      <block v-if="mode == 'rect'">
        <view
          class="u-indicator-item-rect"
          :class="{ 'u-indicator-item-rect-active': index == current }"
          :style="{
            backgroundColor:
              index == current ? indicatorActiveColor : indicatorColor
          }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'dot'">
        <view
          class="u-indicator-item-dot"
          :class="{ 'u-indicator-item-dot-active': index == current }"
          :style="{
            backgroundColor:
              index == current ? indicatorActiveColor : indicatorColor
          }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'round'">
        <view
          class="u-indicator-item-round"
          :class="{ 'u-indicator-item-round-active': index == current }"
          :style="{
            backgroundColor:
              index == current ? indicatorActiveColor : indicatorColor
          }"
          v-for="(item, index) in list"
          :key="index"
        ></view>
      </block>
      <block v-if="mode == 'number'">
        <view class="u-indicator-item-number"
          >{{ current + 1 }}/{{ list.length }}</view
        >
      </block>
    </view>
    <view class="foot-tab" v-if="isFirstVideo">
      <view
        class="item"
        :class="tabActive === 1 ? 'active' : ''"
        :style="tabActive === 1 ? 'background:' + theme.color : ''"
        @click="clickTab(1)"
        >视频</view
      >
      <view
        class="item"
        :class="tabActive === 2 ? 'active' : ''"
        :style="tabActive === 2 ? 'background:' + theme.color : ''"
        @click="clickTab(2)"
        >图片</view
      >
    </view>
  </view>
</template>

<script>
/**
 * swiper 轮播图
 * @description 该组件一般用于导航轮播，广告展示等场景,可开箱即用
 * @property {Array} list 轮播图数据，见官网"基本使用"说明
 * @property {Boolean} title 是否显示标题文字，需要配合list参数，见官网说明（默认false）
 * @property {String} mode 指示器模式，见官网说明（默认round）
 * @property {String Number} height 轮播图组件高度，单位rpx（默认250）
 * @property {String} indicator-pos 指示器的位置（默认bottomCenter）
 * @property {Boolean} effect3d 是否开启3D效果（默认false）
 * @property {Boolean} autoplay 是否自动播放（默认true）
 * @property {String Number} interval 自动轮播时间间隔，单位ms（默认2500）
 * @property {Boolean} circular 是否衔接播放，见官网说明（默认true）
 * @property {String Number} border-radius 轮播图圆角值，单位rpx（默认8）
 * @property {Object} title-style 自定义标题样式
 * @property {String Number} effect3d-previous-margin mode = true模式的情况下，激活项与前后项之间的距离，单位rpx（默认50）
 * @property {String} img-mode 图片的裁剪模式，详见image组件裁剪模式（默认aspectFill）
 * @event {Function} click 点击轮播图时触发
 * @example <u-swiper :list="list" mode="dot" indicator-pos="bottomRight"></u-swiper>
 */
export default {
  name: "u-swiper",
  props: {
    // 轮播图的数据,格式如：[{image: 'xxxx', title: 'xxxx'}，{image: 'yyyy', title: 'yyyy'}]，其中title字段可选
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否显示title标题
    title: {
      type: Boolean,
      default: false
    },
    // 用户自定义的指示器的样式
    indicator: {
      type: Object,
      default() {
        return {};
      }
    },
    // 圆角值
    borderRadius: {
      type: [Number, String],
      default: 0
    },
    // 隔多久自动切换
    interval: {
      type: [String, Number],
      default: 3000
    },
    // 指示器的模式，rect|dot|number|round
    mode: {
      type: String,
      default: "dot"
    },
    // list的高度，单位rpx
    height: {
      type: [Number, String],
      default: 250
    },
    // 指示器的位置，topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
    indicatorPos: {
      type: String,
      default: "bottomCenter"
    },
    indicatorColor: {
      type: String,
      default: "rgba(255, 255, 255, 0.3)"
    },
    indicatorActiveColor: {
      type: String,
      default: "rgba(0, 0, 0, .8)"
    },
    // 是否开启缩放效果
    effect3d: {
      type: Boolean,
      default: false
    },
    // 3D模式的情况下，激活item与前后item之间的距离，单位rpx
    effect3dPreviousMargin: {
      type: [Number, String],
      default: 50
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: true
    },
    // 自动轮播时间间隔，单位ms
    duration: {
      type: [Number, String],
      default: 500
    },
    // 是否衔接滑动，即到最后一张时接着滑动，是佛自动切换到第一张
    circular: {
      type: Boolean,
      default: true
    },
    // 图片的形式模式
    imgMode: {
      type: String,
      default: "aspectFill"
    },
    // 从list数组中读取的图片的属性名
    name: {
      type: String,
      default: "image"
    }
  },
  data() {
    return {
      current: 0, // 当前活跃的swiper-item的index
      tabActive: 1
    };
  },
  computed: {
    justifyContent() {
      if (this.indicatorPos == "topLeft" || this.indicatorPos == "bottomLeft")
        return "flex-start";
      if (
        this.indicatorPos == "topCenter" ||
        this.indicatorPos == "bottomCenter"
      )
        return "center";
      if (this.indicatorPos == "topRight" || this.indicatorPos == "bottomRight")
        return "flex-end";
    },
    titlePaddingBottom() {
      let tmp = 0;
      if (this.mode == "none") return "12rpx";
      if (
        ["bottomLeft", "bottomCenter", "bottomRight"].indexOf(
          this.indicatorPos
        ) >= 0 &&
        this.mode == "number"
      ) {
        tmp = "60rpx";
      } else if (
        ["bottomLeft", "bottomCenter", "bottomRight"].indexOf(
          this.indicatorPos
        ) >= 0 &&
        this.mode != "number"
      ) {
        tmp = "40rpx";
      } else {
        tmp = "12rpx";
      }
      return tmp;
    },
    isFirstVideo() {
      let flag = false;
      if (this.list[0] && this.list[0].video) {
        flag = true;
      }
      return flag;
    }
  },
  mounted() {
    if (this.isFirstVideo) {
      this.videoContext = uni.createVideoContext("itemVideo", this);
    }
  },
  methods: {
    listClick(index) {
      this.$emit("click", index);
    },
    change(e) {
      this.current = e.detail.current;
      if (this.isFirstVideo) {
        this.tabActive = this.current === 0 ? 1 : 2;
        if (this.videoContext && this.videoStart) {
          if (this.tabActive === 1) {
            this.videoContext.play();
          } else {
            this.videoContext.pause();
          }
        }
      }
      this.$emit("change", this.current);
    },
    // 头条小程序不支持animationfinish事件，改由change事件
    // 暂不监听此事件，因为不再给swiper绑定current属性
    animationfinish(e) {
      // #ifndef MP-TOUTIAO
      // this.current = e.detail.current;
      // #endif
    },
    videoPlay(e) {
      this.videoStart = true;
    },
    clickTab(e) {
      this.tabActive = e;
      if (e == 1 && this.current != 0) {
        this.current = 0;
      }
      if (e == 2 && this.current == 0) {
        this.current = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-swiper-wrap {
  position: relative;
  overflow: hidden;
}

.u-swiper-image {
  width: 100%;
  will-change: transform;
  height: 100%;
  display: block;
  /* #ifdef H5 */
  pointer-events: none;
  /* #endif */
}
.u-swiper-video {
  display: block;
  width: 100%;
  height: 100%;
}
.u-swiper-indicator {
  padding: 0 24rpx;
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 1;
}

.u-indicator-item-rect {
  width: 26rpx;
  height: 8rpx;
  margin: 0 6rpx;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.3);
}

.u-indicator-item-rect-active {
  background-color: rgba(255, 255, 255, 0.8);
}

.u-indicator-item-dot {
  width: 14rpx;
  height: 14rpx;
  margin: 0 6rpx;
  border-radius: 20rpx;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.3);
}

.u-indicator-item-dot-active {
  background-color: rgba(255, 255, 255, 0.8);
}

.u-indicator-item-round {
  width: 14rpx;
  height: 14rpx;
  margin: 0 6rpx;
  border-radius: 20rpx;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.3);
}

.u-indicator-item-round-active {
  width: 34rpx;
  background-color: rgba(255, 255, 255, 0.8);
}

.u-indicator-item-number {
  padding: 6rpx 16rpx;
  line-height: 1;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.u-list-scale {
  transform-origin: center center;
}

.u-list-image-wrap {
  width: 100%;
  height: 100%;
  flex: 1;
  transition: all 0.5s;
  overflow: hidden;
  box-sizing: content-box;
  position: relative;
}

.u-swiper-title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 28rpx;
  padding: 12rpx 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.u-swiper-item {
  display: flex;
  overflow: hidden;
  align-items: center;
}

.foot-tab {
  display: flex;
  position: absolute;
  width: 100%;
  height: 48rpx;
  left: 0;
  bottom: 70rpx;
  z-index: 10;
  justify-content: center;
  .item {
    display: flex;
    width: 100rpx;
    height: 48rpx;
    align-items: center;
    justify-content: center;
    color: $text-gray;
    font-size: $font-size-sm;
    border-radius: 99999rpx;
    background: #f2f3f5;
    margin: 0 20rpx;
  }
  .item.active {
    color: #ffffff;
    background: $red;
  }
}
</style>
