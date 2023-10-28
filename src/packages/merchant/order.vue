<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="4"
      @change="onTab"
    >
      <lk-tab v-for="(tab, t) in tabs" :key="t">{{ tab.name }}</lk-tab>
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
            <view class="time">{{ item.create_time}}</view>
          </view>
          <view slot="rightIcon">
            <view class="down">
              +{{ item.direct_bonus ? item.direct_bonus : 0 }}
              <view :class="item.isshow ? 'move' : 'nomove'">
                <lk-icon name="arrow-down" />
              </view>
            </view>
            <view class="status">{{ item.status_name }}</view>
          </view>
        </lk-cell>

        <view :class="item.isshow ? 'show' : 'hidden'">
          <lk-goods-card
           v-for="(goods,g) in item.order_item_list" :key="g"
            :image="goods.pic_cover"
            :title="goods.goods_name"
            :to="'/packages/goods/detail?goods_id=' + goods.goods_id"
          >
            <view slot="num" class="foot">
              <view class="goodsnum">
                <text>x{{ goods.num }}</text>
              </view>
            </view>
          </lk-goods-card>
           <view class="promotion">
          推广费：{{ item.direct_bonus }}
        </view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_WAPGETPROMOTIONORDER } from "@/common/interface/merchants";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-merchant-order",
  data() {
    return {
      params: {},
      tabs: [
        {
          name: "所有订单",
          order_status: ''
        },
        {
          name: "已付款",
          order_status: 1
        },
        {
          name: "已发货",
          order_status: 2
        },
        {
          name: "已完成",
          order_status: 4
        }
      ]
    };
  },
  mixins: [loadMixin, bonusMixin],
  onLoad() {
    this.params = {
      page_index: 1,
      order_status: ""
    };
  },
  methods: {
    show(e) {
      e.isshow = !e.isshow;
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_WAPGETPROMOTIONORDER(this.params).then(res => {
        let list = res.data.data||[];
    list.forEach(item => {
          item["isshow"] = false;
        });
        this.concatList(list, res.data.total_count);
      });
    },
    onTab(e) {
      const order_status = this.tabs[e].order_status;
      this.params.order_status = order_status;
      this.resetList();
    },
  },
  filters: {
    formatDate(value) {
      return formatDate(value, "YYYY-MM-DD hh:mm");
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
.promotion{
  display: flex;
  justify-content: flex-end;
}
</style>

