<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <view class="vui-shop" v-if="viewLoaded">
        <view class="vui-shop-title">
          <text class="text">{{ title }}</text>
        </view>
        <view class="vui-shop-list" v-if="list.length">
          <view class="item" v-for="(item, index) in filterList" :key="index">
            <view class="box">
              <image
                :src="item.shop_logo || static.noShop"
                class="image"
                mode="aspectFit"
                @click="toShop(item.shop_id)"
              />
            </view>
          </view>
        </view>
        <view v-else class="empty">{{ emptyText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { GET_SHOPLIST } from "@/common/interface/shop";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [reform],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["static"]),
    filterList() {
      let list = [];
      list = this.list.filter((e, i) => i < this.items.params.recommendnum);
      return list;
    },
    title() {
      return `—— ${this.items.params.title} ——`;
    },
    emptyText() {
      let text = "";
      if (!this.addons.shop) {
        text = "店铺应用未开启";
      } else if (this.list.length == 0) {
        text = "暂无店铺";
      }
      return text;
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getShopList()
        .then(list => {
          this.viewLoading = false;
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getShopList() {
      return new Promise((resovle, reject) => {
        const params = this.getParams();
        let list = [];
        if (this.items.params.recommendtype == "0") {
          if (this.addons.shop == 1) {
            const num = parseInt(this.items.params.recommendnum);
            GET_SHOPLIST(params)
              .then(({ data }) => {
                let arr = data.shop_list || [];
                arr.forEach((e, i) => {
                  e.shop_logo = e.shop_logo || this.static.noShop;
                  if (i < num) {
                    list.push(e);
                  }
                });
                resovle(list);
              })
              .catch(() => {
                reject();
              });
          } else {
            reject();
          }
        } else {
          for (const key in this.items.data) {
            const item = this.items.data[key];
            item.shop_logo = item.pic_cover || this.static.noShop;
            list.push(item);
          }
          resovle(list);
        }
      });
    },
    getParams() {
      const params = this.items.params;
      let obj = {
        page_index: 1,
        order: "",
        sort: ""
      };
      if (params.recommendcondi == "0") {
        obj.order = "shop_create_time";
        obj.sort = "ASC";
      } else if (params.recommendcondi == "1") {
        obj.order = "shop_create_time";
        obj.sort = "DESC";
      } else if (params.recommendcondi == "2") {
        obj.order = "sale_num";
        obj.sort = "ASC";
      } else if (params.recommendcondi == "3") {
        obj.order = "sale_num";
        obj.sort = "DESC";
      } else if (params.recommendcondi == "4") {
        obj.order = "shop_collect";
        obj.sort = "ASC";
      } else if (params.recommendcondi == "5") {
        obj.order = "shop_collect";
        obj.sort = "DESC";
      }
      return obj;
    },
    toShop(shop_id) {
      this.$Navigate.push({
        path: "/packages/shop/home",
        query: {
          shop_id: shop_id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.vui-shop-title {
  text-align: center;
  padding: 20rpx 0px;
  margin: 0 20rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.vui-shop-title .text {
  padding: 0 20rpx;
  font-weight: 800;
}

.vui-shop-list {
  display: flex;
  flex-wrap: wrap;
  padding: 8rpx;
}

.vui-shop-list .item {
  width: 33.3333334%;
  padding: 8rpx;
}

.vui-shop-list .item .box {
  width: 100%;
  height: 0;
  position: relative;
  border-radius: 12rpx;
  padding-bottom: 50%;
}

.vui-shop-list .item .image {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
