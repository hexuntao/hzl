<template>
  <view class="pages">
    <form-group v-if="formList.length" :items="formList" ref="formGroup" />
    <view v-else>
      <view class="cell-group">
        <lk-cell title="身份类型" field>
          <lk-radio-group v-model="form.apply_type" :active-color="theme.color">
            <lk-radio :name="1">个人</lk-radio>
            <lk-radio :name="2">公司</lk-radio>
          </lk-radio-group>
        </lk-cell>
      </view>
      <individual-info-form-group ref="individual" />
      <view v-show="form.apply_type == 2">
        <company-info-form-group ref="company" />
      </view>
      <identity-info-form-group ref="identity" />
    </view>
    <shop-info-form-group ref="shop" />
    <view class="foot-btn-group">
      <lk-button
        round
        block
        type="danger"
        theme-color
        bing-mobile
        @click="onApply"
      >
        申请
      </lk-button>
    </view>
  </view>
</template>

<script>
import formGroup from "@/components/custom/form-group";
import {
  validEmpty,
  validUsername,
  validMobile,
  validEmail,
  validCard
} from "@/common/utils/validator";
import {
  GET_SHOPAPPLYSTATE,
  APPLY_SHOP,
  GET_SHOPAPPLYCUSTOMFORM
} from "@/common/interface/shop";
import individualInfoFormGroup from "../component/apply/individual-info-form-group";
import companyInfoFormGroup from "../component/apply/company-info-form-group";
import shopInfoFormGroup from "../component/apply/shop-info-form-group";
import identityInfoFormGroup from "../component/apply/identity-info-form-group";
export default {
  name: "packages-shop-business-apply",
  data() {
    return {
      form: {
        apply_type: 1,
        referee_uid:''
      },
      formList: [],
      isLoading: false
    };
  },
  watch: {
    "form.apply_type"(e) {
      if (e == 1) {
        delete this.form.company_name;
        delete this.form.company_type;
        delete this.form.company_phone;
        delete this.form.company_employee_count;
        delete this.form.company_registered_capital;
        delete this.form.business_licence_number;
        delete this.form.business_sphere;
        delete this.form.business_licence_number_electronic;
      }
    }
  },
  onLoad(query) {
    this.form.referee_uid=query.referee_uid?query.referee_uid:''
    GET_SHOPAPPLYSTATE()
      .then(({ data }) => {
        if (data.status == "apply" || data.status == "refuse_apply") {
          this.getData();
        } else {
          this.$Navigate.replace("/packages/shop/business/index?referee_uid="+this.referee_uid);
        }
      })
      .catch(() => {});
  },
  methods: {
    getData() {
      GET_SHOPAPPLYCUSTOMFORM()
        .then(({ data }) => {
          this.formList =
            data.custom_form && data.custom_form.length ? data.custom_form : [];
        })
        .catch(() => {});
    },
    onApply() {
      let form = this.form;
      const form_data = this.$refs["formGroup"]
        ? this.$refs["formGroup"].getFormData()
        : "";
      if (this.formList.length) {
        if (!form_data) return false;
        delete form.apply_type;
        form.post_data = JSON.stringify(form_data);
        form = Object.assign({ ...form }, { ...this.$refs["shop"].form });
      } else {
        for (const key in this.$refs) {
          const item = this.$refs[key];
          if (item) {
            form = {
              ...form,
              ...item.form
            };
          }
        }
        if (
          !validUsername(form.contacts_name, "请输入联系人姓名！") ||
          !validMobile(form.contacts_phone) ||
          !validEmail(form.contacts_email) ||
          !validEmpty(form.company_province_id, "请选择地区！") ||
          !validEmpty(form.company_address_detail, "请输入详细地址！")
        ) {
          return false;
        }
        if (form.apply_type == 2) {
          if (
            !validUsername(form.company_name, "请输入公司名称！") ||
            !validEmpty(form.company_type, "请选择公司类型!") ||
            !validEmpty(form.company_phone, "请输入公司电话!") ||
            !validEmpty(form.company_employee_count, "请输入员工人数!") ||
            !validEmpty(form.company_registered_capital, "请输入注册资金!") ||
            !validEmpty(form.business_licence_number, "请输入营业执照号!") ||
            !validEmpty(form.business_sphere, "请输入经营范围!") ||
            !validEmpty(
              form.business_licence_number_electronic,
              "请上传营业执照!"
            )
          ) {
            return false;
          }
        }
        if (
          !validCard(form.contacts_card_no) ||
          !validEmpty(form.contacts_card_electronic_1, "请上传身份证照！") ||
          !validEmpty(form.contacts_card_electronic_2, "请上传身份证正照！") ||
          !validEmpty(form.contacts_card_electronic_3, "请上传身份证反照！")
        ) {
          return false;
        }
      }
      if (
        !validEmpty(form.shop_name, "请输入店铺名称！") ||
        !validEmpty(form.shop_group_id, "请选择店铺类型！")
      ) {
        return false;
      }
      // return console.log(form);
      this.isLoading = true;
      APPLY_SHOP(form)
        .then(({ message }) => {
          this.$Navigate.replace("/packages/shop/business/index?referee_uid="+this.referee_uid).then(() => {
            this.$Prompt.toast({ title: "提交成功", icon: "success" });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    formGroup,
    individualInfoFormGroup,
    companyInfoFormGroup,
    identityInfoFormGroup,
    shopInfoFormGroup
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
</style>
