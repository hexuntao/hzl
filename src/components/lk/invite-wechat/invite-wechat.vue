<template>
  <view class="invite-wechat" v-if="isShowWechat">
    <lk-cell center :icon="config.logo" icon-size="40" class="cell">
      <view slot="title" class="title">{{ wechatSet.default_title1 }}</view>
      <view slot="label" class="label">{{ wechatSet.default_title2 }}</view>
      <view slot="rightIcon">
        <lk-button round size="small" type="danger" @click="onInvite">
          {{ wechatSet.btn_text }}
        </lk-button>
      </view>
    </lk-cell>
    <lk-popup
      v-if="wechatSet.btn_action == 0"
      v-model="showQr"
      prevent-touchmove
      :custom-style="{ zIndex: 1000, bottom: '0' }"
      wrpper-style="background:transparent;"
    >
      <view class="image-box">
        <image class="qr-img" :src="wechatSet.concern_qr" />
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showQr: false
    };
  },
  computed: {
    ...mapState({
      isWeixin: ({ isWeixin }) => isWeixin,
      config: ({ config }) => config,
      wechatSet: ({ config }) => config.wechatSetInfo,
      memberInfo: ({ member }) => member.info
    }),
    isShowWechat() {
      const configWchat =
        this.isWeixin && this.config.is_wchat && this.wechatSet.is_show == 1;
      const memberInvite = !this.memberInfo.is_subscribe; //会员是否关注过
      return configWchat && memberInvite;
    }
  },
  methods: {
    onInvite() {
      const { btn_action, concern_code } = this.wechatSet;
      if (btn_action == 1) {
        if (!concern_code) return false;
        window.open(
          "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=" +
            concern_code +
            "&scene=110#wechat_redirect"
        );
      } else {
        this.showQr = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cell {
  background: #ffcc80;
}
.title,
.label {
  color: #ff3300;
}
.label {
  font-size: $font-size-sm;
}
.image-box {
  height: 0;
  width: 80vw;
  padding: 50% 0;
  overflow: hidden;
  background: $image-background;
  position: relative;
}
.qr-img {
  display: flex;
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
