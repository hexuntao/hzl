<template>
  <view class="attribute">
    <view v-if="list.length">
      <lk-cell v-for="(item, index) in list" :key="index">
        <view class="cell">
          <view class="title">{{ item.attr_value }}</view>
          <view class="value">{{ item.attr_value_name }}</view>
        </view>
      </lk-cell>
    </view>
    <view class="empty" v-else>暂无属性</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    info: Object
  },
  computed: {
    list() {
      return this.info.list || [];
    }
  }
};
</script>

<style scoped lang="scss">
.attribute {
  .cell {
    display: flex;
    flex-flow: row;
    .title {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}
</style>
