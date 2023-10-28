<template>
  <view class="table">
    <view class="tr" v-if="th.length">
      <view class="th" v-for="(h, hInd) in th" :key="hInd" :style="h.style">
        {{ h.value }}
      </view>
    </view>
    <view class="tr" v-for="(r, rInd) in tr" :key="rInd">
      <view class="td" v-for="(d, dInd) in r.td" :key="dInd" :style="d.style">
        {{ d.value }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    size: String,
    th: {
      type: Array,
      default: () => []
    },
    tr: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;

  border-left: 2rpx solid rgb(228, 231, 237);
  border-top: 2rpx solid rgb(228, 231, 237);
  background-color: rgb(255, 255, 255);
  display: block;
  color: $text-gray;
  font-size: $font-size-sm;
  text-align: center;
  line-height: 1.2;
}
.tr {
  display: flex;
  color: inherit;
}
.th {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  font-weight: 700;
  background-color: #f5f6f8;
  color: inherit;
  padding: 16rpx 8rpx;

  border-bottom: 2rpx solid rgb(228, 231, 237);
  border-right: 2rpx solid rgb(228, 231, 237);
}
.td {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  color: inherit;
  align-self: stretch;
  box-sizing: border-box;
  padding: 16rpx 8rpx;

  border-bottom: 2rpx solid rgb(228, 231, 237);
  border-right: 2rpx solid rgb(228, 231, 237);
}
</style>
