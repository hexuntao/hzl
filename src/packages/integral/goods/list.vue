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
      <lk-tabs
        slot-title
        :active-color="theme.color"
        :line-color="theme.color"
        nav-per-view="3"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <view class="tab-item" @click="onSort(index)">
            <text>{{ tab.name }}</text>
            <view
              v-if="tab.icon"
              :style="{
                transform:
                  tab.sort_type == 'DESC' ? 'rotate(180deg)' : 'rotate(0deg)'
              }"
            >
              <lk-icon :name="tab.icon" class-prefix="v-icon" />
            </view>
          </view>
        </lk-tab>
      </lk-tabs>
    </view>
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
            :point="item.point_exchange"
            :image="item.logo"
            :tag="item.type"
            is-point-goods
            :goods-id="item.goods_id"
          >
          </lk-goods-box>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_GOODSLIST } from "@/common/interface/integral";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-integral-goods-list",
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
          tip: "暂无商品",
          btnText: "去首页",
          to: "/pages/integral/index"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      texts: ({ member }) => member.texts
    }),
    tabs() {
      return [
        {
          name: "默认",
          sort: ""
        },
        {
          name: "兑换量",
          icon: "v-icon-sort2",
          sort: "sales",
          sort_type: "DESC"
        },
        {
          name: this.texts.point_style,
          icon: "v-icon-sort2",
          sort: "point_exchange",
          sort_type: "DESC"
        }
      ];
    }
  },
  onLoad(query) {
    const { search_text, category_id, text } = query;
    if (text) {
      this.pageStyle.title = text;
    }
    this.params = {
      page_index: 1,
      page_size: 20,

      order: "",
      sort: "",
      search_text: search_text || "",
      category_id: category_id || ""
    };
  },
  methods: {
    onSort(index) {
      let params = {};
      params.order = this.tabs[index].sort;
      if (this.tabs[index].sort_type) {
        //升序降序
        params.sort = this.tabs[index].sort_type;
        if (this.tabs[index].sort_type == "DESC") {
          this.tabs[index].sort_type = "ASC";
        } else {
          this.tabs[index].sort_type = "DESC";
        }
      } else {
        // 默认
        params.sort = "";
      }
      this.params.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...params });
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
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
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
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
    }
  }
}
.tab-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
</style>
