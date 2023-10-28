<template>
  <view class="pages"  style="padding-top:30rpx;">
    <view style="background-size: 100% 100%;background-repeat: no-repeat;width:750rpx;height:420rpx;" :style="{backgroundImage: 'url('+info.wap_member_index_adv+')'}">

    <lk-header-panel
      top-bar
      :avatar="info.user_headimg"
      :name="info.nick_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>
          连续签到：<text>{{ info.continuous || 0 }}</text>
        </view>
        <view class="log" @click="toLink('/packages/signin/log')">
          签到明细 >
        </view>
      </view>
      <view slot="right" class="btn-group">
        <lk-button
          size="small"
          bing-mobile
          round
          plain
          :color="theme.color"
          :loading="isLoading"
          :disabled="signinStateDisabled"
          @click="onSignin"
        >
          {{ signinStateText }}
        </lk-button>
      </view>
    </lk-header-panel>
      </view>
    <view>
      <lk-calendar readonly :selected="signList" @monthSwitch="monthSwitch" />
    </view>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import {
  GET_SIGNININFO,
  SET_SIGNIN,
  GET_SIGNINLIST
} from "@/common/interface/signin";
import navbarStyle from "@/mixins/navbar-style";

function getDateText(year, month) {
  return [year, month, 1].join("-");
}
export default {
  name: "pages-signin-index",
  data() {
    return {
      info: {
        continuous: 0
      },
      isLoading: false,
      signList: []
    };
  },
  mixins: [navbarStyle],
  computed: {
    signinStateDisabled() {
      return !!this.info.is_signin;
    },
    signinStateText() {
      return this.info.is_signin ? "已签" : "签到";
    }
  },
  onLoad() {
    this.getData();
  },
  created() {},
  methods: {
    getData() {
      GET_SIGNININFO().then(({ data }) => {
        this.info = data || {};
        this.initDate();
      });
    },
    initDate() {
      const date = new Date();
      this.getSigninList(date.getFullYear(), date.getMonth() + 1);
    },
    getSigninList(year, month) {
      const time = getDateText(year, month);
      let arr = [];
      GET_SIGNINLIST({ time }).then(({ data }) => {
        data.forEach(({ sign_in_time }) => {
          arr.push({
            date: formatDate(sign_in_time),
            info: "已签"
          });
        });
        this.signList = arr;
      });
    },
    toLink(to) {
      this.$Navigate.push(to);
    },
    onSignin() {
      this.isLoading = true;
      SET_SIGNIN()
        .then(() => {
          this.info.is_signin = 1;
          this.isLoading = false;
          this.getData();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    monthSwitch(e) {
      this.getSigninList(e.year, e.month);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.btn-group {
  display: flex;
  align-items: center;
}
</style>
