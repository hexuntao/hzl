<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        disabled
        placeholder="请输入关键词"
        @click="toLink"
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
            {{ item.distance }}
          </view>
        </panel-group>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_STORELIST } from "@/common/interface/store";
import loadMixin from "@/mixins/load-list";
import { mapActions } from "vuex";
import panelGroup from "@/pages/store/component/panel-group";
export default {
  name: "packages-store-search",
  data() {
    return {
      isShopStore: false, //是否店铺的门店
      params: {
        page_index: 1,
        page_size: 20,
        order: "distance",
        sort: "ASC",
        lng: "",
        lat: "",
        search_text: ""
      },
      upOption: {
        auto: false,
        empty: {
          type: "shop",
          tip: "暂无门店"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.isShopStore = !!query.shop_id;
    if (query.shop_id) {
      this.params.shop_id = query.shop_id;
    }
    if (query.search_text) {
      this.params.search_text = query.search_text;
    }
  },
  methods: {
    ...mapActions(["getLocation"]),
    loadInitEnd() {
      this.getLocation({ showLoading: true }).then(res => {
        console.log("经纬度：", res);
        this.params.lat = res.lat;
        this.params.lng = res.lng;
        this.$load.triggerUpScroll();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_STORELIST(this.params, { isShopStore: this.isShopStore })
        .then(({ data }) => {
          let list = [];
          data.store_list.forEach(e => {
            let goods = [];
            e.goods.forEach(g => {
              goods.push({
                goods_id: g.goods_id,
                image: g.goods_img,
                price: g.price
              });
            });
            list.push({
              to: "/packages/store/home?store_id=" + e.store_id,
              title: e.shop_name + "(" + e.store_name + ")",
              logo: e.store_img,
              score: e.score,
              goods: goods,
              distance: e.distance + "km"
            });
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toLink() {
      let query = {
        type: "store"
      };
      if (this.params.shop_id) {
        query.shop_id = this.params.shop_id;
      }
      this.$Navigate.replace({
        path: "/packages/mall/search",
        query
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
.tab-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.tag {
  color: $text-light;
  font-size: $font-size-sm;
}
</style>
