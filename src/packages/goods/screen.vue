<template>
  <view class="pages">
    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <lk-goods-box
          :title="item.goods_name"
          :price="item.price"
          :origin-price="item.market_price"
          :image="item.logo"
          :goods-id="item.goods_id"
          :sales="item.sales"
        >
        </lk-goods-box>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_GOODSCUSTOMLIST } from "@/common/interface/goods";
export default {
  name: "packages-goods-screen",
  data() {
    return {
      list: [],
      params: {}
    };
  },
  onLoad(query) {
    const { goods_ids } = query;
    this.params.goods_ids = goods_ids;
    this.getList();
  },
  methods: {
    getList() {
      GET_GOODSCUSTOMLIST(this.params).then(({ data }) => {
        this.list = data || [];
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  .item {
    width: calc(50% - 20rpx);
    margin: 10rpx;
    border-radius: 20rpx;
    overflow: hidden;
    font-size: $font-size-lg;
    .sales {
      font-size: $font-size-sm;
      color: $text-gray;
      display: flex;
      flex-flow: row;
    }
  }
}
</style>
