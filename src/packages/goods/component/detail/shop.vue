<template>
  <view :class="items.id" >
    <view class="shop-panel card-group-box" v-if="isShow">
      <view class="cell-item">
        <view class="item-left">
          <image class="image" :src="items.params.logo" mode="aspectFit"/>
        </view>
        <view class="item-right">
          <view class="title">
            <view class="left-text" :style="{ color: items.style.namecolor }">
              {{ items.params.name }}
            </view>
            <view class="right-text">
              <lk-button
                v-for="(btn, index) in btnItems"
                :key="index"
                size="mini"
                round
                :type="btn.type"
                :color="btn.color"
                :to="btn.to"
                :custom-style="{ marginLeft: '12rpx' }"
              >
                {{ btn.text }}
              </lk-button>
            </view>
          </view>
          <view class="text">
            <lk-star
              :value="items.params.comprehensive"
              :size="10"
              :color="items.style.starcolor"
              :voidColor="items.style.starcolor"
            />
          </view>
        </view>
      </view>
      <view class="cell-item">
        <view class="score">
          <view
            class="item"
            :class="s.lineclass"
            v-for="(s, index) in scoreItems"
            :key="index"
          >
            <text class="text" :style="{ color: s.titlecolor }">
              {{ s.name }}
            </text>
            <text :style="{ color: s.scorecolor }">{{ s.text }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    isShow() {
      return !!this.addons.shop && this.items.params.id>0;
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    },
    btnItems() {
      return [
        {
          type: "default",
          text: "全部商品",
          style: {
            background: this.items.style.btncolor,
            color: this.items.style.btntextcolor
          },
          to: {
            path: "/pages/goods/list",
            query: {
              shop_id: this.items.params.id
            }
          }
        },
        {
          type: "danger",
          text: "进入店铺",
          color: this.theme.color,
          style: {
            background: this.items.style.btncolor,
            color: this.items.style.btntextcolor
          },
          to: {
            path: "/packages/shop/home",
            query: {
              shop_id: this.items.params.id
            }
          }
        }
      ];
    },
    scoreItems() {
      return [
        {
          name: "描述",
          titlecolor: this.items.style.titlecolor,
          scorecolor: this.items.style.scorecolor,
          text: this.items.params.desc
        },
        {
          name: "物流",
          titlecolor: this.items.style.titlecolor,
          scorecolor: this.items.style.scorecolor,
          lineclass: "lk-hairline--left",
          text: this.items.params.delivery
        },
        {
          name: "服务",
          titlecolor: this.items.style.titlecolor,
          scorecolor: this.items.style.scorecolor,
          lineclass: "lk-hairline--left",
          text: this.items.params.service
        }
      ];
    }
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.shop-panel {
  .cell-item {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx 30rpx;
    overflow: hidden;
    color: $text-color;
    font-size: $font-size;
    line-height: 48rpx;
    background-color: #fff;
  }

  .item-left {
    flex: 0.2;
    margin-right: 20rpx;
    position: relative;
    .image {
      width: 170rpx;
      height: 96rpx;
      display: block;
      border-radius: 16rpx;
      // background: $image-background;
    }
  }

  .item-right {
    flex: 1.8;
    flex-direction: column;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-text {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .right-text {
      display: flex;
      align-items: center;
    }

    .text {
      display: flex;
      align-items: center;
    }
  }

  .score {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .item {
      display: flex;
      flex-flow: row;
      justify-content: center;
      flex: 1;
      line-height: 1.4;
      .text {
        padding: 0 20rpx;
      }
    }
  }
}
</style>
