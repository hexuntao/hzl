<template>
  <view class="cell-group">
    <view >
      <view>
        <lk-cell title="处理方式" field>
          <lk-radio-group
              v-model="default_refund_type"
              :active-color="theme.color"
          >
            <lk-radio :name="1">
              申请回购
            </lk-radio>
          </lk-radio-group>
        </lk-cell>



        <lk-field
            label="商品金额"

            :value="info.refund_max_money"
        />

        <lk-field
            label="回购手续费"

            :value="info.hg_refund_max_radis"
        />


        <lk-field
            label="回购金额"
            :value="info.hg_refund_max_money"
            clearable

        />
      </view>

      <view class="foot-btn-group">
        <lk-wx-open-subscribe node_id="14" @success="success">
          <view slot="btn-subscribe">
            <lk-button
                block
                round
                type="danger"
                theme-color
				v-if="huigou_status!=2"
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
  </view>
</template>

<script>
import { APPLY_REFUNDASK, CANCEL_REFUNDASK,APPLY_HG } from "@/common/interface/order";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      refund_require_money: null,
      reasonActive: -1,
      reasonText: "",
      reason_id: "",

      isLoading: false,

      default_refund_type: 1
    };
  },
  props: {
    pageType: {
      type: Number
    },
    huigou_status: {
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
    isDisabledRefundBtn() {
      if (this.huigou_status==1  || this.huigou_status==4  ) {
        return true;
      }
      return false;
    },
    refundBtnText() {
		console.log('abcdefg');
		console.log(this.huigou_status);
		console.log('abcdefg');
		
      if(this.huigou_status==0){
        return "立即提交";
      }else if(this.huigou_status==1){
        return "审核中...";
      }else if(this.huigou_status==2){
        //等待回寄
      }else if(this.huigou_status==3){
        return "重新申请";
      }else if(this.huigou_status==4){
        return "等待签收";
      }else if(this.huigou_status==5){
        return "已完成";
      }else if(this.huigou_status==6){
        return "重新申请";
      }
    }
  },
  methods: {
    ...mapActions(["setSubscribe"]),
    success() {
      this.onSubmit();
    },
    onSubmit() {
      const info = this.info;
      let order_goods_id = [];
      info.goods_list.forEach(e => {
        order_goods_id.push(e.order_goods_id);
      });
      const params = {};
      params.order_id = info.order_id;
      params.order_goods_id = order_goods_id;
      this.isLoading = true;
      APPLY_HG(params)
        .then(res => {
          this.setSubscribe({ node_id: 14 }).then(() => {
            this.$emit("init-data");
            this.isLoading = false;
          });
        })
        .catch(() => {
          this.isLoading = false;
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
