<template>
  <view class="card-group-box">
    <lk-cell icon="edit" title="买家留言" />
    <lk-cell :value="detail.buyer_message || '该订单没有留言'" />
  </view>
</template>

<script>
export default {
  props: {
    detail: Object
  }
};
</script>
