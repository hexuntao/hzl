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
        :title="item.titleText"
        v-for="(item, index) in list"
        :key="index"
      >
        <view slot="titleRight" :class="item.numClass">{{ item.numText }}</view>
        <view slot="label" class="label">
          <view>{{ item.labelText }}</view>
          <view>{{ item.timeText }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_DEPOTLOG } from "@/common/interface/channel";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
const titleObj = {
  1: "采购",
  2: "自提",
  3: "出货",
  4: "零售"
};
export default {
  name: "packages-channel-depot-log",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  onLoad() {},
  mixins: [loadMixin],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_DEPOTLOG(this.params)
        .then(({ data }) => {
          let list = data.channel_goods_info || [];
          list.forEach(e => {
            e.titleText = `${titleObj[e.buy_type]}：${e.goods_name}`;
            e.numText = `${e.buy_type == 1 ? "+" : "-"}${e.total_num}`;
            e.numClass = `${e.buy_type == 1 ? "color-success" : "color-fail"}`;
            e.labelText = `关联单号${e.order_no}`;
            e.timeText = `${formatDate(e.create_time, "YYYY-MM-DD hh:mm:ss")}`;
          });
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
.color-success {
  color: $green;
}

.color-fail {
  color: $red;
}
.label {
  font-size: $font-size-sm;
  color: $text-light;
  display: flex;
  justify-content: space-between;
}
</style>
