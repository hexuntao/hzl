<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell title="基本信息" is-link to="/packages/microshop/set/info" />
      <lk-cell
        title="微店Logo"
        center
        is-link
        to="/packages/microshop/set/logo?hash=shop"
      >
        <view class="avatar-box">
          <lk-avatar :src="info.microshop_logo" />
        </view>
      </lk-cell>
      <lk-cell
        title="店招Logo"
        center
        is-link
        to="/packages/microshop/set/logo?hash=recruit"
      >
        <view class="avatar-box">
          <lk-avatar :src="info.shopRecruitment_logo" />
        </view>
      </lk-cell>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "packages-microshop-set-index",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      info: ({ microshop }) => microshop.info
    })
  },
  onLoad() {
    this.getMicroshopInfo();
  },
  methods: {
    ...mapActions(["getMicroshopInfo"])
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.avatar-box {
  display: flex;
  justify-content: flex-end;
}
</style>
