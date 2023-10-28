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
          <lk-goods-box
            :flex-direction="flexDirection"
            :image-shape="imageShape"
            :image="item.image"
            :goods-id="item.goods_id"
            :title="item.goods_name"
            :price="item.group_price_text"
            :origin-price="item.price_text"
          >
            <view slot="imageTags">
              <view class="image-tag" v-if="imageTagBg">
                <text class="image-tag-text">{{ imageTagText }}</text>
              </view>
            </view>
            <view slot="label">
              <view class="label chengtuan-label" v-if="item.label_text">{{
                item.label_text
              }}</view>
            </view>
            <view slot="priceRight">
              <block v-if="items.params.style != 3">
                <view class="label price-label" v-if="item.sales_text">{{
                  item.sales_text
                }}</view>
              </block>
              <block v-if="items.params.style == 3">
                <view class="avatar-label" v-if="item.avatars">
                  <image
                    class="img"
                    :src="a.user_img"
                    v-for="(a, i) in item.avatars"
                    :key="i"
                  />
                </view>
              </block>
            </view>
            <view slot="sales">
              <block v-if="items.params.style != 3">
                <view class="avatar-label" v-if="item.avatars">
                  <image
                    class="img"
                    :src="a.user_img"
                    v-for="(a, i) in item.avatars"
                    :key="i"
                  />
                </view>
              </block>
            </view>
          </lk-goods-box>
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
      imageTagText: "拼团",
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
      return cls == 1 ? "rectangle" : "square";
    },
    imageTagBg() {
      let src = "";
      if (this.items.params.show_tag == 1) {
        src = this.static.baseImgPath + "goods-tag.png";
      }
      return src;
    },
    flexDirection() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 4 ? "row" : "";
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
            if (this.items.params.show_group_price == 1) {
              e.group_price_text = e.group_price;
            }
            if (
              this.items.params.show_price == 1 &&
              this.items.params.style != 3
            ) {
              let price =
                parseFloat(e.group_price) < parseFloat(e.price) ? e.price : "";
              e.price_text = price;
            }
            if (this.items.params.show_group_num == 1) {
              e.label_text = "已有" + wan(e.group_num) + "人成团";
            }
            if (
              this.items.params.show_group_sales == 1 &&
              this.items.params.style != 3
            ) {
              e.sales_text = "已拼" + wan(e.goods_total) + "件";
            }
            if (this.items.params.show_group_avatar == 1) {
              let userArr = e.user || [];
              e.avatars = userArr.filter((e, i) => i < 2);
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
        promotion_type: 2, //表示拼团
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
      } else if (params.goodssort == "4") {
        obj.order = "3";
        obj.sort = "ASC";
      } else if (params.goodssort == "5") {
        obj.order = "3";
        obj.sort = "DESC";
      } else if (params.goodssort == "6") {
        obj.order = "4";
        obj.sort = "ASC";
      } else if (params.goodssort == "7") {
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
  font-size: $font-size-lg;
}

.vui-goods-group.goods-group-2 .item {
  width: calc(50% - 20rpx);
}

.vui-goods-group.goods-group-3 .item {
  width: calc(33.33334% - 20rpx);
  font-size: $font-size-sm;
}
.vui-goods-group.goods-group-4 .item {
  width: calc(100% - 20rpx);
  font-size: $font-size-lg;
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
.chengtuan-label {
  background-color: #fcf2ec;
  color: #ec632c;
}
.price-label {
  background-color: #ffeded;
  color: #f23030;
}
.avatar-label {
  display: flex;
  position: relative;
  padding-left: 20rpx;
  margin-top: 10rpx;
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
</style>
