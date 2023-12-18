<template>
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
        <view class="cell-group" v-for="(item, index) in list" :key="index">
          <view class="title-group lk-hairline--right">
            <view class="title">{{ item.name }}</view>
            <text class="text-link more" @click="toLink(item.to)">更多></text>
          </view>
          <view class="content-group">
            <view
              class="item"
              v-for="(child, c) in item.items"
              :key="c"
              @click="toLink(child.to)"
            >
              {{ child.title }}
            </view>
          </view>
        </view>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import loadMixin from '@/mixins/load-list';
import { GET_HELPLIST } from '@/common/interface/help';
export default {
  name: 'pages-help-index',
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20,
        search_text: '',
      },
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    onSearch(text) {
      this.params.search_text = text;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_HELPLIST(this.params)
        .then(({ data }) => {
          let list = data.c_data || [];
          list.forEach(e => {
            e.to = {
              path: '/packages/help/list',
              query: {
                cate_id: e.cate_id,
                cate_title: e.name,
              },
            };
            e.items.forEach(c => {
              c.to = '/packages/help/detail?question_id=' + c.id;
            });
          });
          this.concatList(list, data.c_total);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toLink(to) {
      this.$Navigate.push(to);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.header {
  height: 108rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
.cell-group {
  background: #fff;
  margin: 20rpx 0;
  display: flex;
  flex-flow: row;
}
.title-group {
  padding: 20rpx;
  width: 30%;
  display: flex;
  flex-flow: column;
  line-height: 40rpx;
}
.title-group .title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.title-group .more {
  font-size: $font-size-sm;
}
.content-group {
  padding: 10rpx;
  width: 70%;
  display: flex;
  flex-wrap: wrap;
}
.content-group .item {
  margin: 1%;
  width: 48%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8rpx;
  height: 48rpx;
  line-height: 1;
  border: 2rpx solid #f1f1f1;
}
</style>
