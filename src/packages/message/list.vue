<template>
  <view class="pages">
    <text>{{ route }}</text>
  </view>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      route: ""
    };
  },
  onLoad() {
    this.route = getCurrentPages()[getCurrentPages().length - 1].route;
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
