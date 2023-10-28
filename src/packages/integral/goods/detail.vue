<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <block v-if="goodsData">
      <view class="swiper-box">
        <lk-swiper :height="swiperHeight" :list="swiperList" />
      </view>
      <lk-goods-info-panel
        :name="goodsInfo.title"
        :price="goodsInfo.goodsPrice"
        :origin-price="goodsInfo.marketPrice"
        :point="goodsInfo.point"
        :foot-info="goodsInfo.footInfo"
      />
      <view class="cell-group limit-group" v-if="showLimitCell">
        <lk-cell>
          <view slot="icon" class="title">
            限购
          </view>
          <view class="value">
            每人限购{{ goodsData.limit_num }}件，每天提供{{
              goodsData.day_num
            }}件
          </view>
        </lk-cell>
      </view>
      <view class="cell-group desc-group">
        <lk-tabs
          nav-per-view="2"
          :active-color="theme.color"
          :line-color="theme.color"
        >
          <lk-tab title="详情">
            <view class="descript richtext">
              <lk-parser
                v-if="goodsData && goodsData.description"
                show-with-animation
                lazy-load
                :html="goodsData.description"
              />
              <view v-else class="empty">暂无详情</view>
            </view>
          </lk-tab>
          <lk-tab title="属性">
            <view class="attribute">
              <view v-if="goodsData && goodsData.goods_attribute_list.length">
                <lk-cell
                  v-for="(item, index) in goodsData.goods_attribute_list"
                  :key="index"
                >
                  <view class="cell">
                    <view class="title">{{ item.attr_value }}</view>
                    <view class="value">{{ item.attr_value_name }}</view>
                  </view>
                </lk-cell>
              </view>
              <view class="empty" v-else>暂无属性</view>
            </view>
          </lk-tab>
        </lk-tabs>
      </view>
      <lk-sku
        v-model="showSku"
        :info="goodsData"
        action="buy"
        @get-active-info="onGoodsInfo"
        @action="onSkuAction"
      />
      <lk-goods-action-bar>
        <lk-goods-action-icon
          icon="wap-home-o"
          text="首页"
          :color="theme.color"
          to="/pages/mall/index"
        />
        <lk-sku-actions
          :info="goodsInfo"
          direct-click
          @action="showSku = true"
        />
      </lk-goods-action-bar>
    </block>
    <lk-reform-skeleton type="3" v-else />
  </view>
</template>

<script>
import { GET_GOODSDETAIL } from "@/common/interface/integral";
import videoPopup from "../component/video-popup";
export default {
  name: "packages-integral-goods-detail",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {},
      goodsData: null,
      showSku: false,

      goodsInfo: {},
      video: "",

      swiperList: [],
      swiperHeight: "",

      specsText: "",
      showLimitCell: false
    };
  },
  computed: {},
  created() {
    const systemInfo = uni.getSystemInfoSync();
    this.swiperHeight = systemInfo.safeArea.width + "px";
  },
  onLoad(query) {},
  methods: {
    callLoad(query) {
      this.params.goods_id = query.goods_id;
      this.loadData();
    },
    onGoodsInfo(data) {
      this.goodsInfo = {
        ...data,
        footInfo: [
          { name: "运费:", value: this.goodsData.shipping_fee },
          { name: "兑换量:", value: (this.goodsData.sales || 0) + "笔" }
        ]
      };
      if (data.isHasSku) {
        this.specsText = data.selectedSkuComb
          ? data.selectedSkuComb.sku_name
          : "请选择规格";
      } else {
        this.specsText = "已选：" + data.selectedNum + "件";
      }
    },
    onSkuAction(action, data) {
      const params = {};
      params.sku_list = [];
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum;
      sku_list_obj.sku_id = data.selectedSkuComb.id;
      params.sku_list.push(sku_list_obj);
      this.$Navigate.push({
        path: "/packages/integral/order/confirm",
        query: {
          params: JSON.stringify(params)
        }
      });
    },
    loadData() {
      GET_GOODSDETAIL(this.params).then(({ data }) => {
        this.goodsData = this.packageGoodsData(data);
        this.video = data.goods_detail.video;
        let arr = [];
        if (data.goods_detail.video) {
          arr.unshift({ video: data.goods_detail.video });
        }
        data.goods_detail.goods_images.forEach(e => {
          arr.push({
            image: e
          });
        });
        this.swiperList = arr;
        this.showLimitCell =
          data.goods_detail.day_num > 0 && data.goods_detail.limit_num > 0;
        this.pageStyle.title = data.goods_detail.goods_name;
      });
    },
    // 组装商品所需数据
    packageGoodsData(data) {
      let info = {};
      // 组装sku所需数据格式
      info = data.goods_detail;
      info.goods_image = data.goods_detail.goods_images[0];
      info.point = data.goods_detail.point_exchange;
      info.goods_type = 10;
      info.is_allow_buy =
        typeof data.is_allow_buy == "boolean" ? data.is_allow_buy : true;
      return info;
    }
  },
  components: {
    videoPopup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 200rpx;
}
.swiper-box {
  position: relative;
}
.cell-group {
  margin: 20rpx 0;
}
.limit-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    color: $text-light;
  }
}
.attribute {
  .cell {
    display: flex;
    flex-flow: row;
    .title {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}
</style>
