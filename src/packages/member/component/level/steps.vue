<template>
  <scroll-view class="vs-steps" scroll-x :scroll-left="scrollLeft">
    <view class="vs-steps-items" id="step">
      <view
        class="vs-item"
        v-for="(item, index) in items"
        :key="index"
        :style="styles"
      >
        <view class="vs-step-container">
          <view
            class="vs-step-circle"
            :class="index <= is_current ? 'on' : ''"
          ></view>
        </view>
        <view
          class="vs-step-line"
          :class="index <= is_current ? 'on' : ''"
        ></view>
        <view class="vs-title">
          <view class="p">{{ item.level_name }}</view>
          <view class="p">{{ item.growth_num }}</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { formatStyle } from "@/common/utils/stringify";
export default {
  data() {
    return {
      scrollLeft: 0
    };
  },
  props: {
    items: [Array]
  },
  computed: {
    styles() {
      if (this.items.length > 4) {
        return formatStyle({ flexShrink: "0", width: "80px" });
      } else {
        return formatStyle({ flex: "auto" });
      }
    },
    is_current() {
      let index = 0;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].is_current_member_level == 1) {
          index = i;
          break;
        }
      }
      return index;
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select("#step")
      .boundingClientRect(data => {
        const scrollWidth = 80 * this.items.length;
        this.scrollLeft = scrollWidth - data.width;
      })
      .exec();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.vs-steps {
  overflow-y: hidden;
  overflow-x: auto;
}
.vs-steps-items {
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 20rpx;
  position: relative;
}
.vs-item {
  font-size: 28rpx;
  position: relative;
  color: #ffffff;
  display: inline-flex;
  overflow: hidden;
}
.vs-step-container {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 0 16rpx;
  z-index: 1;
}
.vs-step-circle {
  display: block;
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background-color: #ebedf0;
}
.vs-step-circle.on {
  background-color: #ffe678;
  box-shadow: 0px 0px 20rpx 4rpx rgba(255, 230, 120, 1);
}
.vs-step-line {
  position: absolute;
  left: 0;
  top: 20rpx;
  width: 100%;
  height: 2rpx;
  background-color: rgba(235, 237, 240, 0.5);
}
.vs-step-line.on {
  background-color: #ffe678;
}
.vs-title {
  font-size: $font-size-sm;
  padding-top: 40rpx;
  display: block;
  color: #ffffff;
  line-height: 32rpx;
  padding-left: 20rpx;
}
.vs-title .p {
  white-space: nowrap;
}
</style>
