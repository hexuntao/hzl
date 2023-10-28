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
	  <view style="text-align:center;margin:30rpx 0;">
		  <view style="font-size:70rpx;margin:20rpx 0;">{{info.all_bonus || 0}}</view>
	  </view>
	  
	<lk-tabs
	  v-model="active"
	  :active-color="theme.color"
	  :line-color="theme.color"
	  slot-title
	  nav-per-view="2"
	  @change="onTab"
	>
	  <lk-tab>
	    <text>已结分红</text>
	  </lk-tab>
	  <lk-tab >
	    <text>未结分红</text>
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

    <view class="info-list">
      <view  v-for="(items, indexs) in info.list" :key="indexs" style="border-bottom:20rpx solid #f1f1f1;">
        <view style="padding-top:20rpx;margin-left:20rpx;padding-bottom:20rpx;border-bottom:2rpx dotted #f1f1f1;">{{ items.name }}</view>
        <view class="list" v-for="(item, index) in items.list" :key="index">
          <view class="list-item">
            <view class="list-title">等级：{{ item.level_name }} </view>
            <view class="list-title">我的贡献积分：{{ item.my_total_pv }}</view>
			<view class="list-title">总共贡献积分：{{ item.total_pv }}</view>
            <view class="list-title">当月商城业绩：{{ item.month_pv }}</view>
            <view class="list-tisp">月份：{{ item.add_month }}</view>
          </view>
          <view class="list-item">
            <text class="green-color">{{item.my_bonus_money}}</text>
          </view>
        </view>
      </view>
    </view>
	  
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
	import { formatStyle } from "@/common/utils/stringify";
	import { GET_ASSETACCOUNT } from "@/common/interface/property";
import { mapActions, mapState, mapGetters } from "vuex";
import { GET_COMMISSIONREDLOG } from "@/common/interface/distribute";
import distributeReformGroup from "@/components/custom/distribute-reform-group";
import reformLoad from "@/mixins/reform-load";
import sharePoster from "./component/share-poster";
import navbarStyle from "@/mixins/navbar-style";
import loadMixin from "@/mixins/load-list";
export default {
  name: "pages-ptmoney-red",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: ""
      },
	    showType:1,
	    params: {
        status:0
	    },
      showPoster: false,
      info:{},
      tabs: [
        { name: "已结分红", type: 1 },
        { name: "未结分红", type: 2 }
      ],
    };
  },
  mixins: [loadMixin,reformLoad, navbarStyle],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
	
	styles() {
	  return formatStyle({
	    background: this.theme.gradient,
	  })
	  },
	
    ...mapGetters(["token", "static"]),
    cardItems() {
      
    }
  },

  onLoad() {},

  onShow() {
    this.getItems();
  },
  methods: {
    ...mapActions(["getCustom", "getDistributeInfo"]),
    getItems() {
      GET_COMMISSIONREDLOG({type:this.showType})
          .then(({ data }) => {
            this.info = data;
            console.log(data);
          })
          .catch(() => {

          });
    },

    onTab(index) {
      this.showType = this.tabs[index].type;
      this.getItems();
    },
  },
  components: {
    distributeReformGroup,
    sharePoster
  }
};
</script>

<style lang="scss" scoped>
	.header {
		//background-color:#a32d2a;
	  padding: 100rpx 30rpx;
	  min-height: 240rpx;
	  color: #fff;
	  margin-bottom:20rpx;
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
	.header{
		padding:0 rpx;
		margin:0 rpx;
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
