<template>
  <view class="goods-group card-group-box">
    <lk-cell title="推荐商品">
      <view slot="rightIcon" class="right-text" @click="toAddGoods">
        添加商品
      </view>
    </lk-cell>
    <view class="goods-list">
      <lk-goods-card
        v-for="(item, index) in list"
        :key="index"
        cell-padding
        card-size="sm"
        :title="item.goods_name"
        :image="item.pic_cover"
        :price="item.price"
        :origin-price="item.market_price"
      >
        <view class="btn-group" slot="num">
          <lk-button
            class="btn"
            round
            theme-color
            size="mini"
            :loading="item.btnLoading"
            :plain="!!item.is_recommend"
            @click="recommend(index)"
          >
            {{ item.is_recommend ? "取消主推" : "设为主推" }}
          </lk-button>
          <lk-button class="btn" round size="mini" @click="cancle(index)">
            移除
          </lk-button>
        </view>
      </lk-goods-card>
    </view>
  </view>
</template>

<script>
import {
  SET_LIVEANCHORGOODSCANCLE,
  SET_LIVEANCHORGOODSRECOMMEND
} from "../../interface";
let cancelFlag = 1;
export default {
  data() {
    return {};
  },
  props: {
    anchor_id: [String, Number],
    list: Array
  },
  methods: {
    toAddGoods() {
      this.$Navigate.push({
        path: "/packages/live/anchor/goods",
        query: { anchor_id: this.anchor_id }
      });
    },
    recommend(index) {
      const item = this.list[index];
      item.btnLoading = true;
      let params = {
        anchor_id: this.anchor_id,
        goods_id: item.goods_id,
        is_recommend: item.is_recommend ? 0 : 1
      };
      SET_LIVEANCHORGOODSRECOMMEND(params)
        .then(({ message }) => {
          item.btnLoading = false;
          this.$Prompt.toast({ title: message, icon: "success" });
          this.$emit("refresh", {
            goods_id: item.goods_id,
            is_recommend: item.is_recommend ? 0 : 1
          });
        })
        .catch(() => {
          item.btnLoading = false;
        });
    },
    cancle(index) {
      const item = this.list[index];
      if (!cancelFlag) {
        return;
      }
      cancelFlag = 0;
      let params = {
        anchor_id: this.anchor_id,
        goods_id: item.goods_id,
        is_add: item.is_add ? 0 : 1
      };
      SET_LIVEANCHORGOODSCANCLE(params)
        .then(({ message }) => {
          cancelFlag = 1;
          this.$Prompt.toast({ title: message, icon: "success" });
          this.$emit("refresh");
        })
        .catch(() => {
          cancelFlag = 1;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-list {
  height: 480rpx;
  overflow: hidden auto;
  background: #ffffff;
  .btn-group {
    .btn {
      margin-left: 10rpx;
    }
  }
}
.right-text {
  font-size: $font-size-sm;
  color: $red;
}
</style>
