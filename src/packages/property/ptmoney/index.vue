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
    <view style="text-align: center; margin: 30rpx 0">
      <view>累计获得</view>
      <view style="font-size: 70rpx; margin: 20rpx 0">
        {{ info.pt_moeny_all || 0 }}
      </view>
      <!-- <lk-button
	        size="small"
	        round
	        plain
	        :color="theme.color"
	        to="/packages/property/transfer?account_type=11"
	      >
	        转账
	      </lk-button> -->
    </view>

    <lk-tabs
      v-model="active"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="4"
      @change="onTab"
    >
      <lk-tab>
        <text style="font-size: 24rpx">每月积分</text>
      </lk-tab>
      <lk-tab>
        <text style="font-size: 24rpx"
          >其他积分({{ info.pt_moeny_my || 0 }})</text
        >
      </lk-tab>
      <lk-tab>
        <text style="font-size: 24rpx"
          >已结积分({{ info.total_commission_pv || 0 }})</text
        >
      </lk-tab>
      <lk-tab>
        <text style="font-size: 24rpx"
          >未发积分({{ info.frozen_commission_pv || 0 }})</text
        >
      </lk-tab>
    </lk-tabs>

    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <block v-if="showType == 4">
        <view class="info-list">
          <view class="list" v-for="(item, index) in list" :key="index">
            <view class="list-item">
              <view class="list-title">{{ item.pt_introduce }}</view>
              <view class="list-tisp">{{ item.add_time }}</view>
            </view>
            <view class="list-item">
              <text class="green-color">{{ item.total_pv }}</text>
            </view>
          </view>
        </view>
      </block>
      <block v-if="showType == 3">
        <view class="info-list">
          <view class="list" v-for="(item, index) in list" :key="index">
            <view class="list-item">
              <view class="list-title">{{ item.pt_introduce }}</view>
              <view class="list-tisp">{{ item.add_time }}</view>
            </view>
            <view class="list-item">
              <text class="green-color">{{ item.total_pv }}</text>
            </view>
          </view>
        </view>
      </block>

      <block v-if="showType == 2">
        <view class="info-list">
          <view class="list" v-for="(item, index) in list" :key="index">
            <view class="list-item">
              <view class="list-title">{{ item.type_name }}</view>
              <view class="list-tisp">{{ item.create_time }}</view>
            </view>
            <view class="list-item">
              <text :class="item.sign === 1 ? 'green-color' : 'green-color'">{{
                item.number
              }}</text>
            </view>
          </view>
        </view>
      </block>

      <block v-if="showType == 1">
        <view class="info-list">
          <view class="list" v-for="(item, index) in list" :key="index">
            <view class="list-item">
              <view class="list-title">{{ item.add_month }}</view>
            </view>
            <view class="list-item">
              <text :class="item.sign === 1 ? 'green-color' : 'green-color'">{{
                item.number
              }}</text>
            </view>
          </view>
        </view>
      </block>
    </lk-load-list>

    <view
      class="popup-poster"
      @touchmove.stop.prevent="e => e.preventDefault()"
      v-show="showPoster"
    >
      <share-poster ref="share-poster" show-close @close="showPoster = false">
      </share-poster>
    </view>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { formatStyle } from '@/common/utils/stringify';
