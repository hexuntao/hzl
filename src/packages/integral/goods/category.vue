<template>
  <view class="pages">
    <lk-search disabled placeholder="请输入关键词" @click="search" />
    <view class="item-main">
      <view class="item-child" v-for="(item, index) in items" :key="index">
        <view
          class="box"
          @click="
            toList(item.category_id, item.short_name || item.category_name)
          "
        >
          <view class="image-box">
            <image class="image" :src="item.category_pic" />
          </view>
          <view class="name">
            {{ item.short_name || item.category_name }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_CATEGORYLIST } from "@/common/interface/integral";
export default {
  name: "packages-integral-goods-category",
  data() {
    return {
      items: []
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_CATEGORYLIST()
        .then(({ data }) => {
          this.items = data;
        })
        .catch(() => {});
    },
    search() {
      this.$Navigate.push({
        path: "/packages/mall/search",
        query: {
          type: "integralgoods"
        }
      });
    },
    toList(id, name) {
      this.$Navigate.push({
        path: "/packages/integral/goods/list",
        query: {
          category_id: id,
          text: name
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.item-main {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  .item-child {
    width: 25%;
    text-align: center;
    .box {
      margin: 8rpx;
    }
    .image-box {
      height: 0;
      width: 100%;
      padding: 50% 0;
      overflow: hidden;
      background: $image-background;
      position: relative;
      .image {
        display: flex;
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
    .name {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 12rpx 8rpx 16rpx;
    }
  }
}
</style>
