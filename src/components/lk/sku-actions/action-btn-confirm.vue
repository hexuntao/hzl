<template>
  <view class="sku-action-group">
    <view class="action-btn">
      <lk-button
        square
        bing-mobile
        :type="btnType"
        :color="colorType"
        @click="click"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    action: String,
    info: Object,
    btnText: {
      type: String,
      default: "确定"
    },
    btnType: {
      type: String,
      default: "danger"
    }
  },
  computed: {
    colorType() {
      return this.theme[this.btnType == "danger" ? "gradient" : "cart"];
    }
  },
  methods: {
    click() {
      this.$emit("click", this.action);
    }
  }
};
</script>

<style scoped></style>
