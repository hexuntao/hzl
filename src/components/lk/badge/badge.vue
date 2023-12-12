<template>
  <text
    v-if="dot || text"
    :class="classes"
    :style="styles"
    class="badge"
    @click="onClick"
  >
    {{ dot ? "" : text }}
  </text>
</template>

<script>
/**
 * Badge 数字角标
 * @description 数字角标一般和其它控件（列表、9宫格等）配合使用，用于进行数量提示，默认为实心灰色背景
 * @property {String} text 角标内容
 * @property {String} type = [default|primary|green|warning|danger] 颜色类型
 * 	@value default 灰色
 * 	@value primary 蓝色
 * 	@value green 绿色
 * 	@value warning 黄色
 * 	@value danger 红色
 * @property {String} size = [normal|sm] Badge 大小
 * 	@value normal 一般尺寸
 * 	@value sm 小尺寸
 * @property {String} inverted = [true|false] 是否无需背景颜色
 * @property {Boolean} dot [true|false] 是否只显示点
 * @event {Function} click 点击 Badge 触发事件
 * @example <badge text="1"></badge>
 */
import { basic } from "../../mixin";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {
      cname: "badge"
    };
  },
  mixins: [basic],
  props: {
    type: {
      type: String,
      default: "default"
    },
    dot: {
      type: Boolean,
      default: false
    },
    inverted: {
      type: Boolean,
      default: false
    },
    text: {
      type: [String, Number],
      default: ""
    },
    size: {
      type: String,
      default: "normal"
    }
  },
  computed: {
    classes() {
      let arr = [];
      arr.push(
        this.customClass,
        this.dot ? "dot" : "",
        this.inverted
          ? "badge--" +
              this.type +
              " badge--" +
              this.size +
              " badge--" +
              this.type +
              "-inverted"
          : "badge--" + this.type + " badge--" + this.size
      );
      return formatClass(arr);
    },
    styles() {
      return formatStyle({
        ...this.customStyle,
        width: `${this.dot ? "" : pxTorpx(String(this.text).length * 8 + 12)}`
      });
    }
  },
  mounted() {},
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
.badge {
  /* #ifndef APP-PLUS-NVUE */
  display: inline-flex;
  box-sizing: border-box;
  /* #endif */
  justify-content: center;
  flex-direction: row;
  height: 40rpx;
  line-height: 40rpx;
  color: $text-color;
  border-radius: 200rpx;
  background-color: $background-color;
  background-color: transparent;
  text-align: center;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  font-size: $font-size-sm;
  padding: 0px 12rpx;
}

.badge--inverted {
  padding: 0 10rpx 0 0;
  color: $background-color;
}

.badge--default {
  color: $text-color;
  background-color: $background-color;
}

.badge--default-inverted {
  color: $text-gray;
  background-color: transparent;
}

.badge--info {
  color: #ffffff;
  background-color: $blue;
}

.badge--info-inverted {
  color: $blue;
  background-color: transparent;
}

.badge--primary {
  color: #ffffff;
  background-color: $green;
}

.badge--primary-inverted {
  color: $green;
  background-color: transparent;
}

.badge--warning {
  color: #ffffff;
  background-color: $orange;
}

.badge--warning-inverted {
  color: $orange;
  background-color: transparent;
}

.badge--danger {
  color: #ffffff;
  background-color: $red;
}

.badge--danger-inverted {
  color: $red;
  background-color: transparent;
}

.badge--sm {
  transform: scale(0.8);
  transform-origin: center center;
}

.dot {
  width: 16rpx;
  /* #ifndef APP-PLUS-NVUE */
  min-width: 0;
  /* #endif */
  height: 16rpx;
  border-radius: 100%;
  padding: 0;
}
</style>
