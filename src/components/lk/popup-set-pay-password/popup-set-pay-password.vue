<template>
  <lk-popup
    v-model="show"
    round
    position="bottom"
    prevent-touchmove
    :mask-close="false"
    :title="title"
  >
    <view class="popup-box">
      <form-valid-code
        v-if="isValid"
        @next="isValid = false"
        @cancel="onClose"
      />
      <form-pay-password
        v-else
        @success="refresh"
        @fail="isValid = true"
        @cancel="onClose"
      />
    </view>
  </lk-popup>
</template>

<script>
import formValidCode from "./form-valid-code";
import formPayPassword from "./form-pay-password";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "设置支付密码",
      isValid: true
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    ...mapMutations(["setMemberInfo"]),
    onClose() {
      this.show = false;
    },
    refresh() {
      this.show = false;
      this.isValid = true;
      this.setMemberInfo({ is_password_set: 1 }); // 设置是否有支付密码为true
    }
  },
  components: {
    formValidCode,
    formPayPassword
  }
};
</script>

<style lang="scss" scoped>
.popup-box {
  position: relative;
  height: 70vh;
}
</style>
