<template>
  <view class="result-box">
    <lk-result-state-panel :state="stateType" />
    <view class="box">
      <view>{{ resultInfo.message }}</view>
      <view class="reason" v-if="resultInfo.result === 'fail'">
        原因：{{ resultInfo.reason }}
      </view>
    </view>
    <view
      class="foot-btn-group"
      v-if="resultInfo.result === 'fail' && resultInfo.isAgainApply"
    >
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        @click="onAgainApply"
      >
        重新申请
      </lk-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    resultInfo: {
      type: [Object, Boolean]
    }
  },
  computed: {
    stateType() {
      return "refund-" + this.resultInfo.result;
    }
  },
  methods: {
    onAgainApply() {
      this.$emit("change-page-type", 1);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  min-height: 200rpx;
  margin: 0 auto;
  background: #fff;
  padding: $cell-padding;
}
</style>
