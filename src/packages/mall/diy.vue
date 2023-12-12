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
      <diy-reform-group :show="show" :items="items" />
    </view>
	
	<floater-fixed
	  :items="floaterItems"
	  :key="floaterItems.timestamp"
	  v-if="floaterItems.id"
	/>
	<!-- #ifdef MP-WEIXIN -->
	<lk-floater-kefu />
	<!--  #endif -->
	
    <lk-tabbar :show="showTabbar" />
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import diyReformGroup from "./component/diy-reform-group";
import reformLoad from "@/mixins/reform-load";
import searchFixed from "@/components/custom/reform/search_top";
import floaterFixed from "@/components/custom/reform/floater";
export default {
  name: "packages-mall-diy",
  data() {
    return {
      show: false,
      showTabbar: false,
      page_id: "",
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
    this.showTabbar = false;
    this.getItems("refresh");
  },
  onLoad(query) {
    this.page_id = query.page_id || query.id || "";
    this.getItems();
  },
  methods: {
    ...mapActions(["getCustom"]),
    getItems(refresh) {
      this.getCustom({ type: 6, id: this.page_id || "" }).then(
        ({ items, page }) => {
          this.show = true;
          refresh && this.resetItems();
          this.initLoadItems(items);
          this.pageStyle.title = page.title;
          this.pageStyle.background = page.background;
          this.pageStyle.paddingTop =
            this.searchItems && this.searchItems.vheight
              ? this.searchItems.vheight
              : 0;
          this.showTabbar = !!page.showtabbar;
          this.setWxShare({
            title: page.title
          });
        }
      );
    }
  },
  components: {
    searchFixed,
    diyReformGroup,
	floaterFixed
  }
};
</script>

<style lang="scss" scoped></style>
