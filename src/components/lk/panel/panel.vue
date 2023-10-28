<template>
  <view class="panel" :class="[cardClass]">
    <slot name="header">
      <lk-cell
        :icon="icon"
        :title="title"
        :label="desc"
        v-if="icon || title || desc"
      >
        <text class="status" v-if="status">{{ status }}</text>
      </lk-cell>
    </slot>
    <view class="content">
      <slot />
    </view>
    <view v-if="$slots.footer" class="footer hairline-top">
      <slot name="footer" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "panel"
    };
  },
  props: {
    icon: String, // 头部右侧图标
    title: String, // 头部标题
    desc: String, // 头部 标题描述
    status: String, //头部 右侧描述 字体颜色默认红色
    card: Boolean // 是否卡片式
  },
  computed: {
    cardClass() {
      return this.card ? "card-group-box" : "";
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  background-color: $white;
}

.status {
  color: $red;
}

.content {
  padding: $cell-padding;
}

.footer {
  padding: $cell-padding;
  display: flex;
  justify-content: flex-end;
}
</style>
