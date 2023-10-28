<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="2"
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
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="item-left">
          <lk-goods-card
            :title="item.goods_name"
            :image="item.pic_cover"
            :desc="item.sku_name"
            :num="item.stock"
          />
        </view>
        <view class="item-right lk-hairline--left">
          <view
            class="item-icon"
            v-for="(icon, i) in item.icons"
            :key="i"
            @click="toLink(icon.to)"
          >
            <lk-icon :name="icon.name" size="20" />
            <text>{{ icon.text }}</text>
          </view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_DEPOTLIST } from "@/common/interface/channel";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-channel-depot-list",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20,
        stock_status: 1
      },
      tabs: [
        {
          name: "出售中",
          type: 1
        },
        {
          name: "售罄",
          type: 2
        }
      ]
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    onTab(index) {
      this.params.stock_status = this.tabs[index].type;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_DEPOTLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            e.icons = [
              {
                text: "明细",
                name: "description",
                to: "/packages/channel/depot/detail?sku_id=" + e.sku_id
              }
            ];
            if (this.params.stock_status == 2) {
              e.icons.push({
                text: "补货",
                name: "bag-o",
                to: "/packages/channel/goods?type=purchase"
              });
            } else {
              e.icons.push({
                text: "分享",
                name: "share",
                to: {
                  path: "/packages/goods/share",
                  query: {
                    goods_id: e.goods_id,
                    channel_id: e.channel_id
                  }
                }
              });
            }
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toLink(to) {
      this.$Navigate.push(to);
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  padding: $cell-padding;
  .item-left {
    flex: 1;
  }
  .item-right {
    flex: none;
    display: flex;
    margin-left: 20rpx;
    .item-icon {
      display: flex;
      flex-flow: column;
      align-content: center;
      padding-left: 30rpx;
      justify-content: center;
      font-size: $font-size-sm;
    }
  }
}

.item::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
