<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">
        {{ tab.name }}
      </lk-tab>
    </lk-tabs>
    <view class="list">
      <lk-load-list
        ref="load"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="item" v-for="(item, index) in list" :key="index">
          <view class="info">
            <view class="image">
              <image :src="item.picture" />
            </view>
            <view class="text">
              <view class="name">{{ item.goods_name }}</view>
              <view class="time">{{ item.discount_price }}</view>
              <view class="time">
                {{ item.timeText }}
              </view>
            </view>
            <view
              class="icon-bg"
              v-if="item.code_status != 0 && item.code_status != 2"
            >
              <lk-icon
                class-prefix="v-icon"
                color="#999"
                size="50"
                :name="
                  item.code_status == 1 ? 'v-icon-coupon-use' : 'v-icon-overdue'
                "
              />
            </view>
          </view>
        </view>
      </lk-load-list>
    </view>
    <view class="foot-btn-group fixed">
      <lk-button round block theme-color to="/packages/deliverycode/bindcode">
        绑定{{ receivegoodscode.copy_writing }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_RECEIVEGOODSCODELIST } from "@/common/interface/deliverycode";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
import { mapState } from "vuex";
export default {
  name: "packages-deliverycode-list",
  data() {
    return {
      tabs: [
        {
          name: "未使用",
          status: 2
        },
        {
          name: "已使用",
          status: 1
        },
        {
          name: "已过期",
          status: -1
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        status: 2
      },
      upOption: {
        empty: {
          tip: "没有相关领货码"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  computed: {
    ...mapState({
      receivegoodscode: ({ member }) => member.info.receivegoodscode
    })
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_RECEIVEGOODSCODELIST(this.params).then(({ data }) => {
        let list = data || [];
        list.forEach(e => {
          if (e.validity_type == 2) {
            e.timeText = `${formatDate(e.start_time)}~${formatDate(
              e.end_time
            )}`;
          } else if (e.validity_type == 1) {
            e.timeText = "永久有效";
          } else {
            e.timeText = "";
          }
          if (e.discount_type == 1) {
            e.discount_price = "全额免减";
          } else {
            e.discount_price = "减免" + e.discount_price + "元";
          }
        });
        this.concatList(list, list.length);
      });
    },
    onTab(index) {
      this.params.status = this.tabs[index].status;
      this.resetList();
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  padding-bottom: 190rpx;
}
.bindcode_btn {
  position: fixed;
  left: 20rpx;
  bottom: 20rpx;
  width: 710rpx;
}
.item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 8rpx;
  margin: 30rpx;
  padding: 40rpx 30rpx;
  position: relative;
  overflow: hidden;
}
.item:last-child {
  margin-bottom: 100rpx;
}

.item::after,
.item::before {
  content: "";
  display: block;
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #f8f8f8;
  border-radius: 50%;
  top: 50%;
  margin-top: -16rpx;
}

.item::after {
  right: -16rpx;
}

.item::before {
  left: -16rpx;
}

.item .info {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100rpx;
}

.item .info .image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: $image-background;
  margin-right: 10rpx;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.item .info .text {
  flex: 1;
}

.item .info .text .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.item .info .text .time {
  font-size: 24rpx;
  color: #909399;
}
.icon-bg {
  position: absolute;
  z-index: 1;
  right: 20rpx;
}
</style>
