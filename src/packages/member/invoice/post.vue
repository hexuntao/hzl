<template>
  <view class="pages">
    <lk-cell title="发票类型" field>
      <lk-radio-group
        v-model="invoice"
        :active-color="theme.color"
        @change="onTypeChange"
      >
        <lk-radio :name="0">
          <text>电子普通发票</text>
        </lk-radio>
        <lk-radio :name="1">
          <text>增值税专用发票</text>
        </lk-radio>
      </lk-radio-group>
    </lk-cell>
    <view v-if="invoice == 0">
      <lk-cell title="发票抬头" field>
        <lk-radio-group
          v-model="company"
          :active-color="theme.color"
          @change="onTypeinvoice"
        >
          <lk-radio :name="0">
            <text>个人</text>
          </lk-radio>
          <lk-radio :name="1">
            <text>公司</text>
          </lk-radio>
        </lk-radio-group>
      </lk-cell>
      <lk-field
        v-model="electronic_invoice.title_name"
        label="抬头名称"
        placeholder="请输入抬头名称"
        required
      />

      <lk-field
        v-if="company == 1"
        v-model="electronic_invoice.taxpayer_no"
        label="纳税人识别号"
        placeholder="请输入纳税人识别号"
        required
      />
      <lk-cell center title="设置默认发票抬头">
        <switch
          :checked="!!electronic_invoice.is_default"
          slot="rightIcon"
          @change="
            electronic_invoice.is_default = !electronic_invoice.is_default
          "
        />
      </lk-cell>
    </view>
    <!-- 增值税发票 -->
    <view v-if="invoice == 1">
      <lk-field
        v-model="added_value.company_name"
        label="公司名称"
        placeholder="请输入公司名称"
        required
      />

      <lk-field
        v-model="added_value.taxpayer_no"
        label="纳税人识别号"
        placeholder="请输入纳税人识别号"
        required
      />

      <lk-field
        v-model="added_value.company_addr"
        label="注册地址"
        placeholder="请输入注册地址"
        required
      />

      <lk-field
        v-model="added_value.mobile"
        label="注册电话"
        type="number"
        placeholder="请输入注册电话"
        required
      />

      <lk-field
        v-model="added_value.bank"
        label="开户银行"
        placeholder="请输入开户银行"
        required
      />
      <lk-field
        v-model="added_value.card_no"
        label="银行账户"
        type="number"
        placeholder="请输入银行账户"
        required
      />

      <lk-cell center title="设置默认收货地址">
        <switch
          :checked="!!added_value.is_default"
          slot="rightIcon"
          @change="added_value.is_default = !added_value.is_default"
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
  ADDUSERINVOICE,
  GET_USERINVOICEINFOBYCOND //获取用户发票信息
} from "@/common/interface/member";
export default {
  data() {
    return {
      isLoading: false,
      invoice: 0, //发票类型
      company: 0, //个人 公司
      //普通电子发票
      electronic_invoice: {
        type: 1,
        title: 1, // 发票抬头 1个人 2 公司
        title_name: "", //抬头名称
        taxpayer_no: "", //纳粹人识别号
        is_default: 0
      },
      //增值税专用发票
      added_value: {
        type: 2,
        company_name: "", //公司名称
        company_addr: "", //公司地址
        taxpayer_no: "", //纳税人识别号
        bank: "", //开户银行
        card_no: "", //银行账户
        mobile: "", //注册电话
        is_default: 0
      }
    };
  },
  onLoad(query) {
    if (query.user_invoice_id) this.getUserInvoiceInfo(query.user_invoice_id);
  },
  methods: {
    getUserInvoiceInfo(user_invoice_id) {
      GET_USERINVOICEINFOBYCOND({ user_invoice_id: user_invoice_id }).then(
        ({ data }) => {
          this.invoice = data.type - 1;
          this.company = data.title - 1;
          this.electronic_invoice = data;
          this.added_value = data;
        }
      );
    },
    onTypeChange() {},
    onTypeinvoice(e) {
      this.electronic_invoice.title = e + 1;
    },
    onSave() {
      if (this.invoice == 0) {
        if (!this.electronic_invoice.title_name) {
          this.$Prompt.toast("请输入抬头名称");
          return false;
        }
        if (
          this.electronic_invoice.title == 2 &&
          !this.electronic_invoice.taxpayer_no
        ) {
          this.$Prompt.toast("请输入纳粹人识别号");
          return false;
        }
      }

      if (this.invoice == 1) {
        if (!this.added_value.company_name) {
          this.$Prompt.toast("请输入公司名称");
          return false;
        }
        if (!this.added_value.company_addr) {
          this.$Prompt.toast("请输入公司地址");
          return false;
        }
        if (!this.added_value.taxpayer_no) {
          this.$Prompt.toast("请输入纳税人识别号");
          return false;
        }
        if (!this.added_value.card_no) {
          this.$Prompt.toast("请输入银行账户");
          return false;
        }
        if (!this.added_value.bank) {
          this.$Prompt.toast("请输入开户银行");
          return false;
        }
        if (!this.added_value.mobile) {
          this.$Prompt.toast("请输入注册电话");
          return false;
        }
      }
      this.isLoading = true;
      let params =
        this.invoice == 1 ? this.added_value : this.electronic_invoice;
      ADDUSERINVOICE(params)
        .then(res => {
          this.isLoading = false;
          this.$Navigate.back();
        })
        .catch(error => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style></style>
