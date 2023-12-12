<template>
  <view class="pages">
    <view class="card-group-box">
      <view class="image">
        <image :src="image" mode="widthFix" @click="previewImage" />
      </view>
    </view>
    <view class="foot-btn-group" v-if="auth_url">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :to="auth_url"
      >
        添加至微信卡包
      </lk-button>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_IMG, GET_AUTHURL } from "@/common/interface/invoice";
import { addImgSrcDomain, isWeixin } from "@/common/utils";
export default {
  name: "packages-invoice-detail",
  data() {
    return {
      order_no: "",
      image: "",
      auth_url: ""
    };
  },
  onLoad(query) {
    this.order_no = query.order_no || "";
    this.getData();
  },
  methods: {
    getData() {
      GET_IMG({
        order_no: this.order_no
      }).then(({ data }) => {
        this.image = addImgSrcDomain(data.data) + "?t=" + new Date().getTime();
        this.getAuthUrl();
      });
    },
    getAuthUrl() {
      let params = {
        order_no: this.order_no,
        source: isWeixin() ? "web" : "wap"
      };
      GET_AUTHURL(params).then(({ data }) => {
        this.auth_url = data.data;
      });
    },
    previewImage() {
      if (this.image) {
        uni.previewImage({
          urls: [this.image]
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.image {
  width: 100%;
  min-height: 50vw;
  image {
    display: block;
    width: 100%;
    height: 100%;
    background-color: $image-background;
  }
}
</style>
