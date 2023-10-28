<template>
  <view>
    <view>
      <lk-field-areacode
        label="新手机"
        placeholder="请输入新手机号码"
        v-model="mobile"
        @get-areacode="getAreacode"
      />
      <lk-field-msgcode
        v-model="verification_code"
        :mobile="mobile"
        :areacode="country_code"
        type="bind_mobile"
        @send-success="onSendSuccess"
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
import { UPDATE_MOBILE } from "@/common/interface/member";
import { isEmpty } from "@/common/utils";
import { validMobile, validMsgcode } from "@/common/utils/validator";
export default {
  data() {
    return {
      mobile: "",
      verification_code: "",
      country_code: ""
    };
  },
  props: {
    pageType: {
      type: [Number, String]
    }
  },
  methods: {
    // 发送验证码完成
    onSendSuccess({ isHasMobile, msg }) {
      if (isHasMobile == 1) {
        this.$Prompt.toast(msg);
      }
    },
    getAreacode(code) {
      this.mobile = "";
      this.country_code = code;
    },
    onSave() {
      const $this = this;
      const pageType = $this.pageType;
      if (
        !validMobile($this.mobile, this.country_code) ||
        !validMsgcode($this.verification_code)
      ) {
        return false;
      }
      const params = {};
      params.mobile = $this.mobile;
      params.verification_code = $this.verification_code;
      if (this.country_code) {
        params.country_code = this.country_code;
      }
      UPDATE_MOBILE(params).then(({ message }) => {
        $this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
          $this.$Navigate.replace("/pages/member/index");
        });
      });
    }
  }
};
</script>

<style scoped></style>
