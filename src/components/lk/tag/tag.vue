<template>
  <view :style="tagStyles" :class="tagClasses" @click="onClick">
    <view><slot /></view>
    <lk-icon
      name="cross"
      :class="closeClasses"
      @click="onClose"
      v-if="closeable"
    />
  </view>
</template>

<script>
import { basic } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";
import { BORDER_SURROUND } from "@/common/utils/constant";

const bem = create("tag");

export default {
  mixins: [basic],
  props: {
    size: String,
    mark: Boolean,
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String,
    closeable: Boolean,
    type: {
      type: String,
      default: "default"
    }
  },
  computed: {
    tagStyles() {
      return formatStyle({
        color: this.textColor || !this.plain || this.color,
        backgroundColor: this.plain || this.color,
        ...this.customStyle
      });
    },
    tagClasses() {
      const classes = { mark: this.mark, plain: this.plain, round: this.round };
      if (this.size) {
        classes[this.size] = this.size;
      }
      return formatClass([
        bem([classes, this.type]),
        { [BORDER_SURROUND]: this.plain },
        this.customClass
      ]);
    },
    closeClasses() {
      return formatClass(bem("close"));
    }
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
.lk-tag {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  padding: 0.2em 0.5em;
  color: #fff;
  font-size: $font-size-xs;
  line-height: 1.2;
  border-radius: 0.2em;
}
.lk-tag::after {
  border-color: currentColor;
  border-radius: 0.4em;
}
.lk-tag--default {
  background-color: $text-light;
}
.lk-tag--default.lk-tag--plain {
  color: $text-light;
}
.lk-tag--danger {
  background-color: $red;
}
.lk-tag--danger.lk-tag--plain {
  color: $red;
}
.lk-tag--primary {
  background-color: $blue;
}
.lk-tag--primary.lk-tag--plain {
  color: $blue;
}
.lk-tag--success {
  background-color: $green;
}
.lk-tag--success.lk-tag--plain {
  color: $green;
}
.lk-tag--warning {
  background-color: $orange;
}
.lk-tag--warning.lk-tag--plain {
  color: $orange;
}
.lk-tag--plain {
  background-color: #fff;
}
.lk-tag--mark {
  padding-right: 0.7em;
}
.lk-tag--mark,
.lk-tag--mark::after {
  border-radius: 0 999rpx 999rpx 0;
}
.lk-tag--round,
.lk-tag--round::after {
  border-radius: 999rpx;
}
.lk-tag--medium {
  font-size: $font-size-sm;
}
.lk-tag--large {
  font-size: $font-size;
}
.lk-tag__close {
  min-width: 1em;
  margin-left: 4rpx;
  cursor: pointer;
}
</style>
