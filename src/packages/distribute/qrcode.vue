<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <share-poster :shopid="shopid" ref="share-poster" @sharepost="sharepost" />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import sharePoster from "@/pages/distribute/component/share-poster";
export default {
  name: "packages-distribute-qrcode",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
	  shopid:0
    };
  },
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts
    })
  },
  onLoad(query) {
	  this.shopid = query.shop_id;
	  
  },
  onReady() {
    this.$refs["share-poster"] && this.$refs["share-poster"].init();
  },
  methods: {
	  sharepost(path,shop_name){
		  

		  //获取商家的shop_name
		  let shareParams = {
			title: shop_name,
			imgUrl: path,
			shareUid: true
		  };
		  
		  this.setWxShare(shareParams);
	  }
  },
  onShow() {
    this.pageStyle.title = this.texts.extension_code;
  },

  components: {
    sharePoster
  }
};
</script>

<style lang="scss" scoped></style>
