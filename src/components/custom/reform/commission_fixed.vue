<template>
  <view :class="items.id + ' ' + items.key"> </view>
</template>

<script>
import mixin from '../../mixin/reform';
export default {
  data() {
    return {};
  },
  mixins: [mixin],
  computed: {},
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
