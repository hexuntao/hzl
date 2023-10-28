<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn">
      <lk-button
        square
        type="danger"
        :color="theme.gradient"
        :disabled="btnDisabled"
        @click="presell"
      >
        <view class="btn-flex-column">
          <view>{{ price }}</view>
          <view>{{ btnText }}</view>
        </view>
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {};
  },
  props: {
    // 活动相关参数
    params: Object,
    // 商品基本信息
    info: Object,
    action: String,
    buyBtnText: {
      type: String,
      default: "立即付定金"
    }
  },
  computed: {
    /**
     *  预售状态
     *  ing => 正在进行
     *  not => 未开始
     *  end => 已结束
     */
    state() {
      let state = "";
      if (this.params.state == 1) {
        state = "ing";
      } else if (this.params.state == 2) {
        state = "not";
      } else if (this.params.state == 3) {
        state = "end";
      }
      return state;
    },
    btnText() {
      let text = "";
      if (this.params.presell_id) {
        if (this.state == "ing") {
          text = this.buyBtnText;
        } else if (this.state == "not") {
          text = this.buyBtnText;
        } else if (this.state == "end") {
          text = "已结束";
        }
      }
      return text;
    },
    btnDisabled() {
      let flag = true;
      if (this.state == "ing") {
        flag = false;
      }
      return flag;
    },
    btnType() {
      return "danger";
    },
    price() {
      return yuan(this.info.frontMoney);
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    presell() {
      this.$emit("click", "presell", {
        presell_id: this.params.presell_id
      });
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped lang="scss">
.btn-flex-column {
  display: flex;
  flex-flow: column;
  line-height: 1.2;
  font-size: $font-size-sm;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  view {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
}
</style>
