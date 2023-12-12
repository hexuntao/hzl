<template>
  <view class="pages">
    <lk-goods-card
      cell-padding
      :image="goodsInfo.pic_cover"
      :title="goodsInfo.goods_name"
      :price="goodsInfo.start_money"
      :to="'/packages/goods/detail?goods_id=' + goodsInfo.id"
    >
      <view class="goods-tags" slot="tags">
        <lk-count-down
          :background="theme.color"
          color="#ffffff"
          :time="countTime"
          @finish="finish(goodsInfo.bargain_id)"
        />
        <text class="text">砍价将失效</text>
      </view>
    </lk-goods-card>
    <view class="cell-group">
      <view class="money-text cell-padding">
        现价
        <view class="num price-color first-letter">
          {{ nowBargainMoney | yuan }}
        </view>
        元，还能砍
        <view class="num price-color first-letter">
          {{ canBargainMoney | yuan }}
        </view>
        元
      </view>

      <view
        v-if="canBargainMoney == 0 && isMyBargain == 1"
        class="canBargainMoney"
        >恭喜你，已砍到最低价！</view
      >

      <invite-btn-group :goods-data="goodsInfo" v-if="isMyBargain == 1" />
      <!-- <share-btn-group
        v-if="isMyBargain == 2 && uid"
        :can-bargin-loading="canBarginLoading"
        :is-can-bargain="isCanHelpBargain"
        :is-show-my-bargain-btn="isShowMyBargainBtn"
        @help-bargain="onHelpBargain"
        @bargain="onBargain"
      /> -->

      <view class="btn-group">
        <lk-button
          v-if="is_help_bargain && isMyBargain == 2 && uid"
          round
          type="danger"
          block
          class="btn"
          bing-mobile
          :loading="canBarginLoading"
          @click="onHelpBargain"
        >
          帮好友砍一刀
        </lk-button>
        <lk-button
          v-if="isMyBargain == 2 && uid && !is_help_bargain"
          round
          type="danger"
          block
          class="btn"
          bing-mobile
          @click="onBargain"
        >
          {{ is_helpuid_add_bargain == 1 ? "继续砍价" : "发起砍价" }}
        </lk-button>
      </view>
    </view>
    <view class="cell-group">
      <view class="divider">
        <text>砍价帮</text>
      </view>
      <view>
        <lk-cell
          v-for="(item, index) in helpBargainList"
          :key="index"
          :icon="item.help_user_headimg"
          icon-size="40"
          :title="item.help_name"
          :label="'帮忙砍掉了' + item.help_price + '元'"
        />
      </view>
    </view>
    <closeTips v-if="close" />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import {
  GET_BARGAINDETAIL,
  SUB_BARGAIN,
  CLOSEUSERBARGAIN
} from "@/common/interface/bargain";

import inviteBtnGroup from "./component/invite-btn-group";
import shareBtnGroup from "./component/share-btn-group";
import closeTips from "./component/colsetips";
export default {
  name: "packages-bargain-detail",
  data() {
    return {
      close: false,
      is_help_bargain: "", //帮砍
      is_helpuid_add_bargain: "", //帮砍人是否参加砍价
      params: {},
      uid: "", //自身uid
      goodsInfo: {},
      countTime: 0,
      nowBargainMoney: 0,
      canBargainMoney: 0,
      helpBargainList: [],

      isMyBargain: 0, //是否自身的砍价 1:是，2别人的砍价

      isCanHelpBargain: false,
      isShowMyBargainBtn: false, //是否显示我要砍价

      canBarginLoading: false
    };
  },
  onLoad(query) {
    this.params.goods_id = query.goods_id;
    this.params.bargain_id = query.bargain_id;
    this.params.bargain_uid = query.bargain_uid; //分享进来的用户uid
    if (query.anchor_id) {
      this.params.anchor_id = query.anchor_id;
    }
      if (query.bargain_record_id) {
      this.params.bargain_record_id = query.bargain_record_id;
    }
    this.getData();
  },
  methods: {
    finish(bargain_id) {
      CLOSEUSERBARGAIN({ bargain_id: bargain_id }).then(({ code }) => {
        if (code == 0) {
          this.close = true;
        }
      });
    },
    getData() {
      GET_BARGAINDETAIL(this.params, { isShowLoading: true })
        .then(({ data }) => {
          this.is_help_bargain = data.is_help_bargain;
          this.is_helpuid_add_bargain = data.is_helpuid_add_bargain;
          let detail = data || {};
          this.isMyBargain = detail.is_my_bargain ? 1 : 2;

          this.isShowMyBargainBtn = !detail.is_buy;
          this.nowBargainMoney = detail.now_bargain_money;
          this.canBargainMoney = parseFloat(detail.can_bargain_money);
          this.countTime = parseInt(detail.end_bargain_time) * 1000;
          this.helpBargainList = detail.help_bargain_list || [];
          this.isCanHelpBargain =
            detail.is_help_bargain && !!this.canBargainMoney;
          this.uid = detail.bargain_uid;
          this.record_id = detail.bargain_record_id;

          let goodsData = detail;
          goodsData.id = detail.goods_id;
          goodsData.goods_image = detail.pic_cover;
          goodsData.goods_name = detail.goods_name;
          goodsData.goods_type = detail.goods_type;
          goodsData.state = 1;
          goodsData.sku = {
            list: detail.sku.list || [],
            tree: detail.sku.tree || []
          };
          goodsData.sku.list.forEach(e => {
            e.price = parseFloat(detail.now_bargain_money);
          });
          if (this.params.anchor_id) {
            goodsData.anchor_id = this.params.anchor_id;
          }
          this.goodsInfo = goodsData;
          this.setWxShare({
            title: detail.goods_name,
            imgUrl: detail.pic_cover,
            path: "packages/bargain/detail",
            query: {
              goods_id: detail.goods_id,
              bargain_id: detail.bargain_id,
              bargain_uid: detail.bargain_uid,
              bargain_record_id: detail.bargain_record_id
            },
            desc: `快来帮我砍价吧！`
          });
        })
        .catch(() => {});
    },
    onHelpBargain() {
      this.canBarginLoading = true;
      SUB_BARGAIN({
        bargain_record_id: this.record_id
      })
        .then(({ message }) => {
          this.$Prompt.toast(message);
          this.isCanHelpBargain = !this.isCanHelpBargain;
          this.canBarginLoading = false;
          this.getData();
        })
        .catch(() => {
          this.canBarginLoading = false;
        });
    },
    onBargain() {
      let query = {
        goods_id: this.params.goods_id,
        bargain_id: this.params.bargain_id,
        bargain_uid: this.uid
      };
      if (this.params.anchor_id) {
        query.anchor_id = this.params.anchor_id;
      }
      this.$Navigate.replace({
        path: "/packages/bargain/detail",
        query: query
      });
    }
  },
  components: {
    inviteBtnGroup,
    shareBtnGroup,
    closeTips
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
  background-color: #ffffff;
}
.money-text {
  display: flex;
  align-items: center;
  justify-content: center;
  .num {
    padding: 0 10rpx;
  }
}
.btn-group {
  padding: $cell-padding;
  .btn {
    margin-top: 20rpx;
  }
  .btn:first-child {
    margin-top: 0;
  }
}
.canBargainMoney {
  text-align: center;
  color: $red;
}
</style>
