<template>
  <lk-cell-group>
    <lk-cell icon="location-o" :title="text" />
    <lk-cell>
      <view class="info">
        <view class="name">
          <view class="text-nowrap">
            <view>{{detail.shop_name}} ({{detail.store_name}})</view>
            <view class="tel">{{detail.store_tel}}</view>
          </view>
          <view class="text-right">{{detail.address}}</view>
        </view>
      </view>
    </lk-cell>
  </lk-cell-group>
</template>

<script>
export default {
  props: {
    detail: Object,
    text: {
      type: String,
      default: "使用门店"
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.text-nowrap {
  display: flex;
  justify-content: space-between;
}
.tel {
  color: #909399;
}
.text-right {
  color: #909399;
  font-size: 25rpx;
  padding-top: 10rpx;
}
</style>>
