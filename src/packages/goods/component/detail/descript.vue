<template>
  <view class="descript richtext">
    <lk-parser
      v-if="content"
      show-with-animation
      lazy-load
      :html="content"
    ></lk-parser>
    <view v-else class="empty">暂无详情</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    info: Object
  },
  computed: {
    content() {
      return this.info.content || "";
    }
  }
};
</script>

<style scoped lang="scss">
.descript {
}
</style>
