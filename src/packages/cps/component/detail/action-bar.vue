<template>
  <view class="bottombtn">
    <view>
      <lk-goods-action-icon
        v-if="seller_code"
        :icon="kefuInfo.icon"
        :text="kefuInfo.text"
        :to="kefuInfo.to"
      />
    </view>
    <view class="btn-group">
      <lk-button
        open-type="share"
        size="lager"
        :custom-style="{
          width: '200rpx',
          margin: '10rpx',
          'border-radius': '20rpx',
        }"
        round
        color="#ff9900"
        @click="onInvite"
      >
        分享赚{{commissionInfo }}%
      </lk-button>
      <lk-button
        @click="buy"
        size="lager"
        :custom-style="{
          width: '360rpx',
          margin: '10rpx',
          'border-radius': '20rpx',
        }"
        round
        :color="theme.gradient"
        >{{ couponCommission }}</lk-button
      >
    </view>
  </view>
</template>
<script>
import { mapState } from "vuex";
import { GET_USECOUPONBUY } from "@/common/interface/cps";
import { GET_QLKEFUINFO } from "@/common/interface/message";
import {  openLink } from "@/common/utils/comp-path";

function openlinkpdd(data) {
  // #ifdef APP-PLUS
  plus.runtime.openURL(data.url.we_app_web_view_url);
  // #endif
  // #ifdef H5
  location.assign(data.url.url);
  // #endif
  // #ifdef MP
  uni.navigateToMiniProgram({
    appId: data.url.we_app_info.app_id,
    path: data.url.we_app_info.app_id.page_path || "",
    success(res) {
      // 打开成功
    },
  });
  // #endif
}
export default {
  data() {
    return {
      seller_code: "",
    };
  },
  props: {
    type: [String],
    spuid: [String, Number],
    materialUrl: {
      type: String,
      default: "",
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    skuName: [String],
    img: [String],
    priceInfo: [String, Number],
    commissionInfo: [String, Number],
    pddcommissionInfo: [String, Number],
  },
  mounted() {
    if (this.addons.qlkefu) {
      GET_QLKEFUINFO({
        shop_id: 0,
        goods_id: this.spuid,
      })
        .then(({ data }) => {
          if (data.is_use) {
            this.seller_code = data.seller_code;
          }
        })
        .catch(() => {});
    }
  },
  computed: {
    ...mapState({
      uid: ({ member }) => member.info.uid,
      addons: ({ config }) => config.addons,
    }),
    kefuInfo() {
      return {
        icon: "chat-o",
        text: "客服",
        to: {
          path: "/packages/message/chat",
          query: {
            seller_code: this.seller_code,
            goods: JSON.stringify({
              id: this.spuid,
              img: this.img,
              name: this.skuName,
              price: this.priceInfo.price,
            }),
          },
        },
      };
    },
    couponCommission() {
      if (this.type == "jd") {
        if (this.couponList.length > 0)
          return "领券购买返还￥" + this.commissionInfo;
        else return "立即购买";
      } else if (this.type == "jd")
        return "领券购买返还￥" + this.pddcommissionInfo;
    },
  },
  methods: {
    buy() {
      if (this.type == "jd") this.jdbuy();
      else if (this.type == "pdd") this.pddbuy();
    },
    jdbuy() {
      let params = {
        share_id: this.uid,
        type: "jd",
        goods_id: this.spuid,
        material_id: this.materialUrl,
        coupon_url: this.couponList.length > 0 ? this.couponList[0].link : "",
      };
      GET_USECOUPONBUY(params).then(({ code, data }) => {
        if (code == 1) openLink(data.url);
      });
    },
    pddbuy() {
      let params = {
        share_id: this.uid,
        type: "pdd",
        goods_id: this.spuid,
      };
      GET_USECOUPONBUY(params).then(({ code, data }) => {
        if (code == 1) openlinkpdd(data);
      });
    },
        onInvite() {
      // #ifdef H5
      this.$Prompt.toast(
        this.$store.state.isWeixin
          ? "微信环境下点击右上角分享"
          : "手机浏览器点击底部工具栏分享"
      );
      // #endif
    },
  },
};
</script>

<style scoped lang="scss">
.bottombtn {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0rpx;
  background-color: white;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
