<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell title="头像" center is-link to="/packages/member/avatar">
        <view class="avatar-box">
          <lk-avatar :src="avatar" />
        </view>
      </lk-cell>
      <lk-cell title="基本信息" is-link to="/packages/member/info" />
    </view>

    <view class="cell-group" v-if="showSetAccount">
      <lk-cell
        title="修改登录密码"
        is-link
        to="/packages/member/post?pagetype=1"
      />
      <lk-cell
        v-if="cpp"
        title="设置支付密码"
        is-link
        to="/packages/member/post?pagetype=2"
      />
      <lk-cell
        title="修改关联手机"
        is-link
        to="/packages/member/post?pagetype=3"
      />
      <lk-cell
        title="绑定电子邮箱"
        is-link
        to="/packages/member/post?pagetype=4"
      />
    </view>

    <view class="cell-group">
      <lk-cell
        title="收货地址管理"
        is-link
        to="/packages/member/address/list"
      />
       <lk-cell
        title="发票抬头管理"
        is-link
        to="/packages/member/invoice/list"
      />
    </view>

    <!-- <view class="cell-group">
      <lk-cell title="关联账号" is-link to="/packages/member/relevant" />
    </view> -->

    <!-- <view class="cell-group">
      <lk-cell
        title="设置主题"
        :value="theme.style"
        is-link
        @click="clickTheme"
      >
        <view
          class="theme-box"
          slot="rightIcon"
          :style="{ background: theme.color }"
        ></view>
      </lk-cell>
      <lk-popup v-model="showThemePopup" round>
        <view class="theme-list">
          <lk-cell
            v-for="(item, index) in themeList"
            :key="index"
            :value="item.style"
            @click="selectTheme(index)"
          >
            <view
              class="theme-box"
              slot="rightIcon"
              :style="{ background: item.color }"
            ></view>
          </lk-cell>
        </view>
      </lk-popup>
    </view> -->

    <!-- #ifndef MP -->
    <view class="foot-btn-group" v-if="showLogoutBtn">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        @click="onLogout"
      >
        退出登录
      </lk-button>
    </view>
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import { isWeixin } from "@/common/utils";
import themeColor from "@/common/theme/color";
export default {
  name: "packages-member-set",
  data() {
    return {
      showThemePopup: false,
      themeList: []
    };
  },
  onLoad() {},
  computed: {
    ...mapState(["config", "member"]),
    ...mapGetters(["isBingFlag", "isBindMobile"]),
    avatar() {
      return this.member.info.member_img;
    },
    showSetAccount() {
      return this.isBingFlag && this.isBindMobile;
    },
    showLogoutBtn() {
      // #ifdef H5
      if (process.env.NODE_ENV == "development") {
        return true;
      }
      // #endif
      return !isWeixin() || !this.config.is_wchat;
    },
    // 支付密码开启情况，默认是开启，
    cpp() {
      return !this.config.cpp;
    }
  },
  methods: {
    ...mapMutations(["setTheme"]),
    ...mapActions(["logout"]),
    onLogout() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "是否退出登录?"
        })
        .then(() => {
          this.logout().then(() => {
            uni.reLaunch({ url: "/pages/mall/index" });
          });
        });
    },
    clickTheme() {
      const arr = [];
      for (const key in themeColor) {
        arr.push({
          style: key,
          ...themeColor[key]
        });
      }
      this.themeList = arr;
      this.showThemePopup = true;
    },
    selectTheme(index) {
      const item = this.themeList[index];
      this.setTheme(item.style);
      this.showThemePopup = false;
    }
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

.theme-list {
  width: 80vw;
}
.theme-box {
  width: 48rpx;
  height: 48rpx;
  margin-left: 20rpx;
}
</style>
