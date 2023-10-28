<template>
  <view class="cell-info-list" :class="cardClass">
    <view
      class="item"
      :class="align"
      v-for="(item, index) in list"
      :key="index"
    >
      <view class="title">{{ item.title }}</view>
      <view class="value" :style="{ color: item.color }">
        {{ item.value }}
        <lk-button
          v-if="item.btn"
          class="btn"
          round
          size="mini"
          type="danger"
          :color="theme.gradient"
          @click="btnClick(item, index)"
        >
          {{ item.btn }}
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "cell-info-list"
    };
  },
  props: {
    /**
     * 内容对齐方式
     * left
     * center
     * right
     */
    align: {
      type: String,
      default: "left"
    },
    // 卡片式
    card: {
      type: Boolean,
      default: false
    },
    list: Array
  },
  computed: {
    cardClass() {
      return this.card ? "card-group-box" : "";
    }
  },
  methods: {
    btnClick(item, index) {
      this.$emit("btn-click", item, index);
    }
  }
};
</script>

<style scoped lang="scss">
.cell-info-list {
  line-height: 48rpx;
  padding: 20rpx 30rpx;
  background-color: $white;
  .item {
    display: flex;
    flex-flow: row;
    .title {
      width: 180rpx;
      flex: none;
    }
    .value {
      flex: auto;
      font-size: $font-size-sm;
      color: $gray-darker;
      text-align: left;
      word-break: break-all;
    }
    &.left .value {
      text-align: left;
    }
    &.center .value {
      text-align: center;
    }
    &.right .value {
      text-align: right;
    }
  }
  .btn {
    margin-left: 20rpx;
  }
}
</style>
