<template>
  <view class="btn-group">
    <lk-button
      round
      type="warning"
      block
      class="btn"
      bing-mobile
      :color="theme.gradient"
      :disabled="!isCanBargain"
      :loading="canBarginLoading"
      @click="onBargain('help-bargain')"
    >
      {{ helpBargainBtnText }}
    </lk-button>
    <lk-button
      v-if="isShowMyBargainBtn"
      round
      type="danger"
      block
      class="btn"
      :color="theme.cart"
      @click="onBargain('bargain')"
    >
      我要砍价
    </lk-button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    canBarginLoading: Boolean,
    isCanBargain: Boolean, //是否可以砍价
    isShowMyBargainBtn: Boolean //是否显示我要砍价
  },
  computed: {
    helpBargainBtnText() {
      return !this.isCanBargain ? "已砍" : "帮砍";
    }
  },
  methods: {
    onBargain(action) {
      this.$emit(action);
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-group {
  padding: $cell-padding;
  .btn {
    margin-top: 20rpx;
  }
  .btn:first-child {
    margin-top: 0;
  }
}
</style>
