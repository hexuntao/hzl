<template>
  <view class="bg-white card-group-box">
    <lk-cell icon="orders-o" title="发票信息" />
    <lk-cell-info-list :list="columns" @btn-click="btnClick" />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  data() {
    return {};
  },
  props: {
    detail: Object
  },
  computed: {
    columns() {
      let arr = [];
      if (this.detail.invoice.type) {
        arr.push({
          title: "发票类型",
          value:
            this.detail.invoice.type == 1 ? "电子普通发票" : "增值税专用发票",
          btn: this.detail.invoice.is_upload > 0 ? "查看发票" : ""
        });
      }

      if (this.detail.invoice.type == 1) {
        if (this.detail.invoice.title) {
          arr.push({
            title: "抬头类型",
            value: this.detail.invoice.title == 1 ? "个人" : "公司"
          });
        }
        arr.push({ title: "发票抬头", value: this.detail.invoice.title_name });
        if (this.detail.invoice.title != 1) {
          arr.push({
            title: "税号",
            value: this.detail.invoice.taxpayer_no
          });
        }
      }
      if (this.detail.invoice.type == 2) {
        arr.push(
          {
            title: "公司名称",
            value: this.detail.invoice.company_name
          },
          {
            title: "纳锐人识别号",
            value: this.detail.invoice.taxpayer_no
          },
          {
            title: "注册地址",
            value: this.detail.invoice.company_addr
          },
          {
            title: "注册电话",
            value: this.detail.invoice.mobile
          },
          {
            title: "开户银行",
            value: this.detail.invoice.bank
          },
          {
            title: "银行账户",
            value: this.detail.invoice.card_no
          }
        );
      }

      arr.push({ title: "发票内容", value: this.detail.invoice.content });
      return arr;
    }
  },
  methods: {
    btnClick(item) {
      this.$Navigate.push({
        path: "/packages/invoice/detail",
        query: {
          order_no: this.detail.order_no
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
