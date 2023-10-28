<template>
  <view class="pages">
    <view class="header">
      <lk-search disabled placeholder="请输入关键词" @click="toLink" />
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="3"
        :line="false"
      >
        <lk-tab
          v-for="(tab, index) in tabs"
          :key="index"
          :disabled="tab.disabled"
        >
          <view
            class="tab-item"
            :class="tab.disabled ? 'disabled-color' : ''"
            @click="onSort(tab, index)"
          >
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
          :distance="item.distance"
          :desc="item.desc"
          :goods="item.goods"
		  :time="item.time"
		  :tel="item.store_tel"
        >
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
import { GET_STORELIST } from "@/common/interface/store";
import loadMixin from "@/mixins/load-list";
import { mapActions } from "vuex";
import panelGroup from "./component/panel-group";
export default {
  name: "pages-store-list",
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
      },
      tabs: [
        {
          name: "距离",
          icon: "v-icon-sort2",
          sort: "distance",
          sort_type: "DESC"
        },
        {
          name: "销售量",
          icon: "v-icon-sort2",
          sort: "sales",
          sort_type: "DESC"
        },
        {
          name: "人气",
          icon: "v-icon-sort2",
          sort: "score",
          sort_type: "DESC"
        }
      ]
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.isShopStore = !!query.shop_id;
    if (query.shop_id) {
      this.params.shop_id = query.shop_id;
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
			  
			  store_tel: e.store_tel,
			  time: e.time,
			  
              goods: goods,
              desc: `${e.province_name}${e.city_name}${e.dictrict_name}${e.address}`,
              distance: e.distance ? e.distance + "km" : ""
            });
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onSort(item, index) {
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
      params.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...params });
      this.resetList();
    },
    toLink() {
      let query = {
        type: "store"
      };
      if (this.params.shop_id) {
        query.shop_id = this.params.shop_id;
      }
      this.$Navigate.push({
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
  height: 196rpx;
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
