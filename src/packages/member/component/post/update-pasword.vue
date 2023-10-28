<template>
  <view>
    <view>
      <lk-field
        label="新密码"
        placeholder="请输入新密码"
        type="password"
        v-model="password"
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
import { UPDATE_PASSWORD } from "@/common/interface/member";
import { isEmpty } from "@/common/utils";
import { validPassword, validCheckPassword } from "@/common/utils/validator";
export default {
  data() {
    return {
      check_password: "",
      password: ""
    };
  },
  props: {
    pageType: {
      type: [Number, String]
    }
  },
  methods: {
    onSave() {
      const $this = this;
      const pageType = $this.pageType;
      if (
        !validPassword($this.password) ||
        !validCheckPassword($this.password, $this.check_password)
      ) {
        return false;
      }
      UPDATE_PASSWORD({ password: $this.password }).then(res => {
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
      });
    }
  }
};
</script>

<style scoped></style>
