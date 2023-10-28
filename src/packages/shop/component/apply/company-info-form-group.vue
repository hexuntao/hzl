<template>
  <view >
    <!-- <view class="cell-group-title">基本信息</view>
    <lk-field
      label="联系人"
      required
      v-model="form.contacts_name"
      placeholder="必填，请输入联系人"
    />
    <lk-field
      label="联系电话"
      required
      v-model="form.contacts_phone"
      type="number"
      placeholder="必填，请输入联系电话"
    />
    <lk-field
      label="电子邮箱"
      required
      v-model="form.contacts_email"
      type="text"
      placeholder="必填，请输入电子邮箱"
    />
    <lk-cell-picker-group
      label="联系地址"
      required
      mode="region"
      placeholder="请选择地区"
      @confirm="onArea"
    />
    <lk-field
      label="详细地址"
      required
      v-model="form.company_address_detail"
      placeholder="必填，请输入详细地址"
    /> -->

    <lk-field
      label="公司名称"
      required
      v-model="form.company_name"
      placeholder="必填，请输入公司名称"
    />
    <lk-cell-picker-group
      v-model="companyType"
      required
      label="公司类型"
      placeholder="请选择公司类型"
      :columns="companyTypeColumn"
      @confirm="onCompanyType"
    />
    <lk-field
      label="公司电话"
      required
      v-model="form.company_phone"
      type="number"
      placeholder="必填，请输入公司电话"
    />
    <lk-field
      label="员工人数"
      required
      v-model="form.company_employee_count"
      type="number"
      placeholder="必填，请输入员工人数"
    />
    <lk-field
      label="注册资金(万元)"
      required
      v-model="form.company_registered_capital"
      placeholder="必填，请输入注册资金"
    />
    <lk-field
      label="营业执照号"
      required
      v-model="form.business_licence_number"
      placeholder="必填，请输入营业执照号"
    />
    <lk-field
      label="经营范围"
      required
      type="textarea"
      v-model="form.business_sphere"
      placeholder="必填，请输入经营范围"
    />
    <cell-upload-image
      v-model="form.business_licence_number_electronic"
      label="营业执照"
    />
  </view>
</template>

<script>
import cellUploadImage from "./cell-upload-image";
export default {
  data() {
    return {
      companyType: "",
      companyTypeColumn: [
        { name: "私营企业" },
        { name: "个体户" },
        { name: "外企" },
        { name: "中外合资" }
      ],
      form: {
        // contacts_name: "",
        // contacts_phone: "",
        // contacts_email: "",
        // company_province_id: "",
        // company_city_id: "",
        // company_district_id: "",
        // company_address_detail: "",

        company_name: "",
        company_type: "",
        company_phone: "",
        company_employee_count: "",
        company_registered_capital: "",
        business_licence_number: "",
        business_sphere: "",
        business_licence_number_electronic: ""
      }
    };
  },
  methods: {
    onArea(data) {
      const ids = data.item.map(({ id }) => id);
      this.form.company_province_id = ids[0];
      this.form.company_city_id = ids[1];
      this.form.company_district_id = ids[2];
    },
    onCompanyType(index) {
      const item = this.companyTypeColumn[index];
      this.form.company_type = item.name;
    }
  },
  components: {
    cellUploadImage
  }
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
