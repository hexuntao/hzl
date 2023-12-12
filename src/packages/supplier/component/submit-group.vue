<template>
  <view class="cell">
    <view class="cell-checkbox">
      <lk-checkbox-group>
        <lk-checkbox v-model="checked" :active-color="theme.color">
          我已阅读并了解<text class="text-link" @click="showAgreement = true"
            >【{{ agreementText }}】</text
          >
        </lk-checkbox>
      </lk-checkbox-group>
    </view>
    <lk-popup v-model="showAgreement" :title="agreementText" round>
      <view class="contract">
        <lk-parser
          show-with-animation
          lazy-load
          :html="protocolData.apply_content"
        ></lk-parser>
      </view>
    </lk-popup>
    <lk-button
      block
      round
      type="danger"
      :loading="loading"
      theme-color
      bing-mobile
      :disabled="!checked"
      @click="submit"
    >
      {{ btnText }}
    </lk-button>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      checked: false,
      showAgreement: false
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: "提交申请"
    },
    protocolData:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  computed: {
    agreementText() {
      return `${this.protocolData.apply_name}协议`;
    }
  },
  methods: {
    submit() {
      this.$emit("submit", {});
    }
  }
};
</script>

<style lang="scss" scoped>
.cell {
  padding: $cell-padding;
  background: #ffffff;
}
.cell-checkbox {
  margin: 20rpx 0 40rpx;
}
.contract {
  width: 80vw;
  height: 60vh;
  overflow-y: auto;
}
</style>
