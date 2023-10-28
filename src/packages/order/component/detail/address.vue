<template>
  <view class="card-group-box" v-if="info.name">
    <lk-cell icon="location-o" :title="info.title" />
    <lk-cell
      :title="info.name"
      :title-right="info.mobile"
      :label="info.address"
    />
  </view>
</template>

<script>
export default {
  props: {
    detail: Object
  },
  computed: {
    info() {
      const {
        store_id,
        store_name,
        store_tel,
        shop_name,
        receiver_type,
        receiver_chinese_country_name,
        receiver_name,
        receiver_mobile,
        receiver_province,
        receiver_city,
        receiver_district,
        receiver_address
      } = this.detail;
      let info = {};
      info.title = store_id ? "提货地址" : "收货地址";
      info.name = store_id
        ? shop_name + "（" + store_name + "）"
        : receiver_name;
      info.mobile = store_id ? store_tel : receiver_mobile;
      if (info.receiver_type == 1) {
        info.address = receiver_chinese_country_name + receiver_address;
      } else {
        info.address =
          receiver_province +
          receiver_city +
          receiver_district +
          receiver_address;
      }

      return info;
    }
  }
};
</script>

<style lang="scss" scoped></style>
