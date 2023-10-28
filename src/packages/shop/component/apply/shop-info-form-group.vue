<template>
  <view class="cell-group">
    <view class="cell-group-title">店铺信息</view>
    <lk-field
      label="店铺名称"
      required
      v-model="form.shop_name"
      placeholder="必填，请输入店铺名称"
    />
    <lk-cell-picker-group
      v-model="shopType"
      required
      label="店铺类型"
      placeholder="请选择店铺类型"
      :columns="shopTypeColumn"
      @confirm="onConfirm"
    />
  </view>
</template>

<script>
import { GET_SHOPGROUP } from "@/common/interface/shop";
export default {
  data() {
    return {
      shopType: -1,
      shopTypeColumn: [],
      form: {
        shop_name: "",
        shop_group_id: "",
        shop_group_name: ""
      }
    };
  },
  mounted() {
    GET_SHOPGROUP().then(({ data }) => {
      data.shop_group_list.map(e => {
        this.shopTypeColumn.push({
          name: e.group_name,
          id: e.shop_group_id
        });
      });
    });
  },
  methods: {
    onConfirm(index) {
      const item = this.shopTypeColumn[index];
      this.form.shop_group_id = item.id;
      this.form.shop_group_name = item.name;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
