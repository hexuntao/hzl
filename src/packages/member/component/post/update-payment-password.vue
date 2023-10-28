<template>
  <view>
    <view>
      <lk-field
        label="支付密码"
        placeholder="请输入支付密码"
        type="password"
        v-model="payment_password"
      />
      <lk-field
        label="确认密码"
        placeholder="再次输入新密码"
        type="password"
        v-model="check_password"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        @click="onSave"
      >
        完成
      </lk-button>
    </view>
  </view>
</template>

<script>
import { UPDATE_PAYMENTPASSWORD } from "@/common/interface/member";
import { isEmpty } from "@/common/utils";
import { validPayPassword, validCheckPassword } from "@/common/utils/validator";
import { mapState } from "vuex";
export default {
  data() {
    return {
      check_password: "",
      payment_password: ""
    };
  },
  props: {
    pageType: {
      type: [Number, String]
    }
  },
  computed: {
    ...mapState(["config"])
  },
  methods: {
    onSave() {
      const $this = this;
      if (
        !validPayPassword($this.payment_password, this.config.ppl) ||
        !validCheckPassword($this.payment_password, $this.check_password)
      ) {
        return false;
      }
      UPDATE_PAYMENTPASSWORD({ payment_password: $this.payment_password }).then(
        res => {
          if (res.code === 0) {
            $this.$Prompt.toast(res.message);
            $this.$emit("adopt");
          } else {
            $this.$Prompt
              .toast({ title: res.message, icon: "success" })
              .then(() => {
                $this.$Navigate.replace("/pages/member/index");
              });
          }
        }
      );
    }
  }
};
</script>

<style scoped></style>
