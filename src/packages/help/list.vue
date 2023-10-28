<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="请输入搜索关键词"
        action="搜索"
        @search="onSearch"
      />
    </view>
    <lk-load-list
      ref="load"
      top="108"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <lk-cell
          v-for="(item, index) in list"
          :key="index"
          :value="item.title"
          is-link
          :to="item.to"
        />
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_HELPCATEGORY } from "@/common/interface/help";
export default {
  name: "packages-help-list",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {
        page_index: 1,
        page_size: 20,
        search_text: "",
        cate_id: ""
      },
      upOption: {
        auto: false
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.params.cate_id = query.cate_id;
    if (query.cate_title) {
      this.pageStyle.title = query.cate_title;
    }
  },
  methods: {
    onSearch(text) {
      this.params.search_text = text;
      this.resetList();
    },
    loadInitEnd() {
      setTimeout(() => {
        this.$load.triggerUpScroll();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_HELPCATEGORY(this.params)
        .then(({ data }) => {
          let list = data.items || [];
          list.forEach(e => {
            e.to = {
              path: "/packages/help/detail",
              query: {
                question_id: e.question_id
              }
            };
          });
          this.concatList(list, data.c_total);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header {
  height: 108rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
</style>
