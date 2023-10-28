<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="请输入商品名称"
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
        <lk-goods-card
          v-for="(item, index) in list"
          :key="index"
          cell-padding
          card-size="sm"
          :title="item.goods_name"
          :image="item.pic_cover"
          :price="item.price"
        >
          <view slot="imageTags">
            <view class="image-tags" v-if="item.is_recommend">
              {{ item.is_recommend ? "推荐中" : "" }}
            </view>
          </view>
          <view slot="num">
            <lk-button
              round
              theme-color
              size="mini"
              :loading="item.btnLoading"
              :plain="!!item.is_add"
              @click="add(index)"
            >
              {{ item.is_add ? "取消" : "添加" }}
            </lk-button>
          </view>
        </lk-goods-card>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_LIVEANCHORGOODSLIST, SET_LIVEANCHORGOODS } from "../interface";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-live-anchor-goods",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 10,
        search_text: "",
        anchor_id: 0
      },
      upOption: {
        empty: {
          type: "goods",
          tip: "暂无商品"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad(query) {
    this.params.anchor_id = query.anchor_id || "";
  },
  methods: {
    onSearch(value) {
      this.params.search_text = value;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVEANCHORGOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.anchor_goods_list || [];
          list.forEach(e => {
            e.btnLoading = false;
          });
          this.concatList(list, data.count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    add(index) {
      const item = this.list[index];
      let params = {
        anchor_id: this.params.anchor_id,
        goods_id: item.goods_id,
        is_add: item.is_add ? 0 : 1
      };
      item.btnLoading = true;
      SET_LIVEANCHORGOODS(params)
        .then(({ message }) => {
          item.is_add = !item.is_add;
          item.btnLoading = false;
          this.$Prompt.toast({ title: message, icon: "success" });
        })
        .catch(() => {
          item.btnLoading = false;
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
.image-tags {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: center;
  height: 28rpx;
  font-size: $font-size-sm;
  line-height: 28rpx;
}
</style>
