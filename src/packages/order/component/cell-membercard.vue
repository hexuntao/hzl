<template>
  <view class="card-group-box"  >
    <lk-cell center>
      <lk-checkbox-group slot="icon">
        <lk-checkbox
          v-model="checked"
          :active-color="theme.color"
          :disabled="isDisabled"
          :label-disabled="isDisabled"
          name="point"
          shape="square"
          @click="onChange"
        >
          {{info.membercard_name?info.membercard_name:'' }}
        </lk-checkbox>
      </lk-checkbox-group>
      <view class="text">{{ text }}</view>
      <view slot="rightIcon" class="money">{{ pointDeductMoney }}</view>
    </lk-cell>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {
      checked: false
    };
  },
  props: {
    total_memebrcard_deduction:"",
    info: Object
  },
  watch: {
    "total_memebrcard_deduction"(e) {
      if (parseFloat(e) <= 0 ) {
        this.checked = false;
      }
    },
  },
  computed: {
    ...mapState(["member"]),
    isDisabled() {
      if (
        parseFloat(this.info.total_memebrcard_deduction) == 0&&parseFloat(this.info.membercard_balance)==0
      ) {
        return true;
      } else {
        return false;
      }
    },
    pointDeductMoney() {
      return `-${yuan(this.checked ? this.info.total_memebrcard_deduction : 0)}`;
    },
    text() {
      return `余额${this.info.membercard_balance}`;
    }
  },
  methods: {
    onChange(e) {
      this.$emit("load-data", !e);
    }
  }
};
</script>

<style scoped lang="scss">
.text {
  font-size: $font-size-sm;
  color: $text-light;
  padding: 0 20rpx;
  line-height: 28rpx;
}

.money {
  font-size: $font-size-sm;
  color: $red;
}
</style>
