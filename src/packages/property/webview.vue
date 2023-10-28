<template>
  <view>
    <web-view :src="linkurl"></web-view>
  </view>
</template>

<script>
export default {
  name: "packages-help-detail",
  data() {
    return {
      linkurl: "",
    };
  },
  onLoad(query) {
    this.linkurl = query.linkurl;
  },
  methods: {

  },
  components: {}
};
</script>

<style lang="scss" scoped>
.content {
  padding: $cell-padding;
  max-width: 100%;
  overflow: hidden;
  background-color: #ffffff;
}
</style>
