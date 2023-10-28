<template>
  <view class="pages">
    <view>
      <!-- <lk-cell field :title="'可提现'">
        <view class="price-color ">{{ can_use_money }}</view>
      </lk-cell> -->
	  
	  
	  <lk-cell-account
	    :accounttype="params.account_type"
	    @select="onAccount"
		handletype="is_withdraw"
		
		ref="popup"
	  />
	  
      <lk-cell-withdraw-account-popup
        :account-id="params.bank_account_id"
        @select="onSelectAccount"
        :withdraw-type="withdrawType"
      />
	  
	
      <lk-field
        :label="'提现' + texts.balance_style"
        type="digit"
        :placeholder="'请输入提现' + texts.balance_style"
        v-model="params.cash"
      />
    </view>
	
	
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="2"
      :money="payMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
	
	<view class="cell-group" style="margin-top:20rpx;">
	  <lk-cell title="提现明细" to="/packages/property/withdrawlog" is-link />
	</view>

    <view class="foot-btn-group">
      <lk-wx-open-subscribe node_id="17" @success="success">
        <view slot="btn-subscribe">
          <lk-button
            block
            round
            type="danger"
            theme-color
            :loading="isLoading"
            @click="onWithdraw"
          >
            提现
          </lk-button>
        </view>
      </lk-wx-open-subscribe>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import {
  APPLY_ASSETWITHDRAW
} from "@/common/interface/property";
import { isWeixin } from "@/common/utils";
export default {
  name: "packages-property-withdraw",
  data() {
    return {
      templateIds: [], //公众号订阅通知
      can_use_money: 0,
      withdraw_cash_min: 0,



      params: {
		  account_type:"",
          bank_account_id: "",
          cash: "",
          type: null,
          password: ""
      },

      isLoading: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      texts: ({ member }) => member.texts,
      withdrawType: ({ config }) => config.withdraw_conf.withdraw_message
    }),
    isWeixinshow() {
      return isWeixin();
    },

    payMoney() {
      let money = null;
      this.params.cash && (money = parseFloat(this.params.cash));
      return money;
    }
  },

  onLoad(query) {
	this.params.account_type = query.account_type;

	this.$refs.popup.getAccountList();
  },
  methods: {
    ...mapActions(["setSubscribe"]),
	onAccount(item) {
	  this.params.account_type = item.id;
	  this.withdraw_cash_min = parseFloat(item.withdraw_min);
	  this.can_use_money = item.can_use_money; 
	},
	onSelectAccount(item) {
	  this.params.bank_account_id = item.id;
	  this.params.type = item.type;
	},
	

    success(e) {
      this.onWithdraw();
    },
    openSubscribeError(e) {
      console.log(e, "失败");
      const that = this;
      that.$Prompt.toast(JSON.stringify(e, "失败"));
    },
    onPayPassword(password) {
      this.params.password = password;
      this.onWithdraw();
    },
	
    onWithdraw() {
      const $this = this;
      if (!this.params.bank_account_id && this.params.type != 2) {
        this.$Prompt.toast("请选择提现账户！");
        return false;
      }
      if (isNaN(parseFloat(this.params.cash))) {
        this.$Prompt.toast("请输入提现金额！");
        return false;
      }

      this.isLoading = true;
      this.validPayPassword(this.params.password)
        .then(() => {
          APPLY_ASSETWITHDRAW({
            ...this.params,
            bank_account_id:this.params.type == 2 ? "" : this.params.bank_account_id
          })
            .then(({ message }) => {
              this.setSubscribe({ node_id: 17 }).then(() => {
                this.isLoading = false;
                this.$Prompt
                  .toast({ title: message, icon: "success" })
                  .then(() => {
                    setTimeout(function() {
					  this.$Navigate.push('/packages/property/withdrawlog')
                    }, 500);
                  });
              });
            })
            .catch(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.params.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
