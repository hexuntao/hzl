<template>
  <view>
    <lk-submit-bar
      :price="totalPrice"
      :disabled="submitDisabled"
      button-text="结算"
      @submit="show = true"
    >
      <view class="btn-card" @click="show = true">
        <lk-icon name="shopping-cart-o" size="20" :info="countNum" />
      </view>
    </lk-submit-bar>
    <lk-popup v-model="show" position="bottom" title="购物车" round closeable>
      <view class="list">
        <lk-cell center v-for="(item, index) in list" :key="index">
          <view class="checked" slot="icon">
            <lk-checkbox-group>
              <lk-checkbox
                v-model="item.checked"
                :active-color="theme.color"
                :disabled="item.disabled"
              />
            </lk-checkbox-group>
          </view>
          <lk-goods-card
            :image="item.goods_img"
            :title="item.goods_name"
            :desc="item.sku_name"
          >
            <view slot="titleRight" class="price-color first-letter">
              {{ item.priceText }}
            </view>
            <view slot="bottom" class="info-foot">
              <lk-stepper
                v-model="item.num"
                integer
                async-change
                @change="onNumChange(item)"
                :max="item.quota"
              />
              <view class="del" @click="onRemove(item.cart_id)">
                <lk-icon name="delete" square />
              </view>
            </view>
          </lk-goods-card>
        </lk-cell>
      </view>
      <view class="foot-btn-group">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          :disabled="submitDisabled"
          @click="onSubmit"
        >
          {{ btnText }}
        </lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { addImgSrcDomain, yuan } from "@/common/utils";
import {
  EDIT_STORECARTNUM,
  REMOVE_STORECART,
  GET_STORECARTLIST
} from "@/common/interface/store";
export default {
  data() {
    return {
      show: false,
      list: []
    };
  },
  props: {},
  computed: {
    totalPrice() {
      let cart_id_list = [];
      let sku_list = [];
      let total = 0;
      this.list.forEach(item => {
        if (item.checked) {
          cart_id_list.push(item.cart_id);
          sku_list.push({
            sku_id: item.sku_id,
            coupon_id: 0,
            shop_id: item.shop_id
          });
          total += parseFloat(item.price) * parseFloat(item.num);
        }
      });
      this.cart_id_list = cart_id_list;
      this.sku_list = sku_list;
      return total;
    },
    btnText() {
      return `结算(合计：${yuan(this.totalPrice)})`;
    },
    submitDisabled() {
      let flag =
        this.list.every(({ checked }) => !checked) || !this.list.length;
      return flag;
    },
    countNum() {
      let num = 0;
      if (this.list.length) {
        this.list.forEach(e => {
          num += parseFloat(e.num);
        });
      }
      return num;
    }
  },
  mounted() {
    setTimeout(() => {
      this.getCartList();
    });
  },
  methods: {
    getCartList() {
      GET_STORECARTLIST({
        store_id: this.$store.getters.route.query.store_id
      })
        .then(({ data }) => {
          const list = data.cart_list || [];
          list.forEach(e => {
            if ((e.promotion_type && e.promotion_type === 3) || !e.stock) {
              // 活动商品不可结算
              e.disabled = true;
              e.checked = false;
            } else {
              e.disabled = false;
              e.checked = true;
            }
            e.quota =
              e.max_buy === 0
                ? e.stock
                : e.stock > e.max_buy
                ? e.max_buy
                : e.stock;
            e.goods_img = addImgSrcDomain(e.goods_img);
            e.priceText = yuan(e.price);
          });
          this.list = list;
          if (this.async) {
            this.async = false;
          }
        })
        .catch(() => {
          if (this.async) {
            this.async = false;
          }
        });
    },
    onNumChange({ num, max_buy, stock, cart_id }, index) {
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
      const params = {};
      params.cart_id = cart_id;
      params.num = count;
      EDIT_STORECARTNUM(params).then(() => {
        this.getCartList();
      });
    },
    onRemove(cart_id) {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定移除该商品？"
        })
        .then(() => {
          REMOVE_STORECART({
            cart_id
          }).then(({ message }) => {
            this.getCartList();
          });
        });
    },
    onSubmit() {
      const params = {};
      params.order_tag = "cart";
      params.cart_from = 2;
      params.cart_id_list = this.cart_id_list;
      params.sku_list = this.sku_list;
      // return console.log(params);
      this.show = false;
      this.$Navigate.push({
        path: "/packages/order/confirm",
        query: {
          params: JSON.stringify(params)
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: calc(70vh - 148rpx);
  overflow-y: auto;
  .checked {
    margin-right: 20rpx;
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
