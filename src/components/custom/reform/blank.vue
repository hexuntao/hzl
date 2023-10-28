<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view :style="itemStyle"></view>
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
        height: pxTorpx(this.items.style.height)
      });
    }
  },
  mounted() {
    this.initIntersection().then(() => {});
  }
};
</script>

<style scoped lang="scss"></style>
