<template>
  <view class="pages">
    <view>
      <lk-cell field :title="'可提现' + texts.commission">
        <view class="price-color">{{ commission | yuan }}</view>
      </lk-cell>
      <lk-cell field title="提现方式">
        <lk-radio-group v-model="active" :active-color="theme.color">
          <lk-radio
            :name="index"
            v-for="(item, index) in typeList"
            :key="index"
          >
            {{ item.text }}
          </lk-radio>
        </lk-radio-group>
      </lk-cell>
      <view v-show="showAuccount">
        <lk-cell-withdraw-account-popup
          :account-id="params.account_id"
          :withdraw-type="withdrawType"
          @select="onSelectAccount"
        />
      </view>
      <lk-field
        label="提现金额"
        type="digit"
        placeholder="请输入提现金额"
        v-model="params.cash"
      />
    </view>
    <view class="cell-group">
      <lk-cell title="提现明细" to="/packages/distribute/log" is-link />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="16"
      :money="payMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="isDisabled"
        :loading="isLoading"
        @click="onWithdraw"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import {
  GET_WITHDRAWINFO,
  APPLY_WITHDRAW
} from "@/common/interface/agent";
export default {
  name: "packages-agent-withdraw",
  data() {
    return {
      commission: 0,
      withdrawals_min: 0,

      active: 0,

      params: {
        cash: "",
        account_id: "",
        password: ""
      },

      withdrawType: [],

      isLoading: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
      texts: ({ distribute }) => distribute.texts
    }),
    navbarTitle() {
      const { commission } = this.texts;
      let title = commission + "提现";
      return title;
    },
    showAuccount() {
      const flag = this.typeList[this.active]
        ? this.typeList[this.active].showAuccount
        : false;
      // 余额提现account_id为-1
      this.params.account_id = !flag ? "-1" : "";
      return flag;
    },
    typeList() {
      const withdrawTypeArr = this.withdrawType || [];
      const arr = [];
      if (withdrawTypeArr.some(e => e == 5)) {
        arr.push({
          showAuccount: false,
          text: this.memberTexts.balance_style
        });
      }
      if (withdrawTypeArr.some(e => e == 1 || e == 2 || e == 3 || e == 4)) {
        arr.push({
          showAuccount: true,
          text: "第三方"
        });
      }
      return arr;
    },
    isDisabled() {
      return this.commission <= 0;
    },
    btnText() {
      return this.commission <= 0 ? "提现金额为0，不可提现" : "提现";
    },
    payMoney() {
      let money = null;
      this.params.cash && (money = parseFloat(this.params.cash));
      return money;
    }
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_WITHDRAWINFO()
        .then(({ data }) => {
          if (data.is_datum == 2) {
            this.$Prompt.toast("请先完善资料！").then(() => {
              this.$Navigate.push("/packages/agent/apply?hash=replenish");
            });
          } else {
            this.commission = parseFloat(data.commission);
            this.withdrawals_min = data.withdrawals_min
              ? parseFloat(data.withdrawals_min)
              : 0;
            this.withdrawType = data.withdrawals_type;
          }
        })
        .catch(() => {});
    },
    // 获取选中账户id
    onSelectAccount({ id, type }) {
      // 微信提现account_id为-2
      this.params.account_id = type == 2 ? "-2" : id;
    },
    // 获取支付密码
    onPayPassword(password) {
      this.params.password = password;
      this.onWithdraw();
    },
    onWithdraw() {
      const $this = this;
      if (!$this.params.account_id && this.showAuccount) {
        $this.$Prompt.toast("请选择提现账户！");
        return false;
      }
      if (isNaN(parseFloat($this.params.cash))) {
        $this.$Prompt.toast("请输入提现金额！");
        return false;
      }
      if (parseFloat($this.params.cash) <= 0) {
        $this.$Prompt.toast("提现金额不能低于0！");
        return false;
      }
      if (parseFloat($this.params.cash) < $this.withdrawals_min) {
        $this.$Prompt.toast("提现金额不能低于最低提现额度！");
        return false;
      }
      if (parseFloat($this.params.cash) > $this.commission) {
        $this.$Prompt.toast("提现金额不可高于可提现金额！");
        return false;
      }
      // return console.log($this.params);
      $this.isLoading = true;
      $this
        .validPayPassword($this.params.password)
        .then(() => {
          APPLY_WITHDRAW($this.params)
            .then(({ message }) => {
              $this.$Prompt
                .toast({ title: message, icon: "success" })
                .then(() => {
                  $this.$Navigate.back();
                });
            })
            .catch(() => {
              $this.isLoading = false;
            });
        })
        .catch(() => {
          $this.isLoading = false;
          $this.params.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
</style>
