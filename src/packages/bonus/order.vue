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
              +{{ item.bonus || 0 }}
              <view :class="item.isshow ? 'move' : 'nomove'">
                <lk-icon name="arrow-down" />
              </view>
            </view>
            <view class="status">{{ item.status_name }}</view>
          </view>
        </lk-cell>

        <view :class="item.isshow ? 'show' : 'hidden'">
          <lk-goods-card
            card-size="sm"
            cell-padding
            :image="goods.picture ? goods.picture.pic_cover_mid : ''"
            :title="goods.goods_name"
            v-for="(goods, i) in item.order_item_list"
            :key="i"
            :goods-id="goods.goods_id"
          >
            <view slot="num" class="foot">
              <view class="goodsnum">
                <text>x{{ goods.num }}</text>
              </view>
              <view>{{ bonusTexts.common.bonus }}：{{ goods.bonus }}</view>
            </view>
          </lk-goods-card>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_ORDERLIST } from "@/common/interface/bonus";
import loadMixin from "@/mixins/load-list";
import { formatDate, addImgSrcDomain } from "@/common/utils";
import { mapState } from "vuex";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-bonus-order",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {},
      tabs: [
        {
          name: "所有订单",
          status: 0
        },
        {
          name: "已付款",
          status: 1
        },
        {
          name: "已收货",
          status: 3
        },
        {
          name: "已完成",
          status: 4
        }
      ]
    };
  },
  mixins: [loadMixin, bonusMixin],
  onLoad() {
    this.params = {
      page_index: 1,
      state: ""
    };
  },
  onShow() {
    this.pageStyle.title = this.bonusTexts.common.bonus_order;
  },
  computed: {
    ...mapState({
      bonusTexts: ({ bonus }) => bonus.texts
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
            e.goods_img = addImgSrcDomain(
              e.picture ? e.picture.pic_cover_mid : ""
            );
            e.create_time = formatDate(e.create_time, "YYYY-MM-DD hh:mm");
          });
          this.concatList(list, res.data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(e) {
      const status = this.tabs[e].status;
      this.params.status = status;
      this.resetList();
    }
  }
};
</script>

<style lang="scss" scoped>
.hidden {
  height: 0;
  transition: height 0.4s;
}
.show {
  transition: height 0.4s;
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
  padding-left: 80rpx;
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
</style>
