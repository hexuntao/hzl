<template>
  <view class="pages">
    <view class="cell-group card-group-box">
      <view class="header-box">
        <view>可用{{ balanceText }}</view>
        <view class="panel">
          <view class="price-color first-letter">
            {{ can_use_money | yuan }}
          </view>
          <lk-button size="small" round :to="logRoute">
            查看明细
          </lk-button>
        </view>
      </view>
    </view>
    <view class="cell-group card-group-box">
      <lk-cell center :title="'总' + balanceText" :label="balanceText + '总数'">
        <view class="price-color first-letter">{{ balance | yuan }}</view>
      </lk-cell>
      <lk-cell
        center
        :title="'冻结' + balanceText"
        :label="'已经冻结' + balanceText"
      >
        <view class="price-color first-letter">
          {{ freezing_balance | yuan }}
        </view>
      </lk-cell>
      <lk-cell center title="我的利润" label="全部利润收入">
        <view class="price-color first-letter">
          {{ my_profit | yuan }}
        </view>
      </lk-cell>
      <lk-cell center title="我的奖金" label="全部奖金收入">
        <view class="price-color first-letter">
          {{ my_bonus | yuan }}
        </view>
      </lk-cell>
    </view>

    <view class="foot-btn-group">
      <lk-button
        class="btn"
        block
        round
        type="danger"
        :color="theme.gradient"
        :to="rechargeRoute"
      >
        充值
      </lk-button>
      <lk-button
        v-if="isWithdraw"
        class="btn"
        block
        round
        type="danger"
        plain
        :disabled="disWithdraw"
        :color="theme.color"
        to="/packages/property/withdraw"
      >
        {{ withdrawBtnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import { mapState } from "vuex";
import { GET_FINANCEINFO } from "@/common/interface/channel";
export default {
  name: "packages-channel-finance",
  data() {
    return {
      is_use: 0,
      can_use_money: 0,
      balance: 0,
      freezing_balance: 0,
      my_profit: 0,
      my_bonus: 0,
      is_proceeds: false
    };
  },
  computed: {
    ...mapState({
      balanceText: ({ member }) => member.texts.balance_style
    }),
    isWithdraw() {
      return this.is_use && this.is_use == 1 && !this.is_proceeds;
    },
    disWithdraw() {
      return !(this.can_use_money && this.can_use_money > 0);
    },
    withdrawBtnText() {
      return this.disWithdraw
        ? "可用" + this.balanceText + "为0，不可提现"
        : "提现";
    },
    logRoute() {
      return this.is_proceeds
        ? "/packages/property/log/list?hash=proceeds"
        : "/packages/property/log/list";
    },
    rechargeRoute() {
      return this.is_proceeds
        ? "/packages/property/recharge?hash=proceeds"
        : "/packages/property/recharge";
    }
  },
  onLoad() {
    GET_FINANCEINFO().then(({ data }) => {
      this.is_use = data.is_use;
      this.can_use_money = data.can_use_money;
      this.balance = data.balance;
      this.freezing_balance = data.freezing_balance;
      this.my_profit = data.my_profit;
      this.my_bonus = data.my_bonus;
      this.is_proceeds = !!data.is_proceeds;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  .price-color {
    font-size: $font-size-lg;
  }
}
.header-box {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .panel {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
  }
  .price-color {
    font-weight: 800;
    font-size: 40rpx;
  }
}
.foot-btn-group {
  .btn {
    margin-top: 20rpx;
  }
  .btn:first-child {
    margin-top: 0;
  }
}
</style>
