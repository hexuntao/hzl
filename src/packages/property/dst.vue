<template>
  <page-meta
    :background-color="pageStyle.background"
    :page-style="'background:' + pageStyle.background"
  >
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <!-- #ifndef H5 -->
    <lk-navbar
      immersive
      :title-color="nbStyle.color"
      :back-icon-color="nbStyle.color"
      :title="pageStyle.title"
      :background="{ background: nbStyle.background }"
    />
    <!-- #endif -->
    <view class="w-bg"></view>
    <view class="data-panel-box">
      <view class="title-money">DST价格：{{ money }}元/个</view>
      <view class="panel">
        <view class="item">
          <view class="title">总资产(个)</view>
          <view class="text">{{ accountInfo.store_money }}</view>
        </view>
        <view class="item">
          <view class="title">总资产(元)</view>
          <view class="text">{{ accountInfo.store_money_m }}</view>
        </view>
        <view class="item">
          <view class="title">可用资产(个)</view>
          <view class="text">{{ accountInfo.berelease_store_money }}</view>
        </view>
        <view class="item">
          <view class="title">可用资产(元)</view>
          <view class="text">{{ accountInfo.berelease_store_money_m }}</view>
        </view>
        <view class="item">
          <view class="title">待释放(个)</view>
          <view class="text">{{ accountInfo.freezing_store_money }}</view>
        </view>
        <view class="item">
          <view class="title">待释放(元)</view>
          <view class="text">{{ accountInfo.freezing_store_money_m }}</view>
        </view>
      </view>
      <view class="foot">
        <lk-button
          block
          :color="theme.color"
          to="/packages/property/transfer?account_type=9"
          >资产过户</lk-button
        >
        <text class="tip-text" @click="toLog">我的账户信息</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import navbarStyle from '@/mixins/navbar-style';
import {
  GET_ASSETACCOUNT,
  GET_ASSETACCOUNTBUT,
} from '@/common/interface/property';

const toNumber = e => {
  return parseFloat(e);
};
export default {
  data() {
    return {
      pageStyle: {
        background: '',
        title: '',
      },
      money: 0,
      accountInfo: {
        store_money: 0,
        store_money_m: 0,
        berelease_store_money: 0,
        berelease_store_money_m: 0,
        freezing_store_money: 0,
        freezing_store_money_m: 0,
      },
      items: [
        {
          title: '可用资产(个)',
          text: '',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
        {
          title: '总用资产(元)',
          text: '0',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
        {
          title: '释放中(个)',
          text: '0',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
        {
          title: '释放中价格(元)',
          text: '0',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
        // {
        //   title: '已释放(个)',
        //   text: '0',
        //   titleColor: '#666',
        //   textColor: '#333',
        //   textStyle: {
        //     fontSize: '16px',
        //   },
        // },
        // {
        //   title: '已释放价格(元)',
        //   text: '0',
        //   titleColor: '#666',
        //   textColor: '#333',
        //   textStyle: {
        //     fontSize: '16px',
        //   },
        // },
        {
          title: '待释放(个)',
          text: '0',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
        {
          title: '待释放价格(元)',
          text: '0',
          titleColor: '#666',
          textColor: '#333',
          textStyle: {
            fontSize: '16px',
          },
        },
      ],
    };
  },
  mixins: [navbarStyle],
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
    }),
  },
  onLoad() {
    this.getInfo();
  },
  onShow() {},
  methods: {
    toLog() {
      this.$Navigate.push('/packages/property/dst/log');
    },
    getInfo() {
      GET_ASSETACCOUNTBUT({ account_type: '9' })
        .then(({ data }) => {
          if (data.data) {
            const info = data.data.accountInfo;
            if (info) {
              this.money = toNumber(info.dst_price);
              // this.items[0].text = toNumber(info.store_money);
              // this.items[1].text = toNumber(info.store_money_m);
              // this.items[2].text = toNumber(info.berelease_store_money);
              // this.items[3].text = toNumber(info.berelease_store_money_m);
              // this.items[4].text = toNumber(info.freezing_store_money);
              // this.items[5].text = toNumber(info.freezing_store_money_m);
              this.accountInfo.store_money = toNumber(info.store_money);
              this.accountInfo.store_money_m = toNumber(info.store_money_m);
              this.accountInfo.berelease_store_money = toNumber(
                info.berelease_store_money
              );
              this.accountInfo.berelease_store_money_m = toNumber(
                info.berelease_store_money_m
              );
              this.accountInfo.freezing_store_money = toNumber(
                info.freezing_store_money
              );
              this.accountInfo.freezing_store_money_m = toNumber(
                info.freezing_store_money_m
              );
            }
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.w-bg {
  width: 260%;
  height: 2000rpx;
  background: rgb(13, 160, 254);
  border-radius: 2000rpx;
  position: fixed;
  top: -1720rpx;
  left: 50%;
  transform: translateX(-50%);
}
.title-money {
  font-weight: 700;
  font-size: 36rpx;
  text-align: center;
  padding-top: 40rpx;
}
.data-panel-box {
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  background: #fff;
  margin: 40rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  margin-top: 80rpx;
}
.tip-text {
  color: $text-gray;
  font-size: $font-size-sm;
}
.panel {
  display: flex;
  flex-wrap: wrap;
  padding: 40rpx 0;
  .item {
    width: 50%;
    padding: 20rpx 0;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    text-align: center;
    .title {
      color: $text-gray;
    }
    .text {
      font-size: $font-size-lg;
      font-weight: 700;
    }
  }
}

.foot {
  /* display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center; */
  /* gap: 40rpx; */
  text-align: center;
  padding: 0px 60rpx 50rpx;
  .tip-text {
    padding-top: 32rpx;
    display: block;
  }
}
</style>
