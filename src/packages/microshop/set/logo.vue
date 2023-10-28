<template>
  <view class="pages">
    <view class="avatar-box">
      <lk-avatar :src="params[hash]" size="500" />
    </view>
    <view class="foot-btn-group fixed">
      <lk-upload
        :show-upload-list="false"
        custom-btn
        :multiple="false"
        @on-success="onSuccess"
      >
        <lk-button
          slot="addBtn"
          round
          block
          type="danger"
          :color="theme.gradient"
        >
          上传头像
        </lk-button>
      </lk-upload>
    </view>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import { SET_SHOPSET } from "@/common/interface/microshop";
export default {
  name: "packages-member-avatar",
  data() {
    return {
      params: {
        microshop_logo: "",
        shopRecruitment_logo: "",
        microshop_name: "",
        microshop_introduce: ""
      },
      hash: ""
    };
  },
  computed: {},
  onLoad(query) {
    const obj = {
      shop: "microshop_logo",
      recruit: "shopRecruitment_logo"
    };
    this.hash = obj[query.hash];
    this.getMicroshopInfo().then(info => {
      this.params.microshop_logo = info.microshop_logo;
      this.params.shopRecruitment_logo = info.shopRecruitment_logo;
      this.params.microshop_name = info.microshop_name;
      this.params.microshop_introduce = info.microshop_introduce;
    });
  },
  methods: {
    ...mapActions(["getMicroshopInfo"]),
    onSuccess(e) {
      this.params[this.hash] = e.src;
      SET_SHOPSET(this.params)
        .then(res => {
          this.$Navigate.replace("/pages/microshop/index");
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-box {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 190rpx;
  left: 0;
  right: 0;
}
</style>
