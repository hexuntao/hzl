<template>
<!-- 礼品券详情 -->
  <view class="pages">
    <detailhead :list="detail"  />
    <view class="img">
      <image :src="detail.gift_voucher_codeImg" mode="scaleToFill" />
      <view>{{detail.gift_voucher_code}}</view>
    </view>
	
	<view class="btn-group" v-if="detail.is_send_friend==1" style="width:700rpx;margin-left:30rpx;">
	  <lk-button
	    block
	    round
	    theme-color
	    open-type="share"
	    @click="onGive"
	  >
	    赠送好友
	  </lk-button>
	</view>
	
    <lk-cell>
      <view class="time">使用时间</view>
      <view>{{detail.start_time|formatDate}}~{{detail.end_time|formatDate}}</view>
      <view class="time">使用说明</view>
      <view>{{detail.desc}}</view>
    </lk-cell>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import { GET_GIFTVOUCHERDETAIL } from "@/common/interface/giftvoucher";
import detailhead from "./component/detailhead";
export default {
  name: "packages-giftvoucher-detail",
  data() {
    return {
      detail: {}
    };
  },
  onLoad(options) {
	  
    GET_GIFTVOUCHERDETAIL({ record_id: options.record_id })
      .then(res => {
        // console.log(res);
        this.detail = res.data;
		this.setShareQuery();
      })
      .catch(error => {});
	  
	  
  },
  methods: {
	  setShareQuery() {
	    let query = {
	      gift_voucher_id: this.detail.gift_voucher_id
	    };
	    query.record_id = this.detail.is_send_friend ? this.detail.record_id : 0;
	    if (query.record_id) {
	      query.page_code = this.detail.page_code;
	      query.coupon_time = this.detail.timestamp;
	    }
	    console.log('里阿尼额');
	    console.log(query);
	    this.setWxShare({
	      title: this.detail.gift_name,
	      path: "packages/giftvoucher/receive",
		  imgUrl: this.detail.pic_cover_big,
	      desc: "赶快来领取礼品券",
	      query: query
	    });
	  },
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
  },
  components: {
    detailhead
  },
  filters: {
    formatDate(v) {
      return formatDate(v, "YYYY-MM-DD hh:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
	
	
.img {
  width: 250rpx;
  height: 250rpx;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 60rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.time {
  color: #0ed4ae;
}
</style>
