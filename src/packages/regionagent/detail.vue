<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="cell-group card-group-box">
      <view class="header-box">
        <view>{{ distributeTexts.withdrawable_commission }}（元）</view>
        <view class="panel">
          <view class="price-color first-letter">
            {{ commission | yuan }}
          </view>
          <lk-button size="small" round to="/packages/agent/log">
            查看明细
          </lk-button>
        </view>
      </view>
    </view>
    <view class="cell-group card-group-box">
      <lk-cell
        center
        :title="distributeTexts.total_commission"
        :label="'累计获得' + distributeTexts.commission"
      >
        <view class="price-color first-letter">{{ total_money | yuan }}</view>
      </lk-cell>
      <lk-cell
        center
        :title="distributeTexts.withdrawals_commission"
        :label="'提现成功的' + distributeTexts.commission"
      >
        <view class="price-color first-letter">
          {{ withdrawals | yuan }}
        </view>
      </lk-cell>
      <lk-cell
        center
        :title="distributeTexts.frozen_commission"
        :label="'待发放的' + distributeTexts.commission"
      >
        <view class="price-color first-letter">
          {{ freezing_commission | yuan }}
        </view>
      </lk-cell>
      <lk-cell
        center
        :title="distributeTexts.withdrawal"
        :label="'提现中的' + distributeTexts.commission"
      >
        <view class="price-color first-letter">
          {{ apply_withdraw | yuan }}
        </view>
      </lk-cell>
    </view>

    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="isDisabled"
        to="/packages/agent/withdraw"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_ASSETBALANCE } from "@/common/interface/property";
import { mapState } from "vuex";
import { GET_COMMISSIONDETAIL } from "@/common/interface/agent";
export default {
  name: "packages-agent-detail",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      commission: 0,
      total_money: 0,
      withdrawals: 0,
      apply_withdraw: 0,
      freezing_commission: 0
    };
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts,
      memberTexts: ({ member }) => member.texts
    }),
    isDisabled() {
      return this.commission <= 0;
    },
    btnText() {
      return this.commission <= 0
        ? "提现" + this.distributeTexts.commission + "为0，不可提现"
        : "提现";
    }
  },
  onLoad() {
    GET_COMMISSIONDETAIL()
      .then(({ data }) => {
        this.commission = parseFloat(data.commission);
        this.total_money = data.total_money;
        this.withdrawals = data.withdrawals;
        this.apply_withdraw = data.apply_withdraw;
        this.freezing_commission = data.freezing_commission;
      })
      .catch(() => {});
  },
  onShow() {
    this.pageStyle.title = this.distributeTexts.commission + "详情";
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
</style>
