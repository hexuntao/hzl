<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      :nav-per-view="ismerchantsdepartment == 0 ? 1 : 2"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>

    <view class="qrcode" @click="downloadimg">
      <view>
        <canvas
          canvas-id="qrcode"
          style="position: fixed;right: 100vw;bottom:0vh;z-index: -9999;opacity: 0;width: 250px;height: 250px;"
        />
        <image :src="imagedown" style="width: 500rpx;height: 500rpx;" />
        <!-- #ifdef H5-->
        <view>(长按图片保存二维码分享)</view>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <view>(点击图片保存到相册)</view>
        <!-- #endif -->
      </view>
    </view>

    <view class="cell-item lk-hairline--bottom">
      <view class="title">{{ imgurl }}</view>
      <lk-button round block :color="theme.color" @click="onCopy(imgurl)">
        复制我的邀请链接
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import uQRCode from "./component/uqrcode.js";
import $System from "@/api/system";
export default {
  name: "packages-merchant-qrcode",
  data() {
    return {
      imgurl: "",
      imagedown: "",
      ismerchantsdepartment: "",
    };
  },
  watch: {
    imgurl() {
      this.make();
    },
  },
  computed: {
    ...mapGetters({
      extendCode: "extendCode",
    }),

    ...mapState({
      Domain: ({ domain }) => domain,
      uid: ({ member }) => member.info.uid,
    }),
    imgurlshop() {
      return (
        this.Domain +
        "/wap/packages/shop/business/index?" +
        "extend_code=" +
        this.uid
      ); //店铺推广
    },

    imgurlmerchant() {
      return (
        this.Domain +
        "/wap/packages/merchant/apply?" +
        "extend_code=" +
        this.uid
      ); //招商员推广
    },
    tabs() {
      let arr = [
        {
          name: "店铺推广码",
          status: 0,
        },
      ];
      if (this.ismerchantsdepartment == 1) {
        arr.push({
          name: "招商员推广码",
          status: 1,
        });
      }
      return arr;
    },
  },
  onLoad(query) {
    this.imgurl = this.imgurlshop;
    this.ismerchantsdepartment = query.is_merchants_department;
  },
  methods: {
    downloadimg() {
      // #ifndef H5
      const $this = this;
      uni.saveImageToPhotosAlbum({
        filePath: $this.imagedown,
        success(res) {
          $this.$Prompt.toast("保存成功");
        },
        fail({ errMsg }) {
          $this.$Prompt.toast(errMsg);
        },
      });
      // #endif
    },
    onTab(e) {
      if (e == 0) this.imgurl = this.imgurlshop;
      if (e == 1) this.imgurl = this.imgurlmerchant;
    },
    onCopy(data) {
      $System.setClipboardData(data);
    },

    //生成二维码
    make() {
      var imgurl = encodeURI(this.imgurl);
      uQRCode.make({
        canvasId: "qrcode",
        componentInstance: this,
        text: imgurl,
        size: 250,
        margin: 10,
        backgroundColor: "#ffffff",
        foregroundColor: "#000000",
        fileType: "jpg",
        correctLevel: uQRCode.defaults.correctLevel,
        success: (res) => {
          this.imagedown = res;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qrcode {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
  text-align: center;
}
.cell-item {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .title {
    color: $red;
    text-align: center;
    font-weight: 800;
    padding-bottom: 20rpx;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
}
</style>
