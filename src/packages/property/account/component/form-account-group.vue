<template>
  <view>
    <view>
      <lk-field
        required
        label="账户号码"
        placeholder="请输入账户号码"
        v-model="info.account_number"
      />
      <lk-field
        required
        label="真实姓名"
        placeholder="请输入真实姓名"
        v-model="info.realname"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="save"
        :loading="loading"
      >
        保存
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
    info: Object,
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 验证
    validator() {
      const info = this.info;
      if (!info.account_number) {
        this.$Prompt.toast("请输入账户号码！");
        return false;
      }
      if (!info.realname) {
        this.$Prompt.toast("请输入真实姓名！");
        return false;
      }
      return info;
    },
    save() {
      const info = this.validator();
      if (info) {
        this.$emit("save", info);
      }
    }
  }
};
</script>

<style scoped></style>
