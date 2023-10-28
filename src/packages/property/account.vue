<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="head">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">{{ money_name_show1 }}</text>
        <view class="item">
          <view class="money">{{ points }}</view>
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
    </view>
 
    <lk-load-list
      ref="load"
      top="372"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="info-item" v-if="btnGroup.length">
          <view
            class="info-list1"
            v-for="(item, index) in btnGroup"
            :key="index"
            @click="goPage(item.route)"
          >
            <image class="info-icon" :src="item.iconSrc"></image>
            <view class="info-text">{{ item.text }}</view>
          </view>
      </view>
      <view class="info-list">
          <view class="info-title">{{ money_name_show }}明细</view>
          <view class="listall" v-for="(item, index) in list" :key="index">
			<view class="list">
				<view class="list-item">
				  <view class="list-title">类型：{{ item.type_name }}</view>
				  <view class="list-title" v-if="item.will_order_uid>0">下单人ID：{{ item.will_order_uid }}</view>
				  <view class="list-title" v-if="item.will_order_uid>0">下单人昵称：{{ item.will_order_nick_name }}</view>
				  <view class="list-title" v-if="item.shop_name!=''">商户：{{ item.shop_name }}</view>
				  
				  <view class="list-tisp">{{ item.create_time }}</view>
				</view>
				
				<view class="list-item">
				  <text :class="item.sign === 1 ? 'green-color' : 'green-color'">{{
				    item.number
				  }}</text>
				</view>
			</view>
            
			
			<view class="listintro">
              备注：{{ item.text }}
            </view>
          </view>
      </view>
    </lk-load-list>
  </view>
 
</template>

<script>
import { GET_ASSETACCOUNT,GET_ASSETACCOUNTBUT } from "@/common/interface/property";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-property-points",
  data() {
    return {
      pageStyle: {
        background: "",
        title: "",
      },
      params: {
        page_index: 1,
        page_size: 20,
        account_type:0,
      },
      points: "",
      money_name_show:'',
	  money_name_show1:'',
	  btnGroup:[],
    };
  },
  onLoad(query) {
    this.params.account_type = query.account_type;
    console.log(this.params.account_type);
	this.btnGroupList();
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      config: ({ config }) => config,
    }),


    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}integral_bg.png`;
    },
    infoBg() {
      return this.theme.gradient;
    },
    
  },
  methods: {
	  btnGroupList() {

	    //获取账户信息
	    GET_ASSETACCOUNTBUT({account_type:this.params.account_type})
	      .then(({ data }) => {

	  		//充值
	  		let is_recharge = data.data.is_recharge;
	  		let is_withdraw = data.data.is_withdraw;

	  		let is_transfer = data.data.is_transfer;
	  		let is_change = data.data.is_change;
			let arr = [];
	  		if (is_recharge==1) {
	  			  arr.push({
	  				text: "充值",
	  				route: "/packages/property/recharge?account_type="+this.params.account_type,
	  				disabled: false,
	  				isPlain: false,
	  				iconSrc: `${this.$store.getters.static.baseImgPath}balance.png`
	  			  });
	  		}
	  		if (is_withdraw==1) {
	  			  arr.push({
	  			    text: "提现",
	  			    route: "/packages/property/withdraw?account_type="+this.params.account_type,
	  			    isPlain: false,
	  			    iconSrc: `${this.$store.getters.static.baseImgPath}transfer_accounts.png`
	  			  });
	  		}
	  		
	  		if (is_transfer == 1) {
	  		  arr.push({
	  		    text: "转账",
	  		    route: "/packages/property/transfer?account_type="+this.params.account_type,
	  		    disabled: false,
	  		    isPlain: false,
	  		    iconSrc: `${this.$store.getters.static.baseImgPath}withdraw.png`
	  		  });
	  		}
	  		
	  		if (is_change == 1) {
	  		  arr.push({
	  		    text: "兑换",
	  		    route: "/packages/property/change?account_type="+this.params.account_type,
	  		    disabled: false,
	  		    isPlain: false,
	  		    iconSrc: `${this.$store.getters.static.baseImgPath}conversion.png`
	  		  });
	  		}
	  		
	  		

			
			console.log(arr);
			
	  		this.btnGroup =  arr;
	      })
	      .catch(() => {
	        this.$load.endErr();
	      });
	    	
	  	
	  		  /* const { is_point_transfer, is_transfer, withdraw_conf } = this.config;
	  		  
	  		  
	  
	  		  if (withdraw_conf.is_bonus_wit  && this.params.account_type==6) {
	  			arr.push({
	  			  text: "提现",
	  			  route: "/packages/distribute/withdraw",
	  
	  			  isPlain: false,
	  			  iconSrc: `${this.$store.getters.static.baseImgPath}transfer_accounts.png`
	  			});
	  		  }
	  		  if (withdraw_conf.is_withdraw_start  && this.params.account_type==2) {
	  			arr.push({
	  			  text: "提现",
	  			  route: "/packages/property/withdraw",
	  			  isPlain: false,
	  			  iconSrc: `${this.$store.getters.static.baseImgPath}transfer_accounts.png`
	  			});
	  		  }
	  		  if (is_transfer == 1 && (this.params.account_type==2 || this.params.account_type==7 ||  this.params.account_type==11) ) {
	  			arr.push({
	  			  text: "转账",
	  			  route: "/packages/property/transfer?account_type="+this.params.account_type,
	  			  disabled: false,
	  			  isPlain: false,
	  			  iconSrc: `${this.$store.getters.static.baseImgPath}conversion.png`
	  			});
	  		  }
	  
	  		  if (this.params.account_type==10) {
	  			arr.push({
	  			  text: "分享",
	  			  route: "/packages/property/transfervip",
	  			  disabled: false,
	  			  isPlain: false,
	  			  iconSrc: `${this.$store.getters.static.baseImgPath}conversion.png`
	  			});
	  		  }
	  		  if (is_point_transfer == 1 && this.params.account_type==1) {
	  			arr.push({
	  			  text: "兑换",
	  			  route: "/packages/property/exchange",
	  			  disabled: false,
	  			  isPlain: false,
	  			  iconSrc: `${this.$store.getters.static.baseImgPath}withdraw.png`
	  			});
	  		  }
	  		  arr.forEach((e, i) => (e.isPlain = i + 1 > 2));
	  		  arr.length == 2 && (arr[arr.length - 1].isPlain = true);
	  		  return arr; */
	  },
    upCallback(page) {
      this.params.page_index = page.num;

      GET_ASSETACCOUNT(this.params)
        .then(({ data }) => {

          let list = data.account_detail.data || [];
          this.points = data.money_num_show;
          this.money_name_show = data.money_name_show;
		  this.money_name_show1 = data.money_name_show1;
          this.pageStyle.title = data.money_name_show1;
          this.concatList(list, data.account_detail.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    
    goPage(url) {
      this.$Navigate.push(url);
    }
  
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f8f8f8;
}
.head {
  width: 100%;
  margin-bottom: 20rpx;
  background-color: #fff;
  position: fixed;
  z-index: 100;
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
  .listall{
	  border-bottom: 2rpx solid #eeeeee;
	  padding: 30rpx 20rpx;
	   margin-bottom: 22rpx;
  }
  .listintro {
	 margin-top:10rpx;  
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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

</style>
