<template>
  <view class="pages">
    <lk-search
      v-model="params.search_text"
      placeholder="请输入商品名称"
      action="搜索"
      @search="onSearch"
    />
    <lk-category-nav
      v-model="active"
      :navs="navs"
      top="54"
      :bottom="categoryNavBottom"
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
            :title="item.goods_name"
            :image="item.img_list ? item.img_list[0] : ''"
          >
            <view class="desc" slot="desc">库存：{{ item.stock_num }}</view>
            <view class="price-color" slot="price">
              {{ priceText }}：{{ item.min_price_text }}
            </view>
            <view class="btn-add" slot="num" @click="clickSku(index)">
              <lk-icon name="add" size="20" :color="theme.color" />
            </view>
          </lk-goods-card>
        </view>
      </lk-load-list-view>
    </lk-category-nav>
    <lk-sku
      v-if="goodsData"
      v-model="showSkuPopup"
      :info="goodsData"
      action="buy"
      @action="onSkuAction"
      @close="onSkuClose"
    />
    <foot-cart-popup
      v-model="showCartPopup"
      :buy_type="buy_type"
      :disabled="submitDisabled"
      :submit-text="cartSubmitText"
      :list="cartList"
      @init="getCartList"
      @submit="onSubmit"
    />
    <lk-submit-bar
      :price="totalPrice"
      :disabled="submitDisabled"
      :button-text="buy_type == 'purchase' ? '结算' : '提货'"
      :tip="cartMessage"
      @submit="showCartPopup = true"
    >
      <view class="btn-card" @click="showCartPopup = true">
        <lk-icon name="shopping-cart-o" size="20" :info="countNum" />
      </view>
      <view slot="label" v-if="buy_type !== 'purchase'">
        <text>已选：</text>
        <text class="price-color">
          {{ countNum }}
        </text>
        件商品
      </view>
    </lk-submit-bar>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import {
  GET_GOODSCATEGORY,
  GET_GOODSLIST,
  GET_CARTLIST,
  ADD_CARTGOODS
} from "@/common/interface/channel";
import footCartPopup from "./component/foot-cart-popup";
import { yuan } from "@/common/utils";
const priceTextObj = {
  purchase: "采购价",
  pickupgoods: "商城售价"
};
// 获取总库存数量
function getStockNum(skuList = []) {
  let num = 0;
  skuList.forEach(({ stock_num }) => {
    num += parseFloat(stock_num);
  });
  return num;
}
export default {
  name: "packages-channel-goods",
  data() {
    return {
      active: 0,
      buy_type: "",
      priceText: "",
      navs: [],
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "暂无商品"
        }
      },
      params: {
        page_index: 1,
        page_size: 12,
        category_id: "",
        buy_type: "",
        search_text: ""
      },

      cartList: [],
      totalPrice: 0,
      cartMessage: null,
      isAchieveCondie: false, // 是否满足最低采购金额条件

      showSkuPopup: false,
      goodsData: null,

      showCartPopup: false
    };
  },
  mixins: [loadMixin],
  computed: {
    categoryNavBottom() {
      let num = 50;
      if (this.cartMessage) {
        num = num + 34;
      }
      return num;
    },
    countNum() {
      let num = 0;
      if (this.cartList.length) {
        this.cartList.forEach(e => {
          num += parseFloat(e.num);
        });
      }
      return num;
    },
    submitDisabled() {
      let flag = true;
      if (this.buy_type == "purchase") {
        flag = !this.isAchieveCondie || !this.cartList.length;
      } else {
        flag = !this.cartList.length;
      }
      return flag;
    },
    cartSubmitText() {
      let text = "";
      // 采购情况需要显示最小采购金额
      if (this.buy_type == "purchase") {
        text = this.cartMessage || "结算(合计：" + yuan(this.totalPrice) + ")";
      } else {
        text = "提货";
      }
      return text;
    }
  },
  onLoad(query) {
    this.buy_type = query.type;
    this.priceText = priceTextObj[this.buy_type];
    this.params.buy_type = this.buy_type;
  },
  onShow() {
    uni.$once("refreshCgannel", res => {
      this.resetList()
      this.loadInitEnd()
    });
  },
  methods: {
    onSearch(value) {
      this.params.search_text = value;
      this.resetList();
    },
    onNavChange(index) {
      this.params.category_id = this.navs[index].category_id;
      this.resetList();
    },
    loadInitEnd() {
      setTimeout(() => {
        this.getCategory().then(() => {
          this.params.category_id = this.navs[this.active]
            ? this.navs[this.active].category_id
            : "";
          this.$load.triggerUpScroll();
        });
        this.getCartList();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list || [];
          list.forEach(e => {
            e.stock_num = getStockNum(e.sku && e.sku.list ? e.sku.list : []);
            e.min_price_text = yuan(e.min_price);
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    getCategory() {
      return new Promise((resolve, reject) => {
        if (this.navs.length) {
          resolve();
        } else {
          GET_GOODSCATEGORY({ buy_type: this.buy_type })
            .then(({ data }) => {
              const list = data.category_list || [];
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
      let goodsData = {
        goods_id: item.goods_id,
        goods_image: item.img_list ? item.img_list[0] : "",
        goods_name: item.goods_name,
        goods_type: item.goods_type == undefined ? 1 : item.goods_type,
        max_buy: 0,
        max_market_price: item.max_market_price,
        max_price: item.max_price,
        min_buy: 0,
        min_market_price: item.min_market_price,
        min_price: item.min_price,
        state: item.state == undefined ? 1 : item.state,
        sku: {
          list: item.sku.list,
          tree: item.sku.tree
        },
        is_allow_buy: true,
        channel_info: item.channel_info
      };
      this.goodsData = goodsData;
      this.showSkuPopup = true;
    },
    onSkuClose() {
      setTimeout(() => {
        this.goodsData = null;
      }, 500);
    },
    onSkuAction(action, data) {
      const params = {};
      params.num = data.selectedNum;
      params.sku_id = data.selectedSkuComb.id;
      params.channel_goods_type = this.goodsData.channel_info;
      params.buy_type = this.buy_type;
      // return console.log(params);
      ADD_CARTGOODS(params).then(res => {
        this.showSkuPopup = false;
        this.getCartList();
      });
    },
    getCartList() {
      GET_CARTLIST({
        page_index: 1,
        page_size: 20,
        buy_type: this.buy_type
      })
        .then(({ data }) => {
          let list = data.cart_list || [];
          list.forEach(e => {
            e.stock = e.stock || e.max_buy || 0;
            e.priceText = yuan(e.price);
            e.quota =
              e.max_buy === 0
                ? e.stock
                : e.stock > e.max_buy
                ? e.max_buy
                : e.stock;
          });
          this.cartList = list;
          this.totalPrice = data.total_money || 0;
          if (data.lowest_purchase_money > 0) {
            this.isAchieveCondie =
              this.totalPrice >= data.lowest_purchase_money;
            if (this.buy_type == "purchase") {
              this.cartMessage = !this.isAchieveCondie
                ? `最低采购金额为${data.lowest_purchase_money}元`
                : "";
            }
          } else {
            this.isAchieveCondie = true;
            this.cartMessage = null;
          }
        })
        .catch(error => {});
    },
    onSubmit() {
      this.$Navigate.push({
        path: "/packages/channel/order/confirm",
        query: {
          type: this.buy_type
        }
      });
    }
  },
  components: {
    footCartPopup
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
.btn-card {
  display: flex;
  width: 72rpx;
  height: 72rpx;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 50%;
  font-size: 40rpx;
  position: relative;
  left: 30rpx;
}
</style>
