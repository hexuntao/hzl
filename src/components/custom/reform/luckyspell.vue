<template>
  <view :class="items.id">
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
          <lk-goods-box
            flex-direction="row"
            :image="item.image"
            :goods-id="item.goods_id"
            :title="item.goods_name"
            :image-style="goodsImageStyle"
          >
            <view slot="imageTags">
              <view class="image-tag" v-if="imageTagBg">
                <text class="image-tag-text">{{ imageTagText }}</text>
              </view>
            </view>
            <view class="label" slot="label">
              <view v-if="items.params.style == 2">
                <lk-progress-bar :value="item.percent_num">
                  <view slot="progress-text">{{ item.percent_num_text }}</view>
                </lk-progress-bar>
              </view>
            </view>
            <view class="desc" slot="desc">
              <view class="price-label">
                <view class="price first-letter">{{ item.price_text }}</view>
                <view class="origin-price first-letter">{{
                  item.market_price_text
                }}</view>
              </view>
              <view class="avatar-label" v-if="item.avatars">
                <image
                  class="img"
                  :src="a.user_img"
                  v-for="(a, i) in item.avatars"
                  :key="i"
                />
              </view>
            </view>
            <view class="bottom" slot="bottom">
              <view class="bottom-box" v-if="items.params.style == 1">
                <image class="bg" :src="bottomBgSrc" mode="aspectFill" />
                <view class="texts">
                  <view class="txt">
                    <view
                      >{{ item.group_num }}人拼团，{{
                        item.win_num
                      }}人拼中</view
                    >
                    <view v-if="item.text"
                      >未拼中立得<text>{{
                        item.failure_reward_text
                      }}</text></view
                    >
                  </view>
                  <lk-icon
                    name="arrow"
                    size="12"
                    color="#ffffff"
                    @click="toDetail(item.goods_id)"
                  />
                </view>
              </view>
            </view>
          </lk-goods-box>
          <view class="footer-box" v-if="items.params.style == 2">
            <image class="bg" :src="footerBgSrc" mode="aspectFill" />
            <view class="texts">
              <image class="left-img" :src="footerTextSrc" mode="aspectFill" />
              <view class="txt">
                <view
                  >{{ item.group_num }}人拼团，{{ item.win_num }}人拼中</view
                >
                <view v-if="item.text"
                  >未拼中立得<text class="text-red">{{
                    item.failure_reward_text
                  }}</text></view
                >
              </view>
              <view class="right-txt" @click="toDetail(item.goods_id)">
                <text>立即拼团</text
                ><lk-icon name="arrow" size="12" color="#ffffff" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, yuan } from "@/common/utils";
import { GET_GOODSLIST, GET_GOODSPROMOTELIST } from "@/common/interface/goods";
import { mapGetters } from "vuex";
import mixinPriceText from "@/mixins/price-text";
export default {
  data() {
    return {
      imageTagText: "幸运拼团",
      list: [],
      goodsImageStyle: {}
    };
  },
  mixins: [mixin, mixinPriceText],
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
    imageTagBg() {
      let src = "";
      if (this.items.params.show_tag == 1) {
        src = this.static.baseImgPath + "goods-tag.png";
      }
      return src;
    },
    bottomBgSrc() {
      let src = this.static.baseImgPath + "style/luckyspell-bg-1.png";
      return src;
    },
    footerBgSrc() {
      let src = this.static.baseImgPath + "style/luckyspell-bg-2.png";
      return src;
    },
    footerTextSrc() {
      let src = this.static.baseImgPath + "hongbao.png";
      return src;
    }
  },
  created() {
    this.viewLoading = true;
    if (this.items.params.style == 2) {
      this.goodsImageStyle = {
        "border-bottom-left-radius": 0
      };
    }
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getGoodsList()
        .then(list => {
          this.viewLoading = false;
          list.forEach((e, i) => {
            e.image = e.pic_cover;
            e.price_text = yuan(e.group_price);
            let market_price =
              parseFloat(e.price) < parseFloat(e.market_price)
                ? yuan(e.market_price)
                : "";
            e.market_price_text = market_price;
            let percent_num =
              (parseInt(e.now_num || 0) / parseInt(e.group_num || 0)) * 100;
            e.percent_num = parseFloat(percent_num.toFixed(2));
            e.percent_num_text = `${e.percent_num}%`;
            e.failure_reward_text = e.text;
            e.group_num = e.group_num || 0;
            e.win_num = e.win_num || 0;
            let userArr = e.user || [];
            e.avatars = userArr.filter((e, i) => i < 2);
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
        promotion_type: 6, //表示幸运拼团
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
        obj.order = "2";
        obj.sort = "ASC";
      } else if (params.goodssort == "3") {
        obj.order = "2";
        obj.sort = "DESC";
      }
      return obj;
    },
    toDetail(goods_id) {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: goods_id
        }
      });
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

.vui-goods-group .item {
  width: calc(100% - 20rpx);
  font-size: $font-size-lg;
}
.desc {
  display: flex;
  justify-content: space-between;
}
.price-label {
  display: flex;
  align-items: center;
  .price {
    font-size: $font-size-lg;
    color: $red;
    font-weight: 700;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .origin-price {
    text-decoration: line-through;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $font-size-sm;
    color: $text-light;
    margin-left: 20rpx;
  }
}
.avatar-label {
  display: flex;
  position: relative;
  padding-left: 20rpx;
  // margin-top: 10rpx;
  height: 50rpx;
  .img {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50rpx;
    position: relative;
    margin-left: -16rpx;
    background: $image-background;
  }
}
.bottom-box {
  display: flex;
  position: relative;
  width: 100%;
  height: 76rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 8rpx;
  }
  .texts {
    display: flex;
    width: 100%;
    padding: 0 30rpx;
    color: #fff;
    position: relative;
    font-size: $font-size-sm;
    align-items: center;
    .txt {
      flex: 1;
    }
  }
}
.footer-box {
  display: flex;
  position: relative;
  width: 100%;
  height: 92rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
  }
  .texts {
    display: flex;
    width: 100%;
    padding: 0 30rpx;
    color: #fff;
    position: relative;
    font-size: $font-size-sm;
    align-items: center;
    .left-img {
      width: 50rpx;
      height: 56rpx;
      margin-right: 20rpx;
    }
    .txt {
      flex: 1;
      color: #bc7834;
    }
    .right-txt {
      display: flex;
      align-items: center;
    }
  }
}
</style>
