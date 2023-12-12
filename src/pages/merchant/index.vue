<template>
  <view class="pages">
    <view class="userinfo" :style="{background: theme.gradient}">
      <view class="img">
        <view class="imgitem">
          <lk-avatar :src="info.user_headimg" size="large" />
          <view class="user_name">{{info.user_name}}</view>
        </view>
        <view class="level_name">等级:{{info.level_name?info.level_name:'默认等级'}}</view>
      </view>
    </view>
    <view class="bonus">
      <view>业绩奖金</view>
      <view>
        <lk-button size="mini" type="danger" to="/packages/merchant/withdraw">提现</lk-button>
        <lk-button size="mini" type="danger" class="btn" to="/packages/merchant/detail">详情</lk-button>
      </view>
    </view>

    <view class="withdraw">
      <view v-for="(item,index) in performance" :key="index" class="withdrawitem">
        <view>{{item.name}}</view>
        <view class="amount">{{item.amount}}</view>
      </view>
    </view>

    <lk-grid-panel
      card
      :cols="3"
      icon-prefix="v-icon"
      icon-size="30"
      :items="orderinfo"
      showBorder
      bordercolor="#f2f2f2"
      @click="gridpanel(e)"
    ></lk-grid-panel>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import {
  GET_MERCHANTSCENTER,
} from "@/common/interface/merchants";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "pages-merchant-index",
  data() {
    return {
      info: {},
      have_merchants_code: null,
      extend_code:''
    };
  },
  computed: {
    ...mapGetters(["static"]),
    performance() {
      const arr = [
        { name: "可提现", amount: this.info.bonus },
        { name: "冻结业绩", amount: this.info.freezing_bonus },
        { name: "累计业绩", amount: this.info.total_bonus },
      ];
      return arr;
    },
    orderinfo() {
      const arr = [
        {
          title: "业绩订单",
          icon: this.static.baseImgPath + "icons/money.png",
          to: "/packages/merchant/order",
        },
        {
          title: "推广的店铺",
          to: "/packages/merchant/shop",
          icon: this.static.baseImgPath + "icons/order.png",
        },
        {
          title: "招商码",
          to:`/packages/merchant/qrcode?is_merchants_department=${this.info.is_merchants_department}`,
          icon: this.static.baseImgPath + "icons/certify.png",
        },
      ];
      if(this.info.is_merchants_department==1){
        arr.push({
          title: "推广的招商员",
          to: "/packages/merchant/member",
          icon: this.static.baseImgPath + "icons/order.png", 
        })
      }
      return arr;
    },
  },
  onShow() {
    this.merchantscenter();
  },
  onLoad(query){
   if (query.extend_code) this.extend_code=query.extend_code
  },
  methods: {
    gridpanel(e) {
      console.log(e);
    },
    merchantscenter() {
      //招商中心
      GET_MERCHANTSCENTER().then(({ data }) => {
        this.info = data;
        
        if (data.is_merchants !== 2) {
          this.$Navigate.replace("/packages/merchant/apply?extend_code="+this.extend_code);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.userinfo {
  width: 100%;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .img {
    .imgitem {
      text-align: center;
      .user_name {
        color: #fff;
        padding-bottom: 10rpx;
      }
    }
    .level_name {
      color: #cccccc;
    }
  }
}

.bonus {
  background-color: #fff;
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn {
    margin-left: 10rpx;
  }
}
.withdraw {
  background-color: #fff;
  height: 120rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  border: 4rpx solid #f2f2f2;
  .withdrawitem {
    width: 33.3%;
    border-right: 2rpx solid #f2f2f2;
    padding-right: 10rpx;
    overflow: hidden;
    :last-child {
      border-right: none;
    }
  }
  .amount {
    padding-top: 10rpx;
  }
}
</style>









