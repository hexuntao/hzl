<template>
  <view :class="items.id">
    <view class="card-group-box" style="margin-bottom:0">
      <!-- <lk-cell is-link to="/pages/property/index">
        <lk-icon
          square
          class-prefix="v-icon"
          :name="items.params.iconclass"
          slot="icon"
          :color="items.style.titleiconcolor"
        />
        <text slot="title" :style="{ color: items.style.titlecolor }">
          {{ items.params.title }}
        </text>
        <text
          class="head-text"
          :style="{ color: items.style.titleremarkcolor }"
        >
          {{ items.params.remark }}
        </text>
      </lk-cell> -->
      <!-- <lk-grid :column="3">
        <lk-grid-item v-for="(item, index) in panelItems" :key="index">
          <view class="box" @tap="toLink(item.link)">
            <view class="title" :style="{ color: items.style.textcolor }">
              {{ item.title }}
            </view>
            <text class="text" :style="{ color: items.style.highlight }">
              {{ item.text }}
            </text>
          </view>
        </lk-grid-item>
      </lk-grid> -->
      <view class="card-panel">
        <view class="item" @click="toLink('/packages/property/balance')">
          <text class="num">{{ member.info.balance || 0 }}</text>
          <text class="text">{{ member.texts.balance_style }}</text>
        </view>
        <view class="item" @click="toLink('/packages/property/points')">
          <text class="num">{{ member.info.point || 0 }}</text>
          <text class="text">{{ member.texts.point_style }}</text>
        </view>
        <view class="item" @click="toLink('/packages/coupon/list')">
          <text class="num">{{ member.info.coupon_num || 0 }}</text>
          <text class="text">优惠券</text>
        </view>
        <view class="item item-more" @click="toLink('/pages/property/index')">
          <view class="num">
            <lk-icon name="card" size="24" :color="theme.color" />
          </view>
          <text class="text">更多资产</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    ...mapState(["member", "config"]),
    panelItems() {
      const { data } = this.items;
      const { info, texts } = this.member;
      const { coupontype, giftvoucher, store, blockchain } = this.config.addons;
      const arr = [];
      for (let i in data) {
        if (data[i].is_show == "1") {
          let obj = {};
          switch (data[i].key) {
            case "balance":
              obj = {
                title: texts.balance_style,
                text: info.balance || 0,
                link: "/packages/property/balance"
              };
              arr.push(obj);
              break;
            case "points":
              obj = {
                title: texts.point_style,
                text: info.point || 0,
                link: "/packages/property/points"
              };
              arr.push(obj);
              break;
            case "coupontype":
              if (coupontype) {
                obj = {
                  title: data[i].text,
                  text: info.coupon_num || 0,
                  link: "/packages/coupon/list"
                };
                arr.push(obj);
              }
              break;
            case "giftvoucher":
              if (giftvoucher) {
                obj = {
                  title: data[i].text,
                  text: info.giftvoucher_num || 0,
                  link: "/packages/giftvoucher/list"
                };
                arr.push(obj);
              }
              break;
            case "store":
              if (store) {
                obj = {
                  title: data[i].text,
                  text: info.store_card_num || 0,
                  link: "/packages/consumercard/list"
                };
                arr.push(obj);
              }
              break;
            case "blockchain":
              if (blockchain) {
                obj = {
                  title: data[i].text,
                  text: info.digital_assets || 0,
                  link: "/pages/blockchain/list"
                };
                arr.push(obj);
              }
              break;
          }
        }
      }
      return arr;
    }
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.head-text {
  font-size: $font-size-sm;
}
.box {
  display: flex;
  flex-flow: column;
  justify-content: center;
  text-align: center;
  position: relative;
  line-height: 40rpx;
  padding: 20rpx 0;
  .title {
    font-size: $font-size;
    color: $text-gray;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 20rpx;
    text-overflow: ellipsis;
  }
  .text {
    color: $red;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 160rpx;
    margin: 0 auto;
    height: 40rpx;
  }
}
.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
    width: 25%;
  }
  .text {
    font-size: $font-size;
  }
  .num {
    color: $red;
    height: 40rpx;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-more {
    position: relative;
  }
  .item-more::before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 10rpx;
    border-left-color: #f1f1f1;
    position: absolute;
    left: 10rpx;
  }
  .item-more::after {
    content: "";
    display: block;
    width: 10rpx;
    height: 80rpx;
    position: absolute;
    left: 0px;
    top: -10rpx;
    margin-top: 40rpx;
    background: linear-gradient(to right, rgb(255, 255, 255), #f1f1f1);
  }
}
</style>
