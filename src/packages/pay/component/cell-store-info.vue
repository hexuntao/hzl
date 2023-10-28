<template>
  <view class="card-group-box">
    <lk-cell icon="location-o" :title="info.title" />
    <lk-cell
      :title="info.shop_name + '(' + info.store_name + ')'"
      :title-right="info.store_tel"
      :label="info.address"
    />
  </view>
</template>

<script>
export default {
  props: {
    info: Object
  }
};
</script>
