<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <lk-search
        :placeholder="items.params.placeholder"
        :custom-style="searchStyle"
        disabled
        :background="items.style.background"
        :content-style="{ background: '#ffffff' }"
        @click="click"
      />
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  mixins: [mixin],
  computed: {
    ...mapGetters({
      routeInfo: "route"
    }),
    searchStyle() {
      return {
        padding:
          pxTorpx(this.items.style.paddingtop) +
          " " +
          pxTorpx(this.items.style.paddingleft)
      };
    }
  },
  mounted() {
    this.initIntersection().then(() => {});
  },
  methods: {
    click() {
      let query = {};
      query.type = this.type == 9 ? "integralgoods" : "goods";
      if (this.type == 2 && this.routeInfo.query.shop_id) {
        query.shop_id = this.routeInfo.query.shop_id;
      }
      this.$Navigate.push({
        path: "/packages/mall/search",
        query
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss"></style>
