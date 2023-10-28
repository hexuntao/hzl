<template>
  <view class="goods-group">
    <view v-if="!isPopup" class="scroll-goods-list">
      <view class="item" v-for="(item, index) in recommendList" :key="index">
        <view class="box" @click="clickGoods(item)">
          <lk-goods-card
            card-size="xs"
            :title="item.goods_name"
            :image="item.pic_cover"
            :price="item.price"
            :origin-price="item.market_price"
          />
        </view>
      </view>
    </view>

    <block v-else>
      <lk-popup
        v-model="show"
        position="bottom"
        round
        closeable
        :mask-opacity="0"
        title="直播商品"
      >
        <view class="goods-list">
          <view
            v-for="(item, index) in list"
            :key="index"
            @click="clickGoods(item)"
          >
            <lk-goods-card
              cell-padding
              card-size="sm"
              :title="item.goods_name"
              :image="item.pic_cover"
              :price="item.price"
              :origin-price="item.market_price"
            />
          </view>
        </view>
      </lk-popup>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: Boolean,
    list: Array,
    isPopup: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    recommendList() {
      return this.list.filter(e => e.is_recommend);
    }
  },
  methods: {
    clickGoods(item) {
      this.$emit("click-goods", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-list {
  height: 640rpx;
  overflow: hidden auto;
  background: #ffffff;
}
.scroll-goods-list {
  position: relative;
  overflow: auto hidden;
  display: flex;
  flex-direction: row;
  border-radius: 10rpx;
  margin: 0 20rpx;
  .item {
    display: inline-flex;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
  }
  .box {
    width: 280rpx;
    background: #ffffff;
    padding: 10rpx;
    border-radius: 10rpx;
  }
}
.scroll-view {
  height: 100%;
  position: relative;
  padding-left: 20rpx;
}
</style>
