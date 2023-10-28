<template>
  <view>
    <view>
      <lk-field label="电子邮箱" placeholder="请输入电子邮箱" v-model="email" />
      <lk-field-msgcode
        v-model="verification_code"
        :email="email"
        label="邮箱验证码"
        type="bind_email"
        valid-type="email"
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
import { UPDATE_EMAIL } from "@/common/interface/member";
import { isEmpty } from "@/common/utils";
import { validEmail, validMsgcode } from "@/common/utils/validator";
export default {
  data() {
    return {
      email: "",
      verification_code: ""
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
      if (!validEmail($this.email) || !validMsgcode($this.verification_code)) {
        return false;
      }
      const params = {};
      params.email = $this.email;
      params.email_verification = $this.verification_code;
      UPDATE_EMAIL(params).then(({ message }) => {
        $this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
          $this.$Navigate.replace("/pages/member/index");
        });
      });
    }
  },
  components: {}
};
</script>

<style scoped></style>
