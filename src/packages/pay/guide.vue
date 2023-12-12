<template>
  <view class="pages">
    <view class="wrap">
      <image :src="indicateImg" class="indicate" />
      <view class="text">
        请在菜单中选择在浏览器中打开以完成支付
      </view>
    </view>
    <view class="tip-img">
      <image :src="tipImg" class="img" mode="widthFix" />
      <view v-if="iosShow" class="text">在Safari中打开</view>
    </view>
    <view class="btn-group">
      <lk-button class="btn" round type="danger" theme-color @click="onResult">
        已支付完成
      </lk-button>
      <lk-button
        class="btn"
        plain
        round
        type="danger"
        theme-color
        @click="onBack"
      >
        其他支付方式
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { isWeixin, isBrowser } from "@/common/utils";
import { PAY_ALIPAY } from "@/common/interface/pay";
export default {
  name: "packages-pay-guide",
  data() {
    return {
      iosShow: false,
      out_trade_no: null
    };
  },
  computed: {
    ...mapGetters(["static"]),
    indicateImg() {
      return this.static.baseImgPath + "icon_indicate.png";
    },
    tipImg() {
      let src = isBrowser("ios")
        ? "safari_icon_small.png"
        : "android_icon_small.png";
      return this.static.baseImgPath + src;
    }
  },
  onLoad(query) {
    const { params, config, real, from } = query;
    this.from = from || ""; //来源
    this.real = decodeURIComponent(real);
    console.log({ params, config, real });
    this.out_trade_no = JSON.parse(params).out_trade_no || "";
    this.getInfo(JSON.parse(params), JSON.parse(config));
  },
  methods: {
    getInfo(params = {}, config = {}) {
      if (isWeixin()) {
        this.iosShow = isBrowser("ios");
      } else {
        PAY_ALIPAY({ ...params, type: 2 }, { ...config })
          .then(({ data }) => {
            const div = document.createElement("div");
            div.innerHTML = data;
            document.body.appendChild(div);
            document.forms[0].submit();
          })
          .catch(() => {});
      }
    },
    onResult() {
      this.$Navigate.replace({
        path: "/packages/pay/result",
        query: {
          out_trade_no: this.out_trade_no,
          from: this.from
        }
      });
    },
    onBack() {
      let path = "/pay/payment";
      if (this.from === "membercard") {
        path = "/pay/membercard";
      }
      if (this.from === "level") {
        path = "/pay/level";
      }
      this.$Navigate.replace(path + this.real);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  height: 240rpx;
  .indicate {
    width: 80rpx;
    height: 100rpx;
    position: absolute;
    right: 30rpx;
  }
  .text {
    position: absolute;
    right: 30rpx;
    top: 120rpx;
    line-height: 40rpx;
    width: 340rpx;
    font-size: $font-size-sm;
    color: $text-light;
  }
}
.tip-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 80vw;
  margin: 0 auto;
  flex-flow: column;
  .img {
    width: 400rpx;
    height: 400rpx;
  }
  .text {
    padding: 20rpx 0;
    font-size: $font-size-sm;
    color: $text-light;
  }
}
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $cell-padding;
  .btn {
    margin: 0 20rpx;
  }
}
</style>
