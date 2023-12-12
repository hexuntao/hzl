<template>
  <view>
    <page-meta>
      <navigation-bar
        front-color="#000000"
        background-color="#FFFFFF"
        :title="pageStyle.title"
      />
    </page-meta>
    <view class="pages">
      <view class="serarch-tab">
        <lk-search
          v-model="value"
          placeholder="请输入关键词"
          action="搜索"
          @search="onSearch"
        />
        <lk-tabs
          v-model="active"
          :active-color="theme.color"
          :line-color="theme.color"
          slot-title
          nav-per-view="2"
          :lineScale="1"
          @change="onTab"
        >
          <lk-tab v-for="(tab, index) in tabs" :key="index">
            {{ tab.name }}
          </lk-tab>
        </lk-tabs>
        <tab-sort-screen @change="onTabSort" />
      </view>
      <lk-load-list
        ref="load"
        top="268"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
        @emptyclick="emptyClick"
      >
        <view class="list">
          <!-- 京东数据 -->
          <jd-goods-list
            :list="list"
            :buyer_bonus_rate="buyer_bonus_rate"
            v-if="params.type == 'jd'"
          ></jd-goods-list>
          <!-- 拼多多数据 -->
          <pdd-goods-list
            :list="list"
            :buyer_bonus_rate="buyer_bonus_rate"
            v-if="params.type == 'pdd'"
          ></pdd-goods-list>
        </view>
      </lk-load-list>
    </view>
  </view>
</template>

<script>
import { GET_GETGOODSLIST } from "@/common/interface/cps";
import tabSortScreen from "../component/search/tab-sort-screen";
import loadMixin from "@/mixins/load-list";
import jdGoodsList from "../component/jd-goods-list";
import pddGoodsList from "../component/pdd-goods-list";
export default {
  name: "packages-cps-search-result",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      value: "",
      active: 0,
      tabs: [
        {
          name: "京东",
          type: "jd"
        },
        {
          name: "拼多多",
          type: "pdd"
        }
      ],
      params: {},
      upOption: {
        empty: {
          type: "goods",
          tip: "暂无商品",
          btnText: "去首页",
          to: "/pages/mall/index"
        }
      },
      buyer_bonus_rate: 0
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    const { type, search_text, category_id, text } = query;
    if (type == "jd") {
      this.active = 0;
    }
    if (type == "pdd") {
      this.active = 1;
    }
    if (text) {
      this.pageStyle.title = text;
    }
    this.params = {
      page_index: 1,
      type: type,
      category_id: category_id || "",
      search_text: search_text || "",
      sort: "",
      sort_name: "",
      price_from: "",
      price_to: "",
      show_coupon_goods: 0
    };
  },
  methods: {
    onTab(index) {
      if (index == 0) {
        this.params.type = "jd";
        this.active = 0;
      }
      if (index == 1) {
        this.params.type = "pdd";
        this.active = 1;
      }
      this.resetList();
    },
    onSearch(value) {
      this.params.search_text = value;
      this.resetList();
    },
    onTabSort(e) {
      e.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...e });
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;

      GET_GETGOODSLIST(this.params)
        .then(({ data }) => {
          let list = [];
          if (this.params.type == "jd") {
            list = data.jd_goods_list;
          }
          if (this.params.type == "pdd") {
            list = data.pdd_goods_list;
          }
          this.buyer_bonus_rate = data.buyer_bonus_rate;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {
    tabSortScreen,
    jdGoodsList,
    pddGoodsList
  }
};
</script>

<style lang="scss" scoped>
/deep/ .goods-box .title {
  white-space: normal !important;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/deep/ .goods-box .desc {
  height: 0 !important;
}
.serarch-tab {
  position: fixed;
  height: 284rpx;
  width: 100%;
  z-index: 666;
}
</style>
