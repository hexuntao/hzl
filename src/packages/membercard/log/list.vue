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
        :value="item.create_time"
        v-for="(item, index) in list"
        :key="index"
        :to="'/packages/membercard/log/detail?id=' + item.id"
      >
        <view slot="title">{{ item.type_name }}</view>
        <view
          slot="label"
          class="label"
          :class="item.status == 4 || item.status == -1 ? 'text-through' : ''"
        >余额： {{ item.balance }}</view>
        <view>
          <view :class="item.change_money > 0 ? 'positive' : 'negative'">{{ item.change_money }}</view>
          <view class="time">{{ item.create_time }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>
<script>
import loadMixin from "@/mixins/load-list";
import { GET_MEMBERCARDBALANCELIST } from "@/common/interface/membercard";
import { mapState } from "vuex";
export default {
  name: "packages-membercard-log-list",
  data() {
    return {
      params: {
        page_index: 1
      },
      upOption: {
        empty: {
          type: "",
          tip: "没有明细数据"
        }
      }
    };
  },
  computed: {},
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MEMBERCARDBALANCELIST(this.params).then(res => {
        let list = res.data.data;
        this.concatList(list, res.data.total_count);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.positive {
  color: #4b0;
}
.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
}
.negative {
  color: #ff454e;
}
.text-through {
  text-decoration: line-through;
}
</style>
