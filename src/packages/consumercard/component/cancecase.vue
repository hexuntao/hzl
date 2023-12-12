<template>
<!-- 核销情况 -->
  <lk-cell-group>
    <lk-cell title="核销情况" />
    <lk-cell>
      <view class="count">
        <view>
          <view>核销数</view>
        </view>
        <view>
          <view v-if="detail.type == 1">
            <view v-if="detail.state != 2 && detail.surplus_num == 0">最后一天</view>
            <view v-else>
              剩余
              <text class="text text-maintone">{{detail.surplus_num}}</text>
              <text>{{numText}}</text>
            </view>
          </view>
          <view v-else>
            剩余
            <text class="text text-maintone">{{detail.surplus_num}}</text>
            <text>{{numText}}</text>，总数
            <text class="text text-maintone">{{detail.count_num}}</text>
            <text>{{numText}}</text>
          </view>
        </view>
      </view>
      <view class="time">
        <view>
          <view>有效期</view>
        </view>
        <view>
          <view>
            <text class="invalid_time">{{detail.invalid_time}}</text>前有效
          </view>
        </view>
      </view>
    </lk-cell>
  </lk-cell-group>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    detail: Object
  },
  computed: {
    numText() {
      return this.detail.type == 1 ? "天" : "次";
    }
  }
};
</script>

<style scoped>
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
</style>


