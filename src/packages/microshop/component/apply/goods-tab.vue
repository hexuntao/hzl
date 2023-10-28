<template>
  <view class="cell-goods">
    <view class="goods-list">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="click(index)"
      >
        <lk-goods-box :image="item.pic">
          <view class="goods-title" slot="info">{{ item.goods_name }}</view>
        </lk-goods-box>
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
    list: Array
  },
  methods: {
    click(index) {
      this.$emit("item-click", index);
    }
  }
};
</script>

<style scoped lang="scss">
.cell-goods {
  margin: 20rpx 0;
  background: #fff;
  padding: 20rpx;
}

.goods-list {
  margin: 0 -8rpx;
  overflow: hidden;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  .item {
    position: relative;
    width: calc(33% - 16rpx);
    margin: 8rpx;
    font-size: $font-size-sm;
    flex: none;
    .price {
      color: $red;
    }
    .goods-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 10rpx;
    }
  }
}
</style>
