<template>
  <scroll-view
    scroll-y
    scroll-with-animation
    class="msg-list"
    :scroll-top="scrollTop"
  >
    <view class="item" v-for="(item, index) in filterList" :key="index">
      <view class="content">
        <text class="name" v-if="item.name"> {{ item.name }}： </text>
        {{ item.content }}
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 9999
    };
  },
  watch: {
    list(e) {
      this.wordBottom();
    }
  },
  props: {
    list: Array
  },
  computed: {
    filterList() {
      const items = [];
      this.list.forEach((e, i) => {
        if (i > 49) {
          items.splice(0, 1);
        }
        items.push(e);
      });
      return items;
    }
  },
  methods: {
    wordBottom() {
      this.$nextTick(() => {
        this.scrollTop = this.list.length * 100 + this.scrollTop;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.msg-list {
  padding: 0 30rpx;
  height: 42vw;
  position: relative;
  overflow: hidden;
  mask: gradient(linear, left 30%, left top, from(#000), to(transparent));
  -webkit-mask: -webkit-gradient(
    linear,
    left 30%,
    left top,
    from(#000),
    to(transparent)
  );
  .item {
    .content {
      margin: 10rpx 0;
      display: inline-block;
      vertical-align: top;
      max-width: 80%;
      padding: 8rpx 16rpx;
      border-radius: 28rpx;
      background: rgba(0, 0, 0, 0.5);
      font-size: $font-size-sm;
      color: #ffffff;
      line-height: 40rpx;
      animation: fade;
      animation-duration: 2s;
    }
    .name {
      display: inline-block;
      vertical-align: top;
      max-width: 140rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #a1e4fc;
    }
    @keyframes fade {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
}
</style>
