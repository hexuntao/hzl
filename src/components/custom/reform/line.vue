<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="vui-line" :style="itemStyle">
        <view class="line" :style="lineStyle"></view>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {};
  },
  mixins: [mixin],
  computed: {
    itemStyle() {
      return formatStyle({
        background: this.items.style.background,
        padding: pxTorpx(this.items.style.padding) + " " + 0
      });
    },
    lineStyle() {
      return formatStyle({
        borderTop:
          pxTorpx(this.items.style.height) +
          " " +
          this.items.style.linestyle +
          " " +
          this.items.style.border
      });
    }
  },
  mounted() {
    this.initIntersection().then(() => {});
  }
};
</script>

<style scoped lang="scss"></style>
