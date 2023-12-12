<template>
  <view>
    <view>
      <cell-select-bank @select="onSelectBank" />
      <lk-field
        required
        label="银行卡号"
        type="number"
        placeholder="请输入银行卡号"
        v-model="info.account_number"
      />
      <lk-field
        required
        label="持卡人"
        placeholder="请输入持卡人姓名"
        v-model="info.realname"
      />
      <lk-field
        required
        label="身份证号"
        type="idcard"
        placeholder="请输入身份证号"
        v-model="info.bank_card"
      />
      <lk-field
        required
        label="手机号"
        type="number"
        placeholder="银行预留的手机号"
        v-model="info.mobile"
      >
        <view slot="rightIcon">
          <lk-icon
            name="warning-o"
            size="20"
            :color="theme.color"
            @click="onShowExample('mobile')"
            v-if="isCredit"
          />
        </view>
      </lk-field>
      <block v-if="isCredit">
        <lk-field
          required
          label="有效期"
          type="number"
          maxlength="4"
          placeholder="示例：01/20，输入0120"
          v-model="info.valid_date"
        >
          <lk-icon
            name="warning-o"
            slot="rightIcon"
            size="20"
            :color="theme.color"
            @click="onShowExample('valid_date')"
          />
        </lk-field>
        <lk-field
          required
          label="安全码"
          type="number"
          maxlength="3"
          placeholder="卡背后三位数"
          v-model="info.cvv2"
        >
          <lk-icon
            name="warning-o"
            slot="rightIcon"
            size="20"
            :color="theme.color"
            @click="onShowExample('cvv2')"
          />
        </lk-field>
      </block>

      <!-- 输入验证码 -->
      <lk-field
        v-if="joinpaycode"
        required
        label="短信验证码"
        type="number"
        placeholder="请输入验证码"
        v-model="joinsmscode"
      />
    </view>
    <lk-popup
      v-model="showExamplePopup"
      wrpper-style="background:transparent;"
      v-if="isCredit"
    >
      <view class="example-box" v-if="showExample">
        <view class="example-title">{{ exampleData[showExample].title }}</view>
        <image
          class="example-img"
          mode="widthFix"
          :src="exampleData[showExample].img"
          v-if="exampleData[showExample].img"
        />
        <view class="example-text">{{ exampleData[showExample].text }}</view>
      </view>
    </lk-popup>
    <view class="foot-btn-group">
      <lk-button
       v-if="!joinpaycode"
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="save"
        :loading="loading"
      >
        验证并保存
      </lk-button>
       <!-- 汇聚签约 -->
      <lk-button
        v-if="joinpaycode"
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="sign"
      >输入验证码,进行签约</lk-button>
    </view>
  </view>
</template>

<script>
import cellSelectBank from "./cell-select-bank";
import { validCard, validMobile } from "@/common/utils/validator";
import { mapGetters } from "vuex";
import { SIGNING_BANKCARD } from "@/common/interface/property";
export default {
  data() {
    return {
        joinsmscode: "", //短信验证码
      isCredit: false, //是否为信用卡
      showExamplePopup: false,
      showExample: "",
    };
  },
  props: {
    info: Object,
    loading: {
      type: Boolean,
      default: false,
    },
     joinpaycode: {}, //验证成功显示验证码输入框
    q1_OrderNo: {}, //汇聚签约数据
  },
  computed: {
    ...mapGetters(["static"]),
    exampleData() {
      return {
        valid_date: {
          title: "有效期说明",
          img: this.static.baseImgPath + "bank-demo-01.png",
          text:
            "有效期是打印在信用卡正面卡号下方。标准格式为月份在前，年份在后的一串数字。",
        },
        cvv2: {
          title: "安全码说明",
          img: this.static.baseImgPath + "bank-demo-02.png",
          text: "安全码是卡背面签名区的一组数字，一般为末位三位数字。",
        },
        mobile: {
          title: "预留手机说明",
          img: "",
          text:
            "银行预留的手机号码是办理该银行卡时所填写的手机行号。没有预留、手机号码忘记或者手机号码停用，请联系银行客服更新处理。",
        },
      };
    },
  },
  methods: {
     sign() {
      //汇聚签约
      console.log(this.info);
      this.info["smscode"] = this.joinsmscode;
      this.info["q1_OrderNo"] = this.q1_OrderNo;

      if (!this.joinsmscode) {
        this.$Prompt.toast("请输入验证码");
        return false;
      }
      SIGNING_BANKCARD(this.info)
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.$Prompt.toast({ title: res.message, icon: "success" });
            setTimeout(() => {
              this.$Navigate.back();
            }, 1200);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    onSelectBank({ bank_type, bank_code }) {
      this.info.bank_type = bank_type;
      this.info.bank_code = bank_code;
      if (bank_type == "02") {
        this.isCredit = true;
      } else {
        this.isCredit = false;
        delete this.info.cvv2;
        delete this.info.valid_date;
      }
    },
    // 显示示例
    onShowExample(action) {
      this.showExamplePopup = true;
      this.showExample = action;
    },
    // 验证
    validator() {
      const info = this.info;
      if (!info.bank_type) {
        this.$Prompt.toast("请选择银行！");
        return false;
      }
      if (!info.account_number) {
        this.$Prompt.toast("请输入银行卡号！");
        return false;
      }
      if (!info.realname) {
        this.$Prompt.toast("请输入持卡人姓名！");
        return false;
      }
      if (!validCard(info.bank_card)) {
        return false;
      }
      if (!validMobile(info.mobile)) {
        return false;
      }
      if (this.isCredit) {
        if (!info.valid_date) {
          this.$Prompt.toast("请输入银行卡有效期！");
          return false;
        }
        if (!info.cvv2) {
          this.$Prompt.toast("请输入银行卡安全码！");
          return false;
        }
      }
      return info;
    },
    save() {
      const info = this.validator();
      if (info) {
        this.$emit("save", info);
      }
    },
  },
  components: {
    cellSelectBank,
  },
};
</script>

<style lang="scss" scoped>
.example-box {
  width: 80%;
  max-height: 60%;
  margin: 0 auto;
}

.example-img {
  max-width: 100%;
  display: block;
  height: auto;
}

.example-title {
  padding: 30rpx 20rpx;
  border-bottom: 2rpx solid #fff;
  text-align: center;
  font-size: $font-size-lg;
  color: #fff;
  margin-bottom: 30rpx;
}

.example-text {
  color: #fff;
  line-height: 1.4;
  margin-top: 30rpx;
}
</style>
