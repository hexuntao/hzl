<template>
  <view class="pages">
    <receive-header :info="info" @success="onReceiveSuccess" />
    <view class="tab-fixed">
      <tab-sort-screen
        :fixed="isFixed"
        :isCurrent="isCurrent"
        @change="onTabSort"
      />
    </view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-goods-box
            :title="item.goods_name"
            :price="item.price"
            :origin-price="item.market_price"
            :image="item.pic_cover"
            :goods-id="item.goods_id"
            :sales="item.sales"
          >
          </lk-goods-box>
        </view>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import {
  GET_COUPONDETAIL,
  GET_COUPONDETAILGOODS
} from "@/common/interface/coupon";
import receiveHeader from "./component/receive-header";
import tabSortScreen from "@/pages/goods/component/list/tab-sort-screen";
export default {
  name: "packages-coupon-receive",
  data() {
    return {
      info: {
        is_coupon: ""
      },
      params: {
        page_index: 1,
        page_size: 20,
        coupon_type_id: "",
        order: "",
        sort: "",
        min_price: "",
        max_price: "",
        is_recommend: 0,
        is_new: 0,
        is_hot: 0,
        is_promotion: 0,
        is_shipping_free: 0,
		
      },
	  page_code:'',
	  coupon_time:'',
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "暂无商品",
          btnText: "返回首页",
          to: "/pages/mall/index"
        }
      },
      isFixed: false,
      isCurrent: false
    };
  },
  mixins: [loadMixin],
  onPageScroll() {
    this.handleScrollTop();
  },
  methods: {
    handleScrollTop() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".tab-fixed")
        .boundingClientRect(data => {
          if (data.top < 45) {
            this.isFixed = true;
            this.isCurrent = true;
          } else {
            this.isFixed = false;
            this.isCurrent = false;
          }
        })
        .exec();
    },
    callLoad(query) {
      this.info.coupon_type_id = query.coupon_type_id;
      this.coupon_id = query.coupon_id ? parseInt(query.coupon_id) : "";
      if (this.coupon_id) {
        this.page_code = query.page_code || "";
        this.coupon_time = query.coupon_time || "";
      }
      if (this.$load) {
        this.getData();
      }
    },
    loadInitEnd() {
      setTimeout(() => {
        if (this.info.coupon_type_id) {
          this.getData();
        }
      });
    },
    getData() {
      let query = {
        coupon_type_id: this.info.coupon_type_id
      };
      if (this.coupon_id) {
        query.coupon_id = this.coupon_id;
        query.page_code = this.page_code;
        query.coupon_time = this.coupon_time;
      }
      // console.log(query);
      GET_COUPONDETAIL(query)
        .then(({ data }) => {
          this.info = data || {};
          if (this.coupon_id) {
            this.info.coupon_id = this.coupon_id;
          }
          this.params.coupon_type_id = this.info.coupon_type_id;
          this.$load.triggerUpScroll();
          let query = {
            coupon_type_id: this.info.coupon_type_id
          };
          query.coupon_id = 0;
		  
		  this.info.page_code_old = this.page_code;
		  this.info.coupon_time_old = this.coupon_time;
		  
		  console.log(query);
          this.setWxShare({
            query: query
          });
        })
        .catch(error => {});
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COUPONDETAILGOODS(this.params)
        .then(({ data }) => {
          let list = data.goods_list || [];
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTabSort(e) {
      e.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...e });
      this.resetList();
    },
    onReceiveSuccess() {
      this.getData();
    }
  },
  components: {
    receiveHeader,
    tabSortScreen
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  .item {
    width: calc(50% - 20rpx);
    margin: 10rpx;
    border-radius: 20rpx;
    overflow: hidden;
    font-size: $font-size-lg;
    .sales {
      font-size: $font-size-sm;
      color: $text-gray;
      display: flex;
      flex-flow: row;
    }
  }
}
</style>
