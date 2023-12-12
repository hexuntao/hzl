<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <block v-if="isValid">
      <view>
        <lk-field
          label="手机号码"
          type="number"
          disabled
          v-model="memberInfo.user_tel"
        />
        <lk-field-msgcode
          v-model="verification_code"
          :mobile="memberInfo.user_tel"
          :type="msgcodeType"
          :areacode="areacode"
          :verify="false"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          type="danger"
          :color="theme.gradient"
          @click="onNext"
        >
          下一步
        </lk-button>
      </view>
    </block>
    <block v-else>
      <update-password
        v-if="updateTypeName === 'password'"
        :page-type="pageType"
        @adopt="isValid = true"
      />
      <update-payment-password
        v-if="updateTypeName === 'paymentPassword'"
        :page-type="pageType"
        @adopt="isValid = true"
      />
      <update-mobile v-if="updateTypeName === 'mobile'" :page-type="pageType" />
      <update-email v-if="updateTypeName === 'email'" :page-type="pageType" />
    </block>
  </view>
</template>

<script>
const pagesObj = {
  1: { title: "修改密码", name: "password", codeType: "change_password" },
  2: {
    title: "支付密码",
    name: "paymentPassword",
    codeType: "change_pay_password"
  },
  3: { title: "修改关联手机", name: "mobile", codeType: "update_mobile" },
  4: { title: "绑定邮箱", name: "email", codeType: "bind_email" }
};
import { validMsgcode } from "@/common/utils/validator";
import { VALID_MSGCODE } from "@/common/interface/member";
import { mapState } from "vuex";
import updatePassword from "./component/post/update-pasword";
import updatePaymentPassword from "./component/post/update-payment-password";
import updateMobile from "./component/post/update-mobile";
import updateEmail from "./component/post/update-email";
export default {
  name: "packages-member-post",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      /**
       * pageType 页面类型
       * 1 ==> 修改登录密码
       * 2 ==> 修改支付密码
       * 3 ==> 修改手机
       * 4 ==> 绑定邮箱
       */
      pageType: null,
      updateTypeName: null,
      msgcodeType: null, // 获取验证参数类型

      isValid: true,
      verification_code: ""
    };
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
      areacode: ({ member }) => member.info.country_code
    })
  },
  onLoad(query) {
    this.pagetype = query.pagetype;
    this.pageStyle.title = pagesObj[this.pagetype].title;
    this.updateTypeName = pagesObj[this.pagetype].name;
    this.msgcodeType = pagesObj[this.pagetype].codeType;
  },
  methods: {
    onNext() {
      const $this = this;
      if (!validMsgcode($this.verification_code)) {
        return false;
      }
      const params = {};
      params.mobile = $this.memberInfo.user_tel;
      params.verification_code = $this.verification_code;
      VALID_MSGCODE(params).then(res => {
        if (res.code === 0) {
          $this.$Prompt.toast(res.message);
        } else {
          // 短信验证成功下一步操作;
          $this.$Prompt.toast({ title: "验证通过", icon: "success" });
          $this.isValid = false;
        }
      });
    }
  },
  components: {
    updatePassword,
    updatePaymentPassword,
    updateMobile,
    updateEmail
  }
};
</script>

<style lang="scss" scoped></style>
