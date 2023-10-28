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
      <lk-cell
        :title="item.shop_name"
        :to="item.to"
        clickable
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="logo" slot="icon">
          <view class="img">
            <image :src="item.shop_logo" mode="aspectFill" />
          </view>
        </view>
        <view class="right" slot="rightIcon">
          <lk-icon name="like" color="#f44" />
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_SHOPCOLLECTLIST } from "@/common/interface/shop";
import loadMixin from "@/mixins/load-list";
let showFlag = 0;
export default {
  name: "package-shop-collect",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          type: "shop",
          tip: "暂无店铺收藏"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(option) {},
  onShow() {
    if (showFlag == 1) {
      this.resetList();
    }
  },
  onHide() {
    showFlag = 1;
  },
  onUnload() {
    showFlag = 0;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_SHOPCOLLECTLIST(this.params)
        .then(({ data }) => {
          let list = data.shop_list;
          list.forEach(e => {
            e.to = {
              path: "/packages/shop/home",
              query: { shop_id: e.shop_id }
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 200rpx;
  height: 100rpx;
  margin-right: 20rpx;
}

.logo .img {
  border-radius: 8rpx;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.logo .img image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.right {
  display: flex;
  align-items: flex-end;
}
</style>
