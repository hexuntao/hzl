<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="4"
      :line="true"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell v-for="(item, index) in list" :key="index" class="cellall">
        <lk-cell @click="show(item)">
          <view slot="title">
            <view class="title">{{ item.order_no }}</view>
            <view class="time">{{ item.create_time }}</view>
          </view>
          <view slot="rightIcon">
            <view class="down">
              +{{ item.commission || 0 }}
              <view :class="item.isshow ? 'move' : 'nomove'">
                <lk-icon name="arrow-down" />
              </view>
            </view>
            <view class="status">{{ item.status_name }}</view>
          </view>
        </lk-cell>
        <view :class="item.isshow ? 'show' : 'hidden'">
          <lk-cell class="user">
            <view class="info" slot="title">
              <view class="img">
                <image :src="item.buyer_headimg" mode="scaleToFill" />
              </view>
              <view class="text">
                <span>{{ item.buyerInfoText }}</span>
              </view>
            </view>
          </lk-cell>
          <lk-goods-card
            card-size="sm"
            cell-padding
            :image="goods.picture.pic_cover_mid"
            :title="goods.goods_name"
            v-for="(goods, i) in item.order_item_list"
            :key="i"
            :goods-id="goods.goods_id"
          >
            <view slot="num" class="foot">
              <view class="goodsnum">
                <text>x{{ goods.num }}</text>
              </view>
              <view
                >{{ distributeTexts.commission }}：{{ goods.commission }}</view
              >
            </view>
          </lk-goods-card>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_ORDERLIST } from "@/common/interface/distribute";
import { formatDate } from "@/common/utils";
import { mapState } from "vuex";
export default {
  name: "packages-distribute-order",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      ishow: false,
      order_no: "",
      params: {
        page_index: 1,
        page_size: 20,
        order_status: null
      },
      tabs: [
        {
          name: "所有订单",
          status: null
        },
        {
          name: "已付款",
          status: 1
        },
        {
          name: "已发货",
          status: 2
        },
        {
          name: "已完成",
          status: 4
        }
      ]
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  onShow() {
    this.pageStyle.title = this.distributeTexts.distribution_order;
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts
    })
  },
  methods: {
    show(e) {
      e.isshow = !e.isshow;
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ORDERLIST(this.params)
        .then(res => {
          let list = res.data.data || [];
          list.forEach(e => {
            e.isshow = false;
            e.create_time = formatDate(e.create_time, "YYYY-MM-DD hh:mm");
            e.buyerInfoText = this.buyerInfoText(e);
          });
          this.concatList(list, res.data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      this.params.order_status = this.tabs[index].status;
      this.resetList();
    },
    buyerInfoText({
      buyer_nick_name,
      buyer_user_tel,
      buyer_user_name,
      buyer_id
    }) {
      if (buyer_nick_name) return buyer_nick_name;
      if (buyer_user_tel) return buyer_user_tel;
      if (buyer_user_name) return buyer_user_name;
      if (buyer_id) return buyer_id;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.hidden {
  height: 0;
  transition: height 0.4s;
}
.show {
  transition: all 0.4s;
  height: auto;
}
.nomove {
  transform: rotate(0deg);
  animation: move 1.4;
  transform-origin: 50% 45%;
  transition: all 0.4s;
  margin-left: 8rpx;
}
.move {
  transform: rotate(-180deg);
  animation: move 1.4s;
  transform-origin: 50% 45%;
  transition: all 0.4s;
  margin-left: 8rpx;
}
@keyframes move {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes nomove {
  0% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
/deep/.lk-cell {
  padding: 20rpx 14rpx;
}
.goodsnum {
  padding-left: 100rpx;
}
.cellall {
  margin: 20rpx;
  width: 95%;
  border-radius: 20rpx;
}
.down {
  display: flex;
  color: #b3b4b5;
}
.pages {
  background-color: #f3f3f3;
  width: 100%;
  height: 100vh;
}
.title {
  white-space: nowrap;
}

.time {
  font-size: 24rpx;
  color: #606266;
}

.status {
  color: #ff454e;
}

.user .info {
  display: flex;
  align-items: center;
}
.user .info .img {
  width: 100rpx;
  height: 100rpx;
  overflow: hidden;
}
.user .info .img image {
  width: 100%;
  height: 100%;
  display: block;
}
.user .info .text {
  flex: 1;
  padding-left: 16rpx;
}
</style>
