<template>
  <page-meta
    :background-color="pageStyle.background"
    :page-style="'background:' + pageStyle.background"
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
      background: pageStyle.background,
      paddingTop: pageStyle.paddingTop
    }"
  >
    <search-fixed :items="searchItems" v-if="searchItems.id" />
    <view class="reform-view">
      <integral-reform-group :show="show" :items="items" />
    </view>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions } from "vuex";
import integralReformGroup from "@/components/custom/integral-reform-group";
import reformLoad from "@/mixins/reform-load";
import searchFixed from "@/components/custom/reform/search_top";
export default {
  name: "pages-integral-index",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: "",
        paddingTop: 0
      }
    };
  },
  mixins: [reformLoad],
  onPullDownRefresh() {
    this.show = false;
    this.getItems("refresh");
  },
  onLoad() {
    this.getItems();
  },
  methods: {
    ...mapActions(["getCustom"]),
    getItems(refresh) {
      this.getCustom({ type: 9 }).then(({ items, page }) => {
        this.show = true;
        refresh && this.resetItems();
        this.initLoadItems(items);
        this.pageStyle.title = page.title;
        this.pageStyle.background = page.background;
        this.pageStyle.paddingTop =
          this.searchItems && this.searchItems.vheight
            ? this.searchItems.vheight
            : 0;
        this.setWxShare({
          title: page.title
        });
      });
    }
  },
  components: {
    searchFixed,
    integralReformGroup
  }
};
</script>

<style lang="scss" scoped></style>
