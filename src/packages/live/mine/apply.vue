<template>
  <view class="pages">
    <block v-if="pageType == 1">
      <view class="reason" v-if="uncheckReason">{{ uncheckReason }}</view>
      <view class="cell-group">
        <lk-field
          label="真实姓名"
          required
          type="text"
          placeholder="请输入真实姓名"
          v-model="params.real_name"
        />
        <lk-field
          label="手机号码"
          required
          type="number"
          placeholder="请输入手机号码"
          v-model="params.user_tel"
          maxlength="11"
        />
        <lk-field
          label="身份证号"
          required
          v-model="params.id_card"
          type="idcard"
          placeholder="请输入身份证号"
        />
        <cell-upload-image
          v-model="params.hand_card"
          label="手持身份证照"
          :example-img="exampleImgs[0]"
        />
        <cell-upload-image
          v-model="params.front_card"
          label="身份证正照"
          :example-img="exampleImgs[1]"
        />
        <cell-upload-image
          v-model="params.back_card"
          label="身份证反照"
          :example-img="exampleImgs[2]"
        />
        <view class="cell-protocol">
          <lk-checkbox-group>
            <lk-checkbox v-model="checked" :active-color="theme.color">
              我已阅读并认同
            </lk-checkbox>
          </lk-checkbox-group>
          <text class="text-link" @tap="showContract = true">
            《主播协议》
          </text>
        </view>
      </view>
      <lk-popup v-model="showContract" title="主播协议" round>
        <view class="contract">
          <lk-parser
            show-with-animation
            lazy-load
            :html="contractContent"
          ></lk-parser>
        </view>
      </lk-popup>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          theme-color
          bing-mobile
          :loading="isLoading"
          :disabled="!checked"
          @click="onApply"
        >
          申请
        </lk-button>
      </view>
    </block>
    <block v-if="pageType == 2">
      <result-state
        type="wait"
        message="您的申请已提交至平台审核，请耐心等待！"
      ></result-state>
    </block>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_LIVEAPPLYANCHORINFO, APPLY_LIVEANCHOR } from "../interface";
import cellUploadImage from "../component/cell-upload-image";
import resultState from "../component/result-state";
import {
  validUsername,
  validMobile,
  validCard
} from "@/common/utils/validator";
export default {
  name: "packages-live-mine-apply",
  data() {
    return {
      pageType: 0, // 页面类型 1==> 申请状态 2==> 审核状态
      uncheckReason: "",
      checked: false,
      showContract: false,
      contractContent: "",
      isLoading: false,
      params: {
        real_name: "",
        user_tel: "",
        id_card: "",
        front_card: "",
        back_card: "",
        hand_card: ""
      }
    };
  },
  computed: {
    ...mapGetters(["static"]),
    exampleImgs() {
      let base = this.static.baseImgPath;
      return [
        base + "identity-img-1.png",
        base + "identity-img-2.png",
        base + "identity-img-3.png"
      ];
    }
  },
  onLoad(query) {
    this.hash = query.hash || "";
    this.getInfo();
  },
  methods: {
    getInfo() {
      GET_LIVEAPPLYANCHORINFO({}, { isShowLoading: true }).then(({ data }) => {
        if (this.hash == "replenish") {
          // 完善资料
          this.pageType = 1;
        } else {
          const isApply = parseInt(data.is_anchor);
          const status = parseInt(data.check_status);
          if (isApply === 0) {
            this.pageType = 1;
          }
          if (isApply === 1) {
            this.uncheckReason =
              status == -1 ? "审核不通过：" + data.uncheck_reason : "";
            this.pageType = status == -1 ? 1 : 2;
          }
        }
        this.params.real_name = data.real_name;
        this.params.user_tel = data.user_tel;
        this.params.id_card = data.id_card;
        this.params.front_card = data.front_card;
        this.params.back_card = data.back_card;
        this.params.hand_card = data.hand_card;
        this.contractContent = data.live_protocol || "";
      });
    },
    onApply() {
      if (!validUsername(this.params.real_name)) {
        return false;
      }
      if (!validMobile(this.params.user_tel)) {
        return false;
      }
      if (!validCard(this.params.id_card)) {
        return false;
      }
      if (!this.params.hand_card) {
        return this.$Prompt.toast("请上传手持身份证照");
      }
      if (!this.params.front_card) {
        return this.$Prompt.toast("请上传身份证正照");
      }
      if (!this.params.back_card) {
        return this.$Prompt.toast("请上传身份证反照");
      }
      this.isLoading = true;
      APPLY_LIVEANCHOR(this.params)
        .then(() => {
          this.$Prompt
            .toast({ title: "提交成功", icon: "success" })
            .then(() => {
              setTimeout(() => {
                this.$Navigate.replace("/packages/live/mine/index");
              }, 500);
            });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    cellUploadImage,
    resultState
  }
};
</script>

<style lang="scss" scoped>
.cell-protocol {
  display: flex;
  padding: $cell-padding;
  font-size: $font-size-sm;
  align-items: center;
  background: #fff;
}
.contract {
  width: 80vw;
  height: 60vh;
  padding: 30rpx;
  overflow-y: auto;
  font-size: $font-size;
}
.reason {
  padding: 20rpx;
  color: #f56723;
  font-size: $font-size-sm;
  line-height: 1.5;
  background-color: #fff7cc;
}
</style>
