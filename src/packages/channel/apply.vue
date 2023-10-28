<template>
  <view class="pages">
    <view class="banner" v-if="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <result-state
      :state="applyStateInfo.state"
      :message="applyStateInfo.message"
      v-if="applyStateInfo"
    />
    <view class="cell-group">
      <apply-form-group
        v-if="isChannel == -1 || isChannel == 0"
        :form-list="formList"
        :params="params"
        :loading="isLoading"
        :protocol="protocol"
        @submit="onApply"
      />
      <apply-condition-info
        v-if="isChannel == -2"
        :title="satisfyConditionText"
        :items="conditionInfo"
      />
    </view>
    <view class="protocol" v-if="isChannel == -2">
      <view class="divider">
        <text>申请协议</text>
      </view>
      <view class="content">
        <lk-parser show-with-animation lazy-load :html="protocol"></lk-parser>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GET_APPLYINFO, APPLY_CHANNEL } from "@/common/interface/channel";
import { isEmpty } from "@/common/utils";
import resultState from "./component/apply/result-state";
import applyFormGroup from "./component/apply/form-group";
import applyConditionInfo from "./component/apply/condition-info";
export default {
  name: "packages-channel-apply",
  data() {
    return {
      banner: null,
      protocol: null,
      info: "",

      params: {
        user_tel: null,
        real_name: null
      },
      user_tel: null,
      condition: {},
      isChannel: null,
      state: null,

      formList: [],

      isLoading: false
    };
  },
  computed: {
    ...mapState({
      distributeText: ({ distribute }) => distribute.texts
    }),
    applyStateInfo() {
      const state = this.isChannel;
      let obj = {};
      switch (state) {
        case 1:
          obj.state = "wait";
          obj.message = "申请提交成功，请耐心等待商城审核。";
          break;
        case 2:
          obj.state = "success";
          obj.message = "已通过审核。";
          break;
        case 3:
          obj.state = "info";
          obj.message = "满足条件，请完善资料。";
          break;
        case -1:
          obj.state = "error";
          obj.message = "商城拒绝你成为渠道商，请联系客服或重新提交申请。";
          break;
      }
      return isEmpty(obj) ? false : obj;
    },
    conditionInfo() {
      let arr = [];
      const conditionsObj = this.condition;
      let i = 0;
      for (const key in conditionsObj) {
        let e = conditionsObj[key];
        if (e.text) {
          arr.push({
            index: i + 1 + ".",
            text: e.text,
            link: e.goods_id
              ? "/packages/goods/screen?goods_ids=" + e.goods_id
              : "",
            linkText: e.goods_id ? "去购买" : ""
          });
          i++;
        }
      }
      return arr;
    },
    satisfyConditionText() {
      return this.state == "all"
        ? "满足以下条件自动成为渠道商："
        : "满足其中一个条件即可成为渠道商";
    },
    // 满足条件状态
    satisfyConditionStatus() {
      return this.condition.to_channel_status &&
        this.condition.to_channel_status == 1
        ? true
        : false;
    }
  },
  onLoad(query) {
    this.getMemberInfo().then(info => {
      if (info.isdistributor == 2) {
        this.getData();
      } else {
        this.$Prompt
          .toast("请先成为" + this.distributeText.distributor_name)
          .then(() => {
            this.$Navigate.replace("/pages/member/index");
          });
      }
    });
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData() {
      GET_APPLYINFO()
        .then(({ data }) => {
          if (data.is_checked == 2) {
            this.$Navigate.replace("/pages/channel/index");
          } else {
            this.params.real_name = data.real_name;
            this.params.user_tel = data.user_tel;
            this.user_tel = data.user_tel;
            this.banner = data.channel_agreement
              ? data.channel_agreement.logo
              : "";
            this.protocol = data.channel_agreement
              ? data.channel_agreement.condition
              : "";
            this.condition = data.condition;
            this.state = data.channel_condition;
            this.isChannel = data.is_checked;
            this.formList = !isEmpty(data.customform)
              ? data.customform.channel
              : [];
          }
        })
        .catch(() => {});
    },

    // 提交申请
    onApply(params) {
      // return console.log(params);
      this.isLoading = true;
      APPLY_CHANNEL(params)
        .then(({ message }) => {
          this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            this.$Navigate.replace("/pages/member/index");
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    resultState,
    applyFormGroup,
    applyConditionInfo
  }
};
</script>

<style lang="scss" scoped>
.pages{
  padding-bottom: 160rpx;
}
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cell-group {
  background: #fff;
  margin: 20rpx 0;
}
.protocol {
  background: #ffffff;
  overflow: hidden;
  .content {
    padding: 30rpx;
  }
}
</style>
