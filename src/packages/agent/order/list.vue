<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="订单号/店铺名称/商品名称"
        :action="params.buy_type != 'commission' ? '搜索' : ''"
        @search="onSearch"
      />
      <lk-tabs
        v-model="active"
        :active-color="theme.color"
        :line-color="theme.color"
        :nav-per-view="tabs.length > 4 ? 'auto' : tabs.length"
        slot-title
        @change="onTabChange"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <text>{{ tab.name }}</text>
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
      <view class="list" v-if="params.buy_type == 'commission'">
        <orderCommissionItem
          v-for="(item, index) in list"
          :key="index"
          :item="item"
        />
      </view>
      <view class="list" v-else>
        <view
          class="item card-group-box"
          v-for="(items, index) in list"
          :key="index"
        >
          <lk-cell icon="shop-o" :title="items.shop_name">
            <view class="price-color">{{ items.status_name }}</view>
          </lk-cell>
          <lk-goods-card
            v-for="(item, goods_index) in items.goods_list"
            :key="goods_index"
            cell-padding
            lazyLoad
            :desc="item.sku_name"
            :num="item.num"
            :price="item.price"
            :title="item.goods_name"
            :image="item.goods_img"
          >
            <view slot="tags" v-if="buy_type == 'purchase'">
              采购于：{{ item.purchase_to }}
            </view>
          </lk-goods-card>
          <lk-cell>
            <view class="cell-pay-text">
              <view v-if="items.order_status !== 0">
                {{ items.pay_type_name }}
              </view>
              <view>{{ items.order_status === 0 ? "待支付" : "实付" }}</view>
              <view class="price-color">{{ items.pay_money | yuan }}</view>
            </view>
          </lk-cell>
          <lk-cell>
            <foot-operate
              :buy_type="buy_type"
              :list="items.operateItems"
              :order_id="items.order_id"
              @init="resetList"
            />
          </lk-cell>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_ORDERLIST } from "@/common/interface/agent";
import footOperate from "../component/foot-operate";
import orderCommissionItem from "../component/order-commission-item";
import { formatDate } from "@/common/utils";
const titleObj = {
  purchase: "采购订单",
  pickupgoods: "提货订单",
  output: "出货订单",
  retail: "零售订单"
};
const paymentTypeText = {
  0: "在线支付",
  1: "微信支付",
  2: "支付宝支付",
  3: "银联卡支付",
  4: "货到付款",
  5: "余额支付",
  6: "到店支付",
  10: "线下支付"
};
const orderStatusText = {
  0: "待付款",
  1: "待发货",
  2: "已发货",
  3: "已收货",
  4: "已完成",
  5: "已关闭",
  "-1": "售后中"
};

export default {
  name: "packages-agent-order-list",
  data() {
    return {
      buy_type: "",
      active: 0,
      params: {
        page_index: 1,
        page_size: 20,
        buy_type: "",
        order_status: "",
        search_text: ""
      },
      upOption: {
        auto: false,
        empty: {
          type: "order",
          tip: "暂无订单"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    tabs() {
      const type = this.buy_type;
      let obj = {
        purchase: [
          {
            name: "全部",
            state: ""
          },
          {
            name: "待付款",
            state: 0
          },
          {
            name: "已完成",
            state: 4
          }
        ],
        pickupgoods: [
          {
            name: "全部",
            state: ""
          },
          {
            name: "待付款",
            state: 0
          },
          {
            name: "待发货",
            state: 1
          },
          {
            name: "已发货",
            state: 2
          },
          {
            name: "已收货",
            state: 3
          },
          {
            name: "已完成",
            state: 4
          },
          {
            name: "售后",
            state: -1
          }
        ],
        output: [
          {
            name: "全部",
            state: ""
          },
          {
            name: "待付款",
            state: 0
          },
          {
            name: "已发货",
            state: 2
          }
        ],
        retail: [
          {
            name: "全部",
            state: ""
          },
          {
            name: "待付款",
            state: 0
          },
          {
            name: "待发货",
            state: 1
          },
          {
            name: "已发货",
            state: 2
          },
          {
            name: "已收货",
            state: 3
          },
          {
            name: "已完成",
            state: 4
          },
          {
            name: "售后",
            state: -1
          }
        ],
        commission: [
          {
            name: "所有订单",
            state: null
          },
          {
            name: "已付款",
            state: 1
          },
          {
            name: "已发货",
            state: 2
          },
          {
            name: "已完成",
            state: 4
          }
        ]
      };
      return obj[type];
    }
  },
  onLoad(query) {
    this.buy_type = query.type;
    this.params.buy_type = this.buy_type;
  },
  methods: {
    loadInitEnd() {
      setTimeout(() => {
        this.$load.triggerUpScroll();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ORDERLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            e.pay_type_name = paymentTypeText[e.payment_type];
            e.operateItems = this.getOperateItems(
              this.buy_type,
              e.order_status
            );
            if (this.params.buy_type == "commission") {
              e.isshow = false;
              e.create_time = formatDate(e.create_time, "YYYY-MM-DD hh:mm");
            }
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onSearch(text) {
      this.params.search_text = text;
      this.resetList();
    },
    onTabChange(index) {
      const state = this.tabs[index].state;
      this.params.order_status = state;
      this.resetList();
    },
    getOperateItems(type, state) {
      if (state == undefined) return [];
      let arr = [];
      let pay_obj = {
          no: "pay",
          name: "立即支付"
        },
        close_obj = {
          no: "close",
          name: "关闭订单"
        },
        getdelivery_obj = {
          no: "getdelivery",
          name: "确认收货"
        },
        logistics_obj = {
          no: "logistics",
          name: "查看物流"
        },
        detail_obj = {
          no: "detail",
          name: "订单详情"
        };
      if (type == "purchase") {
        if (state == 0) {
          arr.push(pay_obj);
          arr.push(close_obj);
        }
      } else if (type == "pickupgoods") {
        if (state == 0) {
          arr.push(pay_obj);
          arr.push(close_obj);
        }
        if (state == 2) {
          arr.push(getdelivery_obj);
          arr.push(logistics_obj);
        }
      } else if (type == "output") {
        if (state == 0) {
          arr.push(close_obj);
        }
      } else if (type == "retail") {
        if (state == 2) {
          arr.push(logistics_obj);
        }
      }
      arr.push(detail_obj);
      return arr;
    }
  },
  components: {
    footOperate,
    orderCommissionItem
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
.cell-pay-text {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  color: $text-light;
  font-size: $font-size-sm;
  view {
    margin-left: 20rpx;
  }
  .price-color {
    font-size: $font-size;
    color: $red;
  }
}
</style>
