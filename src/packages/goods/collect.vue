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
      <lk-goods-card
        cell-padding
        v-for="(item, index) in list"
        :key="index"
        :to="item.to"
        :image="item.pic_cover"
        :title="item.goods_name"
        :price="item.price"
      >
        <lk-icon slot="num" name="like" color="#f44" />
      </lk-goods-card>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_GOODSCOLLECTLIST } from "@/common/interface/goods";
import loadMixin from "@/mixins/load-list";
let showFlag = 0;
export default {
  name: "packages-goods-collect",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20,
		shop_id:0
      },
      upOption: {
        empty: {
          type: "goods",
          tip: "暂无商品收藏"
        }
      }
    };
  },
  onLoad(query) {
	  this.params.shop_id= query.shop_id;
  },
  onShow() {
    if (showFlag == 1) {
      this.resetList();
    }
  },
  onHide() {
    showFlag = 1;
  },
  onUnload() {
    showFlag = 0;
  },
  mixins: [loadMixin],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSCOLLECTLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
          list.forEach(e => {
            e.to = {
              path: "/packages/goods/detail",
              query: {
                goods_id: e.goods_id
              }
            };
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

<style lang="scss" scoped></style>
