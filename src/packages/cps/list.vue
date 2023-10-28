<template>
  <view class="pages">
    <view class="header">
      <lk-search disabled placeholder="请输入关键词" @click="click" />
    </view>
    <view class="tabs" v-if="tabs.length">
      <lk-tabs
        v-model="active"
        :active-color="theme.color"
        :line-color="theme.color"
        :lineScale="1"
        slot-title
        @change="onTabChange"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <text>{{ tab.category_name }}</text>
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      top="0"
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
          v-if="type == 'jd'"
        ></jd-goods-list>
        <!-- 拼多多数据 -->
        <pdd-goods-list
          :list="list"
          :buyer_bonus_rate="buyer_bonus_rate"
          v-if="type == 'pdd'"
        ></pdd-goods-list>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import {
  GET_GETOPENGOODS,
  GET_GETGOODSCATEGORY,
  GET_GETGOODSLIST
} from "@/common/interface/cps";
import loadMixin from "@/mixins/load-list";
import cellGoodsVue from "../thingcircle/component/release/cell-goods.vue";
import pddGoodsList from "./component/pdd-goods-list";
import jdGoodsList from "./component/jd-goods-list";
export default {
  name: "packages-cps-list",
  data() {
    return {
      active: 0,
      type: "jd", //平台类型
      params: {},
      tabs: [],
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
    // 判断平台类型('测试')
    this.type = query.type ? query.type : "jd";
    this.params.type = query.type;
  },
  onShow() {},
  methods: {
    click(e) {
      this.$Navigate.push({
        path: "/packages/cps/search",
        query: {
          type: this.type
        }
      });
    },
    getCategory() {
      return new Promise((resolve, reject) => {
        GET_GETGOODSCATEGORY({ type: this.type })
          .then(({ data }) => {
            this.tabs = data.category_list;
            this.params.category_id = this.tabs[this.active].category_id;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    onTabChange(index) {
      const item = this.tabs[index];
      this.params.category_id = item.category_id;
      this.params.type = item.platform;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      this.params.type = this.type;
      GET_GETGOODSLIST(this.params)
        .then(({ data }) => {
          let list = [];
          if (this.type == "jd") {
            list = data.jd_goods_list;
          }
          if (this.type == "pdd") {
            list = data.pdd_goods_list;
          }
          this.buyer_bonus_rate = data.buyer_bonus_rate;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    loadInitEnd() {
      this.getCategory().then(() => {
        if (this.tabs.length) {
          const item = this.tabs[this.active];
          // console.log(item);
        }
        this.$load.triggerUpScroll();
      });
    }
  },
  components: {
    pddGoodsList,
    jdGoodsList
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
</style>
