<template>
  <view v-if="showCellRule">
    <view class="cell">
      <lk-checkbox-group :active-color="theme.color">
        <lk-checkbox v-model="checked">
          <text class="text-sm">我已阅读并同意</text>
        </lk-checkbox>
      </lk-checkbox-group>
      <text class="text-link" @tap="onShowContract">
        《会员购买协议》
      </text>
    </view>
    <lk-popup v-model="showContract" title="购买协议" round>
      <view class="contract">
        <lk-parser
          show-with-animation
          lazy-load
          :html="contractContent"
        ></lk-parser>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { GET_REGISTERPROTOCOL } from "@/common/interface/config";
export default {
  data() {
    return {
      showContract: false,
      contractContent: ""
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      showCellRule: ({ config }) => config.pur_rule
    }),
    checked: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    onShowContract() {
      if (this.contractContent) {
        return (this.showContract = true);
      }
      GET_REGISTERPROTOCOL({ type: 2 })
        .then(({ data }) => {
          this.contractContent = data.register_protocol;
          this.showContract = true;
        })
        .catch(() => {
          this.showContract = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell {
  display: flex;
  align-items: center;
  padding: $cell-padding;
  line-height: 48rpx;
  font-size: $font-size-sm;
}
.text-sm {
  font-size: $font-size-sm;
}
.contract {
  width: 80vw;
  height: 60vh;
  padding: 30rpx;
  overflow-y: auto;
  font-size: $font-size;
}
</style>
