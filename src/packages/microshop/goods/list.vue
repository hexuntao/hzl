<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <tab-sort-screen @change="onTabSort" />
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <view class="list">
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-goods-box
            :title="item.goods_name"
            :price="item.price"
            :origin-price="item.market_price"
            :image="item.logo"
            :to="item.to"
          >
            <view class="sales" slot="bottom">
              <view>销量{{ item.sales }}</view>
              <lk-button
                v-if="item.btnText"
                round
                size="mini"
                type="danger"
                :plain="item.isPlain"
                :color="theme.color"
                :loading="item.btnLoading"
                @click="clickSelect(index)"
              >
                {{ item.btnText }}
              </lk-button>
            </view>
          </lk-goods-box>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_GOODSLIST, GET_SELECTGOODS } from "@/common/interface/microshop";
import loadMixin from "@/mixins/load-list";
import tabSortScreen from "@/pages/goods/component/list/tab-sort-screen";
export default {
  name: "packages-microshop-goods-list",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {},
      upOption: {
        empty: {
          type: "goods",
          tip: "暂无商品"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    const { shop_id, search_text, category_id, text, shopkeeper_id } = query;
    if (text) {
      this.pageStyle.title = text;
    }
    this.params = {
      page_index: 1,
      page_size: 20,

      order: "",
      sort: "",
      min_price: "",
      max_price: "",
      is_recommend: 0,
      is_new: 0,
      is_hot: 0,
      is_promotion: 0,
      is_shipping_free: 0,
      goods_type: shop_id > 0 ? 2 : shop_id == 0 ? 0 : 1,
      search_text: search_text || "",
      category_id: category_id || "",
      shop_id: shop_id || "",
      microshop_type: 1
    };
    if (shopkeeper_id) {
      this.params.shopkeeper_id = shopkeeper_id;
    }
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
          list.forEach(e => {
            if (this.params.shopkeeper_id) {
              let query = {
                goods_id: e.goods_id
              };
              query.shopkeeper_id = this.params.shopkeeper_id;
              e.to = {
                path: "/packages/goods/detail",
                query
              };
            } else {
              e.checked = !!e.mic_selectedgoods;
              e.isPlain = !!e.mic_selectedgoods;
              e.btnText = e.mic_selectedgoods ? "取消" : "挑选";
              e.btnLoading = false;
            }
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
    },
    // 挑选/取消商品
    clickSelect(index) {
      const item = this.list[index];
      const isChecked = !item.checked;
      item.btnLoading = true;
      GET_SELECTGOODS({ goods_id: item.goods_id }, { isChecked })
        .then(res => {
          item.checked = !item.checked;
          item.isPlain = item.checked;
          item.btnText = item.checked ? "取消" : "挑选";
          item.btnLoading = false;
        })
        .catch(error => {
          item.btnLoading = false;
        });
    }
  },
  components: {
    tabSortScreen
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  .item {
    width: calc(50% - 20rpx);
    margin: 10rpx;
    border-radius: 20rpx;
    overflow: hidden;
    font-size: $font-size-lg;
    .sales {
      font-size: $font-size-sm;
      color: $text-gray;
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
