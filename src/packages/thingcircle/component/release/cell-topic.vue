<template>
  <lk-cell is-link @click="toLink">
    <view class="icon" slot="icon">
      <lk-icon class-prefix="v-icon" name="v-icon-huati" size="20" :color="stateStyle.color" />
    </view>
    <view class="title" slot="title" :style="{ color: stateStyle.color }">
      <view class="text">{{ stateStyle.title }}</view>
      <view class="title-right" v-if="!value">选择所属话题</view>
    </view>
  </lk-cell>
</template>

<script>
export default {
  data() {
    return {
      title: ""
    };
  },
  props: {
    value: [Number, String]
  },
  computed: {
    stateStyle() {
      let obj = {
        color: this.value ? "#f44" : "#909399",
        title: this.title || "参与话题"
      };
      return obj;
    }
  },
  mounted() {
    uni.$on("get-release-topic", ({ id, title }) => {
      this.title = title;
      this.$emit("input", id);
    });
  },
  destroyed() {
    uni.$off("get-release-topic");
  },
  methods: {
    toLink() {
      this.$Navigate.push({
        path: "/packages/thingcircle/release/topic"
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
