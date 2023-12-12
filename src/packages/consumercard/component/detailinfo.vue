<template>
  <view>
    <lk-cell class="cell" >
     <view class="img">
          <image :src="detail.goods_picture"  />
         <view class="title"> {{ detail.goods_name}}</view>
     </view>
    </lk-cell>
  </view>
</template>

<script>
export default {
  props: {
    detail: {
    }
  }
};
</script>

<style scoped lang='scss'>
.cell{
  background-color: #f4f4f4;
}
.img{
    display: flex;
}
.img image{
    width: 120rpx;
    height: 120rpx;
}
.title{
    margin-left: 20rpx;
}
</style>