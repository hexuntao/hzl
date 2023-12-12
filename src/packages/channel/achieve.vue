<template>
  <view class="pages">
    <view class="header">
      <view class="icon">
        <lk-icon
          name="arrow-left"
          size="40"
          color="inherit"
          @click="onChangeMonth('pre')"
        />
      </view>
      <view class="content">
        <view>本月业绩({{ params.date_time }})</view>
        <view class="num">{{ info.sale_money || 0 }}</view>
      </view>
      <view class="icon">
        <lk-icon
          name="arrow"
          size="40"
          color="inherit"
          @click="onChangeMonth('next')"
        />
      </view>
    </view>
    <view class="card-panel card-group-box">
      <view class="item">
        <text class="num">{{ info.my_purchase_money || 0 }}</text>
        <text class="text">买入</text>
      </view>
      <view class="item">
        <text class="num">{{ info.my_profit || 0 }}</text>
        <text class="text">利润</text>
      </view>
      <view class="item">
        <text class="num">{{ info.my_bonus || 0 }}</text>
        <text class="text">奖金</text>
      </view>
    </view>
    <view class="cell-group">
      <lk-cell title="团队业绩" />
      <lk-load-list
        ref="load"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-cell :title="item.name">
            <view slot="label" class="label">
              <view>上级：{{ item.up_channel_name }}</view>
              <view>推荐人：{{ item.referee_name }}</view>
              <view>等级：{{ item.grade_name }}</view>
            </view>
            <view slot="rightIcon" class="item-right lk-hairline--left">
              <view class="first-letter">{{ item.sale_money | yuan }}</view>
              <view>本月业绩</view>
            </view>
          </lk-cell>
          <lk-cell>
            <view class="foot-item">
              买入：
              <text>{{ item.my_purchase_money }}</text> 利润：
              <text>{{ item.my_profit }}</text> 奖金：
              <text>{{ item.my_bonus }}</text>
            </view>
          </lk-cell>
        </view>
      </lk-load-list>
    </view>
  </view>
</template>

<script>
import { GET_ACHIEVELIST } from "@/common/interface/channel";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-channel-achieve",
  data() {
    const getFullYear = new Date().getFullYear();
    const getMonth = new Date().getMonth() + 1;
    return {
      info: {},
      currFullYear: getFullYear,
      currMonth: getMonth,
      params: {
        page_index: 1,
        page_size: 10,
        date_time: getFullYear + "-" + getMonth
      }
    };
  },
  onLoad() {},
  computed: {},
  mixins: [loadMixin],
  methods: {
    onChangeMonth(action) {
      if (action == "pre") {
        this.currMonth = this.currMonth == 1 ? 12 : this.currMonth - 1;
        this.currFullYear =
          this.currMonth == 12 ? this.currFullYear - 1 : this.currFullYear;
      } else if (action == "next") {
        this.currFullYear =
          this.currMonth == 12 ? this.currFullYear + 1 : this.currFullYear;
        this.currMonth = this.currMonth == 12 ? 1 : this.currMonth + 1;
      }
      this.params.date_time =
        this.currFullYear +
        "-" +
        (this.currMonth < 10 ? "0" + this.currMonth : this.currMonth);
      // console.log(this.params.date_time);
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ACHIEVELIST(this.params)
        .then(({ data }) => {
          let list = data.data.down_channel || [];
          this.info = data.data.my_performance;
          list.forEach(e => {});
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: $cell-padding;
  background: #fff;
  display: flex;
  align-items: center;
  height: 220rpx;
  .icon {
    flex: none;
    color: $text-light;
  }
  .content {
    flex: 1;
    text-align: center;
  }
  .num {
    font-size: 60rpx;
    margin-top: 10rpx;
    color: $red;
  }
}
.cell-group {
  margin: 20rpx 0;
}

.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
  }
  .text {
    font-size: $font-size;
  }
  .num {
    color: $red;
  }
}
.item {
  font-size: $font-size-sm;
  .label {
    line-height: 32rpx;
    color: $text-gray;
    font-size: $font-size-sm;
  }
  .item-right {
    line-height: 40rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    padding-left: 30rpx;
  }
  .foot-item {
    text {
      padding-right: 20rpx;
      color: $text-gray;
      font-size: $font-size-sm;
    }
  }
}
</style>
