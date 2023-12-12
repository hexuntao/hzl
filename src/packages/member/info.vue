<template>
  <view class="pages">
    <view class="cell-group">
      <lk-field
        label="用户名"
        :disabled="!!info.user_name"
        placeholder="只能更改一次"
        v-model="user_name"
      />
      <lk-field
        label="昵称"
        placeholder="请输入昵称"
        v-model="info.nick_name"
      />
      <lk-field
        label="真实姓名"
        placeholder="请输入真实姓名"
        v-model="info.real_name"
      />

      <form-group v-if="isForm" :items="formList" ref="formGroup" />
      <block v-if="loaded && !isForm">
        <lk-cell-picker-group
          v-model="info.birthday"
          label="生日"
          placeholder="请选择生日"
          mode="date"
        />

        <lk-cell title="性别" field>
          <lk-radio-group v-model="info.sex" :active-color="theme.color">
            <lk-radio :name="1">男</lk-radio>
            <lk-radio :name="2">女</lk-radio>
            <lk-radio :name="0">保密</lk-radio>
          </lk-radio-group>
        </lk-cell>
        <!-- <lk-field
          label="QQ"
          type="number"
          placeholder="请输入QQ号码"
          v-model="info.qq"
        /> -->
        <lk-cell-picker-group
          label="所在地"
          placeholder="请选择地区"
          mode="region"
          :area-code="area_code"
          @confirm="areaConfirm"
        />
      </block>
    </view>
    <view class="foot-btn-group">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        :loading="isLoading"
        @click="onSave"
      >
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
import { dateToTimestamp, formatDate } from "@/common/utils";
import { validNumber } from "@/common/utils/validator";
import { GET_ACCOUNTINFO, SET_ACCOUNTINFO } from "@/common/interface/member";
import formGroup from "@/components/custom/form-group";
import { mapState } from "vuex";
export default {
  name: "packages-member-info",
  data() {
    return {
      user_name: "",
      info: {
        nick_name: "",
        real_name: "",
        birthday: "",
        sex: 0,
        qq: "",
        province_id: "",
        city_id: "",
        district_id: "",
        area_code: ""
      },
      area_code: "",
      loaded: false,
      isLoading: false,
      formList: []
    };
  },
  onLoad() {
    this.getAccountInfo();
  },
  computed: {
    ...mapState({
      customForm: state => state.config.customForm
    }),
    isForm() {
      return !!this.formList.length;
    },
    // 格式化地区信息
    areaInfo() {
      let info = {};
      info.id = [];
      info.code = this.info.area_code;
      if (this.info.province_id) {
        info.id[0] = this.info.province_id;
        info.text = this.info.province_name;
      }
      if (this.info.city_id) {
        info.id[0] = this.info.province_id;
        info.id[1] = this.info.city_id;
        info.text = this.info.province_name + "/" + this.info.city_name;
      }
      if (this.info.city_id) {
        info.id[0] = this.info.province_id;
        info.id[1] = this.info.city_id;
        info.id[2] = this.info.district_id;
        info.text =
          this.info.province_name +
          "/" +
          this.info.city_name +
          "/" +
          this.info.district_name;
      }
      return info;
    }
  },
  methods: {
    getAccountInfo() {
      GET_ACCOUNTINFO().then(({ data }) => {
        data.birthday = formatDate(data.birthday);
        this.info = data;
        this.area_code = [
          data.province_id || 0,
          data.city_id || 0,
          data.district_id || 0
        ].join(",");
        this.loaded = true;
        if (
          data.custom_data.length &&
          data.custom_person &&
          data.custom_person.status == this.customForm.member_status
        ) {
          this.formList = data.custom_person.form_data;
        } else {
          this.formList = data.custom_data;
        }
      });
    },
    areaConfirm(data) {
      this.info.province_name = data.item[0].label;
      this.info.city_name = data.item[1].label;
      this.info.district_name = data.item[2].label;
      this.info.area_code = data.code;
      this.info.province_id = data.item[0].id;
      this.info.city_id = data.item[1].id;
      this.info.district_id = data.item[2].id;
    },
    onSave() {
      let params = {};
      const form_data = this.$refs["formGroup"]
        ? this.$refs["formGroup"].getFormData()
        : "";
      if (this.user_name) {
        if (!validNumber(this.user_name, "用户名不能为纯数字！")) {
          return false;
        }
        params.user_name = this.user_name;
      }
      params.nick_name = this.info.nick_name;
      params.real_name = this.info.real_name;
      if (!this.isForm) {
        params.sex = this.info.sex;
        params.birthday = dateToTimestamp(this.info.birthday);
        params.qq = this.info.qq;
        params.province_id = this.info.province_id;
        params.city_id = this.info.city_id;
        params.district_id = this.info.district_id;
        params.area_code = this.info.area_code;
      } else {
        if (!form_data) return false;
        params.post_data = JSON.stringify({
          form_data,
          status: this.customForm.member_status
        });
      }
      // return console.log(params);
      this.isLoading = true;
      SET_ACCOUNTINFO(params)
        .then(res => {
          const $this = this;
          $this.$Prompt
            .toast({ title: "保存成功", icon: "success" })
            .then(() => {
              setTimeout(function() {
                $this.isLoading = false;
                $this.$Navigate.back();
              }, 500);
            });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    formGroup
  }
};
</script>

<style lang="scss" scoped></style>
