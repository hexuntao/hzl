<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <block v-if="!showWaterfall">
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
              :mintitle="item.sub_title"
              :price="item.price_text"
              :origin-price="item.market_price_text"
              :sales="item.sales_text"
              :vipshowprice="item.vip_show_price"
              :commission="item.commission"
            >
              <view class="image-tag" slot="imageTags">
                <image
                  :src="imageTagBg"
                  class="image"
                  v-if="imageTagBg && item.imageTagText"
                />
                <text
                  class="image-tag-text"
                  v-if="imageTagBg && item.imageTagText"
                  >{{ item.imageTagText }}</text
                >
              </view>
            </lk-goods-box>
          </view>
        </view>
      </block>
      <block v-if="showWaterfall">
        <lk-waterfall v-model="list" ref="waterfallList" @get-list="getList">
          <view class="left-list" slot="left">
            <view class="item" v-for="(item, index) in leftList" :key="index">
              <lk-goods-box
                :showWaterfall="showWaterfall"
                :flex-direction="flexDirection"
                :image-shape="imageShape"
                :image="item.logo"
                :goods-id="item.goods_id"
                :title="item.goods_name"
                :mintitle="item.sub_title"
                :price="item.price_text"
                :origin-price="item.market_price_text"
                :sales="item.sales_text"
                :vipshowprice="item.vip_show_price"
                :pic-size="item.pic_size"
                :commission="item.commission"
              >
                <view class="image-tag" slot="imageTags">
                  <image
                    :src="imageTagBg"
                    class="image"
                    v-if="imageTagBg && item.imageTagText"
                  />
                  <text
                    class="image-tag-text"
                    v-if="imageTagBg && item.imageTagText"
                    >{{ item.imageTagText }}</text
                  >
                </view>
              </lk-goods-box>
            </view>
          </view>
          <view class="right-list" slot="right">
            <view class="item" v-for="(item, index) in rightList" :key="index">
              <lk-goods-box
                :showWaterfall="showWaterfall"
                :flex-direction="flexDirection"
                :image-shape="imageShape"
                :image="item.logo"
                :goods-id="item.goods_id"
                :title="item.goods_name"
                :mintitle="item.sub_title"
                :price="item.price_text"
                :origin-price="item.market_price_text"
                :sales="item.sales_text"
                :vipshowprice="item.vip_show_price"
                :commission="item.commission"
                :pic-size="item.pic_size"
              >
                <view class="image-tag" slot="imageTags">
                  <image
                    :src="imageTagBg"
                    class="image"
                    v-if="imageTagBg && item.imageTagText"
                  />
                  <text
                    class="image-tag-text"
                    v-if="imageTagBg && item.imageTagText"
                    >{{ item.imageTagText }}</text
                  >
                </view>
              </lk-goods-box>
            </view>
          </view>
        </lk-waterfall>
      </block>
    </view>
  </view>
</template>

