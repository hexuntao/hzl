<template>
  <view class="header" :style="{ background: theme.gradient }">
    <view class="shop-info">
<!--      <view class="logo">
        <view class="image">
          <image :src="info.shop_logo" />
        </view>
      </view>-->
      <view class="name">
        {{ info.shop_name || "" }}
      </view>
      <view class="time">
        {{ timeText }}
      </view>
    </view>
    <view class="item-card">
      <view class="coupon-info" :style="receiveColor">
        <view class="money">
          <view class="num" :class="moneyClass">
            {{ moneyText }}
          </view>
        </view>
        <view class="text">
          <view class="name">{{ info.coupon_name }}</view>
          <view class="discount-text">{{ discountText }}</view>
        </view>
        <view>
          <lk-button
            size="small"
            bing-mobile
            round
            :color="theme.gradient"
            :disabled="btnDisabled"
            :loading="isLoading"
            @click="onReceive"
          >
            {{ btnText }}
          </lk-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
import { RECEIVE_COUPON } from "@/common/interface/coupon";
function genreTxt({ coupon_genre, money, discount }) {
  let text = "";
  if (coupon_genre == 3) {
    text = parseFloat(discount) + "折";
  } else {
    text = yuan(money);
  }
  return text;
}
function genreClass({ coupon_genre, money, discount }) {
  let text = "";
  if (coupon_genre == 3) {
    text = "last-letter";
  } else {
    text = "first-letter";
  }
  return text;
}
export default {
  data() {
    return {
      isLoading: false,
      is_coupon: this.info.is_coupon
    };
  },
  props: {
    info: Object
  },
  computed: {
    moneyClass() {
      if (this.info) {
        return genreClass(this.info);
      }
    },
    moneyText() {
      if (this.info) {
        return genreTxt(this.info);
      }
    },
    discountText() {
      if (this.info.coupon_genre) {
        return this.info.coupon_genre == 1
          ? "无门槛"
          : `${parseFloat(this.info.at_least)}可用`;
      }
    },
    timeText() {
      if (this.info.start_time && this.info.end_time) {
        return `${formatDate(this.info.start_time)} ~ ${formatDate(
          this.info.end_time
        )}`;
      }
    },
    receiveColor() {
      let colors = "";
      if (!this.btnDisabled) {
        colors = "color:" + this.theme.color;
      }
      return colors;
    },
    btnDisabled() {
      let flag = false;
      if (
        this.info.is_coupon == 0 ||
        this.info.is_coupon == -1 ||
        this.info.is_coupon == -2 ||
        this.info.is_coupon == -3 ||
        this.info.is_coupon == -4
      ) {
        flag = true;
      }
      return flag;
    },
    btnText() {
      let text = "";
      if (this.info.is_coupon === 0) {
        text = "已领取";
      } else if (this.info.is_coupon > 0) {
        text = "立即领取";
      } else if (this.info.is_coupon == -1) {
        text = "未开始";
      } else if (this.info.is_coupon == -2) {
        text = "已过期";
      } else if (this.info.is_coupon == -3) {
        text = "赠送中";
      } else if (this.info.is_coupon == -4) {
        text = "已失效";
      }
      return text;
    }
  },
  methods: {
    onReceive() {
      let params = {
        coupon_type_id: this.info.coupon_type_id,
        get_type: 6 // 接口规定复制链接领取领取标识
      };
      if (this.info.coupon_id) {
        params = {
			coupon_type_id: this.info.coupon_type_id,
          coupon_id: this.info.coupon_id,
		  page_code:this.info.page_code_old,
		  coupon_time:this.info.coupon_time_old,
        };
      }
      this.isLoading = true;

      RECEIVE_COUPON(params, { isGive: !!this.info.coupon_id })
        .then(res => {
          this.isLoading = false;
          this.$Prompt.toast({ title: "领取成功", icon: "success" });
          this.$emit("success");
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: $cell-padding;
  .shop-info {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: #ffffff;
    line-height: 48rpx;
    .name {
      color: #ffffff;
    }
    .time {
      font-size: $font-size-sm;
    }
    .logo {
      width: 200rpx;
      border-radius: 16rpx;
      overflow: hidden;
      .image {
        padding-bottom: 56%;
        width: 100%;
        position: relative;
        image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: $image-background;
        }
      }
    }
  }
  .item-card {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 8rpx;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;
    position: relative;
    overflow: hidden;
    width: 100%;
    color: $text-gray;
  }

  .item-card::before {
    content: "";
    display: block;
    position: absolute;
    width: 32rpx;
    height: 32rpx;
    // background: rgb(255, 96, 52);
    border-radius: 50%;
    top: 50%;
    margin-top: -16rpx;
  }
  .item-card::after {
    content: "";
    display: block;
    position: absolute;
    width: 32rpx;
    height: 32rpx;
    // background: rgb(238, 10, 36);
    border-radius: 50%;
    top: 50%;
    margin-top: -16rpx;
  }

  .item-card::after {
    right: -16rpx;
  }

  .item-card::before {
    left: -16rpx;
  }

  .item-card .coupon-info {
    flex: 1;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    height: 100rpx;
    .money {
      max-width: 250rpx;
      min-width: 180rpx;
      text-align: center;
      .num {
        font-size: 60rpx;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900;
      }
      .first-letter::first-letter {
        display: block;
        font-size: 0.5em;
      }
    }
    .text {
      flex: 1;
      font-size: $font-size-sm;
      color: #ff9900;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
        font-size: $font-size;
        margin-bottom: 18rpx;
      }
    }
  }
}
</style>