import {
  GET_ASSETACCOUNT,
  GET_ASSETACCOUNTMONTH,
} from '@/common/interface/property';
import { mapActions, mapState, mapGetters } from 'vuex';
import { GET_COMMISSIONJFLOG } from '@/common/interface/distribute';
import distributeReformGroup from '@/components/custom/distribute-reform-group';
import reformLoad from '@/mixins/reform-load';
import sharePoster from './component/share-poster';
import navbarStyle from '@/mixins/navbar-style';
import loadMixin from '@/mixins/load-list';
export default {
  name: 'pages-distribute-index',
  data() {
    return {
      show: false,
      pageStyle: {
        background: '',
        title: '',
      },
      showType: 1,
      params: {
        page_index: 1,
        page_size: 20,
        bonus_id: 0,
        status: 0,
        account_type: 11,
      },
      showPoster: false,
      tabs: [
        { name: '每月积分', type: 1 },
        { name: '可用积分(0)', type: 2 },
        { name: '已结积分(0)', type: 3 },
        { name: '未发积分(0)', type: 4 },
      ],
    };
  },
  mixins: [loadMixin, reformLoad, navbarStyle],
  computed: {
    ...mapState({
      info: ({ distribute }) => distribute.info,
      texts: ({ distribute }) => distribute.texts,
      addons: ({ config }) => config.addons,
    }),

    styles() {
      return formatStyle({
        background: this.theme.gradient,
      });
    },

    ...mapGetters(['token', 'static']),
    cardItems() {},
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
        this.pageStyle.title = '积分中心';
        this.pageStyle.background = page.background;
        this.setWxShare({
          title: '积分中心',
        });
      });
    },
    initCustomData(templateItems = {}) {},

    upCallback(page) {
      this.params.page_index = page.num;
      this.params.status = 0;
      if (this.showType == 4) {
        GET_COMMISSIONJFLOG(this.params)
          .then(({ data }) => {
            //this.tabs[0]['name'] = '可用积分('+data.pt_money+')';
            //this.tabs[1]['name'] = '未发积分('+data.frozen_commission_pv+')';
            let list = data.data;
            this.concatList(list, data.total_count);
          })
          .catch(() => {});
      } else if (this.showType == 3) {
        this.params.status = 1;
        GET_COMMISSIONJFLOG(this.params)
          .then(({ data }) => {
            //this.tabs[0]['name'] = '可用积分('+data.pt_money+')';
            //this.tabs[1]['name'] = '未发积分('+data.frozen_commission_pv+')';
            let list = data.data;
            this.concatList(list, data.total_count);
          })
          .catch(() => {});
      } else if (this.showType == 2) {
        GET_ASSETACCOUNT(this.params)
          .then(({ data }) => {
            let list = data.account_detail.data || [];
            this.concatList(list, data.account_detail.total_count);
          })
          .catch(() => {});
      } else if (this.showType == 1) {
        GET_ASSETACCOUNTMONTH(this.params)
          .then(({ data }) => {
            let list = data.data;
            this.concatList(list, data.total_count);
          })
          .catch(() => {});
      }
    },
    onTab(index) {
      this.showType = this.tabs[index].type;
      this.resetList();
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
  },
};
</script>

<style lang="scss" scoped>
.header {
  //background-color:#a32d2a;
  padding: 100rpx 30rpx;
  min-height: 240rpx;
  color: #fff;
  margin-bottom: 20rpx;
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
.info {
  height: 300rpx;
  margin: 20rpx;
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
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 1.2;
      font-size: 80rpx;
      color: $white;
    }
  }
  .info-image {
    width: 100%;
    height: 300rpx;
    position: absolute;
    bottom: 0;
  }
}
.info-list {
  padding: 0 25px;
  background: #ffffff;
  .info-title {
    padding: 30rpx 20rpx;
    font-size: 30rpx;
    color: #333333;
    border-bottom: 2rpx solid #eeeeee;
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;
    border-bottom: 2rpx solid #eeeeee;
    &:last-of-type {
      border-bottom: 0;
    }
    .list-title {
      font-size: $font-size;
      color: #333333;
      margin-bottom: 22rpx;
    }
    .list-tisp {
      font-size: 26rpx;
      color: #999999;
    }
    .green-color {
      color: #4b0 !important;
    }
    .red-color {
      color: #ff454e !important;
    }
  }
}
.info-item {
  background: #ffffff;
  border-radius: $border-radius-lg;
  padding: 28rpx 0 30rpx;
  display: flex;
  justify-items: center;
  align-items: center;
  margin-bottom: 14rpx;
  .info-list1 {
    flex: 1;
    text-align: center;
    border-right: 2rpx solid #eeeeee;
    &:last-of-type {
      border-right: 0;
    }
    .info-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 24rpx;
    }
    .info-text {
      font-size: 26rpx;
      color: #333333;
    }
  }
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
