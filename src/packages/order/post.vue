<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <block v-if="pageType === 1 || pageType === 2">
      <view class="cell-goods">
        <lk-goods-card
          card-size="sm"
          v-for="(item, index) in goods_list"
          :key="index"
          :title="item.goods_name"
          :desc="item.spec | filterSpec"
          :image="item.pic_cover"
          :num="item.num"
          :to="'/packages/goods/detail?goods_id=' + item.goods_id"
        />
      </view>
      <post-apply
        :info="refund_detail"
        :page-type="pageType"
        @init-data="getData"
      />
      <post-apply-return-goods
        v-if="
          pageType === 2 &&
            (refund_detail.refund_status === 2 ||
              refund_detail.refund_status === 3)
        "
        :info="refund_detail"
        :return-goods-type="returnGoodsType"
        :company-list="company_list"
        :shop-info="shop_info"
        @init-data="getData"
      />
    </block>
    <post-result
      v-else-if="pageType === 3"
      :result-info="resultInfo"
      @change-page-type="changePageType"
    />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { isEmpty } from "@/common/utils";
import { GET_REFUNDINFO } from "@/common/interface/order";
import postApply from "./component/post/apply";
import postApplyReturnGoods from "./component/post/apply-return-goods";
import postResult from "./component/post/result";
export default {
  name: "packages-order-post",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      pageType: 0,
      returnGoodsType: 0,

      refund_detail: {},
      goods_list: [],
      shop_info: {},
      company_list: []
    };
  },
  filters: {
    // 过滤规格数组
    filterSpec(value) {
      if (isEmpty(value)) return "";
      let newArr = [];
      value.forEach(e => {
        let str = e.spec_name + " " + e.spec_value_name;
        newArr.push(str);
      });
      return newArr.join(" , ");
    }
  },
  computed: {
    // 退货退款后提示信息
    resultInfo() {
      const { order_status, refund_type, refund_status } = this.refund_detail;
      // console.log("退款类型==>", refund_type, "售后状态==>", refund_status);
      if (refund_status === 4 || refund_status === 5 || refund_status === -3) {
        let obj = {};
        if (refund_status === 4) {
          obj.result = "success";
          obj.message =
            refund_type === 2
              ? "卖家已收到商品，等待卖家处理退款！"
              : "卖家已同意您的退款，请耐心等待打款！";
        } else if (refund_status === 5) {
          obj.result = "finish";
          obj.message = "退款成功，退款到账可能会有1-3天延迟，请留意你的账户！";
        } else if (refund_status === -3) {
          const reason = this.refund_detail.reason;
          obj.result = "fail";
          obj.message =
            refund_type === 2 ? "卖家已拒绝你的退货！" : "卖家已拒绝你的退款！";
          obj.reason = reason;
          obj.isAgainApply =
            order_status == 4 || order_status == 5 ? false : true;
        }

        // console.log(obj);
        return isEmpty(obj) ? false : obj;
      } else {
        return false;
      }
    }
  },
  onLoad(query) {
    this.params = query;
    this.getData();
  },
  methods: {
    getData() {
      GET_REFUNDINFO(this.params, { isShowLoading: true })
        .then(({ data }) => {
          this.refund_detail = data.refund_detail;
          this.goods_list = data.refund_detail.goods_list;
          this.shop_info = data.shop_info;
          this.company_list = data.company_list || [];
          this.refund_detail.is_refund_all = data.is_all;
          this.setPageType();
          this.pageStyle.title = this.setTitle();
          if (
            this.refund_detail.refund_status === 2 ||
            this.refund_detail.refund_status === 3
          ) {
            this.setReturnGoodsType();
          }
        })
        .catch(() => {});
    },
    setTitle() {
      const order_status = this.refund_detail.order_status;
      let title = "";
      if (order_status == 2 || order_status == 3 || order_status == 4) {
        title = "退款退货";
      } else if (order_status == -1) {
        title = "售后中";
      } else {
        title = "退款";
      }
      return title;
    },
    /**
     * 页面类型
     * 1==> 提交售后
     * 2==> 售后中
     * 3==> 售后结果
     */
    setPageType() {
      const refund_type = this.refund_detail.refund_type;
      const refund_status = this.refund_detail.refund_status;
      // console.log("退款类型==>", refund_type, "售后状态==>", refund_status);
      let type = 0;
      if (refund_status === 0) {
        type = 1;
      } else if (
        refund_status === 1 ||
        refund_status === 2 ||
        refund_status === 3
      ) {
        type = 2;
      } else if (
        refund_status === 4 ||
        refund_status === 5 ||
        refund_status === -3
      ) {
        type = 3;
      }
      // console.log("页面类型==>", type);
      this.pageType = type;
    },
    /**
     * 退货页面类型
     * 1==> 提交退货
     * 2==> 退货中
     */
    setReturnGoodsType() {
      const refund_status = this.refund_detail.refund_status;
      let type = 0;
      if (refund_status === 2) {
        type = 1;
      } else if (refund_status === 3) {
        type = 2;
      }
      // console.log("退货页面类型==>", type);
      this.returnGoodsType = type;
    },
    changePageType(type) {
      this.pageType = type;
    }
  },
  components: {
    postApply,
    postApplyReturnGoods,
    postResult
  }
};
</script>

<style lang="scss" scoped>
.cell-goods {
  padding: $cell-padding;
  background: #ffffff;
}
</style>
