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
    <view
      class="card-panel card-group-box"
      style="margin-bottom: 0; width: 710rpx"
    >
      <view
        class="item"
        @tap="toLink('/packages/property/account?account_type=6')"
      >
        <text class="num">{{ info.bonus_money || 0 }}</text>
        <text class="text">{{ texts.withdrawable_commission }}</text>
      </view>
      <view
        class="item"
        @tap="toLink('/packages/property/withdrawlog?account_type=6')"
      >
        <text class="num">{{ info.withdrawals || 0 }}</text>
        <text class="text">{{ texts.withdrawals_commission }}</text>
      </view>
      <view class="item" @tap="toLink('/packages/distribute/log?status=1')">
        <text class="num">{{ info.total_commission || 0 }}</text>
        <text class="text">{{ texts.total_commission }}</text>
      </view>
      <view class="item" @tap="toLink('/packages/distribute/log?status=0')">
        <text class="num">{{ info.frozen_commission || 0 }}</text>
        <text class="text">{{ texts.frozen_commission }}</text>
      </view>
      <view class="item">
        <lk-button
          size="small"
          round
          :color="theme.gradient"
          @click="onWithdraw"
        >
          提现
        </lk-button>
      </view>
    </view>

    <view class="reform-view">
      <distribute-reform-group :show="show" :items="items" />
    </view>

    <floater-fixed
      :items="floaterItems"
      :key="floaterItems.timestamp"
      v-if="floaterItems.id"
    />
    <!-- #ifdef MP-WEIXIN -->
    <lk-floater-kefu />
    <!--  #endif -->
    <!-- #ifndef H5 -->

    <lk-barrage></lk-barrage>
    <!--  #endif -->

    <view
      class="popup-poster"
      @touchmove.stop.prevent="e => e.preventDefault()"
      v-show="showPoster"
    >
      <share-poster ref="share-poster" show-close @close="showPoster = false">
      </share-poster>
    </view>
    <!--    <lk-shortcut-entry />-->
  </view>
</template>

<script>
import { formatStyle } from '@/common/utils/stringify';
import { mapActions, mapState, mapGetters } from 'vuex';
import distributeReformGroup from '@/components/custom/distribute-reform-group';
import reformLoad from '@/mixins/reform-load';
import floaterFixed from '@/components/custom/reform/floater';
import sharePoster from './component/share-poster';
import navbarStyle from '@/mixins/navbar-style';
export default {
  name: 'pages-distribute-index',
  data() {
    return {
      show: false,
      pageStyle: {
        background: '',
        title: '',
      },
      showPoster: false,
    };
  },
  mixins: [reformLoad, navbarStyle],
  computed: {
    ...mapState({
      info: ({ distribute }) => distribute.info,
      texts: ({ distribute }) => distribute.texts,
      addons: ({ config }) => config.addons,
    }),

    styles() {
      /* return formatStyle({
	    background: this.theme.gradient,
	  })*/
    },

    ...mapGetters(['token', 'static']),
  },
  onPullDownRefresh() {
    if (this.token) {
      this.getDistributeInfo({ update: true }).then(() => {
        this.getItems('refresh');
      });
    } else {
      this.getItems('refresh');
    }
  },
  onLoad() {},
  onShow() {
    if (this.token) {
      this.getDistributeInfo({ update: true })
        .then(() => {
          this.getItems();
        })
        .catch(info => {});
    } else {
      this.getItems();
    }
  },
  methods: {
    ...mapActions(['getCustom', 'getDistributeInfo']),
    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 5 }).then(({ items, page }) => {
        refresh && this.resetItems();
        this.show = true;
        const newItems = this.initCustomData(items);
        this.initLoadItems(newItems);
        this.pageStyle.title = page.title;
        this.pageStyle.background = page.background;
        this.setWxShare({
          title: page.title,
        });
      });
    },
    initCustomData(templateItems = {}) {
      return templateItems;
    },
    onWithdraw() {
      this.$Navigate.push('/packages/property/withdraw?account_type=6');
    },
    toLink(link) {
      this.$Navigate.push(link);
    },
    clickShowPoster() {
      this.showPoster = true;
      this.$refs['share-poster'].init();
    },
  },
  components: {
    distributeReformGroup,
    sharePoster,
    floaterFixed,
  },
};
</script>

<style lang="scss" scoped>
.header {
  //background-color:#a32d2a;
  padding: 100rpx 30rpx;
  min-height: 240rpx;
  color: #fff;
  margin-bottom: -80rpx;
}
.wrap {
  display: flex;
  flex-flow: row;
  .avatar {
    width: 170rpx;
    flex: none;
    margin-right: 30rpx;
  }
  .name {
    font-size: 26rpx;
    line-height: 48rpx;
    height: 48rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 340rpx;
  }
  .name-tag {
    display: inline-flex;
    border-radius: 40rpx;
    height: 32rpx;
    min-width: 100rpx;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    color: $text-gray;
    font-size: $font-size-xs;
    margin-left: 16rpx;
    vertical-align: text-top;
  }
  .content {
    flex: 1;
    display: flex;
    flex-flow: column;
    color: inherit;
  }
}
.header {
  padding: 0 rpx;
  margin: 0 rpx;
}
.info {
  padding-bottom: 40rpx;
  height: 160rpx;
  font-size: $font-size-sm;
  line-height: 40rpx;
}

.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
  }
  .text {
    font-size: $font-size;
  }
  .num {
    color: $red;
  }
}

.ranking-box {
  display: flex;
  flex-flow: column;
  height: 150rpx;
  margin: 20rpx;
  image {
    width: 100%;
    height: 100%;
  }
}

.qr-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.popup-poster {
  position: absolute;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>
