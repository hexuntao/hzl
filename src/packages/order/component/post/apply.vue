<template>
  <view class="cell-group">
    <view v-if="pageType === 1">
      <view>
        <lk-cell title="处理方式" field>
          <lk-radio-group
            v-model="default_refund_type"
            :active-color="theme.color"
          >
            <lk-radio :name="1">
              {{ refund_type === 2 ? "仅退款" : "退款" }}
            </lk-radio>
            <lk-radio
              :name="2"
              v-if="refund_type === 2 && info.goods_type != 3"
            >
              退货退款
            </lk-radio>
          </lk-radio-group>
        </lk-cell>
        <lk-cell-picker-group
          label="退款原因"
          v-model="reasonActive"
          placeholder="请选择退款原因"
          :columns="columns"
          range-key="text"
          @confirm="onPicker"
        />
		
		
        <lk-field
          v-if="info.refund_max_money > 0"
          label="退款金额"
          v-model="refund_require_money"
          type="number"
          clearable
		  disabled="true"
          :placeholder="'最多能退款¥' + info.refund_max_money"
        />
		
		<lk-field
		  v-if="info.refund_require_ptmoney > 0"
		  label="退回积分"
		  v-model="refund_require_ptmoney"
		  type="number"
		  clearable
		  disabled="true"
		/>
		
		
        <lk-field
          v-if="info.refund_point > 0"
          :label="'退' + memberTexts.point_style"
          disabled
          :value="info.refund_point"
        />
		
        <lk-field
          v-for="(bi1, b1) in refundPaymentType"
          :key="b1"
          :label="'退款' + bi1.symbol"
          disabled
          :value="bi1.refund_symbol_max_money"
        />
		
        <lk-field
          label="手续费"
          v-if="info.refund_symbol_charge"
          disabled
          :value="info.refund_symbol_charge"
        />
        <lk-field
          v-for="(bi2, b2) in refundPaymentType"
          :key="bi2.key2"
          label="实际到账"
          disabled
          :value="bi2.refund_symbol_money"
        />
      </view>
      <view class="tip-text" v-if="blockchainText">{{ blockchainText }}</view>
      <view class="foot-btn-group">
        <lk-wx-open-subscribe node_id="14" @success="success">
          <view slot="btn-subscribe">
            <lk-button
              block
              round
              type="danger"
              theme-color
              :disabled="isDisabledRefundBtn"
              :loading="isLoading"
              @click="onSubmit"
            >
              {{ refundBtnText }}
            </lk-button>
          </view>
        </lk-wx-open-subscribe>
      </view>
    </view>
    <view v-else-if="pageType === 2">
      <view v-if="info.refund_status === 1">
        <view>
          <lk-field
            label="处理方式"
            disabled
            :value="info.refund_type === 2 ? '退货退款' : '退款'"
          />
          <lk-field
            label="退款原因"
            disabled
            :value="info.refund_reason ? refund_reason_text : reasonText"
          />
          <lk-field
            v-if="info.require_refund_money > 0"
            label="退款金额"
            disabled
            :value="(info.require_refund_money || refund_require_money) | yuan"
          />
		  <lk-field
		    v-if="info.refund_require_ptmoney > 0"
		    label="退回积分"
		    disabled
		    :value="(info.refund_require_ptmoney || refund_require_ptmoney) "
		  />
		  
		  
          <lk-field
            v-if="info.refund_point > 0"
            :label="'退' + memberTexts.point_style"
            disabled
            :value="info.refund_point"
          />
          <lk-field
            v-for="(bi1, b1) in refundPaymentType"
            :key="b1"
            :label="'退款' + bi1.symbol"
            disabled
            :value="bi1.refund_symbol_max_money"
          />
          <lk-field
            label="手续费"
            v-if="info.refund_symbol_charge"
            disabled
            :value="info.refund_symbol_charge"
          />
          <lk-field
            v-for="(bi2, b2) in refundPaymentType"
            :key="bi2.key2"
            label="实际到账"
            disabled
            :value="bi2.refund_symbol_money"
          />
        </view>
        <view class="foot-btn-group">
          <lk-button
            block
            round
            type="danger"
            theme-color
            :loading="isLoading"
            @click="onCancel"
            >取消{{ info.refund_type === 2 ? "退货退款" : "退款" }}</lk-button
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { APPLY_REFUNDASK, CANCEL_REFUNDASK } from "@/common/interface/order";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      refund_require_money: null,
	  refund_require_ptmoney:0,
      reasonActive: -1,
      reasonText: "",
      reason_id: "",

      isLoading: false,

      default_refund_type: 1,
      columns: [
        {
          text: "拍错/多拍/不想要",
          id: 1
        },
        {
          text: "协商一致退款/退货",
          id: 2
        },
        {
          text: "缺货",
          id: 3
        },
        {
          text: "未按约定时间发货",
          id: 4
        },
        {
          text: "其他",
          id: 5
        }
      ]
    };
  },
  props: {
    pageType: {
      type: Number
    },
    info: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    }),
    refund_type() {
      const order_status = this.info.order_status;
      this.refund_require_money = this.info.refund_max_money;
	  this.refund_require_ptmoney = this.info.refund_require_ptmoney;
      let delivery_num = this.info.goods_list[0].delivery_num;
      return order_status == 2 ||
        order_status == 3 ||
        order_status == 4 ||
        (order_status == 0 && delivery_num)
        ? 2
        : 1;
    },
    // 退款退货原因
    refund_reason_text() {
      const obj = this.columns.filter(e => {
        return e.id == this.info.refund_reason;
      })[0];
      return obj ? obj.text : "";
    },
    refundPaymentType() {
      let syArr = this.info.symbol_data || [];
      let arr = [];
      syArr.forEach((e, i) => {
        e.key2 = `${e.symbol}_${i}`;
        arr.push(e);
      });
      return arr;
    },
    blockchainText() {
      return this.refundPaymentType.length
        ? "由于行情不断更新，实际到账金额可能会有细小偏差"
        : "";
    },
    isDisabledRefundBtn() {
      if (this.refundPaymentType.length && this.info.refund_symbol_status) {
        return true;
      }
      return false;
    },
    refundBtnText() {
      if (this.refundPaymentType.length && this.info.refund_symbol_status) {
        return "退款金额为0,无法申请退款";
      }
      return "提交";
    }
  },
  methods: {
    ...mapActions(["setSubscribe"]),

    success() {
      this.onSubmit();
    },

    onPicker(index) {
      this.reasonActive = index;
      this.reasonText = this.columns[index].text;
      this.reason_id = this.columns[index].id;
    },
    onSubmit() {
      const info = this.info;
      if (!this.reason_id) {
        this.$Prompt.toast("请选择退款原因！");
        return false;
      }
      if (parseFloat(info.refund_max_money) > 0) {
        if (this.refund_require_money == null) {
          this.$Prompt.toast("退款金额不能为空！");
          return false;
        }
        if (this.refund_require_money > info.refund_max_money) {
          this.$Prompt.toast("退款金额不能超过最大退款金额！");
          return false;
        }
        if (this.refund_require_money < 0) {
          this.$Prompt.toast("退款金额不能小于0！");
          return false;
        }
      } else {
        this.refund_require_money = 0;
      }
      let order_goods_id = [];
      info.goods_list.forEach(e => {
        order_goods_id.push(e.order_goods_id);
      });
      const params = {};
      params.order_id = info.order_id;
      params.order_goods_id = order_goods_id;
      params.refund_type = this.default_refund_type;
      params.refund_require_money = this.refund_require_money;
      params.refund_reason = this.reason_id;
      // return console.log(params);
      this.isLoading = true;
      APPLY_REFUNDASK(params)
        .then(res => {
          this.setSubscribe({ node_id: 14 }).then(() => {
            this.$emit("init-data");
            this.isLoading = false;
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    onCancel() {
      const info = this.info;
      const msgText = info.refund_type === 2 ? "退货" : "退款";
      this.$Prompt
        .modal({
          content: `确认取消${msgText}吗？`
        })
        .then(() => {
          let order_goods_id = [];
          info.goods_list.forEach(e => {
            order_goods_id.push(e.order_goods_id);
          });
          const params = {};
          params.order_id = info.order_id;
          params.order_goods_id = order_goods_id;
          // return console.log(params);
          this.isLoading = true;
          CANCEL_REFUNDASK(params)
            .then(res => {
              this.$Prompt
                .toast({ title: "取消成功", icon: "success" })
                .then(() => {
                  this.$Navigate.replace("/pages/order/list");
                });
            })
            .catch(() => {
              this.isLoading = false;
            });
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.tip-text {
  margin: 20rpx 30rpx;
  font-size: $font-size-sm;
  color: $red;
}
</style>
