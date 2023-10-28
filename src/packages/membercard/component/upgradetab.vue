<template>
  <view class="goods">
    <view class="goods-list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="img" @click="handtab(index)">
          <image :src="item.membercard_logo" />
          <view
            class="goods-title"
            :class="index == ind ? 'choosetitle' : 'nochoosetitle'"
            >{{ item.membercard_name }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ind: 0,
    };
  },
  props: {
    list: Array,
  },
  methods: {
    handtab(index) {
      this.ind = index;
      this.$emit("handtab", index);
    },
  },
};
</script>

<style scoped lang="scss">
.goods {
  background: linear-gradient(to right, #f9e174, #ffc342);
  padding: 10rpx;
}
.goods-list {
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  .item {
    position: relative;
    width: calc(33% - 70rpx);
    margin: 4rpx;
    font-size: $font-size-sm;
    flex: none;

    .goods-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4rpx;
      font-weight: 800;
    }
  }
}
.choosetitle {
  color: #1e1e1e;
}
.nochoosetitle {
  color: #fff;
}

.img {
  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
}
</style>
