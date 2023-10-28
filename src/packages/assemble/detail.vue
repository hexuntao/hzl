<template>
  <view class="pages">
    <result-state message="拼团已结束" v-if="status == -1" />
    <lk-goods-card
      v-if="status != -1"
      cell-padding
      :image="goodsInfo.pic_cover"
      :title="goodsInfo.goods_name"
      :price="goodsInfo.group_price"
      :origin-price="goodsInfo.price"
      :to="'/packages/goods/detail?goods_id=' + goodsInfo.goods_id"
    >
      <view class="goods-tags" slot="tags">
        <lk-count-down
          v-if="status !== 1"
          :background="theme.color"
          color="#ffffff"
          :time="countTime"
          @finish="onFinish"
        />
        <text class="text" v-if="statusText">{{ statusText }}</text>
      </view>
    </lk-goods-card>
    <view class="footer" v-if="status == 0">
      <view class="divider">
        <text>成功拼团好友</text>
      </view>
      <view class="buyer-list">
        <avatar-group :list="buyerList" :num="groupNum" />
      </view>
      <view v-if="status !== 1">
        <view class="tips">
          再邀请
          <text class="num">
            {{ diffNum }}
          </text>
          位朋友下单即可开团成功
        </view>
        <view class="btn-group">
          <lk-button
            v-if="!order_id"
            block
            round
            type="danger"
            :color="theme.gradient"
            class="btn"
            :to="toGoodsDetail"
          >
            参与拼团
          </lk-button>
          <lk-button
            block
            round
            type="warning"
            :color="theme.cart"
            class="btn"
            open-type="share"
            @click="onInvite"
          >
            邀请朋友
          </lk-button>
        </view>
        <view class="order-text" v-if="order_id > 0">
          <text @click="toLink('/packages/order/detail?order_id=' + order_id)">
            查看订单详情 >
          </text>
        </view>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import avatarGroup from "./component/avatar-group";
import resultState from "./component/rusult-state";
import { GET_ASSEMBLEDETAIL } from "@/common/interface/assemble";
function countDiff(group = 0, now = 0) {
  let group_num = parseInt(group);
  let now_num = parseInt(now);
  return !isNaN(group_num - now_num) ? group_num - now_num : 0;
}
export default {
  name: "packages-assemble-detail",
  data() {
    return {
      record_id: "",
      goodsInfo: {},
      status: -2,
      countTime: 0,
      buyerList: [],
      groupNum: 0,
      diffNum: 0,
      order_id: -1
    };
  },
  computed: {
    statusText() {
      let text = "";
      if (this.status === 0) {
        text = "拼团将失效";
      }
      if (this.status == 1) {
        text = "拼单成功";
      }
      return text;
    },
    toGoodsDetail() {
      return {
        path: "/packages/goods/detail",
        query: {
          goods_id: this.goodsInfo.goods_id,
          record_id: this.record_id
        }
      };
    }
  },
  onLoad(query) {
    this.record_id = query.record_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_ASSEMBLEDETAIL({ record_id: this.record_id }, { isShowLoading: true })
        .then(({ data }) => {
          const detail = data || {};
          this.goodsInfo = detail.goods;
          this.status = parseInt(detail.status);
          this.countTime = parseInt(detail.finish_time) * 1000;
          this.groupNum = detail.group_num;
          this.order_id = detail.self_order_id;
          let arr = [];
          data.buyer_list.forEach(e => {
            if (e.user_headimg) {
              let obj = {};
              obj.avatar = e.user_headimg;
              if (e.is_head) {
                obj.tag = "团长";
              }
              arr.push(obj);
            }
          });
          this.buyerList = arr;
          this.diffNum = countDiff(detail.group_num, detail.now_num);

          this.setWxShare({
            title: detail.goods.goods_name,
            imgUrl: detail.goods.pic_cover,
            desc: `快来帮我拼团吧！`
          });
        })
        .catch(error => {});
    },
    onFinish() {
      this.$Prompt.toast("拼团已结束！");
      this.status = -1;
    },
    toLink(to) {
      this.$Navigate.push(to);
    },
    onInvite() {
      // #ifdef H5
      this.$Prompt.toast(
        this.$store.state.isWeixin
          ? "微信环境下点击右上角分享"
          : "手机浏览器点击底部工具栏分享"
      );
      // #endif
    }
  },
  components: {
    avatarGroup,
    resultState
  }
};
</script>

<style lang="scss" scoped>
.goods-tags {
  display: flex;
  align-items: center;
  .text {
    font-size: $font-size-sm;
    color: $text-light;
    padding: 0 10rpx;
  }
}
.footer {
  padding: 20rpx 0;
  margin: 20rpx 0;
  background-color: #ffffff;
}
.buyer-list {
  padding: $cell-padding;
}
.tips {
  display: flex;
  justify-content: center;
  padding: $cell-padding;
  color: $text-gray;
  .num {
    color: $red;
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
.order-text {
  padding: $cell-padding;
  font-size: $font-size-sm;
  color: $text-light;
  text-align: center;
}
</style>
