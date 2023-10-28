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
        <lk-parser show-with-animation lazy-load :html="protocol"></lk-parser>
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
    agentType: [Number, String]
  },
  computed: {
    ...mapState({
      texts: ({ bonus }) => bonus.texts
    }),
    agreementText() {
      const { area, global, team } = this.texts;
      let text = "";
      if (this.agentType == 1) text = global.global_agreement;
      if (this.agentType == 2) text = area.area_agreement;
      if (this.agentType == 3) text = team.team_agreement;
      return text + "协议";
    },
    protocol() {
      const { area, global, team } = this.texts;
      let text = "";
      if (this.agentType == 1) text = global.content;
      if (this.agentType == 2) text = area.content;
      if (this.agentType == 3) text = team.content;
      return text;
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
