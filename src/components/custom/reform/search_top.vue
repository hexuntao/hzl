<template>
  <view :class="items.id">
    <view class="reform-box">
      <view class="search-fixed" :style="fixedTop">
        <lk-search
          :custom-style="searchStyle"
          :placeholder="items.params.placeholder"
          disabled
          :background="items.style.background"
          :content-style="contentStyle"
          :show-search-icon="false"
          @click="click"
        >
          <view slot="left">
            <view class="icon-label left" v-if="icons.left">
              <lk-icon
                class-prefix="v-icon"
                size="16"
                :name="'v-icon-' + icons.left"
                @click="clickIcon(icons.left)"
              />
            </view>
          </view>
          <view slot="right">
            <view class="icon-label right" v-if="icons.right">
              <lk-icon
                class-prefix="v-icon"
                size="16"
                :name="'v-icon-' + icons.right"
                @click="clickIcon(icons.right)"
              />
            </view>
          </view>
        </lk-search>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import reform from "../../mixin/reform";
import $System from "@/api/system";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import routes from "@/router/routes";
import { isExLink, openLink } from "@/common/utils/comp-path";

// 获取系统状态栏
let systemInfo = uni.getSystemInfoSync();

export default {
  data() {
    return {};
  },
  mixins: [reform],
  props: {
    // 沉浸式  计算导航高度
    immersive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      routeInfo: "route"
    }),
    searchStyle() {
      return {
        padding:
          pxTorpx(this.items.style.paddingtop) +
          " " +
          pxTorpx(this.items.style.paddingleft)
      };
    },
    contentStyle() {
      return { borderRadius: "9999px" };
    },
    icons() {
      let obj = {
        1: "qr",
        2: "location",
        3: "message"
      };
      return {
        left: obj[this.items.params.lefticon] || "",
        right: obj[this.items.params.righticon] || ""
      };
    },
    // 自定义导航栏高度
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44 + systemInfo.statusBarHeight;
      // #endif
      // #ifdef MP
      let height = systemInfo.platform == "ios" ? 44 : 48;
      return height + systemInfo.statusBarHeight;
      // #endif
    },
    fixedTop() {
      return formatStyle({
        top: this.immersive ? this.navbarHeight + "px" : 0
      });
    }
  },
  methods: {
    ...mapActions(["getLocation"]),
    click() {
      let query = {};
      query.type = this.type == 9 ? "integralgoods" : "goods";
      if (this.type == 2 && this.routeInfo.query.shop_id) {
        query.shop_id = this.routeInfo.query.shop_id;
      }
      this.$Navigate.push({
        path: "/packages/mall/search",
        query
      });
    },
    clickIcon(action) {
      let obj = {
        qr: () => {
          $System.scanCode().then(({ result }) => {
            let url = result;
            if (!url) {
              return false;
            }
            if (!isExLink(url)) {
              const pathname = url.split(this.$store.getters.route.origin)[1];
              this.$Navigate.push(pathname);
            } else {
              openLink(url);
            }
          });
        },
        location: () => {
          this.getLocation({ showLoading: true }).then(res => {
            console.log(res);
          });
        },
        message: () => {
          this.$Navigate.push("/pages/message/index");
        }
      };
      if (obj[action]) {
        obj[action]();
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.search-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: #ffffff;
  // padding-top: var(--status-bar-height);
}
.icon-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40rpx;
  height: 68rpx;
}
.icon-label.left {
  margin-right: 20rpx;
}
.icon-label.right {
  margin-left: 20rpx;
}
</style>
