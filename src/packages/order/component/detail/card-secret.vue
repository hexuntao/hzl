<template>
  <view class="card-group-box box">
    <view class="card-group-box card-info">
      <view v-for="(item,index) in cardInfo.electroncard_msg" :key="index">{{item}}</view>
    </view>
    <view class="explain">
      <view>使用说明：</view>
      <view>{{cardInfo.description}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    detail: Object
  },
  computed:{
    cardInfo(){
     let electroncard_msg = {
       description:this.detail.electroncard_msg.description,
       electroncard_msg:this.detail.electroncard_msg.electroncard_msg.split(',')
     }
      return electroncard_msg
    }
  },
};
</script>
<style lang="scss" scoped>
.box{
  background: #fff;
  .card-info{
    background: #f2f2f2;
    padding: 20rpx;
    line-height: 35rpx;
  }
  .explain{
    padding: 20rpx;
  }
}
</style>
