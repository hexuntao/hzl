<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box" :style="{ height, background }">
      <lk-swiper
        v-if="list.length"
        img-mode="widthFix"
        :height="height"
        :list="list"
        @click="click"
      >
      </lk-swiper>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import {
  pxTorpx,
  addImgSrcDomain,
  countForViewImgHeight
} from "@/common/utils";

export default {
  data() {
    return {
      height: "187.5px",
      background: "#f5f9ff",
      list: []
    };
  },
  mixins: [reform],
  computed: {},
  created() {
    let arr = [];
    for (let i in this.items.data) {
      this.items.data[i].image = addImgSrcDomain(this.items.data[i].imgurl);
      arr.push({
        ...this.items.data[i]
      });
    }
    if (arr.length && arr[0].width) {
      this.height = countForViewImgHeight(arr[0].width, arr[0].height) + "px";
    }
    this._arr = arr;
  },
  async mounted() {
    let list = this._arr || [];
    if (list[0] && !list[0].width) {
      const res = await this.getImageInfo(list[0].image);
      if (res.width) {
        this.height = countForViewImgHeight(res.width, res.height) + "px";
      }
    }
    this.initIntersection().then(() => {
      this.list = list;
      this.background = "";
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
  },
  components: {}
};
</script>

<style scoped lang="scss">
.swiper .image {
  width: 100%;
  display: block;
  height: 600rpx;
}
</style>
