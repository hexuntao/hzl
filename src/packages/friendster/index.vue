<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="search_text"
        placeholder="请输入搜索关键词"
        action="搜索"
        @search="search"
      />
      <lk-tabs
        v-if="tabs.length"
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">{{
          tab.category_name
        }}</lk-tab>
      </lk-tabs>
    </view>

    <lk-load-list
      :top="list_top"
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <single-column
          v-for="(items, index) in list"
          :key="index"
          :items="items"
        />
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import {
  GET_CATEGORYLIST,
  GET_WAPGETMATERIALLIST,
} from "@/common/interface/friendster";
import singleColumn from "./component/single-column";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-friendster-team",
  data() {
    return {
      search_text: "",
      tabs: [],
      params: {
        page_index: 1,
        category_id: "",
      },
      list_top: 108,
      upOption: {
        auto: false,
      },
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.getData();
  },
  methods: {
    search(e) {
      this.params.search_text = e;
      this.resetList();
    },
    getData() {
      GET_CATEGORYLIST()
        .then((res) => {
          if (res.data.show_category != 0) {
            this.list_top = 196;
            this.tabs = res.data.category_list;
            this.params.category_id = this.tabs[0].category_id;
          }
          this.$load.triggerUpScroll();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onTab(index) {
      this.params.category_id = this.tabs[index].category_id;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_WAPGETMATERIALLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
  },
  components: {
    singleColumn,
  },
};
</script>

<style lang="scss" scoped>
.left {
  font-size: $font-size-sm;
  line-height: 40rpx;
  color: $text-gray;
}
.rigth {
  margin-top: 44rpx;
  font-size: $font-size-sm;
  color: $text-gray;
  line-height: 40rpx;
}
.header {
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
