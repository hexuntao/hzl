<template>
  <lk-popup v-model="show" wrpper-style="background:transparent;">
    <view class="box">
      <view class="img">
        <image :src="qrcode" />
      </view>
      <view class="code">{{ code }}</view>
      <view class="text">提货码为提货凭证，请妥善保管</view>
    </view>
  </lk-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    code: String,
    qrcode: String
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 65vw;
}

.box .img {
  height: 0;
  width: 100%;
  padding: 50% 0;
  overflow: hidden;
  background: #ffffff;
  position: relative;
}

.box image {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: -50%;
  background-color: #fff;
  border: none;
}

.box .code {
  width: 100%;
  background: #fff;
  border-radius: 8rpx;
  font-weight: 800;
  color: $text-color;
  text-align: center;
  padding: 8rpx 20rpx;
  margin: 20rpx 0;
}

.box .text {
  font-size: $font-size-sm;
  color: #fff;
  text-align: center;
}
</style>
