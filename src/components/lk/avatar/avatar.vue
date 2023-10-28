<template>
  <view class="u-avatar" :style="[wrapStyle]" @tap="click">
    <image
      @error="loadError"
      :style="[imgStyle]"
      class="u-avatar-img"
      v-if="!text && defaultAvatar"
      :src="defaultAvatar"
      :mode="imgMode"
    ></image>
    <text class="u-line-1" v-else-if="text">{{ text }}</text>
    <slot v-else></slot>
  </view>
</template>

<script>
/**
 * avatar 头像
 * @description 本组件一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。
 * @tutorial https://www.uviewui.com/components/avatar.html
 * @property {String} bg-color 背景颜色，一般显示文字时用（默认#ffffff）
 * @property {String} src 头像路径，如加载失败，将会显示默认头像
 * @property {String Number} size 头像尺寸，可以为指定字符串(large, default, mini)，或者数值，单位rpx（默认default）
 * @property {String} mode 显示类型，见上方说明（默认circle）
 * @property {String} text 用文字替代图片，级别优先于src
 * @property {String} img-mode 头像图片的裁剪类型，与uni的image组件的mode参数一致，如效果达不到需求，可尝试传widthFix值（默认aspectFill）
 * @property {String} index 用户传递的标识符值，如果是列表循环，可穿v-for的index值
 * @event {Function} click 头像被点击
 * @example <u-avatar :src="src"></u-avatar>
 */
import { mapGetters } from "vuex";
export default {
  name: "u-avatar",
  props: {
    // 背景颜色
    bgColor: {
      type: String,
      default: "transparent"
    },
    // 头像路径
    src: {
      type: String,
      default: ""
    },
    // 尺寸，large-大，default-中等，mini-小，如果为数值，则单位为rpx
    // 宽度等于高度
    size: {
      type: [String, Number],
      default: "default"
    },
    // 头像模型，square-带圆角方形，circle-圆形
    mode: {
      type: String,
      default: "circle"
    },
    // 文字内容
    text: {
      type: String,
      default: ""
    },
    // 图片的裁剪模型
    imgMode: {
      type: String,
      default: "aspectFill"
    },
    // 标识符
    index: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      error: false
    };
  },
  computed: {
    ...mapGetters(["static"]),
    wrapStyle() {
      let style = {};
      style.height =
	  
        this.size == "large"
          ? "120rpx"
		  : this.size == "max"
		  ? "170rpx"
          : this.size == "default"
          ? "90rpx"
          : this.size == "mini"
          ? "70rpx"
          : this.size + "rpx";
      style.width = style.height;
      style.flex = `0 0 ${style.height}`;
      style.backgroundColor = this.bgColor;
      style.borderRadius = this.mode == "circle" ? "500px" : "5px";
      if (this.text) style.padding = `0 6rpx`;
      return style;
    },
    defaultAvatar() {
      if (!this.src) return this.static.noAvatar;
      else if (this.src && this.error) return this.static.noAvatar;
      else return this.src;
    },
    imgStyle() {
      let style = {};
      style.borderRadius = this.mode == "circle" ? "500px" : "5px";
      return style;
    }
  },
  methods: {
    // 图片加载错误时，显示默认头像
    loadError() {
      this.error = true;
    },
    click() {
      this.$emit("click", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.u-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: $text-color;
  border-radius: 10px;
  overflow: hidden;
}

.u-avatar-img {
  width: 100%;
  height: 100%;
}
</style>
