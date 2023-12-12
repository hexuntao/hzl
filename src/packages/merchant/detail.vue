<template>
  <view class="pages">
    <view class="head">
      <view>
        <view class="withdrawname">可提现佣金</view>
        <view class="withdrawcount">{{merchantdetail.bonus}}</view>
      </view>
      <view class="detail" @click="godetail('/packages/merchant/log')">
        <lk-icon name="v-icon-menu1" color="#2c9cf0" class-prefix="v-icon" size="10" />
        <text class="detailname">明细</text>
      </view>
    </view>
    <view class="detailinfo">
      <view v-for="(item,index) in detaildata" :key="index" class="detailinfoitem">
        <view>
          <view>{{item.title}}</view>
          <view class="amount">{{item.amount}}</view>
          <view class="name">{{item.name}}</view>
        </view>
      </view>
    </view>
    <view class="btn-group">
      <lk-button size="normal" block round :color="theme.color" class="btn" to='/packages/merchant/withdraw'>提现</lk-button>
    </view>
  </view>
</template>
<script>
import { GET_WAPGETACHIEVEMENTDETAIL } from "@/common/interface/merchants";
export default {
  name: "packages-merchant-detail",
  data() {
    return {
      merchantdetail: {},
    };
  },
  computed: {
    detaildata() {
      const arr = [
        {
          title: "累计佣金",
          amount: this.merchantdetail.total_bonus,
          name: "累计获得佣金",
        },
        {
          title: "已提现佣金",
          amount: this.merchantdetail.withdrawals,
          name: "提现成功的佣金",
        },
        {
          title: "冻结佣金",
          amount: this.merchantdetail.freezing_bonus,
          name: "待发放的佣金",
        },
        {
          title: "提现中",
          amount: this.merchantdetail.withdrawals_in,
          name: "提现中的佣金",
        },
      ];
      return arr;
    },
  },
  onLoad() {
    this.chantdetail();
  },
  methods: {
    chantdetail() {
      GET_WAPGETACHIEVEMENTDETAIL().then(({ data }) => {
        this.merchantdetail = data;
      });
    },
    godetail(e) {
      this.$Navigate.push(e);
    },
  }
};
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  height: 240rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  background-color: #fff;
  .withdrawname{
    font-size: 34rpx;
  }
  .withdrawcount {
    font-size: 40rpx;
    font-weight: 600;
    padding-top: 10rpx;
  }
  .detail {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    .detailname {
      color: #2c9cf0;
    }
  }
}
.detailinfo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 2rpx solid #f5f5f5;
  height: 400rpx;
  background-color: #fff;
  .detailinfoitem {
    width: 350rpx;
    height: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2rpx solid #f5f5f5;
    border-top: none;
    &:nth-child(2n-1) {
      border-left: none;
    }
    &:nth-child(2n) {
      border-right: none;
      border-left: none;
    }
    .amount {
      padding: 8rpx 0;
    }
    .name {
      color: #c6cbd6;
    }
  }
}
/deep/.btn {
  width: 90%;
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
}
</style>
