<template>
  <view class="card-group-box">
    <lk-cell>{{ message }}</lk-cell>
  </view>
</template>

<script>
export default {
  props: {
    message: String
  }
};
</script>
