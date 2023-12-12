<template>
  <view class="cell-group">
    <view class="divider">
      <text>商品详情</text>
    </view>
    <view class="descript richtext">
      <lk-parser v-if="desc" show-with-animation lazy-load :html="desc" />
      <view v-else class="empty">暂无详情</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    desc: String
  },
  computed: {},
  components: {}
};
</script>

<style scoped lang="scss">
.cell-group {
  margin: 20rpx 0;
  padding: 20rpx 0;
  background: #fff;
}
</style>
