<template>
  <view class="cell-group" :class="hairlineClass">
    <slot />
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "cell-group"
    };
  },
  props: {
    border: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hairlineClass() {
      if (this.border) return "hairline-top-bottom";
    }
  }
};
</script>

<style scoped lang="scss">
.cell-group {
  background-color: $white;
}
</style>
