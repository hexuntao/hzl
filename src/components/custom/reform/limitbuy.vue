<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <view
        v-if="viewLoaded"
        class="vui-goods-group"
        :class="classes"
        :style="styles"
      >
        <view class="item" v-for="(item, index) in list" :key="index">
          <block v-if="items.params.style == 3">
            <lk-goods-box
              :flex-direction="flexDirection"
              :image-shape="imageShape"
              :image="item.image"
              :title="item.title_text"
              :goods-id="item.goods_id"
            >
              <view slot="imageTags">
                <view class="image-tag" v-if="imageTagBg">
                  <text class="image-tag-text">{{ imageTagText }}</text>
                </view>
                <view class="image-countdown-box" v-if="item.countdown_text">
                  <lk-count-down
                    :time="item.timestamp"
                    background="#ffffff"
                    color="#f44"
                  />
                </view>
              </view>
              <view class="price-label" slot="price">
                <view v-if="item.price_text" class="price-light-text"
                  >抢购价</view
                >
                <view v-if="item.price_text" class="price-text first-letter">{{
                  item.price_text
                }}</view>
              </view>
            </lk-goods-box>
          </block>
          <block v-if="items.params.style != 3">
            <lk-goods-box
              :flex-direction="flexDirection"
              :image-shape="imageShape"
              :image="item.pic_cover"
              :goods-id="item.goods_id"
            >
              <view slot="imageTags">
                <view
                  class="image-tag"
                  :class="'image-tag-style-' + items.params.style"
                  v-if="imageTagBg"
                >
                  <text class="image-tag-text">{{ imageTagText }}</text>
                </view>
              </view>
              <view class="info-box" slot="info">
                <image class="info-box-bg" :src="infoBoxBg" mode="widthFix" />
                <view class="box-label">
                  <view class="price-label">
                    <view v-if="item.price_text" class="price-light-text"
                      >抢购价</view
                    >
                    <view
                      v-if="item.price_text"
                      class="price-text first-letter"
                      >{{ item.price_text }}</view
                    >
                  </view>
                  <view class="countdown-box" v-if="item.countdown_text">
                    <view class="text">距结束</view>
                    <lk-count-down
                      :time="item.timestamp"
                      background="#ffffff"
                      :color="items.params.style == 1 ? '#2072f4' : '#f63e23'"
                    />
                  </view>
                </view>
              </view>
            </lk-goods-box>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import reform from "../../mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, yuan, addImgSrcDomain, wan } from "@/common/utils";
import { GET_GOODSPROMOTELIST } from "@/common/interface/goods";

