<template>
  <view class="pages">
    <view class="cell-header">
      <view class="image">
        <image :src="headInfo.express_company_logo" mode="widthFix" />
      </view>
      <view class="text">
        <view>订单编号：{{ order_no || "" }}</view>
        <view>快递公司：{{ headInfo.expTextName || "" }}</view>
        <view>快递单号：{{ headInfo.mailNo || "" }}</view>
      </view>
    </view>
    <lk-tabs
      v-if="tabs.length > 1"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      :line="false"
      @change="onTabChange"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">
        <text>{{ tab.name }}</text>
      </lk-tab>
    </lk-tabs>
    <view class="time-line-group">
      <time-line
        v-if="packet_list[active] && packet_list[active].shipping_info"
      >
        <time-line-item
          v-for="(item, index) in packet_list[active].shipping_info.data"
          :key="index"
        >
          <view class="item lk-hairline--bottom" slot="content">
            <view
              class="text"
              :style="{ color: index === 0 ? theme.color : '' }"
            >
              {{ item.context }}
            </view>
            <view class="time">{{ item.time }}</view>
          </view>
        </time-line-item>
      </time-line>
      <view v-else class="empty">暂无物流信息</view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_LOGISTICSDETAIL } from "@/common/interface/order";
import { isEmpty } from "@/common/utils";
import timeLine from "./component/logistics/time-line";
import timeLineItem from "./component/logistics/time-line-item";
export default {
  name: "packages-order-logistics",
  data() {
    return {
      active: 0,
      order_id: "",
      order_no: "",
      packet_list: [],

      tabs: [{}]
    };
  },
  computed: {
    headInfo() {
      const obj = {};
      const list = this.packet_list[this.active];
      if (!isEmpty(list)) {
        obj.express_company_logo = list.express_company_logo;
        obj.mailNo = list.shipping_info
          ? list.shipping_info.mailNo
          : "暂无快递公司";
        obj.expTextName = list.shipping_info
          ? list.shipping_info.expTextName
          : "暂无快递单号";
      }
      return obj;
    },
    isShowTitle() {
      return this.packet_list.length > 1 ? "" : "hidden";
    }
  },
  onLoad(query) {
    this.order_id = query.order_id;
    this.order_id && this.getData();
  },
  methods: {
    getData() {
      GET_LOGISTICSDETAIL({ order_id: this.order_id }, { isShowLoading: true })
        .then(({ data }) => {
          this.order_no = data.order_no;
          this.packet_list = data.goods_packet_list || [];
          let arr = [];
          this.packet_list.forEach((e, i) => {
            arr.push({ name: e.packet_name });
          });

          this.tabs = arr;
        })
        .catch(() => {});
    },
    onTabChange(e) {
      this.active = e;
    }
  },
  components: {
    timeLine,
    timeLineItem
  }
};
</script>

<style lang="scss" scoped>
.cell-header {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  padding: $cell-padding;
  margin-bottom: 20rpx;
  .image {
    display: flex;
    align-items: center;
    width: 200rpx;
    margin-right: 20rpx;
    image {
      width: 100%;
      height: 100%;
      min-height: 40rpx;
    }
  }
  .text {
    flex: 1;
    font-size: $font-size-sm;
    color: $text-gray;
    line-height: 48rpx;
  }
}
.time-line-group {
  padding: $cell-padding;
  background: #ffffff;
  .item {
    line-height: 48rpx;
    padding-bottom: 20rpx;
    .text {
      color: $text-gray;
      line-height: 40rpx;
    }
    .time {
      font-size: $font-size-sm;
      color: $text-light;
    }
  }
}
</style>
