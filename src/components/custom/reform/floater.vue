<template>
  <view :class="items.id">
    <view class="reform-box floater-box">
      <view class="item" v-for="(item, index) in btnList" :key="index">
        <block v-if="item.type == 1">
          <button class="kefu-btn" open-type="contact">
            <image :src="item.imgurl" class="image" mode="aspectFit" />
          </button>
        </block>
        <block v-else>
          <image :src="item.imgurl" class="btn-image" @click="click(item)" />
          <view class="btn-close" v-if="item.close" @tap="close(index)">
            <lk-icon name="clear" color="#666666" size="14" />
          </view>
        </block>
      </view>
      <view class="item" v-if="backtopImage">
        <lk-back-top
          :custom-style="{
            position: 'initial',
          }"
          :scroll-top="scrollTop"
        >
          <image class="backtop-image" :src="backtopImage" />
        </lk-back-top>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from '../../mixin/reform';
import { formatStyle } from '@/common/utils/stringify';
import { addImgSrcDomain } from '@/common/utils';
export default {
  data() {
    return {
      wxKefuImage: '',
      backtopImage: '',
      btnList: [],
    };
  },
  mixins: [mixin],
  props: {},
  computed: {
    scrollTop() {
      return this.items.scrollTop || 0;
    },
  },
  created() {
    console.log(111222);
    console.log(this.items);

    // #ifdef MP
    if (this.items.params.showkefu == 1) {
      this.wxKefuImage = addImgSrcDomain(this.items.params.kefuimage);
    }
    // #endif
    if (this.items.params.showbacktop == 1) {
      this.backtopImage = addImgSrcDomain(this.items.params.backtopimage);
    }
    if (this.items.data) {
      let arr = [];
      for (const key in this.items.data) {
        const item = this.items.data[key];
        item.imgurl = addImgSrcDomain(item.imgurl);
        // #ifdef MP
        arr.push(item);
        // #endif
        // #ifndef MP
        if (item.type != 1) {
          arr.push(item);
        }
        // #endif
      }
      this.btnList = arr;
    }
  },
  mounted() {},
  methods: {
    click(item) {
      if (item.appid) {
        return this.toLink({
          appid: item.appid,
          mpath: item.mpath,
        });
      }
      this.toLink(item.linkurl);
    },
    close(index) {
      this.btnList.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.floater-box {
  position: fixed;
  right: 40rpx;
  bottom: 160rpx;
  z-index: 99;
  .item {
    position: relative;
    width: 65rpx;
    height: 65rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20rpx 0;
    .btn-image {
      width: 100%;
      height: 100%;
    }
    .btn-close {
      position: absolute;
      right: -16rpx;
      top: -16rpx;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36rpx;
      height: 36rpx;
    }
  }
}
.kefu-btn {
  border: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-size: $font-size;
  color: $text-color;
  box-sizing: border-box;
  .image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.kefu-btn::before,
.kefu-btn::after {
  display: none;
}
.backtop-image {
  width: 100%;
  height: 100%;
}
</style>
