<template>
  <view class="pages">
    <lk-choice-address :info="address" @select="onAddress" />
    <form-group v-if="isForm" :items="formList" ref="formGroup" />
    <view
      class="items card-group-box"
      v-for="(items, index) in items"
      :key="index"
    >
      <lk-cell icon="shop-o" :title="items.shop_name" />
      <lk-goods-card
        v-for="(item, g) in items.goods_list"
        :key="g"
        cell-padding
        :image="item.goods_pic"
        :title="item.goods_name"
        :desc="item.sku_name"
        :price="item.price"
        :num="item.num"
      />
      <lk-cell>
        <view class="shop-foot">
          <text>共</text>
          <view class="num">
            {{ items.goods_num }}
          </view>
          <text>件商品，小计：</text>
          <view class="price first-letter">
            {{ items.shop_amount_text}}
          </view>
        </view>
      </lk-cell>
    </view>
    <lk-submit-bar
      label="合计金额（含运费）"
      :price="order_data.total_amount"
      button-text="提交订单"
      :disabled="isDisabled"
      :loading="isLoading"
      @submit="onSubmit"
    />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { yuan, isEmpty } from "@/common/utils";
import { Base64 } from "@/common/lib/base64";
import formGroup from "@/components/custom/form-group";
import { GET_SHOPINFO } from "@/common/interface/microshop";
import { CREATE_ORDER } from "@/common/interface/order";

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
  name: "packages-microshop-order-confirm",
  data() {
    return {
      params: {},
      shopkeeper_id: "",
      orderType: "", // 提交类型 2 ==> 立即开店 /  3 ==> 立即续费 / 4 ==>立即升级

      address: {},
      items: [],

      shipping_type: 1, // 配送方式 1==> 快递  2==> 自提  0 ==> 虚拟（无）
      total_amount: 0, //总金额
      total_shipping: 0, //总运费

      isLoading: false,
      formList: []
    };
  },
  computed: {
    ...mapGetters(["orderFrom"]),
    order_data() {
      const items = this.items;
      const obj = {};
      obj.custom_order = "";
      obj.order_from = this.orderFrom;
      obj.total_amount = this.total_amount;
      if (this.shipping_type !== 0) {
        obj.shipping_type = this.shipping_type;
      }

      if (this.shopkeeper_id) {
        obj.shopkeeper_id = this.shopkeeper_id;
      }
      if (this.orderType) {
        obj.order_type = this.orderType;
      }

      if (this.shipping_type == 1) {
        obj.address_id = this.address.id;
      }
      obj.shop_list = [];
      if (!items) return {};
      items.forEach(e => {
        let shop_obj = {};
        shop_obj.leave_message = e.leave_message;
        shop_obj.shop_id = e.shop_id;
        shop_obj.rule_id = e.full_cut.rule_id ? e.full_cut.rule_id : ""; //满减id
        shop_obj.coupon_id = e.coupon_id ? e.coupon_id : ""; //优惠券id
        shop_obj.shop_amount =
          e.shop_amount <= 0 ? (e.shop_amount = 0) : e.shop_amount;
        if (this.shipping_type == 2) {
          shop_obj.store_id = e.store_id;
        }
        if (this.shipping_type == 0) {
          shop_obj.card_store_id = e.card_store_id;
        }
        shop_obj.goods_list = [];
        e.goods_list.forEach(g => {
          let goods_obj = {};
          goods_obj.goods_id = g.goods_id;
          goods_obj.sku_id = g.sku_id;
          goods_obj.price = g.price;
          goods_obj.num = g.num;
          goods_obj.discount_price = g.discount_price;
          goods_obj.seckill_id = g.seckill_id ? g.seckill_id : "";
          goods_obj.channel_id = g.channel_id ? g.channel_id : "";
          goods_obj.discount_id = g.discount_id ? g.discount_id : "";
          goods_obj.bargain_id = g.bargain_id ? g.bargain_id : "";
          goods_obj.presell_id = g.presell_id ? g.presell_id : "";

          shop_obj.goods_list.push(goods_obj);
        });
        obj.shop_list.push(shop_obj);
      });
      // console.log("order_data===", obj);
      return obj;
    },
    isDisabled() {
      return this.order_data.total_amount >= 0 &&
        this.order_data.total_amount !== undefined
        ? false
        : true;
    },
    isForm() {
      return !isEmpty(this.formList);
    }
  },
  onLoad(query) {
    const params = JSON.parse(query.params);
    this.params = params;
    this.orderType = params.order_type;
    if (query.shopkeeper_id) {
      this.shopkeeper_id = query.shopkeeper_id;
    }
    this.loadData();
  },
  methods: {
    onAddress(address) {
      this.address = address;
      this.params.address_id = address.id;
      this.loadData();
    },
    loadData() {
      const $this = this;
      GET_SHOPINFO($this.params)
        .then(({ data, message }) => {
          if (message) $Prompt.toast(message);
          $this.total_shipping = data.total_shipping;
          $this.total_amount = data.amount;
          $this.items = data.shop.map(e => {
            e.leave_message = "";
            e.goods_num = shopGoodsAmount(e.goods_list);
            e.shop_amount_text = yuan(e.total_amount);
            return e;
          });
          if (!isEmpty(data.address)) {
            $this.address = {
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
          $this.formList = !isEmpty(data.customform) ? data.customform : [];
        })
        .catch(() => {});
    },
    onSubmit() {
      const $this = this;
      const form_data = $this.$refs["formGroup"]
        ? $this.$refs["formGroup"].getFormData()
        : "";
      if ($this.isForm) {
        if (!form_data) return false;
        $this.order_data.custom_order = JSON.stringify(form_data);
      }
      if ($this.shipping_type == 1) {
        if (!$this.order_data.address_id)
          return $this.$Prompt.toast("请选择收货地址！");
      }
      // return console.log($this.order_data);
      $this.isLoading = true;
      CREATE_ORDER({ order_data: $this.order_data })
        .then(({ data }) => {
          $this.$Navigate.replace({
            path: "/pay/payment",
            query: {
              out_trade_no: data.out_trade_no
            }
          });
        })
        .catch(error => {
          $this.isLoading = false;
        });
    }
  },
  components: {
    formGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 100rpx;
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
