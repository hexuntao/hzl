<template>
  <page-meta
    :background-color="pageStyle.background"
    :page-style="pageStyle.backgroundStyle"
  >
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view
    class="pages"
    :style="{
      paddingTop: pageStyle.paddingTop,
      backgroundColor: pageStyle.background
    }"
  >
    <image
      v-if="pageStyle.backgroundImage"
      class="page-bg"
      :src="pageStyle.backgroundImage"
      mode="widthFix"
    />
    <!-- #ifndef H5 -->
    <lk-navbar
      :is-back="false"
      :title="pageStyle.title"
      :title-color="pageStyle.titleColor"
      :title-image="pageStyle.titleImage"
      :background="pageStyle.navbarBg"
    ></lk-navbar>
    <!--  #endif -->
    <search-fixed
      :immersive="isImmersive"
      :items="searchItems"
      v-if="searchItems.id"
    />
    <!-- #ifdef H5 -->
    <lk-invite-wechat />
    <!--  #endif -->
    <view class="reform-view">
      <mall-reform-group :show="show" :items="items" />
    </view>
    <floater-fixed
      :items="floaterItems"
      :key="floaterItems.timestamp"
      v-if="floaterItems.id"
    />
    <!-- #ifdef MP-WEIXIN -->
    <lk-floater-kefu />
    <!--  #endif -->
    <!-- #ifndef H5 -->
    <lk-barrage></lk-barrage>
    <!--  #endif -->
    <lk-popup-adv />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import mallReformGroup from "@/components/custom/mall-reform-group";
import searchFixed from "@/components/custom/reform/search_top";
import floaterFixed from "@/components/custom/reform/floater";
import reformLoad from "@/mixins/reform-load";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";

export default {
  name: "pages-mall-index",
  data() {
    return {
      show: false,
      pageStyle: {
        backgroundStyle: "",
        background: "",
        backgroundImage: "",
        paddingTop: 0,
        title: "",
        titleImage: "",
        navbarBg: {}
      },
      searchFixedItems: {
        id: "",
        params: {},
        style: {}
      }
    };
  },
  mixins: [reformLoad],
  computed: {
    isImmersive() {
      // #ifdef APP-PLUS || MP
      return true;
      // #endif
      // #ifdef H5
      return false;
      // #endif
    },
    ...mapGetters(["token"])
  },
  onPullDownRefresh() {
    this.show = false;
    this.getItems("refresh");
  },
  onLoad() {
    this.getItems();
  },
  onShow() {},
  methods: {
    ...mapActions(["getCustom"]),
    getItems(refresh) {
      this.getCustom({ type: 1 })
        .then(({ items, page }) => {
          this.show = true;
          refresh && this.resetItems();
          this.initLoadItems(items, 1);
          this.pageStyle.paddingTop =
            this.searchItems && this.searchItems.vheight
              ? this.searchItems.vheight
              : 0;

          this.pageStyle.backgroundStyle = formatStyle({
            backgroundColor: page.background
          });

          // 页面背景，图片
          this.pageStyle.background = page.background;
          this.pageStyle.backgroundImage = "";
          if (page.backgroundtype == 1) {
            this.pageStyle.backgroundImage = page.backgroundimage;
          }
          // 页面标题，图片
          this.pageStyle.title = page.title;
          this.pageStyle.titleColor = page.titlecolor || undefined;
          if (page.titletype == 1) {
            this.pageStyle.titleImage = page.titleimage || "";
          }
          // 导航栏颜色 背景
          let navbarBg = {
            backgroundColor:
              page.navbartype === undefined
                ? "#ffffff"
                : page.navbarcolor || "#ffffff"
          };
          if (page.navbartype == 1) {
            navbarBg = {
              backgroundImage: page.navbarimage
                ? `url(${page.navbarimage})`
                : ""
            };
          }
          this.pageStyle.navbarBg = navbarBg;
          this.setWxShare({
            title: page.title
          });

          if (!this.token && getApp().globalData.isshow==1) {
            getApp().globalData.isshow=0;
            this.$Navigate.push({
              path: "/packages/login/index"
            });
          }
        })
        .catch(() => {});
    },
    click(path) {
      this.$Navigate.push(path);
    }
  },
  components: {
    mallReformGroup,
    searchFixed,
    floaterFixed
  }
};
</script>

<style lang="scss" scoped>
.pages {
  position: relative;
}
.reform-view {
  position: relative;
  z-index: 1;
}
.page-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
