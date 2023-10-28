<template>
  <view class="pages">
    <result-state :state="stateInfo.state" :message="stateInfo.message" />
    <view class="foot-btn-group" v-if="stateInfo.state == 'error'">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        :to='`/packages/shop/business/apply?referee_uid=${referee_uid}`'
      >
        重新申请
      </lk-button>
    </view>
    <view class="flex-auto-center" v-if="stateInfo.state == 'success'">
      <lk-field input-align="center" :value="stateInfo.url" disabled />
    </view>
  </view>
</template>

<script>
import {
  GET_SHOPAPPLYSTATE,
  GET_SHOPAPPLYPROTOCOL
} from "@/common/interface/shop";
import resultState from "../component/result-state";
export default {
  name: "packages-shop-business-result",
  data() {
    return {
      referee_uid:'',
      stateInfo: {
        state: "",
        message: "",
        url: ""
      }
    };
  },
  onLoad(query) {
    this.referee_uid=query.referee_uid?query.referee_uid:''
    GET_SHOPAPPLYSTATE()
      .then(({ data }) => {
        const { status, url } = data;
        let info = {};
        if (status == "apply") {
          return this.$Navigate.replace("/packages/shop/business/index");
        }
        if (status == "is_system") {
          info.state = "success";
          info.message =
            "您已是店铺卖家，请用电脑浏览器访问卖家后台管理你的店铺";
          info.url = url;
        }
        if (status == "refuse_apply") {
          info.state = "error";
          info.message = "商家拒绝了您的入驻申请";
        }
        if (status == "is_apply") {
          info.state = "wait";
          info.message = "店铺入驻审核中";
        }
        this.stateInfo = info;
      })
      .catch(() => {});
  },
  methods: {},
  components: {
    resultState
  }
};
</script>

<style lang="scss" scoped></style>
