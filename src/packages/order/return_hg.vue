<template>
  <page-meta>
    <navigation-bar
        front-color="#000000"
        background-color="#FFFFFF"
        :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <block >
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
	  
      <post-apply-hg
          :info="refund_detail"
          :huigou_status="huigou_status"
          @init-data="getData"
      />
	  
	  
	  <view v-if="huigou_status>=2 && huigou_status!=3 && huigou_status!=6">
	    <view class="cell-group">
	      <view class="blod">
	        卖家已经同意回购，请把商品回寄到以下地址：
	      </view>
	      <lk-cell
	          :title="huigou_shop_info.consigner"
	          :title-right="huigou_shop_info.mobile"
	          :label="huigou_shop_info.address"
	      >
	      </lk-cell>
	      <cell-express-company-popup
	          v-if="huigou_status == 2"
	          :name="huigou_back_company_name || '请选择物流公司'"
	          @select="onSelect"
	      />
	  
	      <lk-field
	          label="物流公司"
	          disabled
	          :value="refund_detail.huigou_back_company_name"
	          v-if="huigou_status != 2"
	      />
	  
	      <lk-field
	          label="物流单号"
	          clearable
	          :placeholder="'请输入物流单号'"
	          v-model="huigou_back_shipping_code"
	          v-if="huigou_status == 2"
	      />
	      <lk-field
	          label="物流单号"
	          disabled
	          :value="refund_detail.huigou_back_shipping_code"
	          v-if="huigou_status != 2"
	      />
	    </view>
	    <view class="foot-btn-group" v-if="huigou_status == 2">
	      <lk-button
	          block
	          round
	          type="danger"
	          theme-color
	          :loading="isLoading"
	          @click="onSubmit"
	      >
	        提交
	      </lk-button>
	    </view>
	  </view>


    </block>
    <lk-shortcut-entry />
  </view>
</template>

<script>
	import cellExpressCompanyPopup from "./component/cell-express-company-popup";
	import { SUB_HUIGOUEXPRESS } from "@/common/interface/order";
	
import { isEmpty } from "@/common/utils";
import { GET_REFUNDINFO } from "@/common/interface/order";
import postApply from "./component/post/apply";
import postApplyHg from "./component/post/apply-hg";
import postApplyReturnGoods from "./component/post/apply-return-goods";
import postResult from "./component/post/result";
export default {
  name: "packages-order-post",
  data() {
    return {
		huigou_back_shipping_code: null,
		huigou_shipping_company: null,
		huigou_back_company_name: null,
		columns: [],
		isLoading: false,
      pageStyle: {
        background: "",
        title: ""
      },
      huigou_status:0,
      refund_detail: {},
      goods_list: [],
      shop_info: {},
      company_list: [],
	  huigou_shop_info:[],
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
			this.huigou_shop_info = data.refund_detail.huigou_shop_info;
            this.shop_info = data.shop_info;
            this.company_list = data.company_list || [];
            this.refund_detail.is_refund_all = data.is_all;
            this.huigou_status = data.refund_detail.huigou_status;
            this.pageStyle.title = '申请回购';

          })
          .catch(() => {});
    },
	onSelect(item) {
      this.huigou_shipping_company = item.co_id;
      this.huigou_back_company_name = item.company_name;
    },
    onSubmit() {
      var refund_detail = this.refund_detail;
      if (!this.huigou_shipping_company) {
        this.$Prompt.toast("请选择物流公司！");
        return false;
      }
      if (!this.huigou_back_shipping_code) {
        this.$Prompt.toast("请填写物流单号！");
        return false;
      }
      const params = {};
      params.order_goods_id = this.params.order_goods_id;
      params.huigou_back_company_name = this.huigou_back_company_name;
      params.huigou_back_shipping_code = this.huigou_back_shipping_code;

      this.isLoading = true;

      SUB_HUIGOUEXPRESS(params)
          .then(res => {
            // 发送订阅消息
            this.refund_detail.huigou_status = 4;
			this.refund_detail.huigou_back_company_name = this.huigou_back_company_name;
			this.refund_detail.huigou_back_shipping_code = this.huigou_back_shipping_code;
			this.huigou_status = 4;
            this.refund_detail.huigou_status_show = '等待签收';
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
    }
  },
  components: {
    postApply,
    postApplyHg,
    postApplyReturnGoods,
    postResult,
	cellExpressCompanyPopup
  }
};
</script>

<style lang="scss" scoped>
.cell-goods {
  padding: $cell-padding;
  background: #ffffff;
}
.blod {
  padding: 20rpx 30rpx 0;
  background: #ffffff;
  font-weight: 800;
}
</style>
