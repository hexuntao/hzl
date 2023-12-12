<template>
  <view class="pages">
    <view class="banner" v-if="status == -1">
      <image :src="chantapplyshow.logo" mode="widthFix" />
    </view>
    <view></view>
    <view
      class="userinfo"
      :style="{ background: theme.gradient }"
      v-if="status == 0 || status == 1"
    >
      <view class="img">
        <view class="imgitem">
          <lk-avatar :src="info.member_img" size="large" />
        </view>
        <view class="statustext">{{
          status == 0
            ? "申请提交成功，请耐心等待商城审核"
            : "商城拒绝你成为招商员，请联系客服或重新提交申请"
        }}</view>
      </view>
    </view>
    <view></view>
    <view v-if="status == 1 || status == -1">
      <lk-field
        label="真实姓名"
        required
        v-model="form.real_name"
        placeholder="真实姓名"
      />
      <lk-field
        label="手机号码"
        required
        v-model="chantapplyshow.user_tel"
        type="number"
        :disabled="true"
      />
      <view class="cell">
        <lk-checkbox-group :active-color="theme.color">
          <lk-checkbox v-model="checked">我已阅读并同意以下协议</lk-checkbox>
        </lk-checkbox-group>
      </view>
      <view class="btn-group">
        <lk-button
          v-if="chantapplyshow.can_apply"
          size="normal"
          block
          round
          :color="theme.color"
          class="btn"
          :disabled="!checked"
          :loading="isLoading"
          @click="submit"
          >提交申请</lk-button
        >
      </view>
    </view>

    <view class="protocol">
      <view class="divider">
        <text>招商员协议</text>
      </view>
      <view
        class="content"
        v-if="chantapplyshow.content"
        v-html="chantapplyshow.content"
      ></view>
    </view>
  </view>
</template>

<script>
import {
  GET_MERCHANTSAPPLYSHOW,
  MERCHANTSAPPLYSUBMIT,
} from "@/common/interface/merchants";
import { validEmpty, validUsername } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
export default {
  name: "packages-merchant-apply",
  data() {
    return {
      form: {
        referee_uid: "",
      },
      chantapplyshow: {},
      checked: true,
      status: null, //审核状态
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      info: ({ member }) => member.info,
    }),
  },
  onLoad(query) {
    if (query.extend_code) this.form.referee_uid = query.extend_code;
    this.merchantsapplyshow();
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    merchantsapplyshow() {
      GET_MERCHANTSAPPLYSHOW().then(({ data }) => {
           if (data.is_merchants == 2) {
          this.$Navigate.replace("/pages/merchant/index");
        }
        this.chantapplyshow = data;
        this.form.real_name = data.real_name;
        this.status = data.is_merchants;
        if (data.can_apply == 0) {
          this.$Prompt
            .modal({
              content: "招商员申请只能后台指定",
              showCancel: false,
            })
            .then(() => {
              this.$Navigate.replace("/pages/member/index");
            });
        }
      });
    },
    submit() {
      if (!validUsername(this.form.real_name, "请输入联系人姓名！")) {
        return false;
      }
      this.isLoading = true;
      MERCHANTSAPPLYSUBMIT(this.form).then(({ data, code, message }) => {
        if (code == 1) {
          this.getMemberInfo({ update: true }).then(() => {
            this.isLoading = false;
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              setTimeout(() => {
                if (data.status == 2)  this.$Navigate.replace("/pages/merchant/index");
              }, 300);
              this.status = data.status;
            });
          });
        } else {
          this.$Prompt.toast(message);
        }
      });
    },
  },
  components: {},
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

.cell {
  display: flex;
  font-size: $font-size-sm;
  margin: 20rpx 20rpx;
}
.btn {
  width: 90%;
  margin: 0 auto;
}
.protocol {
  background: #ffffff;
  overflow: hidden;
  .content {
    padding: 10rpx;
  }
}

.userinfo {
  width: 100%;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img {
  .imgitem {
    text-align: center;
  }
  .statustext {
    color: #fff;
  }
}
</style>
