<template>
  <view class="cell-image-panel">
    <view class="item" v-for="(item, index) in list" :key="index">
      <text
        v-if="showDelete"
        class="icons icons-cross btn-del"
        @click="del(index)"
      />
      <view class="box">
        <image
          :src="item.src || item"
          class="image"
          mode="aspectFit"
          @click="preview(index)"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "cell-image-panel"
    };
  },
  props: {
    list: Array,
    // 是否显示删除
    showDelete: {
      type: Boolean,
      default: false
    },
    // 是否预览图片
    isPreview: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    del(i) {
      this.$Prompt
        .modal(`确定删除该图片？`)
        .then(() => {
          this.list.splice(i, 1);
          this.$emit("delete", this.list);
        })
        .catch(() => {});
    },
    preview(i) {
      if (this.isPreview) {
        const urls = this.list.map(e => e.src || e);
        uni.previewImage({
          current: i,
          urls: urls
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.cell-image-panel {
  margin: 0 -8rpx;
  overflow: hidden;
  display: flex;
  flex-flow: wrap;
  .item {
    position: relative;
    width: calc(20% - 16rpx);
    margin: 8rpx;
  }
  .btn-del {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
    right: -8rpx;
    color: #ffffff;
    top: -8rpx;
    width: 36rpx;
    height: 36rpx;
    font-size: $font-size-sm;
  }
  .box {
    height: 0;
    width: 100%;
    padding: 50% 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .image {
      display: flex;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
