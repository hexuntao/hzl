<template>
  <view class="items">
    <view class="item" v-for="(item, index) in items" :key="index">
      <image class="image" :src="item.avatar" v-if="item.avatar" />
      <text class="help" v-else>?</text>
      <lk-tag
        class="tag"
        round
        type="danger"
        :color="theme.color"
        v-if="item.tag"
      >
        {{ item.tag }}
      </lk-tag>
    </view>
  </view>
</template>

<script>
const maxNum = 5;
/**
 * list 数组格式
 * {
 *  avatar：头像
 *  tag：标签
 * }
 */
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    num: [String, Number]
  },
  computed: {
    items() {
      const num = this.num > maxNum ? maxNum : this.num;
      let list = this.list.filter((e, i) => i < maxNum);
      let diff = num - list.length;
      diff = diff < 0 ? 0 : diff;
      let arr = new Array(diff).fill({ fill: true });
      arr.forEach(e => {
        list.push(e);
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>
.items {
  display: flex;
  justify-content: space-around;
}

.items .item {
  position: relative;
  width: 100rpx;
  height: 100rpx;
}

.items .item image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  background: $image-background;
}

.items .item .tag {
  position: absolute;
  right: 0;
  top: 0;
}

.items .help {
  display: block;
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 60rpx;
  color: #999;
  border-radius: 50%;
  border: 1px dashed #999;
  text-align: center;
}
</style>
