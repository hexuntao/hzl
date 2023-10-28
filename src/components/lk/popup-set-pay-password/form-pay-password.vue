<template>
  <view>
    <view class="cell-group">
      <lk-field
        v-model="payment_password"
        label="支付密码"
        placeholder="请输入支付密码"
        type="password"
      />
      <lk-field
        v-model="check_password"
        label="确认密码"
        placeholder="再次输入新密码"
        type="password"
      />
    </view>
    <view class="foot">
      <lk-button class="btn" theme-color block round @click="save">
        确定
      </lk-button>
      <lk-button class="btn" block round @click="cancel">
        取消
      </lk-button>
    </view>
  </view>
</template>

<script>
import { UPDATE_PAYMENTPASSWORD } from "@/common/interface/member";
import { validPayPassword, validCheckPassword } from "@/common/utils/validator";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      check_password: "",
      payment_password: ""
    };
  },
  props: {},
  computed: {
    ...mapState(["config"])
  },
  methods: {
    ...mapMutations(["setMemberInfo"]),
    cancel() {
      this.$emit("cancel");
    },
    save() {
      if (
        !validPayPassword(this.payment_password, this.config.ppl) ||
        !validCheckPassword(this.payment_password, this.check_password)
      ) {
        return false;
      }
      UPDATE_PAYMENTPASSWORD({ payment_password: this.payment_password })
        .then(res => {
          if (res.code === 0) {
            this.$Prompt.toast(res.message);
            this.$emit("fail");
          } else {
            this.$Prompt.toast({ title: "设置成功", icon: "success" });
            this.$emit("success");
            this.check_password = "";
            this.payment_password = "";
            this.setMemberInfo({ ppl: this.config.ppl }); // 设置支付密码长度
          }
        })
        .catch(() => {
          this.$emit("fail");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.foot {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: $cell-padding;
  .btn {
    flex: 1;
    width: 100%;
    margin-top: 20rpx;
  }
  .confirm-color {
    color: $red;
  }
}
</style>
