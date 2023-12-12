<template>
  <view class="pages">
    <header-info-panel :info="info" />
    <lk-category-nav
      v-model="active"
      :navs="navs"
      top="200"
      bottom="50"
      @change="onNavChange"
    >
      <lk-load-list-view
        ref="load"
        :fixed="false"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="list">
          <lk-goods-card
            v-for="(item, index) in list"
            :key="index"
            cell-padding
            :title="item.goods_detail.goods_name"
            :image="item.goods_detail.goods_img"
            :price="item.goods_detail.min_price"
          >
            <view class="btn-add" slot="num" @click="clickSku(index)">
              <lk-icon name="add" size="20" :color="theme.color" />
            </view>
          </lk-goods-card>
        </view>
      </lk-load-list-view>
    </lk-category-nav>
    <sku-popup
      v-if="goodsData"
      v-model="showSkuPopup"
      :store_id="store_id"
      :store_name="store_name"
      :info="goodsData"
      :promote-type="promoteType"
      :promote-params="promoteParams"
      @close="onSkuClose"
      @init-cart="initCartList"
    />
    <foot-cart-submit-bar-group ref="cartSubmitBar" />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapActions } from "vuex";
import loadMixin from "@/mixins/load-list";
import headerInfoPanel from "./component/header-info-panel";
import skuPopup from "./component/sku-popup";
import footCartSubmitBarGroup from "./component/foot-cart-submit-bar-group";
import {
  GET_STOREINFO,
  GET_STOREGOODSCATEGORY,
  GET_STOREGOODSLIST,
  GET_STORECARTLIST
} from "@/common/interface/store";
import { addImgSrcDomain, yuan } from "@/common/utils";
export default {
  name: "packages-store-home",
  data() {
    return {
      store_id: "",
      store_name: "",
      info: {},
      infoParams: {
        lng: "",
        lat: "",
        store_id: ""
      },

      active: 0,
      navs: [],
      params: {
        page_index: 1,
        page_size: 12,
        category_id: "",
        store_id: ""
      },
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "暂无商品"
        }
      },
      showSkuPopup: false,
      goodsData: null,
      promoteType: "normal",
      promoteParams: {}
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad(query) {
    this.store_id = query.store_id;
    this.infoParams.store_id = this.store_id;
    this.params.store_id = this.store_id;
    this.getLocation().then(res => {
      this.infoParams.lat = res.lat;
      this.infoParams.lng = res.lng;
      this.getData();
    });
  },
  methods: {
    ...mapActions(["getLocation"]),
    getData() {
      GET_STOREINFO(this.infoParams)
        .then(({ data }) => {
          this.info = {
            location: {
              lat: this.infoParams.lat,
              lng: this.infoParams.lng
            },
            lat: data.lat,
            lng: data.lng,
            store_name: data.store_name,
            title: `${data.shop_name} (${data.store_name})`,
            address: `${data.province_name}${data.city_name}${data.district_name}${data.address}(距您${data.distance}km)`,
            tel: data.store_tel,
            score: data.score,
            time: `营业时段 ${data.start_time} - ${data.finish_time}`,
            images: data.store_img || []
          };
          this.store_name = data.store_name;
        })
        .catch(() => {});
    },
    loadInitEnd() {
      setTimeout(() => {
        this.getCategory().then(() => {
          this.params.category_id = this.navs[this.active]
            ? this.navs[this.active].category_id
            : "";
          this.$load.triggerUpScroll();
        });
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_STOREGOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onNavChange(index) {
      this.params.category_id = this.navs[index].category_id;
      this.resetList();
    },
    getCategory() {
      return new Promise((resolve, reject) => {
        if (this.navs.length) {
          resolve();
        } else {
          GET_STOREGOODSCATEGORY({
            store_id: this.store_id
          })
            .then(({ data }) => {
              const list = data || [];
              list.forEach(e => {
                e.name = e.short_name || e.category_name;
              });
              this.navs = list;
              resolve();
            })
            .catch(() => {});
        }
      });
    },
    clickSku(index) {
      const item = this.list[index];
      let goodsData = item.goods_detail;
      goodsData.goods_image = goodsData.goods_img;
      goodsData.is_allow_buy =
        typeof item.is_allow_buy == "boolean" ? item.is_allow_buy : true;
      this.goodsData = goodsData;
      this.promoteType = this.packagePromoteData(item).type;
      this.promoteParams = this.packagePromoteData(item).info;
      this.showSkuPopup = true;
    },
    // 组装活动商品所需数据
    packagePromoteData(data) {
      let type = "normal";
      let info = {};
      if (data.seckill_list.seckill_id) {
        type = "seckill";
      } else if (data.group_list.group_id) {
        type = "group";
      } else if (data.presell_list.presell_id) {
        type = "presell";
      } else if (data.bargain_list.bargain_id) {
        type = "bargain";
      } else if (data.limit_list && data.limit_list.discount_id) {
        type = "limit";
      } else if (data.luckyspell_list && data.luckyspell_list.luckyspell_id) {
        type = "luckyspell";
      }
      if (type != "normal") {
        info = data[`${type}_list`] || {};
      }
      return {
        type,
        info
      };
    },
    onSkuClose() {
      setTimeout(() => {
        this.goodsData = null;
      }, 500);
    },
    initCartList() {
      this.$refs.cartSubmitBar.getCartList();
    }
  },
  components: {
    headerInfoPanel,
    skuPopup,
    footCartSubmitBarGroup
  }
};
</script>

<style lang="scss" scoped>
.list {
  .btn-add {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
