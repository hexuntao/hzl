<template>
  <view class="pages">
    <lk-cell
      icon-prefix="v-icon"
      icon="v-icon-menu"
      title="云仓库"
      is-link
      to="/packages/channel/depot/list"
    />
    <lk-cell
      icon-prefix="v-icon"
      icon="v-icon-write"
      title="云仓库日志"
      is-link
      to="/packages/channel/depot/log"
    />
  </view>
</template>

<script>
export default {
  name: "packages-channel-depot-index",
  data() {
    return {};
  },
  onLoad() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
