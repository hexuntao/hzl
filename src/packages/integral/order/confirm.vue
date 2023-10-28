<template>
  <view class="pages">
    <lk-choice-address v-if="showAddress" :info="address" @select="onAddress" />
    <view class="list">
      <view
        class="items card-group-box"
        v-for="(item, index) in items"
        :key="index"
      >
        <lk-cell :title="item.shop_name" icon="shop-o" />
        <lk-goods-card
          v-for="child in item.goods_list"
          :key="child.goods_id"
          cell-padding
          :title="child.goods_name"
          :desc="child.spec_name"
          :price="child.price"
          :point="child.point_exchange"
          :image="child.goods_pic"
        >
          <view slot="tags">{{ child.tags }}</view>
          <view slot="num">
            <lk-stepper
              integer
              v-model="params.sku_list[index].num"
              :max="child.quota"
              disable-input
              @change="onStepperChange"
            />
          </view>
        </lk-goods-card>
        <lk-cell title="配送方式" :value="item.shippingText" />
        <lk-cell>
          <view class="shop-foot">
            <text>共</text>
            <view class="num">
              {{ item.goods_num }}
            </view>
            <text>件商品，小计：</text>
            <view class="price">
              {{ item.totalPricePointText }}
            </view>
          </view>
        </lk-cell>
      </view>
    </view>
    <view class="foot-btn-group fixed">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :loading="isLoading"
        :disabled="isDisabled"
        @click="onSubmit"
      >
        立即支付
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_ORDERINFO, PAY_INTEGRALPAY } from "@/common/interface/integral";
import { isEmpty } from "@/common/utils";
import mixinPriceText from "@/mixins/price-text";
import { mapGetters } from "vuex";
import { Base64 } from "@/common/lib/base64";

// 计算店铺商品数量总和
function shopGoodsAmount(item) {
  const arr = item.map(({ num }) => num);
  return arr.reduce((x, y) => x + y);
}
// 过滤规格数组
function filterSpec(value) {
  if (isEmpty(value)) return "";
  let newArr = [];
  value.forEach(e => {
    let str = e.spec_name + " " + e.spec_value_name;
    newArr.push(str);
  });
  return newArr.join(" , ");
}

export default {
  name: "packages-integral-order-confirm",
  data() {
    return {
      goodsType: -1, // 商品类型 0==> 普通商品  1 ==> 优惠券 2 ==> 礼品券 3 ==> 余额

      items: [],
      payTotalAmount: 0, // 计算结算金额
      payTotalPoint: 0, //计算结算积分
      goodsData: {},
      address: {
        id: ""
      },
      isDisabled: true,
      isLoading: false
    };
  },
  mixins: [mixinPriceText],
  computed: {
    ...mapGetters(["orderFrom"]),
    showAddress() {
      return this.goodsType === 0;
    },
    //兑换方式 1-只能积分兑换 2-积分和金钱兑换
    point_exchange_type() {
      return this.payTotalAmount && this.payTotalPoint > 0 ? 2 : 1;
    },
    order_data() {
      let obj = {};
      obj.custom_order = "";
      obj.type = this.orderFrom;
      obj.goods_type = this.goodsType;
      obj.point_exchange_type = this.point_exchange_type;
      obj.pay_type = 0;
      obj.leave_message = "";
      obj.shipping_type = 1;
      if (this.showAddress) {
        obj.address_id = this.address.id;
      }
      obj.goods_list = {
        ...this.goodsData
      };
      obj.goods_list.exchange_point = this.payTotalPoint;
      return obj;
    }
  },
  onLoad(query) {
    const params = JSON.parse(decodeURIComponent(query.params));
    this.params = params;
    this.loadData();
  },
  methods: {
    onAddress(address) {
      this.address = address;
      this.params.address_id = address.id;
      this.loadData(true);
    },
    loadData() {
      GET_ORDERINFO(this.params)
        .then(({ data, message }) => {
          this.goodsType = data.shop[0].goods_list[0].goods_exchange_type;
          if (!isEmpty(data.address)) {
            this.address = {
              name: data.address.consigner,
              tel: data.address.mobile,
              id: data.address.address_id,
              address:
                data.address.province_name +
                data.address.city_name +
                data.address.district_name +
                data.address.address_detail
            };
          }
          let goodsData = {};
          this.items = data.shop.map((e, i) => {
            e.goods_num = shopGoodsAmount(e.goods_list);
            e.goods_list.forEach(g => {
              g.spec_name = filterSpec(g.spec);
              g.tags = this.getTags(g);
              g.quota =
                g.max_buy === 0
                  ? g.stock
                  : g.stock > g.max_buy
                  ? g.max_buy
                  : g.stock;
              goodsData.goods_id = g.goods_id;
              goodsData.sku_id = g.sku_id;
              goodsData.num = g.num;
              goodsData.price = g.price;
            });
            e.totalPricePointText = this.formatPriceText(
              e.total_amount,
              e.total_point
            );
            e.shippingText = this.getShippingText(e.shipping_fee);
            this.payTotalAmount = e.total_amount;
            this.payTotalPoint = e.total_point;
            return e;
          });
          this.goodsData = goodsData;
          this.isDisabled = false;
        })
        .catch(({ code, message }) => {});
    },
    onStepperChange(value) {
      this.loadData(true);
    },
    getShippingText(shipping_fee) {
      let text = "";
      text = "快递 ¥" + shipping_fee;
      if (parseFloat(shipping_fee) == 0) {
        text = "快递 包邮";
      }
      if (!this.address.id && this.showAddress) {
        text = "未选择收货地址";
      }
      return text;
    },
    getTags(e) {
      let tag = "";
      if (this.goodsType === 1) {
        tag = e.coupon && e.coupon.coupon_name ? e.coupon.coupon_name : "";
      } else if (this.goodsType === 2) {
        tag =
          e.gift_voucher && e.gift_voucher.gift_voucher_name
            ? e.gift_voucher.gift_voucher_name
            : "";
      } else if (this.goodsType === 3) {
        tag = e.balance;
      }
      return tag;
    },
    onSubmit() {
      if (this.showAddress && !this.order_data.address_id) {
        this.$Prompt.toast("请选择地址！");
        return false;
      }
      this.isLoading = true;
      if (this.point_exchange_type === 2) {
        this.$Navigate.replace({
          path: "/pay/payment",
          query: {
            integral_data: Base64.encode(JSON.stringify(this.order_data)),
            pay_money: this.payTotalAmount,
            hash: "integral"
          }
        });
      } else {
        PAY_INTEGRALPAY({ order_data: this.order_data }).then(({ data }) => {
          this.$Navigate.replace({
            path: "/packages/pay/result",
            query: {
              out_trade_no: data.out_trade_no
            }
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 190rpx;
  .shop-foot {
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
    .num,
    .price {
      padding: 0 8rpx;
    }
    .price {
      color: $red;
    }
  }
}
</style>
