<template>
  <view class="cell-group">
    <lk-cell :title="title" is-link :value="text" @click="show = true" />
    <lk-popup v-model="show" position="bottom" round closeable :title="title">
      <lk-radio-group v-model="value" :active-color="theme.color">
        <view class="items">
          <lk-cell
            v-for="(item, index) in items"
            :key="index"
            center
            :title="item.name"
            :label="item.label"
            clickable
            @click="onSelect(item.type)"
          >
            <lk-radio slot="rightIcon" :name="item.type" />
          </lk-cell>
        </view>
      </lk-radio-group>
    </lk-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "支付方式",
      show: false,
      items: [
        { name: "在线支付", label: "支持余额、微信、支付宝、银行卡", type: 1 },
        { name: "货到付款", label: "收货时线下付款，更便捷", type: 0 }
      ]
    };
  },
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  computed: {
    text() {
      const { name } = this.items.filter(({ type }) => type == this.value)[0];
      return name;
    }
  },
  methods: {
    onClose() {
      this.show = false;
    },
    onSelect(type) {
      this.$emit("input", type);
      this.onClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
  .items {
    display: flex;
    width: 100%;
    flex-flow: column;
  }
}
</style>
