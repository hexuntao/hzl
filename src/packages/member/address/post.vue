<template>
  <view class="pages">
    <lk-cell title="地址类型" field v-if="showType">
      <lk-radio-group
        v-model="info.type"
        :active-color="theme.color"
        @change="onTypeChange"
      >
        <lk-radio :name="0">
          <text>国内</text>
        </lk-radio>
        <lk-radio :name="1">
          <text>国际</text>
        </lk-radio>
      </lk-radio-group>
    </lk-cell>
    <view v-show="!info.type">
      <lk-field
        v-model="info.consigner"
        label="姓名"
        placeholder="请输入姓名"
        required
      />
      <lk-field
        v-model="info.mobile"
        type="number"
        label="手机号"
        placeholder="请输入手机号"
        required
		maxlength="11"
      />
      <lk-cell-picker-group
        label="所在地"
        placeholder="请选择地区"
        mode="region"
        required
        :area-code="area_code"
        :area-value="areaValue"
        @confirm="areaConfirm"
      />
      <lk-field
        v-model="info.address"
        type="textarea"
        label="详细地址"
        placeholder="请输入详细地址"
        required
      />
      <lk-field
        v-model="info.zip_code"
        label="邮政编码"
        placeholder="请输入邮政编码"
      />
      <lk-cell center title="设置默认收货地址">
        <switch
          :checked="!!info.is_default"
          slot="rightIcon"
          @change="info.is_default = !info.is_default"
        />
      </lk-cell>
    </view>
    <view v-show="info.type == 1">
      <lk-field
        v-model="info.consigner"
        label="姓名"
        placeholder="请输入姓名"
        required
      />
      <lk-field
        v-model="info.mobile"
        type="number"
        label="联系方式"
        placeholder="请输入手机号"
        required
        maxlength="11"
      />
      <lk-cell-picker-group
        v-model="country_id"
        label="配送国家"
        required
        placeholder="请选择国家"
        :loading="pickerLoading"
        :columns="countryList"
        @confirm="onConfirmCountry"
      />
      <lk-field
        v-model="info.address"
        type="textarea"
        label="详细地址"
        placeholder="请输入详细地址"
        required
      />
      <lk-cell center title="设置默认收货地址">
        <switch
          :checked="!!info.is_default"
          slot="rightIcon"
          @change="info.is_default = !info.is_default"
        />
      </lk-cell>
    </view>
    <view class="foot-btn-group">
      <lk-button round block theme-color :loading="isLoading" @click="onSave">
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_ADDRESSDETAIL,
  SAVE_ADDRESS,
  GET_COUNTRYLIST
} from "@/common/interface/member";
import { validMobile } from "@/common/utils/validator";
import { mapState } from "vuex";
export default {
  name: "packages-member-address-list",
  data() {
    return {
      address_id: "",
      areaValue: "",
      isLoading: false,
      info: {
        id: 0,
        type: 0, // 国内1，国际2
        consigner: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        address: "",
        is_default: 0,
        area_code: "",
        zip_code: "",
        country_id: ""
      },
      area_code: "",
      country_id: -1,

      pickerLoading: false,
      countryList: []
    };
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    showType() {
      return !!this.addons.abroadreceivegoods;
    }
  },
  onLoad(query) {
    this.address_id = query.address_id || "";
    this.onbackevent = query.onbackevent || "";
    this.address_id && this.getDateilInfo();
  },
  methods: {
    getDateilInfo() {
      GET_ADDRESSDETAIL({ id: this.address_id })
        .then(({ data }) => {
          data.type = data.type || 0;
          this.info = data;
          this.area_code = [
            data.province || 0,
            data.city || 0,
            data.district || 0
          ].join(",");
          if (data.country_id) {
            this.country_id = data.country_id;
          }
          this.areaValue = [
            data.province_name,
            data.city_name,
            data.district_name
          ].join("/");
        })
        .catch(() => {});
    },
    onTypeChange(e) {
      if (e == 1 && !this.countryList.length) {
        this.getCountryList();
      }
    },
    onConfirmCountry(e) {
      const item = this.countryList[e];
      this.info.country_id = item.id;
    },
    getCountryList() {
      this.getConfig().then(config => {
        if (config.addons.abroadreceivegoods) {
          GET_COUNTRYLIST().then(({ data }) => {
            let list = data || [];
            list.forEach(e => {
              e.name = e.chinese_country_name;
            });
            this.countryList = list;
          });
        }
      });
    },
    areaConfirm(data) {
      this.areaValue = `${data.item[0].label}/${data.item[1].label}/${data.item[2].label}`;
      this.info.area_code = data.code;
      this.info.province = data.item[0].id;
      this.info.city = data.item[1].id;
      this.info.district = data.item[2].id;
    },
    validForm() {
      if (!this.info.consigner) {
        this.$Prompt.toast("请输入姓名");
        return false;
      }
      if (this.info.type == 0) {
        if (!validMobile(this.info.mobile)) {
          return false;
        }
        if (!this.info.area_code) {
          this.$Prompt.toast("请选择地区");
          return false;
        }
      }
      if (this.info.type == 1) {
        if (!this.info.mobile) {
          this.$Prompt.toast("请输入手机号");
          return false;
        }
        if (!this.info.country_id) {
          this.$Prompt.toast("请选择国家");
          return false;
        }
      }
      if (!this.info.address) {
        this.$Prompt.toast("请输入详细地址");
        return false;
      }
      return true;
    },
    onSave() {
      if (!this.validForm()) {
        return;
      }
      // return console.log(this.info);
      this.isLoading = true;
      SAVE_ADDRESS({ ...this.info, is_default: this.info.is_default ? 1 : 0 })
        .then(res => {
          this.$Navigate.back();
          this.isLoading = false;
          if (this.onbackevent) {
            uni.$emit(this.onbackevent, true);
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
