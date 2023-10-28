<template>
  <view class="card-group-box">
    <lk-cell icon="shop-o" :title="detail.shop_name" />
    <view class="cell-goods">
      <lk-goods-card
        cell-padding
        card-size="sm"
        v-for="(item, index) in goodsList"
        :key="index"
        :to="item.to"
        :num="item.num"
        :price="item.price"
		
		:ptmoney="item.goods_ptmoney"
		
        :desc="item.spec_name"
        :title="item.goods_name"
        :image="item.pic_cover"
        :point="item.goods_point"
      >
        <view slot="footer">
          <block v-if="item.member_operation && item.member_operation.length">


            <lk-button
              size="mini"
              round
              v-for="(btn, btn_index) in item.member_operation"
              :key="btn_index"
              @click="onResult(item.order_goods_id,btn)"
            >
              {{ btn.name }}
            </lk-button>


          </block>
        </view>
      </lk-goods-card>
    </view>
  </view>
</template>

<script>
// 过滤规格数组
function filterSpec(value) {
  if (!value || !value.length) return "";
  let newArr = [];
  value.forEach(e => {
    let str = e.spec_name + " " + e.spec_value_name;
    newArr.push(str);
  });
  return newArr.join(" , ");
}
export default {
  data() {
    return {};
  },
  props: {
    detail: {
      type: Object
    }
  },
  computed: {
    goodsList() {
      const { order_goods, order_type } = this.detail;
      let list = order_goods || [];
      list.forEach(e => {
        if (e.goods_id) {
          e.spec_name = filterSpec(e.spec);
          e.to =
            order_type == 10
              ? "/packages/integral/goods/detail?goods_id=" + e.goods_id
              : "/packages/goods/detail?goods_id=" + e.goods_id;
        }
      });
      return list;
    }
  },
  methods: {
    // 退款/退货
    onResult(order_goods_id,btn) {
      const { unrefund, unrefund_reason } = this.detail;
      if (unrefund == 1) {
        return this.$Prompt.modal({
          content: unrefund_reason,
          showCancel: false
        });
      }

      if(btn.no=='return_hg'){
        this.$Navigate.push({
          path: "/packages/order/return_hg",
          query: {
            order_goods_id
          }
        });
      }else{
        this.$Navigate.push({
          path: "/packages/order/post",
          query: {
            order_goods_id
          }
        });
      }

    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.btn {
  margin-left: 10rpx;
}
.cell-goods {
  // padding: $cell-padding;
  background: #ffffff;
}
</style>
