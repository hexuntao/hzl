<template>
  <view :class="items.id">
    <view class="goods-info-panel card-group-box">
      <lk-goods-info-panel
        :name="goodsInfo.name"
        :name-tag="goodsInfo.nameTag"
        :sub-name="goodsInfo.subName"
        :price="goodsInfo.price"
		:ptmoney="goodsInfo.ptmoney"
		
        :price-tag="goodsInfo.priceTag"
        :origin-price="goodsInfo.originPrice"
        :promote-text="goodsInfo.promoteText"
        :foot-info="goodsInfo.footInfo"
        :price-color="info.style.pricecolor"
        :price-light-color="info.style.pricelightcolor"
        :name-color="info.style.titlecolor"
        :show-price="!promoteType"
        :rebate-commission="goodsInfo.commission"
        :rebate-point="goodsInfo.point"
      >
        <view
          slot="originPrice"
          class="front-money-text"
          v-if="goodsInfo.frontMoneyText"
        >
          {{ goodsInfo.frontMoneyText }}
        </view>
        <view slot="headerRight">
          <view class="collect-share" v-if="!promoteType">
            <view class="item" @click="goodsCollect(goodsInfo.id)">
              <lk-button
                class="i"
                icon-prefix="v-icon"
                :icon="collectInfo.icon"
                :icon-color="collectInfo.color"
                icon-size="18"
                bing-mobile
                type="text"
              >
              </lk-button>
              <text class="text">{{ collectInfo.text }}</text>
            </view>
            <view class="item" @click="eventShare">
              <lk-icon
                class="i"
                class-prefix="v-icon"
                name="v-icon-share-03"
                color="inherit"
                size="18"
              />
              <text class="text">分享</text>
            </view>
          </view>
        </view>
        <view slot="nameRight">
          <view class="collect-share" v-if="promoteType">
            <view class="item" @click="goodsCollect(goodsInfo.id)">
              <lk-button
                class="i"
                icon-prefix="v-icon"
                :icon="collectInfo.icon"
                :icon-color="collectInfo.color"
                icon-size="18"
                bing-mobile
                type="text"
              >
              </lk-button>
              <text class="text">{{ collectInfo.text }}</text>
            </view>
            <view class="item" @click="eventShare">
              <lk-icon
                class="i"
                class-prefix="v-icon"
                name="v-icon-share-03"
                color="inherit"
                size="18"
              />
              <text class="text">分享</text>
            </view>
          </view>
        </view>
        <view slot="label">
          <digital-asset
            v-if="digitalInfo.symbol"
            is-flex-row
            :info="digitalInfo"
            :goods-info="info.goodsInfo"
          />
          <promote-coupon-group
            :coupon-data="items.params.coupon_type_list"
            :full-cut-data="items.params.full_cut_list"
          />
        </view>
      </lk-goods-info-panel>
    </view>
    <assemble-group
      v-if="items.params.promoteType == 'group'"
      :info="items.params.promoteParams"
      @confirm="groupConfirm"
      @callback="initData"
    />
    <presell-group
      v-if="items.params.promoteType == 'presell'"
      :info="items.params.promoteParams"
      :goods-info="info.goodsInfo"
    />
    <luckly-spell
      v-if="items.params.promoteType == 'luckyspell'"
      :info="items.params.promoteParams"
    />
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, formatDate, yuan, wan } from "@/common/utils";
import digitalAsset from "./digital-asset";
import promoteCouponGroup from "./promote-coupon-group";
import presellGroup from "./presell-group";
import assembleGroup from "./assemble-group";
import lucklySpell from "./luckly-spell";
import collect from "../../mixin/collect";
export default {
  data() {
    return {
      collectFlag: "",
      promoteParams: {}
    };
  },
  mixins: [reform, collect],
  computed: {
    info() {
      this.collectFlag = this.items.params.isCollect;
      this.promoteParams = this.items.params.promoteParams;
      return this.items || {};
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    },
    promoteType() {
      let type = null;
      const { promoteType, promoteParams } = this.info.params;
      if (
        (promoteType == "seckill" && promoteParams.seckill_status == "going") ||
        promoteType == "group" ||
        (promoteType == "presell" && promoteParams.state == 1) ||
        (promoteType == "bargain" && promoteParams.status == 1) ||
        (promoteType == "limit" && promoteParams.status == 1) ||
        promoteType == "luckyspell"
      ) {
        type = promoteType;
      }
      return type;
    },
    // 是否横向布局显示数字资产信息
    isDigitalFlexRow() {
      const promoteType = this.promoteType;
      let flag = !!promoteType;
      return flag;
    },
    // 手续费
    digitalFee() {
      const info = this.info.params.digitalAsset || {};
      return info.fee ? info.fee + "%" : "";
    },
    digitalInfo() {
      return this.info.params.digitalAsset || {};
    },
    digitalItems() {
      const info = this.info.params.digitalAsset || {};
      let arr = [];
      const eth = parseFloat(info.eth);
      const eos = parseFloat(info.eos);
      const price = parseFloat(this.info.goodsInfo.goodsPrice || 0);
      if (!isNaN(eth)) {
        let ethObj = {
          name: "ETH",
          icon: "v-icon-eth",
          iconcolor: "#f52929",
          money: price / eth
        };
        arr.push(ethObj);
      }
      if (!isNaN(eos)) {
        let eosObj = {
          name: "EOS",
          icon: "v-icon-eos",
          iconcolor: "#ff8f00",
          money: price / eos
        };
        arr.push(eosObj);
      }
      return arr;
    },
    goodsInfo() {
      const info = this.info.goodsInfo;
      const {
        postage,
        sales,
        promoteType,
        promoteParams,
        rebateCommission,
        rebatePoint
      } = this.info.params;
      let obj = {};
      obj.id = info.id;
      obj.name = info.title;
      obj.subName = info.subTitle || "";
      obj.nameTag = this.getPromoteNameTag(promoteType, promoteParams);
      obj.price = info.goodsPrice;

	  

	  obj.ptmoney = info.ptmoney;
	  
      obj.originPrice = info.marketPrice;
      obj.frontMoneyText = this.getOriginFrontMoney(
        promoteType,
        promoteParams,
        info.frontMoney
      );
      obj.priceTag = "";
      obj.commission = rebateCommission;
      obj.point = rebatePoint;
      obj.promoteText = this.getPromoteText(promoteType, promoteParams);
      if (info.goodsType == 4) {
        obj.footInfo = [{ name: (wan(sales) || 0) + "人学习", value: "" }];
      } else {
        obj.footInfo = [
          { name: "运费:", value: postage },
          { name: "销量:", value: (wan(sales) || 0) + "笔" }
        ];
      }
      return obj;
    }
  },
  methods: {
    getOriginFrontMoney(type, params, money = 0) {
      let price = "";
      if (type == "presell" && params.state != 1) {
        price = "定金：" + yuan(money);
      }
      return price;
    },
    // 获取活动商品标签
    getPromoteNameTag(type, params) {
      let name = "";
      if (type == "group") {
        name = params.group_name;
      } else if (type == "presell") {
        name = params.name;
      } else if (type == "bargain") {
        name = params.bargain_name;
      } else if (type == "limit") {
        name = params.discount_name;
      } else if (type == "luckyspell") {
        name = params.luckyspell_name;
      }
      return name;
    },
    // 获取活动相关文案
    getPromoteText(type, params) {
      let text = "";
      if (type == "presell" && params.state != 1) {
        text = formatDate(params.start_time, "MM月DD日 hh:mm") + " 整点开售";
      } else if (type == "bargain") {
        text =
          formatDate(params.start_bargain_time, "MM月DD日 hh:mm") +
          " 最低砍至 " +
          yuan(params.lowest_money);
      } else if (type == "seckill" && params.seckill_status != "going") {
        text =
          formatDate(params.start_time, "MM月DD日 hh:mm") +
          " 秒杀价 " +
          yuan(params.discount_price);
      } else if (type == "limit" && params.status != 1) {
        text =
          formatDate(params.start_time, "MM月DD日 hh:mm") +
          " 抢购价 " +
          yuan(params.discount_price);
      }
      return text;
    },
    eventShare() {
      this.$emit("event", "share");
    },
    groupConfirm(data) {
      this.$emit("event", "group", data);
    },
    initData() {
      this.$emit("event", "initData");
    }
  },
  components: {
    digitalAsset,
    promoteCouponGroup,
    presellGroup,
    assembleGroup,
    lucklySpell
  }
};
</script>

<style scoped lang="scss">
.goods-info-panel {
  .front-money-text {
    color: $red;
    font-size: $font-size-sm;
  }
  .collect-share {
    display: flex;
    flex: none;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: $text-gray;
      margin-left: 30rpx;
      font-size: $font-size-sm;
      line-height: 36rpx;
      .i {
        height: 36rpx;
      }
    }
  }
}
</style>
