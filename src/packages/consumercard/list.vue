<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <listcard
        :item="item"
        v-for="(item, index) in list"
        :key="index"
      /> 
    </lk-load-list>
  </view>
</template>

<script>
import listcard from "./component/listcard";
import { GET_CONSUMERCARDLIST } from "@/common/interface/consumercard";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
export default {
  name: "",
  data() {
    return {
      color: "#ff4444",
      tabs: [
        {
          name: "未使用",
          state: 0
        },
        {
          name: "已使用",
          state: 1
        },
        {
          name: "已过期",
          state: 2
        },
				{
				  name: "预约记录",
				  state: 3
				}
      ],
      params: {
        page_index: 1,
        page_size: 20,
        state: 0
      },
      upOption: {
        empty: {
          type: "coupon",
          tip: "没有相关消费卡"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_CONSUMERCARDLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          this.concatList(list, data.total_count);
        })
        .catch(error => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      const state = this.tabs[index].state;
      this.params.state = state;
      this.resetList();
    }
  },

  computed: {},
  components: {
    listcard
  }
};
</script>

<style lang="scss" scoped></style>
