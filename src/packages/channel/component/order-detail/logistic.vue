<template>
  <view class="card-group-box">
    <block v-if="(status === 2 || status === 3 || status === 4) && info.mailNo">
      <lk-cell
        icon="v-icon-logistic6"
        icon-prefix="v-icon"
        :title="info.expTextName + ' ' + info.mailNo"
        is-link
        title-right="更多"
        :to="'/packages/order/logistics?order_id=' + order_id"
      />
      <lk-cell v-if="info.newestInfo">
        <view class="title">{{ info.newestInfo.context }}</view>
        <view class="label">{{ info.newestInfo.time }}</view>
      </lk-cell>
    </block>
    <view class="bg-white empty" v-else>暂无物流信息</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    status: {
      type: [Number, String]
    },
    order_id: {
      type: [Number, String]
    },
    info: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.nowrap {
  white-space: nowrap;
}

.title {
  color: $orange;
  line-height: 1.4;
  margin-bottom: 8rpx;
}
.label {
  font-size: $font-size-sm;
  color: $text-light;
}
</style>
