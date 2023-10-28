<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="vui-picture" :style="itemsStyle">
        <view
          class="item"
          v-for="(item, index) in list"
          :key="index"
          :style="itemStyle"
        >
          <view class="image-box">
            <image
              :src="item.src"
              class="image"
              :mode="item.vh ? '' : 'widthFix'"
              :style="{ background: item.bg, height: item.vh || '' }"
              @click="click(index)"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import {
  pxTorpx,
  addImgSrcDomain,
  countForViewImgHeight,
  randomRgbaColor
} from "@/common/utils";

export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [reform],
  computed: {
    itemsStyle() {
      return formatStyle({
        paddingBottom: pxTorpx(this.items.style.paddingtop),
        background: this.items.style.background
      });
    },
    itemStyle() {
      return formatStyle({
        padding:
          pxTorpx(this.items.style.paddingtop) +
          " " +
          pxTorpx(this.items.style.paddingleft) +
          " " +
          0
      });
    }
  },
  created() {},
  async mounted() {
    this.dw =
      uni.getSystemInfoSync().windowWidth -
      parseInt(this.items.style.paddingleft || 0) * 2;
    let arr = [];
    if (this.items.data) {
      for (const key in this.items.data) {
        const item = this.items.data[key];
        item.show = false;
        item.width = item.width || "";
        item.vh = "";
        item.bg = "#f5f9ff";
        // item.bg = randomRgbaColor();
        item.src = "";
        if (item.width) {
          item.vh =
            countForViewImgHeight(item.width, item.height, this.dw) + "px";
        } else {
          let res = await this.getImageInfo(item.imgurl);
          if (res.width) {
            item.vh =
              countForViewImgHeight(res.width, res.height, this.dw) + "px";
          }
        }
        arr.push({ ...item });
      }
    }
    this.list = arr;
    this.initIntersection().then(() => {
      this.list.forEach(e => {
        e.show = true;
        e.bg = "";
        e.src = addImgSrcDomain(e.imgurl);
      });
    });
  },
  methods: {
    getImageInfo(imgurl) {
      return new Promise((resovle, reject) => {
        uni.getImageInfo({
          src: imgurl,
          complete: res => {
            resovle(res);
          }
        });
      });
    },
    click(index) {
      const item = this.list[index];
      if (item.appid) {
        return this.toLink({
          appid: item.appid,
          mpath: item.mpath
        });
      }
      this.toLink(item.linkurl);
    }
  }
};
</script>

<style scoped lang="scss">
.vui-picture {
  overflow: hidden;
}
.item {
  display: block;
  width: 100%;
  .image-box {
    height: auto;
    width: 100%;
    position: relative;
    .image {
      display: flex;
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.loading-box {
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    padding: 0 20rpx;
  }
}
</style>