<script>
import reform from '../../mixin/reform';
import waterfall from '@/mixins/waterfall';
import { formatStyle, formatClass } from '@/common/utils/stringify';
import { pxTorpx, yuan, wan } from '@/common/utils';
import { GET_GOODSLIST, GET_GOODSCUSTOMLIST } from '@/common/interface/goods';
import { mapGetters } from 'vuex';
const goodstag = {
  1: '推荐',
  2: '新品',
  3: '热卖',
  4: '促销',
  5: '包邮',
};
export default {
  data() {
    return {
      list: [],
    };
  },
  mixins: [reform, waterfall],
  computed: {
    ...mapGetters({
      routeInfo: 'route',
      static: 'static',
    }),
    classes() {
      let cls = this.items.params.style || this.items.params.showtype;
      return formatClass('goods-group-' + cls);
    },
    showWaterfall() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 2;
    },
    styles() {
      return formatStyle({
        background: this.items.style.background,
      });
    },
    imageShape() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 1 ? 'rectangle' : 'square';
    },
    imageTagBg() {
      let src = '';
      if (this.items.params.show_tag == 1) {
        src = this.static.baseImgPath + 'goods-tag.png';
      }
      return src;
    },
    flexDirection() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 4 ? 'row' : '';
    },
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getGoodsList()
        .then(list => {
          this.viewLoading = false;

          // 兼容旧数据
          if (typeof this.items.params.show_price == 'undefined') {
            this.items.params.show_price = 1;
            this.items.params.show_market_price = 1;
            this.items.params.show_sales = 1;
          }

          list.forEach((e, i) => {
            e.image = e.logo;
            if (this.items.params.style == 1) {
              e.image = e.activity_pic || e.logo;
            }
            e.imageTagText = goodstag[e.goods_types] || '';
            e.price_text = this.items.params.show_price == 1 ? e.price : '';
            if (this.items.params.show_market_price == 1) {
              let market_price =
                parseFloat(e.price) < parseFloat(e.market_price)
                  ? e.market_price
                  : '';
              e.market_price_text = market_price;
            } else {
              e.market_price_text = '';
            }
            if (this.items.params.style != 3) {
              e.sales_text = this.items.params.show_sales == 1 ? e.sales : '';
              e.commission_text =
                this.items.params.show_commission == 1 && e.commission
                  ? e.commission + '积分'
                  : '';
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
      const num = parseInt(this.items.params.recommendnum);
      const params =
        this.items.params.recommendtype == 1
          ? this.getGoodsids()
          : this.getParams();
      return new Promise((resolve, reject) => {
        if (this.items.params.recommendtype == 1) {
          if (params.goods_ids) {
            GET_GOODSCUSTOMLIST(params)
              .then(({ data }) => {
                let list = data || [];
                resolve(list);
              })
              .catch(() => {
                reject();
              });
          } else {
            resolve([]);
          }
        } else {
          GET_GOODSLIST(params)
            .then(({ data }) => {
              let list = [];
              data.goods_list.forEach((e, i) => {
                if (i < num) {
                  list.push(e);
                }
              });
              resolve(list);
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    getGoodsids() {
      let ids = {};
      let arr = [];
      let type = parseInt(this.items.params.recommendtype);
      if (type == 1 && this.items.data) {
        for (let i in this.items.data) {
          arr.push(this.items.data[i].goods_id);
        }
      }
      if (arr.join(',')) {
        ids = { goods_ids: arr.join(',') };
      }
      return ids;
    },
    getParams() {
      const params = this.items.params;
      let obj = {
        page_index: 1,
        page_size: this.items.params.recommendnum || 30,
        order: '',
        sort: '',
        goods_type: params.goodstype,
      };
      if (params.goodstype == '2' || this.items.shoptype == '2') {
        /**
         * goodstype == 2 为属于店铺商品
         * shoptype == 2 为店铺类型
         */
        obj.shop_id = this.routeInfo.query.shop_id
          ? this.routeInfo.query.shop_id
          : params.shop_id || 0;
      }
      if (obj.shop_id != 0 && this.items.shoptype == '2') {
        obj.goods_type = 2;
      }
      if (params.goodssort == '0') {
        obj.order = 'create_time';
        obj.sort = 'ASC';
      } else if (params.goodssort == '1') {
        obj.order = 'create_time';
        obj.sort = 'DESC';
      } else if (params.goodssort == '2') {
        obj.order = 'sales';
        obj.sort = 'ASC';
      } else if (params.goodssort == '3') {
        obj.order = 'sales';
        obj.sort = 'DESC';
      } else if (params.goodssort == '4') {
        obj.order = 'collects';
        obj.sort = 'ASC';
      } else if (params.goodssort == '5') {
        obj.order = 'collects';
        obj.sort = 'DESC';
      }
      return obj;
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.vui-goods-group {
  height: auto;
  overflow: hidden;
  background: #f3f3f3;
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
}
.left-list {
  width: 50vw;
  padding-left: 10rpx;
}
.right-list {
  width: 50vw;
  padding-right: 10rpx;
}
.item {
  position: relative;
  //width: calc(50% - 20rpx);
  margin: 10rpx 10rpx;
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
  width: 56rpx;
  height: 46rpx;
  z-index: 1;
  text-align: center;
  line-height: 40rpx;
}
.image-tag .image {
  width: 56rpx;
  height: 46rpx;
  position: absolute;
  left: 0;
  top: 0;
}
.image-tag .image-tag-text {
  color: #ffffff;
  font-size: $font-size-xs;
  position: relative;
  z-index: 1;
}
.fanyong {
  display: flex;
  font-size: 22rpx;
  line-height: 28rpx;
  height: 28rpx;
  border-radius: 8rpx;
  overflow: hidden;
  border: 1rpx solid $red;
  //max-width: 160rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  .fan {
    color: #ffffff;
    background: $red;
    padding: 0 2rpx;
  }
  .yong {
    color: $red;
    padding: 0 2rpx;
  }
}

.vui-goods-group.goods-group-1 .item {
  width: calc(100% - 20rpx);
  font-size: $font-size-lg;
}

.vui-goods-group.goods-group-2 .item {
  // width: calc(50% - 20rpx);
}

.vui-goods-group.goods-group-3 .item {
  width: calc(33.33334% - 20rpx);
  font-size: $font-size-sm;
}
.vui-goods-group.goods-group-4 .item {
  width: calc(100% - 20rpx);
  font-size: $font-size-lg;
}
</style>
