<template>
  <view class="pages">
    <!-- <lk-cell field :title="'余额'">
	    <view class="price-color ">{{ can_use_money }}</view>
	  </lk-cell> -->

    <lk-cell-account
      :accounttype="params.account_type"
      @select="onAccount"
      handletype="is_recharge"
      ref="popup"
    />

    <view>
      <lk-field
        v-model="params.recharge_money"
        label="充值金额"
        type="digit"
        placeholder="请输入充值金额"
      />
    </view>

    <view class="cell-group" style="margin-top: 20rpx">
      <lk-cell title="充值明细" to="/packages/property/rechargelog" is-link />
    </view>

    <view class="foot-btn-group">
      <lk-wx-open-subscribe node_id="16" @success="success">
        <view slot="btn-subscribe">
          <lk-button
            block
            round
            type="danger"
            theme-color
            :loading="isLoading"
            @click="onRecharge"
          >
            充值
          </lk-button>
        </view>
      </lk-wx-open-subscribe>
    </view>
  </view>
</template>

<script>
import {
  RECHARGE_ASSETBALANCELOG,
  CREATE_ASSETRECHARORDER,
} from '@/common/interface/property';
import { mapActions } from 'vuex';

export default {
  name: 'packages-property-recharge',
  data() {
    return {
      isLoading: false,
      isProceeds: false, //货款充值

      can_use_money: 0,
      recharge_cash_min: 0,

      params: {
        account_type: '',
        store_id: 0,
        recharge_money: '',
      },
    };
  },
  computed: {},
  onLoad(query) {
    this.params.account_type = query.account_type;
    this.params.store_id = query.store_id;

    this.$refs.popup.getAccountList();
    this.isProceeds = query.hash === 'proceeds';
  },
  methods: {
    ...mapActions(['setSubscribe']),

    onAccount(item) {
      this.params.account_type = item.id;
      this.recharge_cash_min = parseFloat(item.recharge_min);
      this.can_use_money = item.can_use_money;
    },

    success() {
      this.onRecharge();
    },

    onRecharge() {
      const value = this.params.recharge_money;

      if (isNaN(parseFloat(value))) {
        this.$Prompt.toast('请输入充值金额！');
        return false;
      }
      if (value <= 0) {
        this.$Prompt.toast('充值金额不能低于0！');
        return false;
      }
      this.isLoading = true;
      CREATE_ASSETRECHARORDER(this.params)
        .then(res => {
          // 发送订阅消息
          this.setSubscribe({ node_id: 16 }).then(() => {
            this.$Navigate
              .push({
                path: '/pay/payment',
                query: {
                  out_trade_no: res.data.out_trade_no,
                  hash: 'recharge',
                },
              })
              .then(() => {
                this.isLoading = false;
              });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
