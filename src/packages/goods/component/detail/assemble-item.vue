<template>
  <lk-cell center>
    <image class="image" :src="item.user_headimg" slot="icon"/>
    <view class="info">
      <view class="name">{{ item.user_name }}</view>
      <view class="value">
        <view>
          <text>还差</text>
          <text class="num">{{ item.group_num - item.now_num }}人</text>拼成
        </view>
        <view class="time-box">
          <text>剩</text>
          <lk-count-down :time="item.finish_time * 1000" @finish="finish" />
        </view>
      </view>
    </view>
    <lk-button slot="rightIcon" theme-color round size="mini" @click="click">
      去拼单
    </lk-button>
  </lk-cell>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    finish() {
      this.$emit("callback", this.item.record_id);
    },
    click() {
      this.$emit("show-detail", this.item.record_id);
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.image {
  width: 80rpx;
  height: 80rpx;
  display: block;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 20rpx;
}

.name {
  width: 50%;
  line-height: 1.2;
  max-height: 64rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
  color: $text-gray;
}

.info {
  text-align: right;
  line-height: 1.2;
  padding-right: 20rpx;
  font-size: $font-size-sm;
  color: $text-light;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .num {
    color: $red;
    padding: 0 8rpx;
  }
  .time-box {
    white-space: nowrap;
  }
}
</style>
