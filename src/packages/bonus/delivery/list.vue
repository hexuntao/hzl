<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="订单号/店铺名称/商品名称"
        action="搜索"
        @search="onSearch"
      />
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="2"
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.name }}
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
      <view
        v-for="(items, index) in list"
        :key="index"
        class="item card-group-box"
      >
        <lk-cell :title="'订单编号：' + items.order_no">
          <view slot="titleRight" class="price-color">
            {{ items.status_name }}
          </view>
        </lk-cell>
        <lk-goods-card
          v-for="(item, goods_index) in items.order_item_list"
          :key="goods_index"
          cell-padding
          lazyLoad
          :desc="item.sku_name"
          :num="item.num"
          :price="item.price"
          :title="item.goods_name"
          :image="item.pic_cover"
        />
        <lk-cell>
          <view class="">发货信息</view>
          <view class="info-item">
            {{ items.receiver_name }},电话{{ items.receiver_mobile }}
          </view>
          <view class="info-item">
            {{ items.pcd_address }}{{ items.receiver_address }}
          </view>
        </lk-cell>
        <lk-cell>
          <view class="btn-group">
            <lk-button
              class="btn"
              size="small"
              round
              v-for="(item, bInd) in items.member_operation"
              :key="item"
              @click="onOperation(item.no, items.order_id)"
            >
              {{ item.name }}
            </lk-button>
          </view>
        </lk-cell>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_BONUSTEAMDELIVERYORDER } from "@/common/interface/bonus";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-bonus-delivery-list",
  data() {
    return {
      tabs: [
        {
          name: "待发货",
          status: 1
        },
        {
          name: "已发货",
          status: 2
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        search_text: "",
        order_status: 1
      },
      upOption: {
        empty: {
          type: "order",
          tip: "暂无订单"
        }
      }
    };
  },
  mixins: [loadMixin, bonusMixin],
  onLoad() {},
  methods: {
    onTab(index) {
      this.params.order_status = this.tabs[index].status;
      this.resetList();
    },
    onSearch(text) {
      this.params.search_text = text;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_BONUSTEAMDELIVERYORDER(this.params)
        .then(({ data }) => {
          let list = data.delivery_order_list || [];
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onOperation(no, order_id) {
      if (no == "delivery" || no == "update_delivery") {
        this.$Navigate.push({
          path: "/packages/bonus/delivery/post",
          query: {
            order_id
          }
        });
      }
      if (no == "logistics") {
        this.$Navigate.push({
          path: "/packages/order/logistics",
          query: {
            order_id
          }
        });
      }
    }
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
.info-item {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
.btn-group {
  display: flex;
  justify-content: flex-end;
  .btn {
    margin-left: 12rpx;
  }
}
</style>
