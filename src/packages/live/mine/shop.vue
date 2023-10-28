<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.uname"
      :custom-style="{
        background: '#ffffff',
        color: '#323233',
        padding: '20rpx 30rpx',
        minHeight: 'auto'
      }"
    >
      <view class="info">
        <view class="tag" v-if="info.tagText">{{ info.tagText }}</view>
      </view>
      <view class="rigth" slot="right">
        <lk-icon
          class-prefix="v-icon"
          name="v-icon-help-02"
          @click="showHelpTip"
        />
      </view>
    </lk-header-panel>
    <view class="cell-group">
      <lk-cell :title="'全部商品  ' + goodsCount">
        <text class="text-link" @click="toLink">挑选商品</text>
      </lk-cell>
    </view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-goods-box
            :title="item.goods_name"
            :price="item.price"
            :origin-price="item.market_price"
            :image="item.pic_cover"
            :goods-id="item.goods_id"
          >
          </lk-goods-box>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_LIVEANCHORINFO } from "@/common/interface/live";
import { GET_LIVESHOPGOODSLIST } from "../interface";
import { wan } from "@/common/utils";
import { mapGetters } from "vuex";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-live-mine-shop",
  data() {
    return {
      info: {
        anchor_id: 0
      },
      params: {
        page_index: 1,
        page_size: 20,
        anchor_id: 0
      },
      upOption: {
        auto: false
      },
      goodsCount: 0
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad() {},
  onShow() {
    if (this.params.anchor_id) {
      this.resetList();
    }
  },
  methods: {
    loadInitEnd() {
      this.getInfo().then(() => {
        this.params.anchor_id = this.info.anchor_id;
        this.$load.triggerUpScroll();
      });
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        GET_LIVEANCHORINFO()
          .then(({ data }) => {
            this.info = data;
            this.info.tagText = this.info.room_no
              ? "房号: " + this.info.room_no
              : "";
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVESHOPGOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.anchor_goods_list || [];
          this.goodsCount = data.count || 0;
          this.concatList(list, data.count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    showHelpTip() {
      this.$Prompt.modal({
        content:
          "直播时推荐的商品将从直播小店中挑选，直播预告将会显示小店所有商品。",
        showCancel: false
      });
    },
    toLink() {
      this.$Navigate.push(
        "/packages/live/mine/goods?anchor_id=" + this.info.anchor_id
      );
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  margin-top: 16rpx;
}
.tag {
  font-size: $font-size-sm;
  border-radius: 99999rpx;
  height: 44rpx;
  display: inline-flex;
  align-items: center;
  line-height: 28rpx;
  color: #ffffff;
  padding: 8rpx 16rpx;
  background: linear-gradient(to right, #ff5b4b, #ff417b);
}
.cell-group {
  margin: 20rpx 0;
}
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  .item {
    width: calc(50% - 20rpx);
    margin: 10rpx;
    border-radius: 20rpx;
    overflow: hidden;
    font-size: $font-size-lg;
  }
}
</style>
