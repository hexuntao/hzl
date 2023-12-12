<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <view
          class="cart-panel-group card-group-box"
          v-for="(items, index) in list"
          :key="index"
        >
          <lk-cell>
            <view slot="title">
              <lk-checkbox-group>
                <lk-checkbox
                  v-model="items.checked"
                  :active-color="theme.color"
                  @click="onShopChecked(index)"
                >
                  {{ items.shop_name }}
                </lk-checkbox>
              </lk-checkbox-group>
            </view>
            <!-- <view class="cell-delivery">
            <lk-icon name="location-o" />
            <text class="text">{{ deliveryText }}</text>
          </view> -->
            <view slot="rightIcon">
              <text
                class="shop-title-rigth"
                :style="{ color: theme.color }"
                v-if="items.couponList.length"
                @click="onReciveCoupon(index)"
              >
                领券
              </text>
            </view>
          </lk-cell>
          <lk-cell center v-for="(item, g) in items.goods_list" :key="g">
            <view class="checked" slot="icon">
              <lk-checkbox-group>
                <lk-checkbox
                  v-model="item.checked"
                  :active-color="theme.color"
                  :disabled="item.disabled"
                  @change="onGoodsChecked(index, g)"
                />
              </lk-checkbox-group>
            </view>
            <view class="info">
              <lk-goods-card
                :image="item.goods_pic"
                :title="item.goods_name"
                :tag="item.tagName"
                :to="'/packages/goods/detail?goods_id=' + item.goods_id"
              >
                <view slot="titleRight" class="price-text first-letter">
                  {{ item.priceText }}
				  <view v-if="item.ptmoney!=0 && item.ptmoney!=null">+{{item.ptmoney}}积分</view>
                </view>
                <view
                  class="sku-text"
                  slot="tags"
                  v-if="item.sku_name"
                  @click="clickSku(item, index, g)"
                >
                  <text class="text">{{ item.sku_name }}</text>
                  <lk-icon name="arrow-down" />
                </view>
                <view slot="bottom" class="info-foot">
                  <block v-if="item.stock">
                    <lk-stepper
                      v-model="item.num"
                      integer
                      async-change
                      @change="onNumChange(item, index, g)"
                      :max="item.quota"
                      :min="item.least"
                    />
                  </block>
                  <view v-else class="text">库存不足</view>
                  <view class="del">
                    <lk-icon
                      name="delete"
                      square
                      @click="onRemove(item.cart_id)"
                    />
                  </view>
                </view>
              </lk-goods-card>
            </view>
          </lk-cell>
          <lk-cell-full-cut
            v-if="items.mansong_info.rule_id"
            :items="items.mansong_info"
          />
        </view>
      </view>
    </lk-load-list>
    <lk-popup-coupon
      v-model="isShowPopupCoupon"
      get-type="4"
      :title="popupCouponTitle"
      :items="couponList"
    />
    <lk-sku
      v-if="goodsData"
      v-model="showSku"
      :info="goodsData"
      action="buy"
      :initial-sku="initialSku"
      @action="onAction"
      @close="onSkuClose"
    />
    <view>
      <lk-submit-bar
        safe-area-inset-bottom
        :price="totalPrice"
		:ptmoney="totalPtmoney"
        :disabled="submitDisabled"
        button-text="结算"
        @submit="onSubmit"
      >
        <view class="total-checkbox">
          <lk-checkbox-group>
            <lk-checkbox v-model="allChecked" :active-color="theme.color">
              全选
            </lk-checkbox>
          </lk-checkbox-group>
        </view>
      </lk-submit-bar>
    </view>
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import {
  REMOVE_CARTGOODS,
  EDIT_CARTNUM,
  GET_SHOPCARTINFO,
  EDIT_CARTINFO
} from "@/common/interface/mall";
import { GET_SHOPCOUPONLIST } from "@/common/interface/coupon";
import { GET_GOODSINFO } from "@/common/interface/goods";
import { yuan } from "@/common/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
const tagName = {
  1: "秒杀",
  2: "团购",
  3: "预售",
  4: "砍价",
  5: "限时折扣"
};
export default {
  name: "pages-mall-cart",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },

      upOption: {
        auto: true,
        empty: {
          type: "cart",
          tip: "没有相关数据",
          btnText: "去逛逛",
          to: "/pages/mall/index"
        }
      },

      cart_id_list: [],
      sku_list: [],

      isShowPopupCoupon: false,
      couponList: [],
      popupCouponTitle: "",
      isShowDelivery: false,
      storeList: [],
      deliveryText: "快递配送",

      showSku: false,
      skuAction: "",
      goodsData: null,
      initialSku: null
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    // 是否全选
    allChecked: {
      get() {
        // 选中的item组
        if (this.list.length > 0) {
          const checkedArr = this.list.map((e, i) => {
            const checkItems = e.goods_list.filter(item => {
              return item.checked == true && !item.disabled;
            }).length;
            const InitialItems = this.list[i].goods_list.filter(item => {
              return !item.disabled;
            }).length;
            return checkItems == InitialItems;
          });
          return (
            checkedArr.filter(item => {
              return item == true;
            }).length == checkedArr.length
          );
        } else {
          return false;
        }
      },
      set(value) {
        this.list.forEach(item => {
          item.checked = value;
          item.goods_list.forEach(g => {
            g.checked = g.disabled ? false : value;
          });
        });
      }
    },
    // 计算总价
    totalPrice() {
      let total = 0;
      let arr = [];
      let sku_list = [];
      this.list.forEach(({ goods_list }) => {
        goods_list.forEach(item => {
          if (item.checked) {
            arr.push(item.cart_id);
            sku_list.push({
              sku_id: item.sku_id,
              coupon_id: 0,
              shop_id: item.shop_id
            });
            total += parseFloat(item.price) * parseFloat(item.num);
          }
        });
      });
      this.cart_id_list = arr;
      this.sku_list = sku_list;
      return total;
    },
	// 计算总价
	totalPtmoney() {
	  let total = 0;
	  this.list.forEach(({ goods_list }) => {
	    goods_list.forEach(item => {
	      if (item.checked) {
	        total += parseFloat(item.ptmoney) * parseFloat(item.num);
	      }
	    });
	  });

	  return total;
	},
    submitDisabled() {
      return !this.cart_id_list.length;
    }
  },
  onShow() {
    this.$load && this.getList();
  },
  methods: {
    ...mapActions(["getCartList"]),
    upCallback(page) {
      this.params.page_index = page.num;
      this.getList();
    },
    getList() {
      this.getCartList(this.params)
        .then(({ data, code, message }) => {
          const items = data.shop || [];
		  
		  
		  
		
          this.list = items.map(item => {
			  
            const originItem = this.list.filter(
              ({ shop_id }) => shop_id == item.shop_id
            )[0];
			
			
            let obj = {};
            obj.shop_id = item.shop_id;
            obj.shop_name = item.shop_name;
            obj.checked = originItem ? originItem.checked : true;
            obj.couponList = [];
			
			
            obj.goods_list = item.goods_list;
			
            obj.goods_list.forEach(goodsItem => {
				
				
              const originGoodsItem = originItem
                ? originItem.goods_list.filter(
                    ({ goods_id }) => goods_id == goodsItem.goods_id
                  )[0]
                : "";
              goodsItem.tagName = tagName[goodsItem.promotion_type];
              goodsItem.priceText = yuan(goodsItem.price);
              goodsItem.quota =
                goodsItem.max_buy === 0
                  ? goodsItem.stock
                  : goodsItem.stock > goodsItem.max_buy
                  ? goodsItem.max_buy
                  : goodsItem.stock;
              goodsItem.least = goodsItem.least_buy || 1;
			  
			  
			  
              if (
                (goodsItem.promotion_type && goodsItem.promotion_type === 3) ||
                !goodsItem.stock ||
                !goodsItem.state
              ) {
                goodsItem.disabled = true;
                goodsItem.checked = false;
              } else {
                goodsItem.disabled = false;
                goodsItem.checked = originGoodsItem
                  ? originGoodsItem.checked
                  : true;
              }
            });
			
			
			
            obj.discount_info = item.discount_info;
			
            /* obj.mansong_info = item.mansong_info;
             if (obj.mansong_info.discount) {
              obj.mansong_info.discount = parseFloat(item.mansong_info.discount);
            } */

            return obj;
          });
		  
          this.getCounponList();
		  
          this.concatList(this.list, data.total_count);
          if (code == 3) {
            this.$Prompt.toast(message);
          }
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    getCounponList() {
      if (this.addons.coupontype) {
        this.list.forEach(item => {
          let goods_id_array = [];
          item.goods_list.forEach(({ goods_id }) => {
            goods_id_array.push(goods_id);
          });
          GET_SHOPCOUPONLIST({
            goods_id_array
          })
            .then(({ data }) => {
              data.forEach(e => {
                e.loading = false;
              });
              item.couponList = data;
            })
            .catch(() => {});
        });
      }
    },
    onSubmit() {
      let params = {};
      params.order_tag = "cart";
      params.cart_from = 1;
      params.cart_id_list = this.cart_id_list;
      params.sku_list = this.sku_list;
      // return console.log(params);
      this.$Navigate.push({
        path: "/packages/order/confirm",
        query: {
          params: JSON.stringify(params)
        }
      });
    },

    onShopChecked(index) {
      const items = this.list[index];
      items.goods_list.forEach(item => {
        item.checked = item.disabled ? false : items.checked;
      });
    },
    onGoodsChecked(index, g) {
      const items = this.list[index];
      const checkItems = items.goods_list.filter(item => {
        return item.checked == true;
      }).length;
      const InitialItems = items.goods_list.filter(item => {
        return !item.disabled;
      }).length;
      items.checked = checkItems == InitialItems;
    },
    onReciveCoupon(index) {
      const items = this.list[index];
      this.isShowPopupCoupon = true;
      this.popupCouponTitle = items.shop_name;
      this.couponList = items.couponList;
    },
    onNumChange({ num, max_buy, stock, cart_id, shop_id }, index) {
      if (num <= 0) {
        return;
      }
      if (this.async) {
        return;
      }
      const maxCount =
        max_buy === 0 ? stock : stock > max_buy ? max_buy : stock;
      const count = num > maxCount ? maxCount : num;
      this.async = true;
      let params = {
        cart_id: cart_id,
        shop_id: shop_id,
        num: count
      };
      this.currentStoreId && (params.store_id = this.currentStoreId);
      this.active = index;
      this.editCart(params)
        .then(() => {
          this.async = false;
        })
        .catch(() => {
          this.async = false;
        });
    },
    selectDelivery(index) {
      let params = {
        shop_id: this.items.shop_id,
        store_id: 0
      };
      if (index == -1) {
        this.deliveryText = "快递配送";
        params.store_id = 0;
      } else {
        this.deliveryText = this.storeList[index].store_name;
        params.store_id = this.storeList[index].store_id;
      }
      this.currentStoreId = params.store_id;
      this.getShopCartInfo(params);
    },
    getShopCartInfo(params) {
      GET_SHOPCARTINFO(params).then(({ data }) => {
        this.resetShopCartData(data);
      });
    },

    onAction(action, data) {
      let params = {
        cart_id: this.currentCartId || 0,
        shop_id: data.shopId,
        sku_list: {
          sku_id: data.selectedSkuComb.id,
          num: data.selectedNum
        }
      };
      this.currentStoreId && (params.store_id = this.currentStoreId);
      this.editCart(params)
        .then(() => {
          this.showSku = false;
        })
        .catch(() => {
          this.showSku = false;
        });
    },
    onSkuClose() {
      setTimeout(() => {
        this.goodsData = null;
      }, 500);
    },
    // 选择sku
    clickSku(item, index) {
      let params = {
        goods_id: item.goods_id
      };
      this.active = index;
      this.initialSku = {
        id: item.sku_id,
        num: item.num
      };
      this.currentStoreId && (params.store_id = this.currentStoreId);
      this.currentCartId = item.cart_id;
      GET_GOODSINFO(params, { loading: true })
        .then(({ data }) => {
          this.goodsData = data.goods_detail;
          this.goodsData.goods_image = data.goods_detail.goods_image_yun;
          this.goodsData.is_allow_buy =
            typeof data.is_allow_buy == "boolean" ? data.is_allow_buy : true;
          this.showSku = true;
        })
        .catch(() => {});
    },
    // 重置购物车信息
    resetShopCartData(data = {}) {
      const items = this.list[this.active || 0];
      const goods_list = data.goods_list || [];
      goods_list.forEach(item => {
        item.tagName = tagName[item.promotion_type];
        item.priceText = yuan(item.price);
        item.quota =
          item.max_buy === 0
            ? item.stock
            : item.stock > item.max_buy
            ? item.max_buy
            : item.stock;
        item.least = item.least_buy || 1;
        if (
          (item.promotion_type && item.promotion_type == 3) ||
          !item.stock ||
          !item.state
        ) {
          item.disabled = true;
          item.checked = false;
        } else {
          item.disabled = false;
          item.checked = true;
        }
      });

      items.goods_list = goods_list;
      items.discount_info = data.discount_info || {};
      items.mansong_info = data.mansong_info || {};
    },
    // 编辑购物车
    editCart(params) {
      return new Promise((resolve, reject) => {
        EDIT_CARTINFO(params)
          .then(({ data }) => {
            this.resetShopCartData(data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 删除购物车
    onRemove(cart_id) {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定移除该商品？"
        })
        .then(() => {
          REMOVE_CARTGOODS({ cart_id })
            .then(({ message }) => {
              this.resetList();
            })
            .catch(() => {});
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.list {
  padding-bottom: 100rpx;
}
.total-checkbox {
  padding-left: 30rpx;
}
.cart-panel-group {
  .checked {
    margin-right: 20rpx;
  }
  .info {
    flex: 1;
  }
  .cell-delivery {
    text-align: left;
    display: flex;
    align-items: center;
    font-size: $font-size-sm;
    color: $text-gray;
    .text {
      padding-left: 4rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .price-text {
    color: $red;
    font-size: $font-size-sm;
    font-weight: 700;
    line-height: 1.2;
  }
  .shop-title-rigth {
    padding: 8rpx;
    color: $red;
  }
  .sku-text {
    display: flex;
    align-items: center;
    width: 200rpx;
    justify-content: space-between;
    background: #f8f8f8;
    color: $text-gray;
    height: 40rpx;
    padding: 0 10rpx;
    .text {
      padding-right: 10rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .info-foot {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .del {
      display: flex;
      align-items: center;
    }
    .text {
      color: $text-gray;
    }
  }
}
</style>
