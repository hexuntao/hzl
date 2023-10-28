<template>
  <view class="pages">
    <view class="card-group-box">
      <view class="info-box">
        <view
          class="item"
          v-for="(item, index) in infoList"
          :key="index"
          @click="goPage(item.route)"
        >
          <view class="item-box">
            <view class="item-text">
              <view class="item-text_title">{{ item.title }}</view>
              <view class="item-text_text">{{ item.text }}</view>
            </view>
            <image class="item-img" :src="item.iconSrc"></image>
          </view>
        </view>
		
		
		<view
		    class="item"  @click="goPage('/packages/coupon/list?shop_id='+shop_id)">
		  <view class="item-box">
		    <view class="item-text">
		      <view class="item-text_title">优惠券</view>
		      <view class="item-text_text">{{ info.coupon_num || 0 }}张</view>
		    </view>
		    <image class="item-img" :src="basepath+'coupon_icon.png'"></image>
		  </view>
		</view>
		

        <view
            class="item"
            v-for="(item, index) in info.giftvoucher_list"
            :key="index"
            @click="goPage('/packages/giftvoucher/list?gift_voucher_id='+item.gift_voucher_id+'&shop_id='+shop_id)"
        >
          <view class="item-box">
            <view class="item-text">
              <view class="item-text_title">{{ item.giftvoucher_name }}</view>
              <view class="item-text_text">{{ item.count }}份</view>
            </view>
            <image class="item-img" :src="item.pic_cover_mid"></image>
          </view>
        </view>
      </view>
    </view>
    
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState } from "vuex";
import {GET_ACCOUNTINFO} from "../../common/interface/member";
import {GET_ASSETBALANCE} from "../../common/interface/property";
export default {
  name: "pages-property-index",
  data() {
    return {
      infoList:[],
      infoList2:[],
	  info:[],
	  shop_id:0
    };
  },
  onLoad(query) {
  	  this.shop_id = query.shop_id;
  },
  computed: {
    ...mapState({
      member: ({ member }) => member,
      addons: ({ config }) => config.addons
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    infoList1() {
      const { coupontype, giftvoucher, store, receivegoodscode } = this.addons;


      //获取其他账户

      GET_ASSETBALANCE({'shop_id':this.shop_id}).then(({ data }) => {
        let arr = [];
            var moneyTypeAll = data.moneyTypeAll;
            for(var i in moneyTypeAll){
                if(moneyTypeAll[i]['is_show_index']==1){
                  arr.push({
                    title: moneyTypeAll[i]['name'],
                    text: data[moneyTypeAll[i]['key']],
                    route: "/packages/property/account?account_type="+moneyTypeAll[i]['num'],
                    iconSrc: `${this.$store.getters.static.baseImgPath}integral_icon.png`
                  });
                }

            }
			
			this.info = data;

        this.infoList = arr;

        /* let arr2 = [];
        if (coupontype == 1) {
          arr2.push({
            title: "优惠券",
            text: this.member.info.coupon_num,
            route: "/packages/coupon/list",
            iconSrc: `${this.$store.getters.static.baseImgPath}coupon_icon.png`
          });
        }
        if (giftvoucher == 1) {
          arr2.push({
            title: "礼品券",
            text: this.member.info.giftvoucher_num,
            route: "/packages/giftvoucher/list",
            iconSrc: `${this.$store.getters.static.baseImgPath}gift_certificate.png`
          });
        }
        if (store == 1) {
          arr2.push({
            title: "消费券",
            text: this.member.info.store_card_num,
            route: "/packages/consumercard/list",
            iconSrc: `${this.$store.getters.static.baseImgPath}consume_icon.png`
          });
        }
        if (receivegoodscode == 1) {
          arr2.push({
            title: this.member.info.receivegoodscode.copy_writing,
            text: this.member.info.receivegoodscode.count,
            route: "/packages/deliverycode/list",
            iconSrc: `${this.$store.getters.static.baseImgPath}take_icon.png`
          });
        }

        this.infoList2 = arr2; */
		
        }).catch(() => {});






    },
    walletList() {
      const { blockchain } = this.addons;
      let walletListArr = [];
      walletListArr.push({
        title: "账号列表",
        text: "提现账号管理",
        route: "/packages/property/account/list",
        iconSrc: `${this.$store.getters.static.baseImgPath}account_list.png`
      });
      if (blockchain == 1) {
        walletListArr.push({
          title: "数字钱包",
          // text: this.member.info.digital_assets ? this.member.info.digital_assets: '去中心化资产',
          text: "去中心化资产",
          route: "/pages/blockchain/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}wallets_icon.png`
        });
      }
      return walletListArr;
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}property_bg.png`;
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
.property-wrap {
  margin: 20rpx;
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
      height: 100rpx;
      position: absolute;
      bottom: 0;
    }
  }
}
.info-title {
  font-size: $font-size-lg;
  padding: $cell-padding;
  background: #ffffff;
}
.info-box {
  display: flex;
  background: #ffffff;
  flex-wrap: wrap;
  .item {
    display: flex;
    width: 100%;
    height: auto;
	padding:20rpx 0rpx;
    align-items: center;
	border-bottom:1rpx solid #cccccc;
    .item-box {
      display: flex;
      position: relative;
      width: 100%;
      height: auto;
      padding: 0 40rpx;
    }
    .item-text {
      width: 100%;
      padding-right: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .item-text_title {
       
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $font-size;
        line-height: 40rpx;

        color: $text-gray;
      }
      .item-text_text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $font-size;
        line-height: 48rpx;
        height: 48rpx;
      }
    }
    .item-img {
      width: 82rpx;
      height: 82rpx;
      position: absolute;
      right: 40rpx;
      top: 0;
    }
  }
}
.wallet-box {
  .item {
    .item-text {
      padding-right: 0;
      padding-left: 100rpx;
      .item-text_title {
        font-size: $font-size-sm;
      }
    }
    .item-img {
      width: 72rpx;
      height: 72rpx;
      text-align: center;
      position: absolute;
      left: 40rpx;
      top: 8rpx;
    }
  }
}
</style>
