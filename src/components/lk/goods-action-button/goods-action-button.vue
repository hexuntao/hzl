<template>
  <lk-button
    custom-class="goods-action-button"
    :icon="icon"
    square
    block
    :type="type"
    :color="color"
    :loading="loading"
    :disabled="disabled"
    @click="onClick"
  >
    {{ text }}
  </lk-button>
</template>

<script>
import { basic, navigate } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("goods-action-button");

export default {
  data() {
    return {
      cname: "goods-action-button"
    };
  },
  mixins: [basic, navigate],
  props: {
    type: String,
    text: String,
    color: String,
    icon: String,
    loading: Boolean,
    disabled: Boolean
  },
  computed: {
    classes() {
      return formatClass(bem());
    }
  },
  mounted() {},
  methods: {
    onClick(event) {
      this.$emit("click", event);
      this.toNavigate();
    }
  }
};
</script>

<style scoped lang="scss">
.goods-action-button {
  flex: 1;
  height: 100rpx;
  font-weight: 500;
  font-size: $font-size;
  line-height: 100rpx;
  border: none;
}
</style>
