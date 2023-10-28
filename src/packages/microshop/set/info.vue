<template>
  <view class="pages">
    <view class="cell-group">
      <lk-field
        v-model="params.microshop_name"
        label="微店名称"
        placeholder="微店名称"
      />
      <lk-field
        v-model="params.microshop_introduce"
        label="微店介绍"
        type="textarea"
        placeholder="请输入微店介绍"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        :loading="isLoading"
        @click="onSave"
      >
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
import { SET_SHOPSET } from "@/common/interface/microshop";
import { mapActions } from "vuex";
export default {
  name: "packages-microshop-set-info",
  data() {
    return {
      isLoading: false,
      params: {
        microshop_logo: "",
        shopRecruitment_logo: "",
        microshop_name: "",
        microshop_introduce: ""
      }
    };
  },
  onLoad(query) {
    this.getMicroshopInfo().then(info => {
      this.params.microshop_logo = info.microshop_logo;
      this.params.shopRecruitment_logo = info.shopRecruitment_logo;
      this.params.microshop_name = info.microshop_name;
      this.params.microshop_introduce = info.microshop_introduce;
    });
  },
  methods: {
    ...mapActions(["getMicroshopInfo"]),
    onSave() {
      this.isLoading = true;
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

<style lang="scss" scoped></style>
