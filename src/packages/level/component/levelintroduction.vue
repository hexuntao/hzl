<template>
  <view class="introduce">
    <view class="cell-title" v-if="gradeintroduce.introduce_name != ''">{{
      gradeintroduce.introduce_name
    }}</view>
    <lk-parser
      v-if="gradeintroduce.introduce_content != ''"
      show-with-animation
      lazy-load
      :html="gradeintroduce.introduce_content"
    >
    </lk-parser>
  </view>
</template>

<script>
export default {
  props: {
    gradeintroduce: Object
  }
};
</script>

<style scoped>
.introduce {
  height: auto;
  background-color: #fff;
  margin: 20rpx 0 200rpx;
  padding: 20rpx 20rpx 240rpx;
}
.cell-title {
  font-size: 32rpx;
  color: #333333;
  padding-bottom: 20rpx;
}
.introduceitem {
  color: #999999;
}
</style>
