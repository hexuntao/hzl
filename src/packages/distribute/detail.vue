<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="property-wrap">
      <view class="info" :style="{ background: infoBg }">
        <text class="text"
          >{{ distributeTexts.withdrawable_commission }}（元）</text
        >
        <view class="item">
          <view class="money">{{ commission }}</view>
          <view
            class="btn"
            @click="goPage('/packages/distribute/log')"
            :style="{ color: infoColor }"
            >查看明细</view
          >
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
      <view class="cell-group card-group-box card-groud-margin">
        <lk-cell
          center
          :title="distributeTexts.total_commission"
          :label="'累计获得' + distributeTexts.commission"
        >
          <view class="price-color first-letter">{{ total_money | yuan }}</view>
        </lk-cell>
        <lk-cell
          center
          :title="distributeTexts.withdrawals_commission"
          :label="'提现成功的' + distributeTexts.commission"
        >
          <view class="price-color first-letter">
            {{ withdrawals | yuan }}
          </view>
        </lk-cell>
        <lk-cell
          center
          :title="distributeTexts.frozen_commission"
          :label="'待发放的' + distributeTexts.commission"
        >
          <view class="price-color first-letter">
            {{ freezing_commission | yuan }}
          </view>
        </lk-cell>
        <lk-cell
          center
          :title="distributeTexts.withdrawal"
          :label="'提现中的' + distributeTexts.commission"
        >
          <view class="price-color first-letter">
            {{ apply_withdraw | yuan }}
          </view>
        </lk-cell>
      </view>

      <view class="foot-btn-group">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          :disabled="isDisabled"
          to="/packages/distribute/withdraw"
        >
          {{ btnText }}
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_ASSETBALANCE } from "@/common/interface/property";
import { mapState } from "vuex";
import { GET_COMMISSIONDETAIL } from "@/common/interface/distribute";
export default {
  name: "packages-distribute-detail",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      commission: 0,
      total_money: 0,
      withdrawals: 0,
      apply_withdraw: 0,
      freezing_commission: 0
    };
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts,
      memberTexts: ({ member }) => member.texts
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    isDisabled() {
      return this.commission <= 0;
    },
    btnText() {
      return this.commission <= 0
        ? "提现" + this.distributeTexts.commission + "为0，不可提现"
        : "提现";
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}balance_bg.png`;
    },
    infoBg() {
      return this.theme.gradient;
    },
    infoColor() {
      return this.theme.color;
    }
  },
  onLoad() {
    GET_COMMISSIONDETAIL()
      .then(({ data }) => {
        this.commission = parseFloat(data.commission);
        this.total_money = data.total_money;
        this.withdrawals = data.withdrawals;
        this.apply_withdraw = data.apply_withdraw;
        this.freezing_commission = data.freezing_commission;
      })
      .catch(() => {});
  },
  onShow() {
    this.pageStyle.title = this.distributeTexts.commission + "详情";
  },
  methods: {
    goPage(url) {
      this.$Navigate.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.property-wrap {
  padding: 26rpx;
}
.card-groud-margin {
  margin: 25rpx 0;
}
.info {
  width: 100%;
  height: 300rpx;
  border-radius: $border-radius-lg;
  position: relative;
  .text {
    padding: 74rpx 0 0 50rpx;
    font-size: 30rpx;
    color: $white;
    display: block;
  }
  .item {
    display: flex;
    padding: 52rpx 50rpx;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 100;
    .money {
      font-size: 80rpx;
      color: $white;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 1.2;
      max-width: 420rpx;
    }
    .btn {
      width: 170rpx;
      height: 66rpx;
      line-height: 66rpx;
      text-align: center;
      font-size: 30rpx;
      border-radius: 66rpx;
      background: #ffffff;
    }
  }
  .info-image {
    width: 100%;
    height: 300rpx;
    position: absolute;
    bottom: 0;
  }
}
.cell-group {
  .price-color {
    font-size: $font-size-lg;
  }
}
.header-box {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .panel {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
  }
  .price-color {
    font-weight: 800;
    font-size: 40rpx;
  }
}
</style>
