<template>
  <view class="goods-group">
    <view class="goods-group-wrap" v-if="type == 'imgtext'">
      <view class="scroll-goods-list">
        <view
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="toDetail(item.goods_id)"
        >
          <view class="box">
            <lk-goods-card
              :custom-style="{
                backgroundColor: '#f8f8f8',
                padding: '10rpx',
                borderRadius: '20rpx'
              }"
              card-size="sm"
              :image="item.goods_img"
              :price="item.price"
              :origin-price="item.market_price"
              :title="item.goods_name"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="popup-goods-group" v-if="type == 'video'">
      <lk-popup
        v-model="show"
        title="推荐商品"
        round
        closeable
        position="bottom"
      >
        <view class="popup-goods">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="toDetail(item.goods_id)"
          >
            <lk-goods-card
              cell-padding
              card-size="sm"
              :image="item.goods_img"
              :price="item.price"
              :origin-price="item.market_price"
              :title="item.goods_name"
            />
          </view>
        </view>
      </lk-popup>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    list: Array,
    type: String
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    toDetail(goods_id) {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: goods_id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-group {
  width: 100%;
  .goods-group-wrap {
    background: #fff;
  }
  .scroll-goods-list {
    position: relative;
    overflow: auto hidden;
    display: flex;
    flex-direction: row;
    margin: 0 20rpx;
    border-radius: 10rpx;
    .item {
      display: inline-flex;
      margin-right: 20rpx;
    }
    .box {
      width: 560rpx;
      background: #ffffff;
      padding: 10rpx;
      border-radius: 10rpx;
    }
  }
}

.popup-goods {
  width: 100%;
  background: #fff;
  position: relative;
  overflow-y: auto;
  height: 70vh;
}
</style>
