<template>
  <view class="pages">
    <lk-parser
      show-with-animation
      lazy-load
      :html="contractContent"
    ></lk-parser>
  </view>
</template>

<script>
import { GET_GETCOMMISSIONRULE } from "@/common/interface/cps";

export default {
  name: "packages-cps-rule",
  data() {
    return {
      contractContent: ""
    };
  },
  onLoad() {},
  onShow() {
    GET_GETCOMMISSIONRULE().then(({ data }) => {
      this.contractContent = data;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
