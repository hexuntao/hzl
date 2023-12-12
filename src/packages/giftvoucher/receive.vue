<template>
  <view class="pages">
    <receive-header :info="info" @success="onReceiveSuccess" />
    <view class="cell-group">
      <view class="cell-title">适用门店</view>
      <lk-load-list-view
        ref="load"
        :fixed="false"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="list">
          <lk-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.store_name"
            :title-right="item.distanceText"
            :to="item.to"
          >
            <view class="label" slot="label">
              <lk-icon name="location-o" />
              <view>{{ item.addressText }}</view>
            </view>
          </lk-cell>
        </view>
      </lk-load-list-view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapActions } from "vuex";
import loadMixin from "@/mixins/load-list";
import {
  GET_GIFTVOUCHERDETAILRECEIVE,
  GET_GIFTVOUCHERSTORE
} from "@/common/interface/giftvoucher";
import receiveHeader from "./component/receive-header";
export default {
  name: "packages-giftvoucher-receive",
  data() {
    return {
      info: {
        is_giftvoucher: ""
      },
      params: {
        page_index: 1,
        page_size: 20
      },
	  record_id:0,
	  page_code:'',
	  coupon_time:'',
      upOption: {
        auto: false,
        empty: {
          type: "shop",
          tip: "暂无门店"
        }
      }
    };
  },
  mixins: [loadMixin],
  methods: {
    ...mapActions(["getLocation"]),
    callLoad(query) {
      this.info.gift_voucher_id = query.gift_voucher_id;
	  
	  this.record_id = query.record_id ? parseInt(query.record_id) : "";
	  	  
	  if (this.record_id) {
	    this.page_code = query.page_code || "";
	    this.coupon_time = query.coupon_time || "";
	  }
	  
      if (this.$load) {
        this.getData();
      }
    },
    loadInitEnd() {
      if (this.info.gift_voucher_id) {
        this.getData();
      }
    },
    getData() {
      this.getLocation().then(res => {
        this.params.lat = res.lat;
        this.params.lng = res.lng;
		
		let query = {
		  gift_voucher_id: this.info.gift_voucher_id
		};
		if (this.record_id) {
		  query.record_id = this.record_id;
		  query.page_code = this.page_code;
		  query.coupon_time = this.coupon_time;
		}
		console.log('wo');
		console.log(query);
		
        GET_GIFTVOUCHERDETAILRECEIVE(query)
          .then(({ data }) => {
            this.info = data || {};
			
			if (this.record_id) {
			  this.info.record_id = this.record_id;
			}
			
			console.log(this.info.record_id);
			
            this.params.gift_voucher_id = this.info.gift_voucher_id;
			
			let query = {
			  gift_voucher_id: this.info.gift_voucher_id
			};
			query.record_id = 0;

			this.info.page_code_old = this.page_code;
			this.info.coupon_time_old = this.coupon_time;

			this.setWxShare({
			  query: query,
			  imgUrl: this.info.pic_cover_big,
			});
			
            this.$load.triggerUpScroll();
          })
          .catch(error => {});
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GIFTVOUCHERSTORE(this.params)
        .then(({ data }) => {
          let list = data.store_list || [];
          list.forEach(e => {
            e.distanceText = e.distance + "km";
            e.addressText = `${e.province_name}${e.city_name}${e.dictrict_name}${e.address}`;
            e.to = {
              path: "/packages/store/home",
              query: {
                store_id: e.store_id
              }
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onReceiveSuccess() {
      this.getData();
    }
  },
  components: {
    receiveHeader
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.cell-title {
  text-align: center;
  padding: $cell-padding;
  font-size: $font-size-lg;
}
.label {
  display: flex;
  align-items: center;
  line-height: 40rpx;
  font-size: $font-size-sm;
  color: $text-light;
}
</style>
