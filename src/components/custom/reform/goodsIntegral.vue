<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <block v-if="!showWaterfall">
        <view
          class="vui-goods-group"
          v-if="viewLoaded"
          :class="classes"
          :style="styles"
        >
          <view class="item" v-for="(item, index) in list" :key="index">
            <lk-goods-box
              :image="item.logo"
              :title="item.goods_name"
              :price="item.price"
              :point="item.point_exchange"
              :tag="item.type"
              :goods-id="item.goods_id"
              is-point-goods
            />
          </view>
        </view>
      </block>
      <block v-if="showWaterfall">
        <lk-waterfall v-model="list" ref="waterfallList" @get-list="getList">
          <view class="left-list" slot="left">
            <view class="item" v-for="(item, index) in leftList" :key="index">
              <lk-goods-box
                :showWaterfall="showWaterfall"
                :image="item.logo"
                :title="item.goods_name"
                :price="item.price"
                :point="item.point_exchange"
                :tag="item.type"
                :goods-id="item.goods_id"
                is-point-goods
              >
              </lk-goods-box>
            </view>
          </view>
          <view class="right-list" slot="right">
            <view class="item" v-for="(item, index) in rightList" :key="index">
              <lk-goods-box
                :showWaterfall="showWaterfall"
                :image="item.logo"
                :title="item.goods_name"
                :price="item.price"
                :point="item.point_exchange"
                :tag="item.type"
                :goods-id="item.goods_id"
                is-point-goods
              >
              </lk-goods-box>
            </view>
          </view>
        </lk-waterfall>
      </block>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import waterfall from "@/mixins/waterfall";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, yuan } from "@/common/utils";
import { GET_GOODSLIST } from "@/common/interface/integral";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [mixin, waterfall],
  computed: {
    ...mapGetters({
      routeInfo: "route"
    }),
    classes() {
      return formatClass("goods-group-" + this.items.params.showtype);
    },
    styles() {
      return formatStyle({
        background: this.items.style.background
      });
    },
    showWaterfall() {
      let cls = this.items.params.style || this.items.params.showtype;
      return cls == 2;
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getGoodsList()
        .then(list => {
          this.list = list;
          this.viewLoading = false;
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
      return new Promise((resolve, reject) => {
        if (this.items.params.recommendtype == "0") {
          GET_GOODSLIST(this.getParams())
            .then(({ data }) => {
              let list = data.goods_list.filter(
                (e, i) => i < this.items.params.recommendnum
              );
              resolve(list);
            })
            .catch(() => {
              reject();
            });
        } else {
          let list = [];
          if (this.items.data) {
            for (let i in this.items.data) {
              this.items.data[i].logo = this.items.data[i].pic_cover_mid;
              list.push(this.items.data[i]);
            }
          }
          resolve(list);
        }
      });
    },
    getParams() {
      const $this = this;
      const params = $this.items.params;
      let obj = {
        page_index: 1,
        page_size: this.items.params.recommendnum || 30,
        order: "",
        sort: ""
      };
      if (params.goodssort == "0") {
        obj.order = "sale_date";
        obj.sort = "ASC";
      } else if (params.goodssort == "1") {
        obj.order = "sale_date";
        obj.sort = "DESC";
      } else if (params.goodssort == "2") {
        obj.order = "sales";
        obj.sort = "ASC";
      } else if (params.goodssort == "3") {
        obj.order = "sales";
        obj.sort = "DESC";
      } else if (params.goodssort == "4") {
        obj.order = "point_exchange";
        obj.sort = "ASC";
      } else if (params.goodssort == "5") {
        obj.order = "point_exchange";
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
  padding: 8rpx;
  display: flex;
  flex-wrap: wrap;
}

.item {
  position: relative;
  // width: calc(50% - 16rpx);
  margin: 8rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  -webkit-box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  font-size: $font-size-lg;
}

.vui-goods-group.goods-group-1 .item {
  width: calc(100% - 16rpx);
  font-size: $font-size-lg;
}

.vui-goods-group.goods-group-2 .item {
  // width: calc(50% - 16rpx);
}

.vui-goods-group.goods-group-3 .item {
  width: calc(33.33334% - 16rpx);
  font-size: $font-size-sm;
}
</style>
