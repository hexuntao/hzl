<template>
  <lk-popup
    v-model="value"
    round
    :mask-close="false"
    closeable
    :beforeHide="onClose"
  >
    <view class="popup-assemble">
      <view class="title">
        参与
        <text> {{ item.user_name }} </text>的拼单
      </view>
      <view class="tips">
        <text>仅剩</text>
        <text class="num"> {{ item.group_num - item.now_num }} </text>个名额，
        <lk-count-down :time="item.finish_time * 1000" @finish="finish" />
      </view>
      <view class="img-box">
        <view class="img">
          <image :src="item.user_headimg" />
          <lk-tag
            :custom-style="{
              position: 'absolute',
              right: 0,
              top: 0
            }"
            round
            type="danger"
          >
            团长
          </lk-tag>
        </view>
        <view class="help">?</view>
      </view>
      <view class="btn">
        <lk-button type="danger" size="small" round block @click="onJoin">
          参与拼单
        </lk-button>
      </view>
    </view>
  </lk-popup>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    }
  },
  methods: {
    finish() {
      this.$emit("callback", this.item.record_id);
    },
    onJoin() {
      this.$emit("confirm", this.item.record_id);
    },
    onClose() {
      this.$emit("input", false);
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.popup-assemble {
  width: 600rpx;
  padding: 40rpx;
  text-align: center;
  line-height: 1.6;
  .title {
    margin-bottom: 20rpx;
    font-size: $font-size-lg;
  }

  .tips {
    font-size: $font-size-sm;
    color: $text-gray;
    display: flex;
    justify-content: center;
  }

  .tips .num {
    color: $red;
  }

  .img-box {
    display: flex;
    justify-content: center;
    margin: 40rpx 0;
  }

  .img-box .img {
    position: relative;
    width: 100rpx;
    height: 100rpx;
    margin-right: 20rpx;
  }

  .img-box .img image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }

  .img-box .img text {
    position: absolute;
    right: 0;
    top: 0;
  }

  .img-box .help {
    display: block;
    width: 100rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 60rpx;
    color: $text-light;
    border-radius: 50%;
    border: 2rpx dashed $text-light;
    margin-left: 20rpx;
  }
}
</style>
