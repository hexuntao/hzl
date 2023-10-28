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

    <view class="reform-view">
      <customize-reform-group :show="show" :items="items" />
    </view>
    <!-- <lk-tabbar :show="showTabbar" /> -->
	<floater-fixed
	  :items="floaterItems"
	  :key="floaterItems.timestamp"
	  v-if="floaterItems.id"
	/>
	<!-- #ifdef MP-WEIXIN -->
	<lk-floater-kefu />
	<!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import customizeReformGroup from "@/components/custom/member-reform-group";
import reformLoad from "@/mixins/reform-load";
import floaterFixed from "@/components/custom/reform/floater";
export default {
  name: "packages-mall-customizethree",
  data() {
    return {
      show: false,
      showTabbar: true,
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
    this.showTabbar = true;
    this.getItems("refresh");
  },
  onLoad(query) {
    this.getItems();
  },
  methods: {
    ...mapActions(["getCustom"]),
    getItems(refresh) {
      this.getCustom({ type: 52 }).then(
        ({ items, page }) => {
          this.show = true;
          //refresh && this.resetItems();
         console.log('aaabbbcc');
		 console.log(items);
		  this.initLoadItems(items);
		  
		  
          this.pageStyle.title = page.title;
          this.pageStyle.background = page.background;
          this.pageStyle.paddingTop =
            this.searchItems && this.searchItems.vheight
              ? this.searchItems.vheight
              : 0;
          this.showTabbar = true;
          this.setWxShare({
            title: page.title
          });
        }
      );
    }
  },
  components: {
    customizeReformGroup,
	floaterFixed
  }
};
</script>

<style lang="scss" scoped></style>
