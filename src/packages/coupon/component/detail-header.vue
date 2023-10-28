<template>
  <view class="header" :class="giveBtn.show ? 'show-give-btn' : ''">
    <view
      class="placeholder"
    ></view>
    <view class="header-card card-group-box" :style="{'background':infoBg}">
    <view class="lk-cell" @click="goShop">
      <view class="icons icons-shop-o lk-cell-left-icon shop-icon"></view>
      <view class="lk-cell-title">
      <view class="lk-cell-title-box">
        <text class="lk-cell-title-text">{{info.shop_name}}</text>
        <text class="lk-cell-title-right">进店</text></view>
      </view>
      <view class="icons icons-arrow lk-cell-right-icon"></view>
    </view>
    <view class="lk-cell">
      <view class="lk-cell-value">
        <view class="shop-tisp" >{{ info.coupon_name }}</view>
      <view class="shop-tisp" >以下商品可使用以下优惠</view>
      <view class="shop-coupon">
        <text class="tag coupon-tag" :style="tagStyles">
          店铺 | 优惠券
        </text>
        <text class="text">{{ couponName }}</text>
      </view>
      </view>
    </view>
    <view class="lk-cell">
      <view class="time">{{ timeText }}</view>
    </view>
    </view>
    <view class="btn-group" v-if="giveBtn.show">
      <lk-button
        block
        round
        theme-color
        open-type="share"
        @click="onGive"
      >
        {{ giveBtn.text }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
// #ifdef APP-PLUS
import getPoster from "@/common/utils/poster";
// #endif
export default {
  data() {
    return {
      infoBg: '',
      infoFont: '',
    };
  },
  props: {
    info: Object
  },
  computed: {
    couponName() {
      const info = this.info;
      if(this.theme.hasOwnProperty('gradient')!='') {
         this.infoBg = this.theme.gradient;
      }   
      let name = "";
      var money = parseFloat(info.money),
        at_least = parseFloat(info.at_least),
        discount = parseFloat(info.discount);
      if (info.coupon_genre == 1) {
        name = "无门槛" + money + "元";
      } else if (info.coupon_genre == 2) {
        name = "满" + at_least + "元减" + money + "元";
      } else if (info.coupon_genre == 3) {
        name = "满" + at_least + "元" + discount + "折";
      }
      return name;
    },
    timeText() {
      if (this.info.start_time && this.info.end_time) {
        return `有限期 ${formatDate(this.info.start_time)} ~ ${formatDate(
          this.info.end_time
        )}`;
      }
    },
    tagStyles() {
      return formatStyle({
        // color: this.theme.color,
        backgroundColor: this.theme.cart
      });
    },
    giveBtn() {

      console.log('2143789');
      console.log(this.shareParams.link);
      return {
        show: !!this.info.is_send_friend,
        text: "赠送好友",
        disabled: this.info.is_coupon == -3
      };
    }
  },
  methods: {
    onGive() {
      // #ifdef H5
      this.$Prompt.toast(
        this.$store.state.isWeixin
          ? "微信环境下点击右上角分享"
          : "手机浏览器点击底部工具栏分享"
      );
      // #endif

      // #ifdef APP-PLUS
      $Plugins.shareWithSystem({
        type: "text",
        summary: "赠送优惠券",
        href: this.shareParams.link
      });
      // #endif
    },
    goShop() {
     this.$Navigate.push({
        path: "/packages/shop/home",
        query: {
          shop_id:this.info.shop_id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 352rpx;
  position: relative;
}
.header.show-give-btn {
  height: auto;
}
.placeholder {
  width: 100%;
  z-index: 1;
  background: #ffffff;
}
.placeholder.show-give-btn {
  height: auto;
}
.header-card {
  z-index: 10;
}
.shop-coupon {
  display: flex;
  align-items: center;
  height: 48rpx;
  overflow: hidden;
  .tag {
    white-space: nowrap;
    margin-right: 10rpx;
    font-size: $font-size-sm;
    display: flex;
    align-items: center;
    line-height: normal;
    overflow: hidden;
    padding: 0.1em 0.6em;
    color: $white;
    background-color: #fae9e6;
  }

  .tag.coupon-tag {
    display: block;
    position: relative;
    border-radius: 8rpx;
  }

  .tag.coupon-tag::before {
    left: -10rpx;
  }

  .tag.coupon-tag::after {
    right: -10rpx;
  }
  .text {
    padding: 0 20rpx;
    color: $white;
  }
}
.btn-group {
  width: 100%;
  padding: 20rpx;
  z-index: 2;
}
.lk-cell {
  position: relative;
  display: flex;
  flex-flow: row;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 30rpx;
  overflow: hidden;
  color: $text-color;
  font-size: $font-size;
  line-height: 48rpx;
  color: $white;
  .lk-cell-value {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    color: $text-color;
    text-align: left;
  }
  .shop-tisp {
    color: $white;
  }
  .lk-cell-left-icon,
  .lk-cell-right-icon {
    min-width: 1em;
    display: flex;
    align-items: center;
    font-size: 38rpx;
  }
  .lk-cell-left-icon {
    margin-right: 10rpx;
  }
  .shop-icon {
    width: 48rpx;
    height: 48rpx;
  }
  .lk-cell-title {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  }
  .lk-cell-title-box {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
  }
  .lk-cell-title-text {
    flex: 1;
    font-size: $font-size;
  }
  .lk-cell-title-right {
    flex: none;
    color: $white;
    font-size: $font-size;
  }
}
.lk-cell:nth-of-type(2) {
  border-bottom: 2rpx dashed $white;
  padding: 0 30rpx 20rpx;
}
</style>
