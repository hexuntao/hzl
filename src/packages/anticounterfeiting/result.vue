<template>
  <view class="pages">
    <view class="cell-group">
      <lk-goods-card
        cell-padding
        :image="info.goods_img"
        :price="info.price"
        :title="info.goods_name"
      >
        <view slot="num">
          <lk-button
            size="mini"
            type="danger"
            round
            :color="theme.gradient"
            :to="'/packages/goods/detail?goods_id=' + info.goods_id"
          >
            点击购买
          </lk-button>
        </view>
      </lk-goods-card>
    </view>

    <view class="cell-group" v-if="columns.length">
      <view class="cell-group-title">防伪信息</view>
      <lk-cell :title="info.search_tips" :border="false" />
      <lk-cell-info-list :list="columns" />
    </view>

    <view class="cell-group" v-if="batchItems.length">
      <view class="cell-group-title">商品溯源信息</view>
      <view class="batch-list">
        <time-line>
          <time-line-item v-for="(item, index) in batchItems" :key="index">
            <view class="item lk-hairline--bottom" slot="content">
              <view class="head">
                <view class="name">{{ item.node_name }}</view>
                <view class="time">{{ item.timeText }}</view>
              </view>
              <view class="content">{{ item.node_description }}</view>
              <view class="images">
                <lk-cell-image-panel :list="item.proof_pic" />
              </view>
            </view>
          </time-line-item>
        </time-line>
      </view>
    </view>

    <view
      class="foot-btn-group"
      v-if="info.chain_status == 1 && info.chain_url"
    >
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :to="info.chain_url"
      >
        查看上链信息
      </lk-button>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import { mapActions } from "vuex";
import { GET_SEARCHANTI } from "@/common/interface/anticounterfeiting";
import timeLine from "./component/time-line";
import timeLineItem from "./component/time-line-item";
export default {
  name: "packages-anticounterfeiting-resutl",
  data() {
    return {
      info: {},
      params: {
        anti_code: "",
        lat: "",
        lng: ""
      }
    };
  },
  computed: {
    columns() {
      const info = this.info;
      let arr = [];
      if (info.anti_code) {
        arr.push({
          title: "防伪编码",
          value: info.anti_code
        });
      }
      if (info.box_code) {
        arr.push({
          title: "箱码",
          value: info.box_code
        });
      }
      if (info.address) {
        arr.push({
          title: "销售地址",
          value: info.address
        });
      }
      return arr;
    },
    batchItems() {
      const arr = this.info.batch_trace || [];
      arr.forEach(e => {
        e.timeText = formatDate(e.create_time, "YYYY-MM-DD hh:mm:ss");
      });
      return arr;
    }
  },
  onLoad(query) {
    this.params.anti_code = query.anti_code;
    this.getLocation({ showLoading: true }).then(res => {
      this.params.lat = res.lat;
      this.params.lng = res.lng;
      this.getData();
    });
  },
  methods: {
    ...mapActions(["getLocation"]),
    getData() {
      GET_SEARCHANTI(this.params).then(({ data }) => {
        this.info = data || {};
      });
    }
  },
  components: {
    timeLine,
    timeLineItem
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
.batch-list {
  background: #ffffff;
  padding: $cell-padding;
  .item {
    line-height: 40rpx;
    .head {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      .time {
        color: $text-light;
        font-size: $font-size-sm;
        white-space: nowrap;
        margin-left: 20rpx;
      }
    }
    .content {
      color: $text-gray;
      font-size: $font-size-sm;
      margin: 10rpx 0;
    }
  }
}
</style>
