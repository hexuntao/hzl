<template>
  <view class="box">
    <lk-icon :name="active.icon" :color="active.color" square size="26" />
    <text class="text" :style="'color:' + active.color">{{ active.text }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        {
          state: 1,
          icon: "clock-o",
          color: "#1989fa",
          text: "进行中"
        },
        {
          state: 2,
          icon: "passed",
          color: "#06bf04",
          text: "已完成"
        },
        {
          state: 3,
          icon: "close",
          color: "#909399",
          text: "已失效"
        }
      ]
    };
  },
  props: {
    state: [Number, String]
  },
  computed: {
    active() {
      return this.arr.filter(({ state }) => state == this.state)[0];
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}
</style>
