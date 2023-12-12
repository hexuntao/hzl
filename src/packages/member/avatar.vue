<template>
  <view class="pages">
    <view class="avatar-box">
      <lk-avatar :src="avatar" size="500" />
    </view>
    <view class="foot-btn-group fixed">
      <lk-upload
        :show-upload-list="false"
        custom-btn
        :multiple="false"
        :form-data="{ type: 'avatar' }"
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
import { mapState, mapMutations } from "vuex";
export default {
  name: "packages-member-avatar",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      avatar: ({ member }) => member.info.member_img
    })
  },
  onLoad() {},
  methods: {
    ...mapMutations(["setMemberInfo"]),
    onSuccess(e) {
      this.setMemberInfo({ member_img: e.src });
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
