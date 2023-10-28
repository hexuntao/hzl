<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="time">{{ item.time }}</view>
        <view class="info card-group-box">
          <view class="title">{{ item.title }}</view>
          <view class="content">{{ item.content }}</view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_MESSAGENOTICELIST } from "@/common/interface/message";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
export default {
  name: "packages-message-notice",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "暂无消息通知"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MESSAGENOTICELIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            e.time = formatDate(e.create_time, "YYYY-MM-DD hh:mm:ss");
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.item {
  margin: 20rpx;
  padding: 20rpx 0;
  .time {
    font-size: $font-size-sm;
    color: $text-light;
    text-align: center;
  }
  .info {
    line-height: 49rpx;
    background-color: #ffffff;
    padding: $cell-padding;
    .title {
      color: $text-color;
    }
    .content {
      color: $text-gray;
      line-height: 40rpx;
      margin-top: 12rpx;
      font-size: $font-size-sm;
    }
  }
}
</style>
