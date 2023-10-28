<template>
  <view class="pages">
    <view
      class="header"
      :style="headerInfo.backgroundImg || { background: theme.gradient }"
    >
      <image :src="headerInfo.backgroundImg" class="bg" mode="center" />
      <view class="info">
        <view class="logo">
          <lk-avatar :src="headerInfo.logo" size="120" />
        </view>
        <view class="text">
          <view class="name">{{ headerInfo.name || "" }}</view>
          <view class="label">{{ headerInfo.introduce || "" }}</view>
        </view>
      </view>
    </view>
    <view class="link-box">
      <view class="item" @click="toLink('/packages/microshop/goods/list')">
        全部商品
      </view>
      <view class="item" @click="toLink('/packages/microshop/goods/category')">
        商品分类
      </view>
    </view>
    <lk-grid-panel card cols="4" :items="categoryItems" />
    <view class="goods-list-box">
      <view class="divider">
        <text>店铺精选</text>
      </view>
      <lk-load-list
        ref="load"
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
              :sales="item.sales"
            >
            </lk-goods-box>
          </view>
        </view>
      </lk-load-list>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  GET_MICROSHOPGOODSLIST,
  GET_PREVIEWMICROSHOGOODS
} from "@/common/interface/microshop";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-microshop-home",
  data() {
    return {
      shopkeeper_id: "", //当前店主id
      headerInfo: {
        logo: "",
        backgroundImg: "",
        name: "",
        introduce: ""
      },
      categoryItems: [],
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        auto: false,
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
    if (query.shopkeeper_id) {
      this.shopkeeper_id = query.shopkeeper_id;
    }
  },
  methods: {
    ...mapActions(["getMicroshopInfo"]),
    getCategory() {
      GET_PREVIEWMICROSHOGOODS({
        shopkeeper_id: this.shopkeeper_id
      }).then(({ data }) => {
        let arr = [];
        data.forEach(({ second_category }) => {
          let obj = {
            title: "",
            icon: "",
            to: ""
          };
          second_category.forEach(({ third_category }) => {
            third_category.forEach(e => {
              obj.title = e.short_name || e.category_name;
              obj.icon = e.category_pic;
              let query = {
                category_id: e.category_id,
                text: obj.title
              };
              if (this.shopkeeper_id) {
                query.shopkeeper_id = this.shopkeeper_id;
              }
              obj.to = {
                path: "/packages/microshop/goods/list",
                query
              };
            });
          });
          arr.push(obj);
        });
        this.categoryItems = arr;
      });
    },
    loadInitEnd() {
      setTimeout(() => {
        const params = {};
        if (this.shopkeeper_id) {
          params.shopkeeper_id = this.shopkeeper_id;
        }
        this.getMicroshopInfo(params).then(info => {
          this.shopkeeper_id = info.uid;
          this.params.shopkeeper_id = info.uid;
          this.headerInfo.logo = info.microshop_logo;
          this.headerInfo.backgroundImg = info.shopRecruitment_logo;
          this.headerInfo.name = info.microshop_name;
          this.headerInfo.introduce = info.microshop_introduce;
          this.getCategory();
          this.$load.triggerUpScroll();
          this.setWxShare({
            title: info.microshop_name,
            imgUrl: info.microshop_logo,
            query: {
              shopkeeper_id: info.uid
            }
          });
        });
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MICROSHOPGOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
          list.forEach(e => {
            let query = {
              goods_id: e.goods_id
            };
            query.shopkeeper_id = this.params.shopkeeper_id;
            e.to = {
              path: "/packages/goods/detail",
              query
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toLink(path) {
      this.$Navigate.push({
        path: path,
        query: {
          shopkeeper_id: this.shopkeeper_id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  height: 200rpx;
  background: $image-background;
  overflow: hidden;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .info {
    position: relative;
    z-index: 1;
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 100%;
    padding: $cell-padding;
    align-items: center;
    .logo {
      flex: none;
      margin-right: 20rpx;
      font-size: $font-size-lg;
    }
    .text {
      flex: 1;
      color: #ffffff;
      line-height: 48rpx;
    }
    .label {
      word-break: break-word;
      line-height: 40rpx;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
.link-box {
  display: flex;
  padding: $cell-padding;
  justify-content: center;
  background-color: #ffffff;
  .item {
    flex: 1;
    text-align: center;
  }
}
.goods-list-box {
  background-color: #ffffff;
  padding: 20rpx 0;
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
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
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
