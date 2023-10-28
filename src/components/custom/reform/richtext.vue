<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="richtext" :style="styles">
        <lk-parser show-with-animation lazy-load :html="content"></lk-parser>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { Base64 } from "@/common/lib/base64";
export default {
  data() {
    return {
      content: ""
    };
  },
  mixins: [mixin],
  computed: {
    styles() {
      return formatStyle({
        padding: pxTorpx(this.items.style.padding)
      });
    }
  },
  mounted() {
    this.initIntersection().then(() => {
      this.content = this.items.params.content
        ? Base64.decode(this.items.params.content)
        : "";
    });
  }
};
</script>

<style scoped lang="scss"></style>
