<template>
  <lk-cell-info-list :list="columns" card align="right" />
</template>

<script>
import { yuan } from "@/common/utils";
import { mapState } from "vuex";
export default {
  props: {
    detail: Object,
  },
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
      copy_writing: ({ member }) => member.info.receivegoodscode.copy_writing
    }),
    columns() {
      const {
        order_type,
        goods_money,
        order_money,
		total_ptmoney,
        order_real_money,
        order_point,
        shipping_fee,
        invoice,
        promotion_money,
        receive_goods_code_deduct,
        deduction_money,
        membercard_deduction_money,
        presell_status,
        first_real_money,
        final_real_money,
      } = this.detail;
      let arr = [];

      if (order_type == 10) {
        if (goods_money > 0 && order_point) {
          arr = [
            {
              title: "商品总额",
              value:
                order_point +
                this.memberTexts.point_style +
                " + " +
                yuan(goods_money),
              color: "#f44",
            },
          ];
        } else if (order_point > 0) {
          arr = [
            {
              title: "商品总额",
              value: order_point + this.memberTexts.point_style,
              color: "#f44",
            },
          ];
        }
      } else {
        arr = [{ title: "商品总额", value: yuan(goods_money), color: "#f44" }];
      }
	  if (parseFloat(total_ptmoney) > 0) {
	    arr.push({
	      title: "商品积分",
	      value: total_ptmoney,
	      color: "#f44",
	    });
	  }

		

      if (parseFloat(deduction_money) > 0) {
        arr.push({
          title: this.memberTexts.point_style + "抵扣",
          value: yuan(deduction_money),
          color: "#f44",
        });
      }
      if (receive_goods_code_deduct>0) {
        arr.push({
          title: this.copy_writing + "优惠",
          value: yuan(receive_goods_code_deduct),
          color: "#f44",
        });
      }
      if (Number(membercard_deduction_money) > 0) {
        arr.push({
          title: "会员卡抵扣",
          value: yuan(membercard_deduction_money),
          color: "#f44",
        });
      }
      if (order_type == 7) {
        if (presell_status == 0) {
          arr.push({
            title: "待付定金",
            value: first_real_money,
            color: "#f44",
          });
        } else if (presell_status == 1) {
          arr.push(
            { title: "已付定金", value: first_real_money, color: "#f44" },
            {
              title: "待付尾款(含运费" + (invoice.type ? "税费" : "") + ")",
              value: final_real_money,
              color: "#f44",
            }
          );
        } else if (presell_status == 2) {
          arr.push(
            { title: "已付定金", value: first_real_money, color: "#f44" },
            {
              title: "已付尾款",
              value: final_real_money,
              color: "#f44",
            },
            { title: "运费", value: yuan(shipping_fee), color: "#f44" }
          );
          if (invoice.type) {
            arr.push({
              title: "税费",
              value: yuan(invoice.tax),
              color: "#f44",
            });
          }
          arr.push({
            title: "实付",
            value: order_real_money,
            color: "#f44",
          });
        }
      } else if (order_type == 10) {
        if (order_point > 0 && order_money > 0) {
          arr.push(
            { title: "运费", value: yuan(shipping_fee), color: "#f44" },
            {
              title: "实付",
              value:
                order_point +
                this.memberTexts.point_style +
                " + " +
                yuan(order_money),
              color: "#f44",
            }
          );
        } else if (order_point > 0) {
          arr.push(
            { title: "运费", value: yuan(shipping_fee), color: "#f44" },
            {
              title: "实付",
              value: order_point + this.memberTexts.point_style,
              color: "#f44",
            }
          );
        } else {
          arr.push(
            { title: "运费", value: yuan(shipping_fee), color: "#f44" },
            { title: "实付", value: yuan(order_money), color: "#f44" }
          );
        }
      } else {
        arr.push(
          { title: "运费", value: yuan(shipping_fee), color: "#f44" },
          { title: "优惠金额", value: yuan(promotion_money), color: "#f44" }
        );
        if (invoice && invoice.type) {
          arr.push({
            title: "税费",
            value: yuan(invoice.tax),
            color: "#f44",
          });
        }

        arr.push({
          title: "实付",
          value: order_real_money || "",
          color: "#f44",
        });
      }

     

      return arr;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
