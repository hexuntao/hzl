<template>
  <view :class="classes" :style="styles" @click="click">
    <lk-badge
      v-if="dot || info"
      :dot="dot"
      :text="info"
      type="danger"
      size="sm"
      :custom-style="badgeStyle"
    />
    <image
      v-if="isImage"
      :src="imageSrc"
      mode="aspectFit"
      class="image"
      @error="imgError"
    />
  </view>
</template>

<script>
const prefix = "icons";
import { basic } from "../../mixin";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      cname: "icon",
      errorImgSrc: ""
    };
  },
  mixins: [basic],
  props: {
    name: {
      type: String,
      required: true
    },
    dot: {
      type: Boolean,
      default: false
    },
    info: [String, Number],
    color: {
      type: String
    },
    size: {
      type: [String, Number]
    },
    classPrefix: {
      type: String,
      default: prefix
    },
    // 是否正方形，自动设置宽高
    square: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["static"]),
    isImage() {
      return this.name ? this.name.indexOf("/") !== -1 : false;
    },
    imageSrc() {
      return this.errorImgSrc || this.name;
    },
    styles() {
      let obj = {};
      if (this.size) {
        obj.fontSize = pxTorpx(this.size);
      }
      if (this.square) {
        obj.width = pxTorpx(Number(this.size || 14) + 10);
        obj.height = pxTorpx(Number(this.size || 14) + 10);
      }
      if (this.color) {
        obj.color = this.color;
      }
      return formatStyle({
        ...obj,
        ...this.customStyle
      });
    },
    classes() {
      return formatClass([
        this.customClass,
        this.classPrefix,
        this.isImage
          ? "icon-image"
          : this.classPrefix != prefix
          ? this.name
          : `${this.classPrefix}-${this.name}`
      ]);
    },
    badgeStyle() {
      let p = `-${pxTorpx(this.dot ? 2 : 8)}`;
      return {
        position: "absolute",
        top: p,
        right: p
      };
    }
  },
  methods: {
    click() {
      this.$emit("click");
    },
    imgError() {
      this.errorImgSrc = this.static.noSquare;
    }
  }
};
</script>

<style scoped lang="scss">
.icon-image{
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}
.image {
  width: 1em;
  height: 1em;
  /* #ifndef APP-PLUS-NVUE */
  object-fit: contain;
  /* #endif */
}
</style>
