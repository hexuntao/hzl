<template>
    <view>
      <image class="img" :src='bannerUrl' mode="widthFix"></image>
      <view class="foot-btn-group fixed">
        <lk-button
          block
          round
          theme-color
          @click="onApply"
        >
          申请入驻
        </lk-button>
      </view>
    </view>
</template>
<script>
export default {
  name: '',
  data() {
    return {};
  },
  components: {},
  props: {
    bannerUrl:{
      type:String,
      default:''
    }
  },
  computed: {},
  onLoad() {},
  methods: {
    onApply(){
      this.$emit('onApply')
    }
  },
}
</script>
<style scoped lang='scss'>
.img{
  width: 100%;
  margin-bottom: 100rpx;
}
</style>