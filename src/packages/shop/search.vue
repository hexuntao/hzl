<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        disabled
        placeholder="请输入关键词"
        @click="click"
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
        <panel-group
          v-for="(item, index) in list"
          :key="index"
          :to="item.to"
          :logo="item.logo"
          :title="item.title"
          :score="item.score"
          :goods="item.goods"
        >
          <view class="tag" slot="tag">
            <lk-tag class="t" type="danger" v-if="item.shop_id == 0">
              自营
            </lk-tag>
            <lk-tag class="t" type="primary" v-if="item.has_store == 1">
              O2O
            </lk-tag>
          </view>
        </panel-group>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_SHOPLIST } from "@/common/interface/shop";
import loadMixin from "@/mixins/load-list";
import panelGroup from "@/pages/store/component/panel-group";
export default {
  name: "packages-shop-search",
  data() {
    return {
      params: {},
      upOption: {
        empty: {
          type: "shop",
          tip: "暂无店铺"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.params = {
      page_index: 1,
      page_size: 20,

      search_text: query.search_text || "",
      order: "",
      sort: "",
      shop_group_id: ""
    };
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_SHOPLIST(this.params)
        .then(({ data }) => {
          let list = [];
          data.shop_list.forEach(e => {
            let goods = [];
            e.goods_list.forEach(g => {
              goods.push({
                goods_id: g.goods_id,
                image: g.logo,
                price: g.price
              });
            });
            let title = e.shop_name;
            if (e.group_name && e.is_visible) {
              title = title + "/" + e.group_name;
            }
            list.push({
              to: "/packages/shop/home?shop_id=" + e.shop_id,
              shop_id: e.shop_id,
              has_store: e.has_store,
              title: title,
              logo: e.shop_logo,
              score: e.comprehensive,
              goods: goods
            });
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    click(e) {
      this.$Navigate.replace({
        path: "/packages/mall/search",
        query: {
          type: "shop"
        }
      });
    }
  },
  components: {
    panelGroup
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 108rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
.tag {
  display: flex;
  flex-flow: row;
  .t {
    margin-right: 10rpx;
  }
}
</style>
