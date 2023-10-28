<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="wrap">
        <image
          class="bg"
          :style="backgroundStyle"
          :src="backgroundImage"
          mode="widthFix"
        />
        <view class="content">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
            :style="item.style"
            @click="click(index)"
          >
            <image class="image" v-if="item.src" :src="item.src" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import {
  pxTorpx,
  countForViewImgHeight,
  randomRgbaColor
} from "@/common/utils";
export default {
  data() {
    return {
      backgroundImage: "",
      list: []
    };
  },
  mixins: [mixin],
  computed: {
    backgroundStyle() {
      return formatStyle({
        backgroundColor: this.backgroundImage ? "" : "#f5f9ff",
        width: pxTorpx(this.items.params.width),
        height:
          countForViewImgHeight(
            this.items.params.width,
            this.items.params.height
          ) + "px"
      });
    }
  },
  created() {
    let arr = [];
    let index = 1;
    if (this.items.data) {
      for (const key in this.items.data) {
        const item = this.items.data[key];
        item.style = formatStyle({
          ...item,
          top: pxTorpx(item.top),
          left: pxTorpx(item.left),
          width: pxTorpx(item.width),
          height: pxTorpx(item.height),
          zIndex: index
        });
        index++;
        arr.push(item);
      }
    }
    this.list = arr;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.backgroundImage = this.items.params.backgroundImage;
      this.list.forEach(e => {
        e.src = e.imgurl;
      });
    });
  },
  methods: {
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
.wrap {
  position: relative;
  overflow: hidden;
  .bg {
    position: relative;
    left: 0;
    top: 0;
    right: 0;
    display: block;
    bottom: 0;
    max-width: 100%;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .item {
      position: absolute;
    }
    .image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
