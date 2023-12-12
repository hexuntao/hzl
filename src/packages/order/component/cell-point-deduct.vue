<template>
  <view class="card-group-box" v-if="isPointDeduct">
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
          {{ member.texts.point_style }}
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
    isPointDeduct: Boolean,
    info: Object
  },
  watch: {
    "info.total_deduction_money"(e) {
      if (parseFloat(e) <= 0) {
        this.checked = false;
      }
    }
  },
  computed: {
    ...mapState(["member"]),
    isDisabled() {
      if (
        this.isPointDeduct &&
        parseFloat(this.info.total_deduction_money) > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    pointDeductMoney() {
      return `-${yuan(this.checked ? this.info.total_deduction_money : 0)}`;
    },
    text() {
      return `共${this.info.point}${this.member.texts.point_style},可使用${this.info.total_deduction_point}个`;
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
