<template>
  <view class="bind-mobile-group">
    <lk-bind-mobile @close="close" />
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    close() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.bind-mobile-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // background-color: rgba(0, 0, 0, 0.7);
}
</style>
