<template>
  <view class="pages">
    <view class="content">
      <lk-parser show-with-animation lazy-load :html="content"></lk-parser>
    </view>
  </view>
</template>

<script>
import { GET_REGISTERPROTOCOL } from "@/common/interface/config";
export default {
  name: "packages-mall-contract",
  data() {
    return {
      content: ""
    };
  },
  onLoad(query) {
    let type = query.type || "";
    GET_REGISTERPROTOCOL({ type: type }).then(({ data }) => {
      this.content = data.register_protocol;
    });
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 30rpx;
}
</style>
