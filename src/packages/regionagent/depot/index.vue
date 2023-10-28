<template>
  <view class="pages">
    <lk-cell
      icon-prefix="v-icon"
      icon="v-icon-menu"
      title="云仓库"
      is-link
      to="/packages/agent/depot/list"
    />
    <lk-cell
      icon-prefix="v-icon"
      icon="v-icon-write"
      title="云仓库日志"
      is-link
      to="/packages/agent/depot/log"
    />
  </view>
</template>

<script>
export default {
  name: "packages-agent-depot-index",
  data() {
    return {};
  },
  onLoad() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