export default {
  data() {
    return {
      imageTagText: "限时抢购",
      list: []
    };
  },
  mixins: [reform],
  computed: {
    ...mapGetters({
      routeInfo: "route",
      static: "static"
    }),
    classes() {
      let cls = this.items.params.style || this.items.params.showtype;
      return formatClass("goods-group-" + cls);
    },
    styles() {
      return formatStyle({
        background: this.items.style.background
      });
    },
    imageShape() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 3 ? "square" : "rectangle";
    },
    imageTagBg() {
      return this.items.params.show_tag == 1;
    },
    flexDirection() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 3 ? "row" : "";
    },
    infoBoxBg() {
      return `${this.static.baseImgPath}style/limitbuy-style-${this.items.params.style}-bg.png`;
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getGoodsList()
        .then(list => {
          this.viewLoading = false;
          list.forEach((e, i) => {
            e.image = e.pic_cover;
            if (this.items.params.style == 1) {
              e.image = e.activity_pic || e.pic_cover;
            }
            if (this.items.params.style == 3) {
              e.title_text = e.goods_name;
            }
            if (this.items.params.show_price == 1) {
              e.price_text = `${yuan(e.discount_price)}`;
            }
            if (this.items.params.show_countdown == 1) {
              e.countdown_text = `距结束`;
              e.timestamp = parseInt(e.end_time) * 1000;
            }
          });
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getGoodsList() {
      const params = this.getParams();
      return new Promise((resolve, reject) => {
        GET_GOODSPROMOTELIST(params)
          .then(({ data }) => {
            let arr = data.data || [];
            let list = [];
            if (this.items.params.recommendtype == 1) {
              const num = parseInt(this.items.params.recommendnum);
              arr.forEach((e, i) => {
                if (i < num) {
                  list.push(e);
                }
              });
            } else {
              list = arr;
            }
            resolve(list);
          })
          .catch(() => {
            reject();
          });
      });
    },
    getGoodsids() {
      let ids = "";
      let arr = [];
      let type = parseInt(this.items.params.recommendtype);
      if (type == 1 && this.items.data) {
        for (let i in this.items.data) {
          arr.push(this.items.data[i].goods_id);
        }
      }
      if (arr.join(",")) {
        ids = arr.join(",");
      }
      return ids;
    },
    getParams() {
      const params = this.items.params;
      let obj = {
        page_index: 1,
        page_size: params.recommendnum || 30,
        promotion_type: 5, //表示拼团
        goods_type: params.goodstype,
        shop_id: params.shop_id,
        recommend_type: params.recommendtype,
        order: "",
        sort: "",
        goods_ids: this.getGoodsids()
      };
      if (params.goodstype == "2" || this.items.shoptype == "2") {
        /**
         * goodstype == 2 为属于店铺商品
         * shoptype == 2 为店铺类型
         */
        obj.shop_id = this.routeInfo.query.shop_id
          ? this.routeInfo.query.shop_id
          : params.shop_id || 0;
      }
      // 店铺情况 goods_type 为 2
      if (obj.shop_id != 0 && this.items.shoptype == "2") {
        obj.goods_type = 2;
      }
      if (params.goodssort == "0") {
        obj.order = "1";
        obj.sort = "ASC";
      } else if (params.goodssort == "1") {
        obj.order = "1";
        obj.sort = "DESC";
      } else if (params.goodssort == "2") {
        obj.order = "3";
        obj.sort = "ASC";
      } else if (params.goodssort == "3") {
        obj.order = "3";
        obj.sort = "DESC";
      } else if (params.goodssort == "4") {
        obj.order = "4";
        obj.sort = "ASC";
      } else if (params.goodssort == "5") {
        obj.order = "4";
        obj.sort = "DESC";
      }
      return obj;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.vui-goods-group {
  height: auto;
  overflow: hidden;
  background: #f3f3f3;
  padding: 10rpx;
  display: flex;
  flex-wrap: wrap;
}
.item {
  position: relative;
  width: calc(50% - 20rpx);
  margin: 10rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  -webkit-box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  font-size: $font-size-lg;
}
.image-tag {
  position: absolute;
  top: 0;
  left: 20rpx;
  z-index: 1;
  text-align: center;
  line-height: 40rpx;
  height: 40rpx;
  background: linear-gradient(to top, #ff6034, #ee0a24);
  padding: 0 8rpx;
  border-bottom-left-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.image-tag .image-tag-text {
  color: #ffffff;
  font-size: $font-size-xs;
  position: relative;
  z-index: 1;
}

.vui-goods-group.goods-group-1 .item {
  width: calc(100% - 20rpx);
  border-bottom-left-radius: 68rpx;
  border-bottom-right-radius: 68rpx;
}

.vui-goods-group.goods-group-2 .item {
  width: calc(100% - 20rpx);
}

.vui-goods-group.goods-group-3 .item {
  width: calc(100% - 20rpx);
}

.image-tag.image-tag-style-1 {
  background: linear-gradient(to top, #0da0fe, #2072f4);
}
.label {
  border-radius: 8rpx;
  padding: 4rpx 8rpx;
  display: inline-block;
  white-space: nowrap;
  font-size: $font-size-sm;
  background-color: #eeee;
  color: #999;
}
.price-label {
  display: flex;
  align-content: center;
}
.price-light-text {
  line-height: 40rpx;
  font-size: $font-size-sm;
  color: $text-light;
  margin-right: 10rpx;
}
.price-text {
  font-weight: 700;
  color: $red;
  font-size: $font-size-lg;
}
.light-label {
  font-size: $font-size-sm;
  color: $text-light;
}
.image-countdown-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #ff6034, #ee0a24);
  font-size: $font-size-sm;
  color: #ffffff;
  border-bottom-left-radius: 20rpx;

  display: flex;
  padding: 10rpx 0;
  justify-content: center;
}
.info-box {
  position: relative;
  margin-top: -70rpx;
}
.info-box-bg {
  width: 100%;
  height: 140rpx;
  display: block;
}
.box-label {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .price-label {
    position: relative;
    .price-light-text {
      color: #ffffff;
    }
    .price-text {
      color: #ffffff;
    }
  }
  .countdown-box {
    position: relative;
    color: #ffffff;
    font-size: $font-size-sm;
    display: flex;
    align-content: center;
    margin: 10rpx 0;
    .text {
      margin-right: 10rpx;
    }
  }
}
</style>
