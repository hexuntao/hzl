<template>
  <view class="pages">
    <view class="header-tab">
      <lk-tabs
        v-if="tabs.length"
        :nav-per-view="tabs.length > 4 ? 'auto' : tabs.length"
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        @change="onTab"
      >
        <lk-tab v-for="(item, index) in tabs" :key="index">
          <view class="tab-item">
            <view class="name">{{ item.tag_name }}</view>
            <view class="state">{{ item.tag_status_text }}</view>
          </view>
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell v-for="(item, index) in list" :key="index">
        <lk-goods-card
          :image="item.goods_img"
          :title="item.goods_name"
          :price="item.seckill_price"
          :origin-price="item.price"
          :to="item.to"
        >
          <view slot="tags" class="tags">
            <view
              class="progress-bar"
              v-if="item.tag_status == 'started' || item.tag_status == 'going'"
            >
              <lk-progress-bar :value="item.robbed_percent_num" :num='item.robbed_num'>
                <view slot="progress-text">{{ item.robbed_num_text }}</view>
              </lk-progress-bar>
            </view>
            <view
              class="remain-info"
              v-else-if="
                item.tag_status == 'unstart' ||
                  item.tag_status == 'tomorrow_start'
              "
            >
              <view>{{ item.seckill_num }} 件</view>
              <text class="p">|</text>
              <view>{{ item.rob_time }}</view>
            </view>
          </view>
          <view slot="num">
            <lk-button
              size="mini"
              round
              :color="theme.color"
              :to="item.to"
              @click="onCollection(index)"
            >
              {{ item.btnText }}
            </lk-button>
          </view>
        </lk-goods-card>
      </lk-cell>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_SECKILLLIST, GET_SECKILLTAG } from "@/common/interface/seckill";
import {
  SET_GOODSCOLLECT,
  CANCEL_GOODSCOLLECT
} from "@/common/interface/goods";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
const tagStatusText = {
  started: "已开抢",
  going: "抢购中",
  unstart: "即将开抢",
  tomorrow_start: "明日开抢"
};
export default {
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20,
        condition_time: "",
        condition_day: "",
        tag_status: ""
      },
      tabs: [],
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "没有相关秒杀商品"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    if (query.shop_id) {
      this.params.shop_id = query.shop_id;
    }
  },
  methods: {
    loadInitEnd() {
      setTimeout(() => {
        let params = {};
        if (this.params.shop_id) {
          params.shop_id = this.params.shop_id;
        }
        GET_SECKILLTAG(params).then(({ data }) => {
          data.forEach(e => {
            e.tag_status_text = tagStatusText[e.tag_status];
          });
          this.tabs = data;
          if (this.tabs.length) {
            this.params.condition_time = this.tabs[0].condition_time;
            this.params.condition_day = this.tabs[0].condition_day;
            this.params.tag_status = this.tabs[0].tag_status;
          }
          this.$load.triggerUpScroll();
        });
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_SECKILLLIST(this.params)
        .then(({ data }) => {
          let list = data.sec_goods_list || [];
          list.forEach(e => {
            e.robbed_num_text = `已抢${e.robbed_num}件`;
            e.robbed_percent_num = parseFloat(e.robbed_percent);
            e.to = "/packages/goods/detail?goods_id=" + e.goods_id;
            if (e.tag_status == "started" || e.tag_status == "going") {
              e.btnText = "马上抢";
            } else if (
              e.tag_status == "unstart" ||
              e.tag_status == "tomorrow_start"
            ) {
              e.btnText = e.is_collection ? "取消收藏" : "收藏";
            }
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      this.params.condition_time = this.tabs[index].condition_time;
      this.params.condition_day = this.tabs[index].condition_day;
      this.params.tag_status = this.tabs[index].tag_status;
      this.resetList();
    },
    onCollection(index) {
      const item = this.list[index];
      if (item.is_collection) {
        CANCEL_GOODSCOLLECT({ goods_id: item.goods_id }).then(res => {
          this.$Prompt.toast("取消成功");
          item.is_collection = false;
          item.btnText = item.is_collection ? "取消收藏" : "收藏";
        });
      } else {
        SET_GOODSCOLLECT({
          goods_id: item.goods_id,
          seckill_id: item.seckill_id
        }).then(res => {
          this.$Prompt.toast("收藏成功");
          item.is_collection = true;
          item.btnText = item.is_collection ? "取消收藏" : "收藏";
        });
      }
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header-tab {
  position: fixed;
  width: 100%;
  height: 88rpx;
  z-index: 10;
}
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  line-height: 36rpx;
  .state {
    font-size: $font-size-sm;
  }
}
.progress-bar {
  width: 70%;
}
.remain-info {
  display: flex;
  align-items: center;
  line-height: 40rpx;
  font-size: $font-size-sm;
  color: $text-gray;
  .p {
    padding: 0 10rpx;
  }
}
</style>
