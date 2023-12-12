<template>
  <view :class="items.id">
    <view class="shop-header">
      <image :src="imageBg" class="image" />
      <view class="box" :class="boxClasses" v-if="styleType">
        <view class="logo">
          <view class="img">
            <image :src="shopInfo.shop_logo" mode="aspectFit" />
          </view>
        </view>
        <view class="info">
          <view class="info-name">
            <view class="name">{{ shopInfo.shop_name }}</view>
            <view class="tag" v-if="styleType != 4" @click="onCollect">
              <lk-icon color="inherit" size="10" :name="collectInfo.icon" />
              {{ collectInfo.text }}
            </view>
          </view>
          <view class="info-foot">
            <view class="fans">
              <text>粉丝</text>
              <text>{{ shopInfo.fans_number }}</text>
            </view>
            <view class="score">
              <text class="text">综合评分</text>
              <lk-star
                :value="shopInfo.score"
                :color="starColor"
                :voidColor="starColor"
              />
            </view>
            <view class="tag" v-if="styleType == 4" @click="onCollect">
              <lk-icon color="inherit" size="10" :name="collectInfo.icon" />
              {{ collectInfo.text }}
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="menu-group">
        <view class="menu-icon">
          <lk-icon name="v-icon-menu1" color="#fff" class-prefix="v-icon" />
        </view>
      </view> -->
    </view>
    <lk-cell>
      <lk-button
        :style="{ marginRight: '10rpx' }"
        size="small"
        round
        :icon="btn.icon"
        :to="btn.to"
        v-for="(btn, index) in btnItems"
        :key="index"
      >
        {{ btn.text }}
      </lk-button>
    </lk-cell>
    <lk-cell
      :title="info.store.title"
      :to="info.store.to"
      is-link
      v-if="info.store"
    />
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapState, mapGetters } from "vuex";
import { SET_COLLECTSHOP, CANCEL_COLLECTSHOP } from "@/common/interface/shop";
import { GET_QLKEFUINFO } from "@/common/interface/message";
export default {
  data() {
    return {
      collect: {
        loading: false,
        isCollect: false
      },
      seller_code: ""
    };
  },
  mixins: [reform],
  props: {
    info: Object
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    ...mapGetters({
      static: "static",
      routeInfo: "route"
    }),
    shopInfo() {
      let info = this.info || {};
      info.score = info.evaluate ? info.evaluate.comprehensive : 0;
      this.collect.isCollect = !!info.is_collection;
      if (info.has_store) {
        info.store = {
          title: "门店列表",
          to: {
            path: "/pages/store/list",
            query: {
              shop_id: this.routeInfo.query.shop_id
            }
          }
        };
      }
      return info;
    },
    btnItems() {
      const arr = [
        {
          icon: "search",
          text: "搜索",
          to: {
            path: "/packages/mall/search",
            query: {
              type: "goods",
              shop_id: this.routeInfo.query.shop_id
            }
          }
        },
        {
          icon: "",
          text: "全部商品",
          to: {
            path: "/pages/goods/list",
            query: {
              shop_id: this.routeInfo.query.shop_id
            }
          }
        }
      ];
      if (this.seller_code) {
        arr.push({
          icon: "",
          text: "联系客服",
          to: {
            path: "/packages/message/chat",
            query: {
              seller_code: this.seller_code
            }
          }
        });
      }
      return arr;
    },
    styleType() {
      let type = 0;
      if (this.items.params && this.items.params.styletype) {
        type = this.items.params.styletype;
      }
      if (!this.items.params) {
        type = 1;
      }
      return type;
    },
    imageBg() {
      let src = "";
      if (this.items.style && this.items.style.backgroundimage) {
        src = this.items.style.backgroundimage;
      } else if (this.styleType) {
        src =
          this.static.baseImgPath +
          "style/shop-head-0" +
          this.styleType +
          ".jpg";
      }
      return src;
    },
    boxClasses() {
      return "box-" + this.styleType;
    },
    collectInfo() {
      return {
        text: "收藏",
        icon: !!this.collect.isCollect ? "like" : "like-o"
      };
    },
    starColor() {
      let colors = {
        1: "#f44",
        2: "#043f8d",
        3: "#fff",
        4: "#fff",
        5: "#f44",
        6: "#f44"
      };
      return colors[this.styleType];
    }
  },
  mounted() {
    this.getConfig().then(() => {
      if (this.addons.qlkefu) {
        GET_QLKEFUINFO({
          shop_id: this.routeInfo.query.shop_id,
          goods_id: 0
        }).then(({ data }) => {
          if (data.is_use) {
            this.seller_code = data.seller_code;
          }
        });
      }
    });
  },
  methods: {
    onCollect() {
      const shopId = this.routeInfo.query.shop_id;
      this.collect.loading = true;
      const API = !this.collect.isCollect
        ? SET_COLLECTSHOP
        : CANCEL_COLLECTSHOP;
      API({ shop_id: shopId })
        .then(res => {
          this.collect.isCollect = !this.collect.isCollect;
          this.collect.loading = false;
        })
        .catch(() => {
          this.collect.loading = false;
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.shop-header {
  position: relative;
  .image {
    display: flex;
    width: 100%;
    height: 200rpx;
    background: #fff;
  }
  .box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;

    display: flex;
    align-items: center;
    .logo {
      width: 13.334%;
      width: 160rpx;
      height: 80rpx;
      margin: 10rpx 30rpx;
    }

    .logo .img {
      border-radius: 8rpx;
      position: relative;
      height: 100%;
      width: 100%;
      // padding: 50% 0;
      overflow: hidden;
      // background: $image-background;
    }

    .logo .img image {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .info {
      height: 80rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        max-width: 240rpx;
        min-width: 60rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tag {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-sm;
        color: #fff;
        background: $red;
        height: 40rpx;
        min-width: 100rpx;
        line-height: 40rpx;
        border-radius: 999rpx;
        margin-left: 10rpx;
        padding-right: 10rpx;
      }
      .fans {
        padding-right: 20rpx;
        font-size: $font-size-xs;
      }
      .score {
        font-size: $font-size-xs;
        display: flex;
        align-items: center;
        .text {
          padding-right: 10rpx;
        }
      }
    }
    .info > view {
      display: flex;
      line-height: 1.6;
      height: 40rpx;
      align-items: center;
    }
  }

  .box.box-2 {
    flex-direction: column;
    justify-content: center;
    .info {
      align-items: center;
      color: #043f8d;
    }
    .tag {
      color: #043f8d;
      background: #fff;
    }
  }
  .box.box-3 {
    flex-direction: column;
    justify-content: center;
    .info {
      align-items: center;
      color: #fff;
    }
    .tag {
      color: #fff;
      background: transparent;
    }
  }
  .box.box-4 {
    flex-direction: column;
    justify-content: center;
    .info {
      position: relative;
      width: 100%;
      .info-name {
        justify-content: center;
      }
      .info-foot {
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
        justify-content: space-around;
      }
    }
    .tag {
      color: #fff;
      background: transparent;
    }
  }
  .box.box-5 {
    .logo {
      // width: 24%;
      .img {
        border-radius: 8rpx;
        padding: 0;
        // padding-bottom: 56%;
      }
    }
    .tag {
      color: $red;
      background: transparent;
    }
  }
  .box.box-6 {
    .tag {
      border: 2rpx solid $red;
      color: $red;
      background: transparent;
    }
  }
  .menu-group {
    position: absolute;
    z-index: 1;
    right: 30rpx;
    top: 30rpx;
    .menu-icon {
      border-radius: 100%;
      background: rgba(0, 0, 0, 0.3);
      width: 60rpx;
      height: 60rpx;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 30rpx;
      top: 30rpx;
      font-weight: 800;
    }
  }
}
</style>
