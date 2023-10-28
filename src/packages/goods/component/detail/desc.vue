<template>
  <view :class="items.id">
    <evaluate :info="items.params" />
    <catalog :info="items.params" v-if="items.params.isCatalog" />
    <view class="desc-group">
      <view class="descript richtext">
        <lk-parser
          v-if="content"
          show-with-animation
          lazy-load
          :html="content"
        ></lk-parser>
        <view v-else class="empty">暂无详情</view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters } from "vuex";
import evaluate from "./evaluate";
import catalog from "./catalog";
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    content() {
      return this.items.params.content;
    }
  },
  methods: {},
  components: {
    evaluate,
    catalog
  }
};
</script>

<style scoped lang="scss">
.desc-group {
  background: #fff;
}
</style>
