<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <div class="card-group-box">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">{{ bonusTexts.common.withdrawals_bonus }}</text>
        <view class="item">
          <view class="money">{{ detail.grant_bonus | yuan }}</view>
          <view
            class="btn"
            @click="goPage('/packages/bonus/log')"
            :style="{ color: infoColor }"
            >{{ bonusTexts.common.bonus_details }}</view
          >
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
    </div>
    <view class="cell-group card-group-box card-groud-margin">
      <lk-cell center :title="bonusTexts.common.withdrawal_bonus">
        <view class="price-color first-letter">{{
          detail.ungrant_bonus | yuan
        }}</view>
      </lk-cell>
      <lk-cell center :title="bonusTexts.common.frozen_bonus">
        <view class="price-color first-letter">
          {{ detail.freezing_bonus | yuan }}
        </view>
      </lk-cell>
    </view>

    <view class="card-group-box">
      <lk-tabs
        v-if="tabs.length"
        v-model="active"
        :active-color="theme.color"
        :line-color="theme.color"
        :nav-per-view="tabs.length"
      >
        <lk-tab v-for="(item, index) in tabs" :key="index" :title="item.name">
          <view class="box-head">
            <view class="text-center">{{ item.text_grant_bonus }}</view>
            <text class="price-color  first-letter">
              {{ item.grant_bonus | yuan }}
            </text>
          </view>
          <lk-cell center :title="item.text_ungrant_bonus">
            <view class="price-color first-letter">{{
              item.ungrant_bonus | yuan
            }}</view>
          </lk-cell>
          <lk-cell center :title="item.text_freezing_bonus">
            <view class="price-color first-letter">
              {{ item.freezing_bonus | yuan }}
            </view>
          </lk-cell>
        </lk-tab>
      </lk-tabs>
    </view>
  </view>
</template>

<script>
import { yuan, isEmpty } from "@/common/utils";
import { GET_BONUSDETAIL } from "@/common/interface/bonus";
import { mapState } from "vuex";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-bonus-detail",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      active: 0,
      detail: {}
    };
  },
  mixins: [bonusMixin],
  onLoad() {
    GET_BONUSDETAIL()
      .then(({ data }) => {
        this.detail = data;
      })
      .catch(() => {});
  },
  onShow() {
    this.pageStyle.title = this.bonusTexts.common.bonus_money;
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      memberInfo: ({ member }) => member.info,
      bonusTexts: ({ bonus }) => bonus.texts
    }),
    tabs() {
      const detail = this.detail;
      const { globalbonus, areabonus, teambonus } = this.addons;
      const { is_global_agent, is_area_agent, is_team_agent } = this.memberInfo;
      const { area, global, team } = this.bonusTexts;
      let arr = [];
      if (!isEmpty(detail)) {
        if (globalbonus && is_global_agent == 2) {
          arr.push({
            name: global.global_agreement,
            grant_bonus: detail.global.grant_bonus,
            ungrant_bonus: detail.global.ungrant_bonus,
            freezing_bonus: detail.global.freezing_bonus,
            text_grant_bonus: global.withdrawals_global_bonus,
            text_ungrant_bonus: global.withdrawal_global_bonus,
            text_freezing_bonus: global.frozen_global_bonus
          });
        }
        if (areabonus && is_area_agent == 2) {
          arr.push({
            name: area.area_agreement,
            grant_bonus: detail.area.grant_bonus,
            ungrant_bonus: detail.area.ungrant_bonus,
            freezing_bonus: detail.area.freezing_bonus,
            text_grant_bonus: area.withdrawals_area_bonus,
            text_ungrant_bonus: area.withdrawal_area_bonus,
            text_freezing_bonus: area.frozen_area_bonus
          });
        }
        if (teambonus && is_team_agent == 2) {
          arr.push({
            name: team.team_agreement,
            grant_bonus: detail.team.grant_bonus,
            ungrant_bonus: detail.team.ungrant_bonus,
            freezing_bonus: detail.team.freezing_bonus,
            text_grant_bonus: team.withdrawals_team_bonus,
            text_ungrant_bonus: team.withdrawal_team_bonus,
            text_freezing_bonus: team.frozen_team_bonus
          });
        }
      }
      return arr;
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
  methods: {
    goPage(url) {
      this.$Navigate.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.price-color {
  font-size: $font-size-lg;
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
.box-foot {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  padding: $cell-padding;
  line-height: 48rpx;
  font-size: $font-size-sm;
  color: $text-gray;
}
.box-foot .item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-top: 2rpx solid #eee;
  border-right: 2rpx solid #eee;
}

.box-foot .item:last-child {
  border-right: 0;
}

.box-head {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding-top: 20rpx;
  line-height: 48rpx;
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
</style>
