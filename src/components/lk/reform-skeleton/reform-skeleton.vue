<template>
  <view class="reform-skeleton">
    <block v-if="type != 3">
      <view class="search">
        <view class="box">
          <view class="icon"></view>
          <view class="text"></view>
        </view>
      </view>
      <view class="banner">
        <view class="box">
          <text class="i"></text>
          <text class="i"></text>
          <text class="i"></text>
        </view>
      </view>
      <view class="menu">
        <view class="box">
          <view class="i">
            <text class="icon"></text>
            <text class="text"></text>
          </view>
          <view class="i">
            <text class="icon"></text>
            <text class="text"></text>
          </view>
          <view class="i">
            <text class="icon"></text>
            <text class="text"></text>
          </view>
          <view class="i">
            <text class="icon"></text>
            <text class="text"></text>
          </view>
          <view class="i">
            <text class="icon"></text>
            <text class="text"></text>
          </view>
        </view>
      </view>
      <view class="picturew">
        <view class="l"></view>
        <view class="r">
          <view class="r-t "></view>
          <view class="r-b">
            <view class="r-b-l"></view>
            <view class="r-b-r"></view>
          </view>
        </view>
      </view>
      <view class="shop">
        <view class="t"></view>
        <view class="b">
          <view class="i"></view>
          <view class="i"></view>
          <view class="i"></view>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="banner goods-banner">
        <view class="box">
          <text class="i"></text>
          <text class="i"></text>
          <text class="i"></text>
        </view>
      </view>
      <view class="info">
        <view class="h">
          <view class="p"></view>
          <view class="o"></view>
          <view class="n"></view>
        </view>
        <view class="f">
          <view></view>
          <view></view>
        </view>
      </view>
      <view class="list">
        <view class="l">
          <view class="i"></view>
          <view class="t"></view>
        </view>
        <view class="r"></view>
      </view>
      <view class="list">
        <view class="l">
          <view class="i"></view>
          <view class="t"></view>
        </view>
        <view class="r"></view>
      </view>
      <view class="bar">
        <view class="i">
          <view class="p"></view>
          <view class="t"></view>
        </view>
        <view class="i">
          <view class="p"></view>
          <view class="t"></view>
        </view>
        <view class="i">
          <view class="p"></view>
          <view class="t"></view>
        </view>
        <view class="b">
          <view class="l"></view>
          <view class="r"></view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    type: [Number, String]
  },
  computed: {}
};
</script>

<style scoped lang="scss">
$bg: #f2f3f5;
.card {
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
.reform-skeleton {
  background: #f8f8f8;
  animation: skeleton-blink 1.2s ease-in-out infinite;
  @keyframes skeleton-blink {
    50% {
      opacity: 0.5;
    }
  }
  .shop {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 20rpx 0;
    .t {
      width: 200rpx;
      height: 40rpx;
      background: $bg;
    }
    .b {
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      margin: 20rpx 0;
      .i {
        width: 200rpx;
        height: 80rpx;
        background: $bg;
      }
    }
  }
  .search {
    height: auto;
    margin: 20rpx;
    .box {
      background: #fff;
      padding: 10rpx;
      display: flex;
      .icon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 20rpx;
        background: $bg;
      }
      .text {
        width: 40%;
        height: 48rpx;
        background: $bg;
      }
    }
  }
  .banner {
    width: 100%;
    height: 50vw;
    background: $bg;
    position: relative;
    .box {
      position: absolute;
      bottom: 20rpx;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
    }
    .i {
      display: block;
      width: 40rpx;
      height: 10rpx;
      background: #fff;
      margin: 0 10rpx;
    }
  }
  .menu {
    margin: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background: #fff;
    .box {
      display: flex;
      flex-wrap: wrap;
      padding: 20rpx;
      justify-content: space-evenly;
      .i {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        width: 20%;
        .icon {
          border-radius: 50%;
          width: 88rpx;
          height: 88rpx;
          background: $bg;
        }
        .text {
          width: 80rpx;
          height: 30rpx;
          background: $bg;
          margin: 10rpx 0;
        }
      }
    }
  }
  .picturew {
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    .l {
      width: 50vw;
      height: 50vw;
      background: $bg;
      border-right: 1px solid #e8e8e8;
    }
    .r {
      width: 50vw;
      height: 50vw;
      .r-t {
        width: 100%;
        height: 25vw;
        background: $bg;
        border-bottom: 1px solid #e8e8e8;
      }
      .r-b {
        width: 100%;
        height: 25vw;
        display: flex;
        .r-b-l,
        .r-b-r {
          width: 25vw;
          height: 25vw;
          background: $bg;
        }
        .r-b-r {
          border-left: 1px solid #e8e8e8;
        }
      }
    }
  }
  .goods-banner {
    height: 100vw;
    position: relative;
    .b {
      position: absolute;
      width: 60rpx;
      height: 60rpx;
      background: #ddd;
      border-radius: 200rpx;
      right: 30rpx;
      top: 30rpx;
    }
    .i {
      display: block;
      width: 12rpx;
      height: 12rpx;
      background: #ddd;
      margin: 0 10rpx;
      border-radius: 200rpx;
    }
  }
  .info {
    display: flex;
    flex-flow: column;
    background: #fff;
    & > view {
    }
    .h {
      padding: 20rpx 30rpx;
      position: relative;
      view {
        margin: 10rpx 0;
      }
      &::before {
        content: " ";
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 30rpx;
        right: 0;
        bottom: 0;
        transform: scaleY(0.5);
        border-bottom: 2rpx solid #ebedf0;
      }
    }
    .p {
      width: 160rpx;
      height: 48rpx;
      background: $bg;
    }
    .o {
      width: 80rpx;
      height: 40rpx;
      background: $bg;
    }
    .n {
      width: 100%;
      height: 40rpx;
      background: $bg;
    }
    .f {
      padding: 20rpx 30rpx;
      display: flex;
      align-items: center;
      view {
        width: 200rpx;
        height: 30rpx;
        background: $bg;
        margin-right: 80rpx;
      }
    }
  }
  .list {
    display: flex;
    flex-flow: row;
    padding: 20rpx 30rpx;
    margin: 20rpx 0;
    justify-content: space-between;
    background: #fff;
    align-items: center;
    .l {
      flex: 1;
      display: flex;
      .i {
        width: 100rpx;
        height: 48rpx;
        background: $bg;
        margin-right: 40rpx;
      }
      .t {
        width: 240rpx;
        height: 48rpx;
        background: $bg;
      }
    }
    .r {
      width: 40rpx;
      height: 40rpx;
      background: $bg;
    }
  }
  .bar {
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    position: fixed;
    background-color: #fff;
    z-index: 1;
    .i {
      position: relative;
      display: flex;
      height: 100rpx;
      min-width: 15%;
      line-height: 1;
      text-align: center;
      background-color: #fff;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .p {
        width: 40rpx;
        height: 40rpx;
        background: $bg;
        margin: 0 auto 10rpx;
      }
      .t {
        width: 80rpx;
        height: 28rpx;
        background: $bg;
      }
    }
    .b {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      view {
        width: 100%;
        height: 80rpx;
        background: $bg;
      }
      .l {
        border-top-left-radius: 80rpx;
        border-bottom-left-radius: 80rpx;
        background: #f7e3c7;
      }
      .r {
        border-top-right-radius: 80rpx;
        border-bottom-right-radius: 80rpx;
        background: #f3d7d7;
      }
    }
  }
}
</style>
