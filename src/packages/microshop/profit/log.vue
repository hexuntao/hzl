<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell
        v-for="(item, index) in list"
        :key="index"
        :value="item.create_time"
      >
        <view slot="title" :class="item.profit > 0 ? 'positive' : 'negative'">
          {{ item.profit }}
        </view>
        <view slot="label" class="label">{{ item.text }}</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_MICROSHOPLOG } from "@/common/interface/microshop";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-microshop-profit-log",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MICROSHOPLOG(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.positive {
  color: $green;
}
.negative {
  color: $red;
}

.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
</style>
