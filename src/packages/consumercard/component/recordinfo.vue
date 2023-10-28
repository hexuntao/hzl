<template>
  <lk-cell-group>
    <lk-cell title="核销纪录" />
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view v-for="(item,index) in list" :key="index">
        <lk-cell>
          <view class="record">
            <view class="shop">
              <view class="storename">{{item.store_name}}</view>
              <view class="num">{{item.num}}</view>
            </view>
						<view class="shop">
						  <view class="storename">技师</view>
						  <view class="num">{{item.tec_name}}</view>
						</view>
						<view class="shop">
						  <view class="storename">预约时间</view>
						  <view class="num">{{item.reserve_time}}</view>
						</view>
						<view class="shop">
						  <view class="storename">核销时间</view>
						  <view class="num" >{{item.create_time}}</view>
						</view>
            <!-- <view class="storename">{{item.create_time|formatDate}}</view> -->
          </view>
        </lk-cell>
      </view>
    </lk-load-list>
  </lk-cell-group>
</template>

<script>
import { GET_CONSUMERCARDLOG } from "@/common/interface/consumercard";
import { formatDate } from "@/common/utils";
import loadMixin from "@/mixins/load-list";
export default {
  props: {
    card_id: "",
  },
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 10,
        card_id: this.card_id,
      },
      record: [],
    };
  },

  computed: {},
  mixins: [loadMixin],
  mounted() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_CONSUMERCARDLOG(this.params).then((res) => {
        let list = res.data.data;
        this.concatList(list, res.data.total_count);
      });
    },
  },
  filters: {
    formatDate(v) {
      return formatDate(v, "YYYY-MM-DD hh:mm");
    },
  },
};
</script>

<style scoped>
.mescroll-body {
  min-height: 100% !important;
}
.text {
  padding: 0 8rpx;
}
.count {
  display: flex;
  justify-content: space-between;
}
.time {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}
.shop {
  display: flex;
  justify-content: space-between;
}
.num {
  color: #ff0000;
}
.storename {
  color: #999999;
  margin-top: 5rpx;
}
</style>


