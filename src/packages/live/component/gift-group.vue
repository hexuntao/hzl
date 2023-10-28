<template>
  <lk-popup
    v-model="show"
    position="bottom"
    round
    :mask-opacity="0"
    wrpper-style="background: #161823"
  >
    <view class="gift-group">
      <view class="gift-tabs">
        <view
          class="name"
          :class="active === index ? 'active' : ''"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="onTab(index)"
        >
          {{ tab.cate_name }}
        </view>
      </view>
      <view class="gift-warp">
        <lk-load-list-view
          :fixed="false"
          ref="load"
          @init="loadInit"
          :down="downOption"
          @down="downCallback"
          :up="upOption"
          @up="upCallback"
        >
          <view class="gift-list">
            <view
              class="item"
              v-for="(item, index) in list"
              :key="index"
              :class="giftActive === index ? 'active' : ''"
              @click="clickGift(index)"
            >
              <image class="image" :src="item.gift_img" mode="aspectFit" />
              <view class="name">
                {{ item.gift_name }}
              </view>
              <view class="text">
                {{ item.point_text }}
              </view>
            </view>
          </view>
        </lk-load-list-view>
      </view>
      <view class="gift-foot">
        <view class="text">
          <view>
            <image class="zs-icon" :src="zsIcon" />
          </view>
          <view>{{ pointCountText }}</view>
        </view>
        <view class="btn">
          <lk-button round theme-color size="small" @click="send">
            赠送
          </lk-button>
        </view>
      </view>
    </view>
  </lk-popup>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { GET_LIVEGIFTLIST } from "../interface";
import loadMixin from "@/mixins/load-list";
import { debounce } from "@/common/utils";

export default {
  data() {
    return {
      active: 0,
      pointCount: 0,
      params: {
        gift_cate_id: "",
        page_index: 1,
        page_size: 10
      },
      upOption: {
        auto: false,
        empty: {
          use: false
        }
      },
      tabs: [],
      giftActive: -1
    };
  },
  mixins: [loadMixin],
  props: {
    value: Boolean
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    ...mapGetters(["static"]),
    ...mapState({
      memberText: ({ member }) => member.texts,
      memberInfo: ({ member }) => member.info
    }),
    zsIcon() {
      return this.static.baseImgPath + "zs-icon.png";
    },
    pointCountText() {
      return this.pointCount + this.memberText.point_style;
    },
    selectItem() {
      return this.list[this.giftActive] ? this.list[this.giftActive] : "";
    }
  },
  destroyed() {},
  methods: {
    loadInitEnd() {
      GET_LIVEGIFTLIST(this.params)
        .then(({ data }) => {
          this.pointCount = parseInt(data.member_total_point);
          this.tabs = data.gift_cate_list || [];
          if (this.tabs.length) {
            this.params.gift_cate_id = this.tabs[this.active].gift_cate_id;
          }
          this.$load.triggerUpScroll();
        })
        .catch(() => {});
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVEGIFTLIST(this.params)
        .then(({ data }) => {
          const list = data.live_gift_list.data || [];
          list.forEach(e => {
            e.point_text = e.price + this.memberText.point_style;
          });
          this.concatList(list, data.live_gift_list.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      const tab = this.tabs[index];
      this.active = index;
      this.params.gift_cate_id = tab.gift_cate_id;
      this.resetList();
    },
    clickGift(index) {
      this.giftActive = this.giftActive === index ? "" : index;
    },
    send: debounce(function(obj) {
      if (!this.selectItem) {
        return this.$Prompt.toast("请选择礼物");
      }
      const price = parseInt(this.selectItem.price);
      if (this.pointCount < price) {
        return this.$Prompt.toast(this.memberText.point_style + "不足");
      }
      this.pointCount = this.pointCount - price;
      const info = {
        avatar: this.memberInfo.member_img,
        uid: this.memberInfo.uid,
        name: this.memberInfo.name,
        resource: this.selectItem.show_gift_img || this.selectItem.gift_img,
        type: this.selectItem.gift_type,
        aniType: this.selectItem.animation_type,
        id: this.selectItem.gift_id,
        label: "送出" + this.selectItem.gift_name,
        price: this.selectItem.price
      };
      this.$emit("send-gift", info);
    }, 100)
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.gift-group {
  background-color: #161823;
}
.gift-tabs {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  padding: $cell-padding;
  white-space: nowrap;
  overflow: auto hidden;
  .name {
    padding: 0 20rpx;
    color: #ffffff;
  }
  .name.active {
    font-weight: 700;
    color: #f3cf4a;
  }
}
.gift-warp {
  width: 100%;
  margin: 20rpx 0;
  height: 400rpx;
  overflow-y: auto;
}
.gift-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: $font-size-sm;
    text-align: center;
    width: 25%;
    height: 200rpx;
    background-color: transparent;
    .image {
      display: block;
      width: 100rpx;
      height: 100rpx;
    }
    .name {
      height: 40rpx;
      line-height: 40rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 80%;
    }
    .text {
      height: 24rpx;
      font-size: $font-size-xs;
      color: $text-light;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 80%;
    }
  }
  .item.active {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 16rpx;
    color: #ffffff;
    .text {
      color: #ffffff;
    }
  }
}
.gift-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100rpx;
  padding: $cell-padding;
  .text {
    display: flex;
    align-items: center;
    color: #ffffff;
    .zs-icon {
      display: block;
      width: 35rpx;
      height: 29rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
