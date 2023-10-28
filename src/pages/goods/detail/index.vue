<template>
  <view></view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(query) {
    console.log(this.routeQuery, query);
    const { scene } = query;
    let to = {
      path: "/packages/goods/detail",
      query: {}
    };
    if (scene) {
      let arr = scene.split("_");
      console.log(arr);
      const extend_code = arr[0] == -1 ? "" : arr[0];
      const goods_id = arr[1] || "";
      const poster_id = arr[2] || "";
      const poster_type = arr[3] || "";
      if (extend_code) {
        to.query.extend_code = extend_code;
      }
      if (goods_id) {
        to.query.goods_id = goods_id;
      }
      if (poster_id && poster_type) {
        to.query.poster_id = poster_id;
        to.query.poster_type = poster_type;
      }
    }
    console.log(to);
    this.$Navigate.replaceAll(to);
  },
  methods: {},
  components: {}
};
</script>

<style lang="scss" scoped></style>
