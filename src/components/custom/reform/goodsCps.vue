<template>
  <view :class="items.id">
    <view class="reform-box"></view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, yuan } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [mixin],
  computed: {},
  created() {},
  mounted() {
    this.initIntersection().then(() => {});
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss"></style>
