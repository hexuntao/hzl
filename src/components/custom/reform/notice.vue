<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <lk-notice-bar
        :text="items.params.text"
        scrollable
        single
        :color="items.style.color"
        :background="items.style.background"
      />
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
  mounted() {
    this.initIntersection().then(() => {});
  },
  computed: {},
  components: {}
};
</script>

<style scoped lang="scss"></style>
