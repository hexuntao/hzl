<template>
  <view :class="cellClass" :style="cellStyle" @click="onClick">
    <slot name="icon">
      <lk-icon
        v-if="icon"
        :class="leftIconClass"
        :name="icon"
        :size="iconSize"
        :custom-style="iconStyle"
        :square="iconSquare"
        :class-prefix="iconPrefix"
      />
    </slot>



    <view v-if="showTitle" :class="titleClasses">

      <slot name="title">
        <view :class="titleBoxClasses">
          <text :class="titleTextClasses" :style="titleTextStyles">{{ order_no || '' }}</text>

        </view>
      </slot>


      <slot name="title">
        <view :class="labelClasses">
          <text :class="titleTextClasses" :style="titleTextStyles">{{ title || '' }}</text>
          <slot name="titleRight">
            <text
              :class="titleRightClasses"
              :style="titleRightStyles"
              v-if="titleRight"
              >{{ titleRight }}</text
            >
          </slot>
        </view>
      </slot>
      <slot name="label">
        <view v-if="showLabel" :class="labelClasses">{{ label }}</view>
      </slot>
    </view>
    <view v-if="showValue" :class="valueClasses">
      <slot>
        <text>{{ value || "" }}</text>
      </slot>
    </view>
    <slot name="rightIcon">
      <lk-icon v-if="isLink" :class="rightIconClass" :name="arrowIcon" />
    </slot>
  </view>
</template>

<script>
import { basic, navigate } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("cell");

export default {
  data() {
    return {
      cname: "cell"
    };
  },
  mixins: [basic, navigate],
  props: {
    icon: String,
    iconSize: null,
    iconSquare: {
      type: Boolean,
      default: true
    },
    iconStyle: {
      type: Object,
      default: () => {}
    },
    iconPrefix: {
      type: String,
      default: "icons"
    },
    size: String,
    center: Boolean,
    isLink: Boolean,
    required: Boolean,
    field: Boolean,
    clickable: Boolean,
    titleStyle: {
      type: Object,
      default: () => {}
    },
    titleRightStyle: {
      type: Object,
      default: () => {}
    },
    titleClass: null,
    valueClass: null,
    labelClass: null,
    title: [Number, String],
    order_no:[Number, String],
    titleRight: [Number, String],
    value: [Number, String],
    label: [Number, String],
    arrowDirection: String,
    border: {
      type: Boolean,
      default: true
    },
    background: String
  },
  computed: {
    cellStyle() {
      let styles = {
        ...this.customStyle
      };
      if (this.background) {
        styles.background = this.background;
      }
      return formatStyle(styles);
    },
    cellClass() {
      return formatClass([
        bem({
          clickable: this.isLink || this.clickable,
          center: this.center,
          required: this.required,
          field: this.field,
          borderless: !this.border,
          [this.size]: this.size
        }),
        this.customClass
      ]);
    },
    leftIconClass() {
      return bem("left-icon");
    },
    showTitle() {
      return this.$slots.title || isDef(this.title);
    },
    titleClasses() {
      return formatClass([bem("title"), this.titleClass]);
    },
    titleBoxClasses() {
      return formatClass([bem("title-box")]);
    },
    titleTextClasses() {
      return formatClass([bem("title-text")]);
    },
    titleRightClasses() {
      return formatClass([bem("title-right")]);
    },
    titleTextStyles(){
      return formatStyle({
        ...this.titleStyle
      })
    },
    titleRightStyles(){
      return formatStyle({
        ...this.titleRightStyle
      })
    },
    showLabel() {
      return this.$slots.label || isDef(this.label);
    },
    labelClasses() {
      return formatClass([bem("label"), this.labelClass]);
    },
    showValue() {
      return this.$slots.default || isDef(this.value);
    },
    valueClasses() {
      return formatClass([
        bem("value", { alone: !this.$slots.title && !this.title }),
        this.valueClass
      ]);
    },
    rightIconClass() {
      return formatClass(bem("right-icon"));
    },
    arrowIcon() {
      return formatClass(
        this.arrowDirection ? `arrow-${this.arrowDirection}` : "arrow"
      );
    }
  },
  methods: {
    onClick(e) {
      if (this.to || this.url) {
        this.toNavigate();
      } else {
        this.$emit("click", e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.lk-cell {
  position: relative;
  display: flex;
  flex-flow: row;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 30rpx;
  overflow: hidden;
  color: $text-color;
  font-size: $font-size;
  line-height: 48rpx;
  background-color: #fff;
}

.lk-cell::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.lk-cell--borderless::after {
  display: none;
}
.lk-cell__label {
  margin-top: 6rpx;
  color: $text-light;
  font-size: $font-size-sm;
  line-height: 36rpx;
}
.lk-cell__title,
.lk-cell__value {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.lk-cell__title-box {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.lk-cell__title-text {
  flex: 1;
}
.lk-cell__title-right {
  flex: none;
  color: $text-gray;
  font-size: $font-size-sm;
}
.lk-cell__value {
  position: relative;
  overflow: hidden;
  color: $text-light;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
}
.lk-cell__value--nowrap {
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2; /*行数*/
}
.lk-cell__value--alone {
  color: $text-color;
  text-align: left;
}
.lk-cell__left-icon,
.lk-cell__right-icon {
  min-width: 1em;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  font-size: 32rpx;
}
.lk-cell__left-icon {
  margin-right: 10rpx;
}
.lk-cell__right-icon {
  margin-left: 10rpx;
  color: $text-light;
  width: 32rpx;
}

.lk-cell--clickable:active {
  background-color: #f2f3f5;
}

.lk-cell--required {
  overflow: visible;
}
.lk-cell--required::before {
  position: absolute;
  left: 8px;
  color: $red;
  font-size: $font-size;
  content: "*";
}
.lk-cell--field {
  .lk-cell__title {
    max-width: 180rpx;
  }
  .lk-cell__value {
    text-align: left;
  }
}
.lk-cell--center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.lk-cell--large {
  padding-top: 24rpx;
  padding-bottom: 24rpx;
}
.lk-cell--large .lk-cell__title {
  font-size: $font-size-lg;
}
.lk-cell--large .lk-cell__label {
  font-size: $font-size;
}
</style>
