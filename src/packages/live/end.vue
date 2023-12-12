<template>
  <view class="pages">
    <anchor-top-bar :show-info="false" />
    <view class="warp">
      <view class="title-time">
        <view class="title">直播已结束</view>
        <view class="time">直播时长：{{ info.live_time }}</view>
      </view>
      <view class="statistic-card card-group-box">
        <view class="item">
          <view class="text">{{ info.watch_num }}</view>
          <view class="title">观看次数</view>
        </view>
        <view class="item">
          <view class="text">{{ info.likes_num }}</view>
          <view class="title">点赞次数</view>
        </view>
        <view class="item">
          <view class="text">{{ info.share_num }}</view>
          <view class="title">分享次数</view>
        </view>
      </view>
      <view class="goods-list-card card-group-box" v-if="list.length">
        <view class="title">直播商品</view>
        <view class="goods-list">
          <view class="item" v-for="(item, index) in list" :key="index">
            <lk-goods-card
              card-size="sm"
              cell-padding
              :image="item.goods_img"
              :title="item.goods_name"
              :price="item.price"
              :to="item.to"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_LIVEANCHORENDSTATISTIC } from "./interface";
import anchorTopBar from "./component/anchor-top-bar";
export default {
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 10,
        live_id: 0
      },

      info: {
        comment_member_num: 0,
        fans_num: 0,
        gift_member_num: 0,
        likes_num: 0,
        live_time: "00:00:00",
        point_total_num: 0,
        share_num: 0,
        watch_member_num: 0,
        watch_num: 0
      },

      list: []
    };
  },
  onLoad(query) {
    this.anchor_id = query.anchor_id || 0;
    this.params.live_id = query.live_id || 0;
    this.getData();
  },
  methods: {
    getData() {
      GET_LIVEANCHORENDSTATISTIC(this.params).then(({ data }) => {
        this.info = data.end_data_list || {};
        this.list = data.live_goods_records_list.data || [];
      });
    }
  },
  components: {
    anchorTopBar
  }
};
</script>

<style lang="scss" scoped>
.pages {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #15112c;
}
.warp {
  position: relative;
  padding-top: 200rpx;
}
.title-time {
  padding: $cell-padding;
  color: #ffffff;
  line-height: 48rpx;
  .title {
    font-size: 40rpx;
  }
  .time {
    font-size: $font-size-sm;
  }
}
.statistic-card {
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  margin: 60rpx 20rpx;
  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-basis: 33.33334%;
    color: #ffffff;
    padding: 20rpx;
    line-height: 40rpx;
    .text {
      font-size: $font-size-lg;
    }
    .title {
      font-size: $font-size-sm;
      color: #79828e;
    }
  }
}
.goods-list-card {
  background: rgba(255, 255, 255, 0.05);
  margin: 60rpx 20rpx;
  .title {
    text-align: center;
    line-height: 48rpx;
    color: #ffffff;
    padding: $cell-padding;
  }
  .goods-list {
    height: 380rpx;
    overflow-y: auto;
    .item {
      margin: 20rpx;
      border-radius: 20rpx;
      overflow: hidden;
    }
  }
}
</style>
