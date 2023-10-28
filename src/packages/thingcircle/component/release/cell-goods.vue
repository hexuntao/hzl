<template>
  <lk-cell is-link @click="toLink">
    <view class="icon" slot="icon">
      <lk-icon class-prefix="v-icon" name="v-icon-zan03" size="20" :color="stateStyle.color" />
    </view>
    <view class="title" slot="title" :style="{ color: stateStyle.color }">
      <view class="text">{{ stateStyle.title }}</view>
      <view class="title-right" v-if="!value">推荐购买过的商品</view>
    </view>
  </lk-cell>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: String
  },
  computed: {
    idsLengt() {
      return this.value ? this.value.split(",").length : 0;
    },
    stateStyle() {
      let obj = {
        color: this.value ? "#f44" : "#909399",
        title: this.value ? `已选中${this.idsLengt}件商品` : "推荐商品"
      };
      return obj;
    }
  },
  mounted() {
    uni.$on("get-release-goodsid", ({ ids }) => {
      this.$emit("input", ids);
    });
  },
  destroyed() {
    uni.$off("get-release-goodsid");
  },
  methods: {
    toLink() {
      let query = {};
      if (this.value) {
        query.ids = this.value;
      }
      this.$Navigate.push({
        path: "/packages/thingcircle/release/goods",
        query
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 12rpx;
  display: flex;
  align-items: center;
}
.title {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  color: $text-light;
  .title-right {
    font-size: $font-size-sm;
  }
}
.list {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
  padding-bottom: 160rpx;
}
</style>
