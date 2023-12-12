<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="4"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>

    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="info">
          <view class="image">
            <image :src="item.pic_cover_mid" />
          </view>
          <view class="text">
            <view class="name">{{ item.giftvoucher_name }}</view>
            <view class="time">{{ item.timeText }}</view>
			<view class="time">所属人ID：{{ item.show_top_uid }}</view>
			<view class="time" style="height:10rpx"></view>
			<view class="time" v-if="item.send_send_uid>0">赠送给会员ID：{{ item.send_send_uid }}  </view>
			<view class="time" v-if="item.send_send_uid>0">赠送编号：{{ item.send_coupon_pid_code }}</view>
			<view class="time"  style="height:10rpx"> </view>
			<view class="time" v-if="item.send_uid>0">由会员ID赠送：{{ item.send_uid }}</view>
            <view class="time" v-if="item.send_uid>0">赠送编号：{{ item.coupon_pid_code }}</view>
            
          </view>
		  <view class="text-link" @click="toDetail(item.record_id)">
		    详情>
		  </view>
          <view class="icon-bg" v-if="item.state != 1">
            <lk-icon
              class-prefix="v-icon"
              color="#999"
              size="50"
              :name="item.state == 2 ? 'v-icon-coupon-use' : 'v-icon-overdue'"
            />
          </view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_GIFTVOUCHERLIST } from "@/common/interface/giftvoucher";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
export default {
  name: "packages-giftvoucher-list",
  data() {
    return {
      tabs: [
        {
          name: "未使用",
          state: 1
        },
        {
          name: "已使用",
          state: 2
        },
        {
          name: "已过期",
          state: 3
        },
        {
          name: "已赠送",
          state: 4
        }
      ],
      params: {
		gift_voucher_id:0,
        page_index: 1,
        page_size: 20,
        state: 1
      },
      upOption: {
        empty: {
          tip: "没有相关礼品券"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
	  this.params.gift_voucher_id = query.gift_voucher_id;
  },
  computed: {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GIFTVOUCHERLIST(this.params).then(({ data }) => {
        let list = data.data || [];
        list.forEach(e => {
          e.timeText = `${formatDate(e.start_time)}~${formatDate(e.end_time)}`;
        });
        this.concatList(list, data.total_count);
      });
    },
    toDetail(record_id) {
      this.$Navigate.push({
        path: "/packages/giftvoucher/detail",
        query: {
          record_id
        }
      });
    },
    onTab(index) {
      this.params.state = this.tabs[index].state;
      this.resetList();
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 8rpx;
  margin: 30rpx;
  padding: 40rpx 30rpx;
  position: relative;
  overflow: hidden;
}

.item::after,
.item::before {
  content: "";
  display: block;
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #f8f8f8;
  border-radius: 50%;
  top: 50%;
  margin-top: -16rpx;
}

.item::after {
  right: -16rpx;
}

.item::before {
  left: -16rpx;
}

.item .info {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: auto;
}

.item .info .image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: $image-background;
  margin-right: 10rpx;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.item .info .text {
  flex: 1;
}

.item .info .text .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.item .info .text .time {
  font-size: 24rpx;
  color: #909399;
}
.icon-bg {
  position: absolute;
  z-index: 1;
  right: 20rpx;
}
</style>
