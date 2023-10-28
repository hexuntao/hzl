<template>
  <view class="packtype">
    <view>
      当前等级：
      <text class="level_info">{{ level_name }}</text>
    </view>
    <view class="recharge" v-if="spec_list.length">
      <view
        class="recharge-item"
        v-for="(item, index) in spec_list"
        :key="index"
        @click="rechargeChange(index, item)"
        :class="active == index ? 'recharge-item-active' : ''"
      >
        <view class="recharge-item-price">
          <text class="recharge-item-price-text">{{
            item.grade_type_name
          }}</text>
        </view>
        <text class="recharge-item-duration">
          {{ item.price }}/
          <text class="firstletter"
            >{{ item.effective_time }}{{ timetype(item.granularity) }}</text
          >
        </text>
        <view class="recharge-item-price">
          <text class="recharge-item-price-text"
            >到期降至:{{ item.demotion_name }}</text
          >
        </view>
      </view>
    </view>
    <view class="no-recharge" v-if="chage_data.loaded && !spec_list.length">
      当前身份暂无可买等级！
    </view>
    <view
      v-if="spec_list.length"
      :class="chage_data.isShowBtn ? 'bottom-btn' : ''"
    >
      <view class="cell">
        <lk-checkbox-group active-color="#1f2553">
          <lk-checkbox v-model="checked">我已经阅读并同意</lk-checkbox>
        </lk-checkbox-group>
        <text class="text-link" @tap="onContract">《{{ content_title }}》</text>
      </view>
      <view class="btn-group">
        <lk-button
          size="normal"
          block
          round
          color="#1f2553"
          class="btn"
          :disabled="!checked"
          @click="dredge"
          >{{ chage_data.top ? "续费" : "立即开通" }}</lk-button
        >
      </view>
    </view>
    <lk-popup
      v-model="showContract"
      class="contract-popup"
      :title="content_title"
      round
    >
      <view class="contract">
        <lk-parser show-with-animation lazy-load v-html="content"></lk-parser>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import {
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS
} from "@/common/interface/pay";
import mixinPayPassword from "@/mixins/valid-pay-password";
import { CREATEPURCHASEORDER } from "@/common/interface/level";
import PAY from "../../pay/pay";
export default {
  props: {
    content_title: {},
    content: {},
    spec_list: {
      type: Array,
      default: () => []
    },
    level_name: [String, Number],
    chage_data: Object,
    tabindex: {}
  },
  data() {
    return {
      params: {
        set_meal_id: "",
        pay_grade_id: ""
      },
      active: -1,
      payType: "bpay",
      payMoney: "",
      feeType: 1,
      isLoading: false,
      checked: false,
      showContract: false,
      contractContent: "",
      show: false
    };
  },
  mixins: [mixinPayPassword],
  watch: {
    tabindex(e) {
      this.active = -1;
    }
  },
  computed: {
    showLevel() {
      let flag = false;
      return !!(this.spec_list.length && this.level_name);
    }
  },
  mounted() {},
  methods: {
    timetype(v) {
      if (v == 1) return "年";
      if (v == 2) return "季";
      if (v == 3) return "月";
    },
    rechargeChange(index, item) {
      this.params.set_meal_id = item.set_meal_id;
      this.params.pay_grade_id = this.chage_data.gradeId;
      this.active = index;
      this.payMoney = item.price;
    },
    onContract() {
      this.showContract = true;
    },
    dredge() {
      if (!this.params.set_meal_id) {
        this.$Prompt.toast("请选择套餐类型");
        return false;
      }
      this.isLoading = true;
      CREATEPURCHASEORDER(this.params).then(res => {
        this.out_trade_no = res.data.out_trade_no;
        this.$Navigate.push({
          path: "/pay/level",
          query: { out_trade_no: this.out_trade_no }
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.contract {
  width: 80vw;
}
.packtype {
  background-color: #fff;
  margin: 25rpx;
  border-radius: 30rpx;
  padding: 36rpx 24rpx 30rpx;
}
.firstletter {
  font-size: 20rpx;
}
.cell {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;
  margin: 20rpx 0;
}
.btn {
  width: 99%;
}
.recharge-item-active {
  border: 2rpx solid #ffc544 !important;
  background-color: #fdf5ef;
  color: #c68854 !important;
}

.recharge-item-duration {
  margin: 10rpx;
  font-weight: 600;
  font-size: 36rpx;
  width: 210rpx;
  text-align: left;
  padding: 0 10rpx;
}

.recharge {
  position: relative;
  margin-bottom: 35rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 35rpx;
  overflow-x: auto;
  width: auto;

  .recharge-tag {
    position: absolute;
    top: -2rpx;
    left: 0rpx;
    width: 140rpx;
    height: 36rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #ea693a, #e14140);
    border-top-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    color: #fff;
  }
  .recharge-item-price {
    width: 100%;
    text-align: left;
    padding: 0 10rpx;
  }
  .recharge-item-price-text {
    font-size: 24rpx;
  }
  .recharge-item {
    border: 2rpx solid #eee;
    position: relative;
    padding: 20rpx 0;
    margin-left: 15rpx;
    width: 224rpx;
    height: 190rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12rpx;
  }
}
.level_info {
  color: #ff3f30;
  font-weight: 600;
}
.text-link {
  color: #f0d7b9;
}
.bottom-btn {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 100;
  padding: 0 24rpx 30rpx;
}
.no-recharge {
  font-size: 32rpx;
  text-align: center;
  padding: 30rpx 0;
}
</style>
