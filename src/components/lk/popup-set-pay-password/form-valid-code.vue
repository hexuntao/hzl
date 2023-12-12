<template>
  <view>
    <view class="cell-group">
      <lk-field :value="userTel" label="手机号码" type="tel" disabled />
      <lk-field-msgcode
        v-model="verification_code"
        :mobile="userTel"
        :areacode="areacode"
        type="change_pay_password"
        :verify="false"
      />
    </view>
    <view class="foot">
      <lk-button class="btn" theme-color block round @click="next">
        下一步
      </lk-button>
      <lk-button class="btn" block round @click="cancel">
        取消
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  validMobile,
  validMsgcode,
  validImgcode
} from "@/common/utils/validator";
import { VALID_MSGCODE } from "@/common/interface/member";
import { mapState } from "vuex";
export default {
  data() {
    return {
      verification_code: ""
    };
  },
  props: {},
  computed: {
    ...mapState({
      userTel: ({ member }) => member.info.user_tel,
      areacode: ({ member }) => member.info.country_code
    })
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    // 验证手机验证码
    next() {
      if (!validMsgcode(this.verification_code)) {
        return false;
      }
      const params = {};
      params.mobile = this.userTel;
      params.verification_code = this.verification_code;
      // return console.log(params)
      VALID_MSGCODE(params).then(res => {
        if (res.code === 0) {
          this.$Prompt.toast(res.message);
        } else {
          // 短信验证成功下一步操作;
          this.$Prompt.toast({ title: "验证通过", icon: "success" });
          this.$emit("next");
          this.verification_code = "";
        }
      });
    }
  },
  components: {}
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
