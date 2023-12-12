<template>
  <view class="pages">
    <view>
      <!-- <lk-cell field :title="'余额'">
		  <view class="price-color ">{{ can_use_money }}</view>
		</lk-cell> -->

      <lk-cell-account
        :accounttype="params.account_type"
        @select="onAccount"
        handletype="is_transfer"
        ref="popup"
      />

      <lk-cell :title="paramText.typeText" field>
        <lk-radio-group
          v-model="type"
          :active-color="theme.color"
          @change="change"
        >
          <lk-radio :name="1">{{ paramText['1'].user }}</lk-radio>
          <lk-radio :name="2">{{ paramText['2'].user }}</lk-radio>
        </lk-radio-group>
      </lk-cell>
      <lk-field
        :label="paramText[type].user"
        type="number"
        v-model="params[paramText[type].name]"
        :placeholder="paramText[type].userPlaceholder"
        clearable
      />
      <lk-field
        :label="paramText.input"
        type="digit"
        v-model="params.money"
        :placeholder="paramText.inputPlaceholder"
        @input="onInput"
        clearable
      />
      <lk-field
        :label="paramText.remark"
        :placeholder="paramText.remarkPlaceholder"
        v-model="params.remark"
      />
    </view>

    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="3"
      :money="params.money"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />

    <view class="cell-group" style="margin-top: 20rpx">
      <lk-cell title="转账明细" to="/packages/property/transferlog" is-link />
    </view>

    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        :disabled="isDisabled"
        @click="onTransfer"
      >
        {{ pageTypeText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { TRANSFER_BALANCE } from '@/common/interface/property';
import { validMobile } from '@/common/utils/validator';
import { mapState, mapActions } from 'vuex';
import { yuan } from '@/common/utils';
import mixinPayPassword from '@/mixins/valid-pay-password';
export default {
  name: 'packages-property-transfer',
  data() {
    return {
      type: 1,
      params: {
        user_id: null,
        mobile: null,
        money: null,
        remark: null,
        account_type: '',
      },
      can_use_money: 0,
      transfer_cash_min: 0,
      isLoading: false,
      pageTypeText: '转账',
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts,
    }),
    isDisabled() {
      return !parseFloat(this.can_use_money);
    },
    paramText() {
      return {
        typeText: this.pageTypeText + '方式',
        usable: '可用',
        number: this.can_use_money,
        1: {
          name: 'user_id',
          user: '会员ID',
          userPlaceholder: '请输入收款人ID',
        },
        2: {
          name: 'mobile',
          user: '手机号码',
          userPlaceholder: '请输入会员手机号码',
        },
        input: this.pageTypeText,
        inputPlaceholder: '请输入' + this.pageTypeText,
        remark: '备注',
        remarkPlaceholder: '选填',
      };
    },
  },
  onLoad(query) {
    this.params.account_type = query.account_type;
    this.$refs.popup.getAccountList();
  },
  methods: {
    ...mapActions(['setSubscribe']),

    onAccount(item) {
      this.params.account_type = item.id;
      this.transfer_cash_min = parseFloat(item.transfer_min);
      this.can_use_money = item.can_use_money;
    },
    change(e) {
      if (e == 1) {
        this.params.mobile && delete this.params.mobile;
      } else {
        this.params.user_id && delete this.params.user_id;
      }
    },
    onInput(e) {
      let money = parseFloat(this.can_use_money);
      let value = parseFloat(e);
      value && value > money && (this.params.money = money);
    },
    onPayPassword(e) {
      this.password = e;
      this.onTransfer();
    },
    onTransfer() {
      if (this.type == 1 && !this.params.user_id) {
        this.$Prompt.toast(this.paramText[this.type].userPlaceholder);
        return false;
      }
      if (this.type == 2 && !validMobile(this.params.mobile)) {
        return false;
      }
      if (!this.params.money) {
        this.$Prompt.toast(this.paramText.inputPlaceholder);
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.password).then(() => {
        TRANSFER_BALANCE(this.params)
          .then(({ data }) => {
            this.setSubscribe({ type: 3 })
              .then(() => {
                this.$Prompt
                  .toast({
                    title: this.pageTypeText + '成功',
                    icon: 'success',
                  })
                  .then(() => {
                    this.$Navigate.push('/packages/property/transferlog');
                  });
              })
              .catch(() => {
                this.isLoading = false;
              });
          })
          .catch(() => {
            this.password = '';
            this.isLoading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
