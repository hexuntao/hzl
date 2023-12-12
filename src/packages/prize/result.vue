<template>
  <view class="pages">
    <view class="wrap">
      <view class="message">恭喜你，奖品已收入囊中！</view>
      <view class="image">
        <image :src="prizeImage" mode="aspectFit" />
      </view>
      <view class="foot-btn">
        <lk-button
          class="btn"
          type="danger"
          round
          size="small"
          :color="theme.color"
          to="/pages/mall/index"
        >
          返回首页
        </lk-button>
        <lk-button
          class="btn"
          type="danger"
          round
          size="small"
          plain
          :color="theme.color"
          to="/packages/prize/list"
        >
          返回奖品列表
        </lk-button>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "packages-prize-result",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["static"]),
    prizeImage() {
      return this.static.baseImgPath + "prize-success.png";
    }
  },
  methods: {},
  components: {}
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  .message {
    text-align: center;
    font-size: $font-size-lg;
    margin: 40rpx;
  }
  .image {
    width: 278rpx;
    height: 236rpx;
    margin: 40rpx;
    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .foot-btn {
    margin: 40rpx;
    .btn {
      margin: 0 20rpx;
    }
  }
}
</style>
