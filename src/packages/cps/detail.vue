<template>
  <view class="pages">
    <view v-if="swiperList.length > 0 && skuName">
      <lk-swiper :height="height" :list="swiperList" @click="previewImage" />
      <jddetailInfo
        v-if="params.type == 'jd'"
        :priceInfo="priceInfo"
        :couponList="couponList"
        :skuName="skuName"
      />
      <pdddetailInfo
        v-if="params.type == 'pdd'"
        :sales_tip="sales_tip"
        :skuName="skuName"
        :priceInfo="priceInfo"
        :has_coupon="has_coupon"
        :coupon_discount="coupon_discount"
      />
      <view class="goods-detail">
        <block v-for="(item, index) in detaiLlist" :key="index">
          <image :src="item.image || item" class="image" mode="widthFix" />
        </block>
      </view>
      <goodsactionbar
        :type="params.type"
        :spuid="spuid"
        :materialUrl="materialUrl"
        :couponList="couponList"
        :skuName="skuName"
        :img="swiperList[0].url"
        :priceInfo="priceInfo"
        :commissionInfo="commissionInfo"
        :pddcommissionInfo="pddcommissionInfo"
      />
      <lk-shortcut-entry />
    </view>
    
    <lk-reform-skeleton type="3" v-else />
  </view>
</template>

<script>
import { GET_GETGOODSDETAIL } from "@/common/interface/cps";
import goodsactionbar from "./component/detail/action-bar";
import jddetailInfo from "./component/detail/jd-detail-info";
import pdddetailInfo from "./component/detail/pdd-detail-info";
export default {
  name: "packages-cps-detail",
  data() {
    const systemInfo = uni.getSystemInfoSync();
    return {
      params: {},
      goodsInfo: {},
      buyer_bonus_rate: 0,
      share_bonus_rate: 0,
      swiperList: [],
      detaiLlist: [],
      height: systemInfo.safeArea.width + "px",
      priceInfo: {},
      couponList: [],
      skuName: "",
      sales_tip: "",
      min_normal_price: "",
      has_coupon: "",
      coupon_discount: "",
      spuid: "",
      materialUrl: "",
      commissionInfo: "",
      pddcommissionInfo: "",
    };
  },
  onLoad(query) {
    this.params = query;
    GET_GETGOODSDETAIL(this.params).then(({ data }) => {
      if (this.params.type == "jd") {
        this.swiperList = data.jd_goods_detail.imageInfo.imageList.map(
          (val) => {
            return { image: val.url };
          }
        );
        this.detaiLlist = this.swiperList;
        this.priceInfo = data.jd_goods_detail.priceInfo.price; //价格
        this.couponList = data.jd_goods_detail.couponInfo.couponList; //券
        this.skuName = data.jd_goods_detail.skuName; //商品名
        this.spuid = data.jd_goods_detail.spuid; //id
        this.materialUrl = data.jd_goods_detail.materialUrl; //推广物料
        this.commissionInfo =
          data.jd_goods_detail.commissionInfo.commissionShare *
          data.share_bonus_rate; //佣金
      }
      if (this.params.type == "pdd") {
        this.swiperList = [{ image: data.pdd_goods_detail.goods_image_url }];
        this.detaiLlist = data.pdd_goods_detail.goods_gallery_urls;

        this.sales_tip = data.pdd_goods_detail.sales_tip; //销量
        this.skuName = data.pdd_goods_detail.goods_name;
        this.priceInfo = data.pdd_goods_detail.min_normal_price; //价格
        this.has_coupon = data.pdd_goods_detail.has_coupon; //是否有优惠
        this.coupon_discount = data.pdd_goods_detail.coupon_discount; //优惠金额
        this.pddcommissionInfo =
          data.pdd_goods_detail.promotion_rate *
          10 *
          (data.pdd_goods_detail.min_normal_price * 100).data.buyer_bonus_rate;
        this.commissionInfo =
          data.pdd_goods_detail.promotion_rate *
          10 *
          (data.pdd_goods_detail.min_normal_price * 100).data.share_bonus_rate;

        this.skuName = data.pdd_goods_detail.goods_name; //商品名
        this.spuid = data.pdd_goods_detail.goods_id; //id
      }
      this.buyer_bonus_rate = data.buyer_bonus_rate;
      this.share_bonus_rate = data.share_bonus_rate;
    });
  },
  methods: {
    previewImage(index) {
      const urls = this.swiperList.filter((e) => e.image).map((e) => e.image);
      if (urls.length) {
        uni.previewImage({
          current: index,
          urls: urls,
        });
      }
    },
  },
  components: {
    jddetailInfo,
    pdddetailInfo,
    goodsactionbar,
  },
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 80rpx;
}
.goods-detail {
  margin-top: 20rpx;
  padding:20rpx 20rpx env(safe-area-inset-bottom) 20rpx;
  .image {
    display: block;
    width: 100%;
  }
}
</style>
