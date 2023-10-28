<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-goods-card
        cell-padding
        v-for="(item, index) in list"
        :key="index"
        :to="item.to"
        :image="item.pic_cover_mid"
        :title="item.goods_name"
        :price="item.sku_price.min_price"
      >
        <view slot="tags" class="tags">
          <view>
            已拼
            <text class="num"> {{ item.goods_total }} </text>
            件
          </view>
        </view>
        <view slot="footer" class="foot">
          <view class="user-box">
            <view class="img" v-for="(img, i) in item.user" :key="i">
              <image :src="img.user_img" />
            </view>
          </view>
        </view>
      </lk-goods-card>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_ASSEMBLELIST } from "@/common/interface/assemble";
export default {
  name: "packages-assemble-list",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          type: "goods",
          tip: "没有相关拼团商品"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.params.shop_id = query.shop_id || "";
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ASSEMBLELIST(this.params)
        .then(({ data }) => {
          let list = data.group_shopping_list || [];
          list.map(item => {
            item.to = {
              path: "/packages/goods/detail",
              query: { goods_id: item.goods_id }
            };
            if (item.user.length > 0) {
              item.user = item.user.filter((e, i) => i < 4);
            }
            return item;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.fw-blod {
  font-weight: 800;
}

.van-card {
  background: #ffffff;
}

.title {
  height: 80rpx;
}

.list .tags {
  display: flex;
  align-items: center;
}

.list .tags .num {
  color: #ffffff;
  background: $red;
  border-radius: 40rpx;
  height: 40rpx;
  padding: 0 20rpx;
  line-height: 40rpx;
}

.foot {
  display: flex;
  justify-content: flex-end;
}

.user-box {
  display: flex;
  align-items: center;
}

.user-box .img {
  width: 48rpx;
  height: 48rpx;
  border-radius: 40rpx;
  overflow: hidden;
  border: 1rpx solid #ddd;
  margin-left: -16rpx;
  background-color: $image-background;
}

.user-box .img image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  overflow: hidden;
}
</style>
