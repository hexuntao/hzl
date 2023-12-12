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
  <view class="pages">
    <view class="reform-view">
 <!--     <shop-header :items="headerItems" :info="info" /> -->
      <shop-reform-group :show="show" :items="items" />
    </view>
	
	<floater-fixed
	  :items="floaterItems"
	  :key="floaterItems.timestamp"
	  v-if="floaterItems.id"
	/>
	<!-- #ifdef MP-WEIXIN -->
	<lk-floater-kefu />
	<!--  #endif -->
	
	<!-- <footer-tab :active="0" :shopid="shopid" /> -->
    <lk-shortcut-entry />
	
	
  </view>
  <!-- #ifndef MP-WEIXIN -->
  
  <!--  #endif -->
  <lk-tabbar :show="showtabbar" :shopfooter="shopfooter" :shopid="shopid" />
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import shopHeader from "./component/header";
import shopReformGroup from "./component/shop-reform-group";
import reformLoad from "@/mixins/reform-load";
import { GET_SHOPINFO } from "@/common/interface/shop";
import floaterFixed from "@/components/custom/reform/floater";
import footerTab from "./component/footer-tab";
export default {
  name: "packages-shop-home",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: ""
      },
      headerItems: {
        params: {},
        style: {}
      },
	  shopfooter:{},
	  shopid:0,
	  showtabbar:true,
      info: {}
    };
  },
  mixins: [reformLoad],
  onPullDownRefresh() {
    this.getItems("refresh");
    this.getShopInfo();
  },

  methods: {
    ...mapActions(["getCustom"]),
	
	callLoad(query) {
	  const { shop_id } = query;
	  console.log(shop_id);
	  this.shopid = shop_id;

	  
	  this.getItems();
	  this.getShopInfo();
	},
	
    getShopInfo() {
      GET_SHOPINFO({ shop_id: this.shopid }).then(({ data }) => {
        this.info = data;
        this.pageStyle.title = this.info.shop_name;
        this.setWxShare({
          title: this.info.shop_name,
          desc: "我刚刚发现了一个很不错的店铺，赶快来看看吧。",
          imgUrl: this.info.shop_logo
        });
      });
    },
    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 2, shop_id: this.shopid }).then(
        ({ items, page }) => {
          this.show = true;
		  this.shopfooter = page.shop_footer;

          refresh && this.resetItems();
          const newItems = this.initCustomData(items);
          this.pageStyle.background = page.background;
          this.initLoadItems(newItems);
        }
      );
    },
    initCustomData(templateItems = {}) {
      let newItems = {};
      const arr = ["shop_head"];
      for (let key in templateItems) {
        const item = templateItems[key];
        if (arr.indexOf(item.id) != -1) {
          this.headerItems = item;
        } else {
          newItems[key] = item;
        }
      }
      return newItems;
    }
  },
  components: {
    shopHeader,
    shopReformGroup,
    footerTab,
	floaterFixed
  }
};
</script>

<style lang="scss" scoped>

</style>
