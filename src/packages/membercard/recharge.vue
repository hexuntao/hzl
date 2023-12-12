<template>
  <view class="pages">
    <rechargehead :info="info" />
    <view class="memberrecharge">
      <view class="card">会员卡充值</view>
      <view class="list" v-if="ishsow">
        <view
          v-for="(item,index) in info.recharge_list"
          :key="index"
          class="item"
          :class="indx==index?'choose':''"
          @click="choose(index)"
        >
          <view class="listitem">
            <view class="money">￥{{parseFloat(item.recharge_money)}}</view>
            <view class="money1">送￥{{parseFloat(item.give_money)}}</view>
          </view>
        </view>
      </view>
      <view v-if="!ishsow" class="input">
        <view class="inputmoney">￥</view>
        <input type="digit" placeholder="0.00" @input="onKeyInput" />
        <view class="givemoney" v-if="givemoney">
          <view>送</view>
          <view>￥{{givemoney}}</view>
        </view>
      </view>
      <view class="othermoney" @click="othermoney">{{isshowname}}</view>
      <view class="btn-group">
        <lk-button
          size="normal"
          block
          round
          :color="theme.gradient"
          class="btn"
          @click="onrecharge"
        >充值</lk-button>
        <lk-popup v-model="show" position="bottom" round closeable>
          <lk-pay-action-group :tlpay="false" @change="onPayTypeChange" />
          <lk-button
            size="normal"
            block
            :color="theme.color"
            class="btn"
            @click="onpay"
            :loading="isLoading"
          >确定</lk-button>
        </lk-popup>
      </view>
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :type="feeType"
      :money="payMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
  </view>
</template>
<script>
import {
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS,
} from "@/common/interface/pay";
import PAY from "../pay/pay";
import rechargehead from "./component/rechargehead";
import { GET_RECHARGE } from "@/common/interface/membercard";
import mixinPayPassword from "@/mixins/valid-pay-password";

export default {
  name: "packages-membercard-recharge",
  data() {
    return {
      isLoading: false,
      payType: "bpay",
      payMoney: "",
      feeType: 1,
      info: {},
      indx: null,
      show: false,
      ishsow: true,
      givemoney: "",
      paramsout_trade_no: null,
      params: {},
      out_trade_no: "", //订单号
      revenue: [],
      reward: [],
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    isshowname() {
      return this.ishsow == true ? "其他金额" : "固定金额";
    },
  },
  onShow() {
    this.infodata();
  },
  methods: {
    infodata() {
      GET_RECHARGE().then((res) => {
        this.info = res.data;
        this.paramsout_trade_no = res.data.out_trade_no;
        res.data.recharge_list.forEach((item) => {
          this.revenue.push(Number(item.recharge_money));
          this.reward.push(Number(item.give_money));
        });
      });
    },
    onKeyInput(event) {
      this.payMoney = event.target.value;
      const num = event.target.value;
      let list = this.revenue;
      function getindex(num) {
        for (var i = 0; i < list.length; i++) {
          if (i != list.length - 1) {
            if (num >= list[i] && num < list[i + 1]) {            
              return i;
            }
            if (num >= list[list.length - 1]) {           
              return list.length - 1;
            }
          }
          if (num < list[0]) {
            
            return null;
          }
          if (i!==0 &&i == list.length - 1) {
           
            return i - 1;
          }
          if(i==0&&list.length==1){
            return i
          }
        }
      }
      if (getindex(num) == null) {
        this.givemoney = "";
      } else {
        this.givemoney = this.reward[getindex(num)];
      }
    },
    othermoney() {
      this.ishsow = !this.ishsow;
      this.params = {};
      this.indx = null;
    },
    choose(index) {
      this.indx = index;
      this.params["recharge_id"] = this.info.recharge_list[index].id;
      this.payMoney = this.info.recharge_list[index].recharge_money;
    },
    onrecharge() {
      if (this.ishsow == true && this.indx == null) {
        this.$Prompt.toast("请选择充值类型");
        return false;
      }
      if (this.ishsow == false && !this.payMoney||this.payMoney==0||this.payMoney<0) {
        this.$Prompt.toast("请输入充值金额");
        return false;
      }
      if (this.ishsow == true) {
        this.params["out_trade_no"] = this.paramsout_trade_no;
      } else {
        this.params = {
          recharge_money: this.payMoney,
          give_money: this.givemoney,
          out_trade_no: this.paramsout_trade_no,
        };
      }
      this.$store
        .dispatch("membercardceeateorder", this.params)
        .then((out_trade_no) => {
          // this.out_trade_no = out_trade_no;
           this.$Navigate.replace({
          path: "/pay/membercard",
          query: { out_trade_no: out_trade_no },
        });
        });
      // this.show = true;
    },
    onpay() {
      //确定
      typeof this[this.payType + "Fn"] === "function" &&
        this[this.payType + "Fn"]();
    },
    onPayTypeChange(e) {
      this.payType = e;
    },
    onPayPassword(e) {
      this.password = e;
      this.onpay();
    },
    // 余额支付
    bpayFn() {
      if (Number(this.payMoney) >Number(this.$store.state.member.info.balance) ) {
        this.$Prompt.toast("余额不足！");
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.password)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.payMoney,
          };
          PAY_BALANCE(params).then((res) => {
            if (res.code == 0) {
              this.$Prompt.toast(res.message);
              this.password = "";
              this.isLoading = false;
              this.show = false;
              this.infodata();
            } else {
              this.isLoading = false;
            }
          });
        })
        .catch((error) => {
          this.isLoading = false;
          this.password = "";
        });
    },
    // 微信支付
    wechatFn() {
      let params = {
        out_trade_no: this.out_trade_no,
      };

      this.isLoading = true;
      PAY.WXPAY(params)
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
          } else {
            this.isLoading = false;
            this.infodata();
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 支付宝支付
    alipayFn() {
      let params = {
        out_trade_no: this.out_trade_no,
      };

      this.isLoading = true;
      PAY.ALIPAY(params)
        .then(() => {})
        .catch(() => {
          this.isLoading = false;
        });
    },
  },

  components: {
    rechargehead,
  },
};
</script>

<style lang="scss" scoped>
.memberrecharge {
  margin: 40rpx;
}
.card {
  font-weight: 600;
  font-size: 36rpx;
}
.list {
  width: 100%;
  display: flex;
  margin-top: 10rpx;
  overflow: auto;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 170rpx;
  width: 200rpx;
  border: 4rpx solid #e7e7e7;
  border-radius: 20rpx;
  margin-top: 20rpx;
  overflow: auto;
}
.money {
  font-size: 40rpx;
}
.money1 {
  font-size: 26rpx;
  text-align: center;
  color: #ff1717;
}
.othermoney {
  color: #42a6f1;
  margin-top: 40rpx;
  margin-bottom: 260rpx;
}
.choose {
  border-color: red;
}
.btn {
  margin-top: 20rpx;
}
.btn-group{
  padding-bottom: 30rpx;
}
.input {
  height: 170rpx;
  width: 90%;
  border-bottom: 2rpx solid #7f7f7f;
  display: flex;
  margin: 20rpx;

  .inputmoney {
    font-size: 40rpx;
    padding-top: 120rpx;
  }
  input {
    font-size: 50rpx;
    margin-top: 110rpx;
    font-weight: 600;
  }
}
.givemoney {
  display: flex;
  margin-top: 120rpx;
  color: #ff454e;
}
</style>
