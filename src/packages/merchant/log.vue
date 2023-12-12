<template>
  <view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell :value="item.create_time" v-for="(item, index) in list" :key="index">
        <view slot="title">
          <view :class="item.number > 0 ? 'positive' : 'negative'">{{ item.number }}</view>
          <view  class="label">{{item.text}}</view>
        </view>
        <view>
          <view class="time">{{ item.create_time }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>
<script>
import { GET_WAPGETACHIEVEMENTLIST } from "@/common/interface/merchants";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-merchant-log",
  data() {
    return {
      params: {
        page_index: 1,
      },
      upOption: {
        empty: {
          type: "",
          tip: "没有数据",
        },
      },
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_WAPGETACHIEVEMENTLIST(this.params).then((res) => {
        let list = res.data.data;
        this.concatList(list, res.data.total_count);
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.positive {
  color: #4b0;
}
.label{
   font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
.negative {
  color: #ff454e;
}
.text-through {
  text-decoration: line-through;
}
</style>
