<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="课程名称"
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
          center
          :icon="item.goods_picture"
          icon-size="40"
          :title="item.goods_name"
          :label="'共' + item.total_count + '节'"
        >
          <lk-button
            size="small"
            round
            :color="theme.color"
            :to="'/packages/course/detail?goods_id=' + item.goods_id"
          >
            前往学习
          </lk-button>
        </lk-cell>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_GOODSLIST } from "@/common/interface/course";
export default {
  name: "packages-course-list",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 14,
        search_text: ""
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    onSearch(e) {
      this.params.search_text = e;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.knowledge_payment_list || [];
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
.header {
  position: fixed;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 108rpx;
}
</style>
