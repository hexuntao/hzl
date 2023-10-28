<template>
  <view class="pages">
    <view>
		
		<!-- <lk-cell field :title="'余额'">
		  <view class="price-color ">{{ can_use_money }}</view>
		</lk-cell> -->
				
	
		<lk-cell-account
		  :accounttype="params.account_type"
		  @select="onAccount"
				handletype="is_change"
				ref="popup"
		/>
		
		<lk-cell field :title="'兑换账户'">
		  <view >{{ change_other_key_name }}</view>
		</lk-cell>
		

	  <lk-field
	    label="兑换数额"
	    type="digit"
	    placeholder="请输入兑换数额"
	    v-model="params.money"
		@input="onInput"
	  />

    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="4"
      :money="params.money"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
	
	<view class="cell-group" style="margin-top:20rpx;">
	  <lk-cell title="兑换明细" to="/packages/property/changelog" is-link />
	</view>
	
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        :disabled="isDisabled"
        @click="onExchange"
      >
        {{ pageTypeText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { EXCHANGE_BALANCE } from "@/common/interface/property";
import { validMobile } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
import { yuan } from "@/common/utils";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  name: "packages-property-exchange",
  data() {
    return {
      params: {
		account_type:"",
		money:"",
      },
	  change_other_key_name:'',
	  can_use_money: 0,
	  change_cash_min: 0,
      isLoading: false,
      pageTypeText: "兑换"
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      config: ({ config }) => config,
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts
    }),

    isDisabled() {
      return !parseFloat(this.can_use_money);
    },
    
  },
  onLoad(query) {
	  this.params.account_type = query.account_type;
	  this.$refs.popup.getAccountList();
  },
  methods: {
    ...mapActions(["setSubscribe"]),
	onAccount(item) {
	  this.params.account_type = item.id;
	  this.change_cash_min = parseFloat(item.change_min);
	  this.can_use_money = item.can_use_money; 
	  this.change_other_key_name = item.change_other_key_name;
	
	},

    onInput(e) {
      let money = parseFloat(this.can_use_money);
      let value = parseFloat(e);
      value && value > money && (this.params.money = money);
    },
    onPayPassword(e) {
      this.password = e;
      this.onExchange();
    },
    onExchange() {
      if (!this.params.money || this.params.money < 0) {
        return this.$Prompt.toast(
          '请输入数额'
        );
      }

      this.isLoading = true;
      this.validPayPassword(this.password).then(() => {
        EXCHANGE_BALANCE(this.params)
          .then(({ data }) => {
            this.setSubscribe({ type: 3 })
              .then(() => {
                this.$Prompt
                  .toast({
                    title: this.pageTypeText + "成功",
                    icon: "success"
                  })
                  .then(() => {
					  this.$Navigate.push('/packages/property/changelog')
                  });
              })
              .catch(() => {
                this.isLoading = false;
              });
          })
          .catch(() => {
            this.password = "";
            this.isLoading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
