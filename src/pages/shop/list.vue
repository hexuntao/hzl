<template>
  <view class="pages">
    <tab-sort-screen @change="onTabSort" />
    <lk-load-list
      ref="load"
      top="196"
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
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { GET_SHOPLIST } from "@/common/interface/shop";
import loadMixin from "@/mixins/load-list";
import tabSortScreen from "./component/list/tab-sort-screen";
import panelGroup from "../store/component/panel-group";
export default {
  name: "pages-shop-list",
  data() {
    return {
      params: {},
      upOption: {
        empty: {
          type: "shop",
          tip: "暂无店铺"
        }
      },
      tabs: [
        {
          name: "全部",
          sort: false,
          isShow: true
        },
        {
          name: "销量",
          icon: "v-icon-sort2",
          sort: "sale_num",
          sort_type: "DESC",
          isShow: true
        },
        {
          name: "人气",
          icon: "v-icon-sort2",
          sort: "shop_collect",
          sort_type: "DESC",
          isShow: true
        },
        {
          name: "评分",
          icon: "v-icon-sort2",
          sort: "comprehensive",
          sort_type: "DESC",
          isShow: true
        },
        {
          name: "附近门店",
          disabled: true,
          sort: false,
          isShow: false
        }
      ]
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.params = {
      page_index: 1,
      page_size: 20,

      search_text: "",
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
              goods: goods,
			  
            });
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTabSort(e) {
      e.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...e });
      this.resetList();
    }
  },
  components: {
    tabSortScreen,
    panelGroup
  }
};
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  flex-flow: row;
  .t {
    margin-right: 10rpx;
  }
}
</style>
