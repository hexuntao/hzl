<template>
  <view class="steps">
    <view :class="[direction === 'column' ? 'steps__column' : 'steps__row']">
      <view
        :class="[
          direction === 'column'
            ? 'steps__column-text-container'
            : 'steps__row-text-container'
        ]"
      >
        <view
          v-for="(item, index) in options"
          :key="index"
          :class="[
            direction === 'column' ? 'steps__column-text' : 'steps__row-text'
          ]"
        >
          <text
            :style="{ color: index <= active ? activeColor : deactiveColor }"
            :class="[
              direction === 'column'
                ? 'steps__column-title'
                : 'steps__row-title'
            ]"
            >{{ item.title }}</text
          >
          <text
            :style="{ color: index <= active ? activeColor : deactiveColor }"
            :class="[
              direction === 'column' ? 'steps__column-desc' : 'steps__row-desc'
            ]"
            >{{ item.desc }}</text
          >
        </view>
      </view>
      <view
        :class="[
          direction === 'column'
            ? 'steps__column-container'
            : 'steps__row-container'
        ]"
      >
        <view
          :class="[
            direction === 'column'
              ? 'steps__column-line-item'
              : 'steps__row-line-item'
          ]"
          v-for="(item, index) in options"
          :key="index"
        >
          <view
            :class="[
              direction === 'column' ? 'steps__column-line' : 'steps__row-line',
              direction === 'column'
                ? 'steps__column-line--before'
                : 'steps__row-line--before'
            ]"
            :style="{
              backgroundColor:
                index <= active && index !== 0
                  ? activeColor
                  : index === 0
                  ? 'transparent'
                  : deactiveColor
            }"
          ></view>
          <view
            :class="[
              direction === 'column'
                ? 'steps__column-check'
                : 'steps__row-check'
            ]"
            v-if="index === active"
          >
            <lk-icon :color="activeColor" name="success" size="28" />
          </view>
          <view
            :class="[
              direction === 'column'
                ? 'steps__column-circle'
                : 'steps__row-circle'
            ]"
            v-else
            :style="{
              backgroundColor: index < active ? activeColor : deactiveColor
            }"
          ></view>
          <view
            :class="[
              direction === 'column' ? 'steps__column-line' : 'steps__row-line',
              direction === 'column'
                ? 'steps__column-line--after'
                : 'steps__row-line--after'
            ]"
            :style="{
              backgroundColor:
                index < active && index !== options.length - 1
                  ? activeColor
                  : index === options.length - 1
                  ? 'transparent'
                  : deactiveColor
            }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "steps"
    };
  },
  props: {
    direction: {
      // 排列方向 row column
      type: String,
      default: "row"
    },
    activeColor: {
      // 激活状态颜色
      type: String,
      default: "#38f"
    },
    deactiveColor: {
      // 未激活状态颜色
      type: String,
      default: "#909399"
    },
    active: {
      // 当前步骤
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
.steps {
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
  flex-direction: column;
  font-size: $font-size;
}

.steps__row {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.steps__column {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row-reverse;
}

.steps__row-text-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.steps__column-text-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  flex: 1;
}

.steps__row-text {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  flex: 1;
  flex-direction: column;
}

.steps__column-text {
  padding: 12rpx 0;
  border-bottom-style: solid;
  border-bottom-width: 2rpx;
  border-bottom-color: #e5e5e5;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.steps__row-title {
  font-size: inherit;
  line-height: 32rpx;
  text-align: center;
}

.steps__column-title {
  font-size: inherit;
  text-align: left;
  line-height: 36rpx;
}

.steps__row-desc {
  font-size: $font-size-sm;
  line-height: 28rpx;
  text-align: center;
}

.steps__column-desc {
  font-size: $font-size-sm;
  text-align: left;
  line-height: 36rpx;
}

.steps__row-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.steps__column-container {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  width: 60rpx;
  flex-direction: column;
}

.steps__row-line-item {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  flex-direction: row;
  flex: 1;
  height: 28rpx;
  line-height: 28rpx;
  align-items: center;
  justify-content: center;
}

.steps__column-line-item {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.steps__row-line {
  flex: 1;
  height: 2rpx;
  background-color: $gray-dark;
}

.steps__column-line {
  width: 2rpx;
  background-color: $gray-dark;
}

.steps__row-line--after {
  transform: translateX(2rpx);
}

.steps__column-line--after {
  flex: 1;
  transform: translate(0, 2rpx);
}

.steps__row-line--before {
  transform: translateX(-2rpx);
}

.steps__column-line--before {
  height: 12rpx;
  transform: translate(0, -2rpx);
}

.steps__row-circle {
  width: 10rpx;
  height: 10rpx;
  border-radius: 200rpx;
  background-color: $gray-dark;
  margin: 0 6rpx;
}

.steps__column-circle {
  width: 10rpx;
  height: 10rpx;
  border-radius: 200rpx;
  background-color: $gray-dark;
  margin: 8rpx 0 10rpx 0;
}

.steps__row-check {
  margin: 0 12rpx;
}

.steps__column-check {
  height: 28rpx;
  line-height: 28rpx;
  margin: 4rpx 0;
}
</style>
