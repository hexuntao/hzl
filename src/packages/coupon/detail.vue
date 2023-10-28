<template>
  <view class="pages">
    <detail-header :info="info" />
    <view v-if="countTime" class="count-time">
      <lk-count-down :time="countTime" @finish="onCountTimeFinish" />
    </view>
    <view class="tab-fixed">
      <tab-sort-screen
        @change="onTabSort"
        :fixed="isFixed"
        :isCurrent="isCurrent"
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
import detailHeader from "./component/detail-header";
import tabSortScreen from "@/pages/goods/component/list/tab-sort-screen";
import md5 from "@/common/lib/md5.min";
import { mapState } from "vuex";

export default {
  name: "packages-coupon-detail",
  data() {
    return {
      info: {},
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
        is_shipping_free: 0
      },
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "暂无商品",
          btnText: "返回首页",
          to: "/pages/mall/index"
        }
      },
      countTime: 0,
      isFixed: false,
      isCurrent: false
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      authKey: ({ authKey }) => authKey
    })
  },
  onLoad(query) {
    this.info.coupon_type_id = query.coupon_type_id;
    this.coupon_id = query.coupon_id ? parseInt(query.coupon_id) : "";
  },
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
    loadInitEnd() {
      setTimeout(() => {
        this.getData();
      });
    },
    getData() {
      let query = {
        coupon_type_id: this.info.coupon_type_id
      };
      if (this.coupon_id) {
        query.coupon_id = this.coupon_id;
      }
      GET_COUPONDETAIL(query)
        .then(({ data }) => {
          this.info = data || {};
          if (this.coupon_id) {
            this.info.coupon_id = this.coupon_id;
            this.countTime = parseInt(data.expire_time)
              ? parseInt(data.expire_time) * 1000
              : 0;
          }
          this.params.coupon_type_id = this.info.coupon_type_id;
          this.$load.triggerUpScroll();
          this.setShareQuery();
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
    setShareQuery() {
      let query = {
        coupon_type_id: this.info.coupon_type_id
      };
      query.coupon_id = this.info.is_send_friend ? this.coupon_id : 0;
      if (query.coupon_id) {
        query.page_code = this.info.page_code;
        query.coupon_time = this.info.timestamp;
      }
	  console.log('里阿尼额');
	  console.log(query);
      this.setWxShare({
        title: this.info.coupon_name,
        path: "packages/coupon/receive",
        desc: "赶快来领取优惠券",
        query: query
      });
    },
    onCountTimeFinish(e) {
      this.getData();
    }
  },
  components: {
    detailHeader,
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
.count-time {
  display: none;
}
</style>
