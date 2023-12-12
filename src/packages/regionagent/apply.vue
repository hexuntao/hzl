<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="banner" v-if="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <result-state
      :state="applyStateInfo.state"
      :message="applyStateInfo.message"
      v-if="applyStateInfo"
    />
    <view class="cell-group" v-if="isagent != 1">
      <apply-form-group
        v-if="pageType == 1"
        :form-list="formList"
        :params="params"
        :condition-state="conditionState"
        :loading="isLoading"
        @submit="onApply"
      />
      <apply-condition-info
        v-else-if="pageType == 2"
        :title="satisfyConditionText"
        :items="conditionInfo"
      />
      <apply-submit-group
        v-else-if="pageType == 3"
        :loading="isLoading"
        :btn-text="'成为' + texts.distributor_name"
        @submit="onApply"
      />
    </view>
    <view class="protocol" v-if="pageType == 2">
      <view class="divider">
        <text>{{ texts.distributor_name }}协议</text>
      </view>
      <view class="content">
        <lk-parser
          show-with-animation
          lazy-load
          :html="texts.content"
        ></lk-parser>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  GET_APPLYCOMMISSION,
  APPLY_COMMISSION
} from "@/common/interface/agent";
import { isEmpty } from "@/common/utils";
import resultState from "./component/apply/result-state";
import applyFormGroup from "./component/apply/form-group";
import applyConditionInfo from "./component/apply/condition-info";
import applySubmitGroup from "./component/apply/submit-group";
export default {
  name: "packages-agent-apply",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      isagent: null,
      condition: {},
      params: {
        user_tel: null,
        real_name: null
      },

      formList: [],

      isLoading: false,

      banner: "",

      isReplenishInfo: false //是否完善资料
    };
  },
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts
    }),
    /**
     * 申请情况页面类型
     * 1 ==> 提交表单形式
     * 2 ==> 显示条件形式
     * 3 ==> 直接提交形式
     */
    pageType() {
      const isagent = this.isagent;
      const state = this.condition.distributor_condition;
      let type = 0;
      if (state == -1 || isagent == 3) {
        type = 1;
      } else if (state == 1 || state == 2) {
        type = 2;
      } else if (state == 3) {
        type = 3;
      }
      // 完善资料 需要提交表单
      if (this.isReplenishInfo) {
        type = 1;
      }
      // console.log(type);
      return type;
    },
    // 申请条件状态
    conditionState() {
      return this.isReplenishInfo ? -1 : this.condition.distributor_condition;
    },
    navbarTitle() {
      let title = this.isReplenishInfo
        ? "完善资料"
        : "申请成为" + this.texts.distributor_name;
      return title;
    },
    applyStateInfo() {
      const state = this.isReplenishInfo ? 0 : this.isagent;
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
          obj.message =
            "商城拒绝你成为" +
            this.texts.distributor_name +
            "，请联系客服或重新提交申请。";
          break;
      }
      return isEmpty(obj) ? false : obj;
    },
    satisfyConditionText() {
      const condition = this.condition.distributor_condition;
      return condition == 1
        ? "满足以下条件自动成为" + this.texts.distributor_name + ""
        : "满足其中一个条件即可成为" + this.texts.distributor_name;
    },
    conditionInfo() {
      const $this = this;
      const condition = $this.condition.distributor_condition;
      const conditionsArr = $this.condition.distributor_conditions
        ? String($this.condition.distributor_conditions).split(",")
        : [];
      let infoArr = [];
      if (condition == 1 || condition == 2) {
        conditionsArr.forEach((e, i) => {
          if (e == "2") {
            infoArr.push({
              index: i + 1 + ".",
              text: "订单消费达到",
              money: $this.condition.pay_money,
              unit: "元"
            });
          }
          if (e == "3") {
            infoArr.push({
              index: i + 1 + ".",
              text: "订单数达到",
              money: $this.condition.order_number,
              unit: "件"
            });
          }
          if (e == "4") {
            infoArr.push({
              index: i + 1 + ":",
              text: "购买商品，并完成订单"
            });
          }
          if (e == "5") {
            infoArr.push({
              index: i + 1 + ".",
              text: "购买指定商品",
              link:
                "/packages/goods/screen?goods_ids=" + $this.condition.goods_id,
              linkText: "去购买"
            });
          }
        });
      }
      return infoArr;
    }
  },
  onLoad(query) {
    this.isReplenishInfo = query.hash === "replenish";
    this.getData();
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData() {
      GET_APPLYCOMMISSION({}, { isShowLoading: true })
        .then(({ data }) => {
          this.params.real_name = data.real_name;
          this.params.user_tel = data.user_tel;
          this.isagent = data.isagent;
          this.condition = data.condition;
          this.formList = !isEmpty(data.customform) ? data.customform : [];
          this.pageStyle.title = this.navbarTitle;
          this.banner =
            data.xieyi.logo || this.static.baseImgPath + "apply-banner.png";
          if (!this.isReplenishInfo && this.isagent == 2) {
            this.$Navigate.replace("/pages/agent/index");
          }
        })
        .catch(() => {});
    },
    // 提交申请
    onApply(params) {
      this.isLoading = true;
      // return console.log(this.isReplenishInfo, params);
      APPLY_COMMISSION(params, { isReplenishInfo: this.isReplenishInfo })
        .then(({ message }) => {
          const route =
            this.pageType == 3 ? "/pages/agent/index" : "/pages/member/index";
          this.getMemberInfo({ update: true }).then(() => {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              this.$Navigate.replace(route);
            });
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
    applyConditionInfo,
    applySubmitGroup
  }
};
</script>

<style lang="scss" scoped>
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
