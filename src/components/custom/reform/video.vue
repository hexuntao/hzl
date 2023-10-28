<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="video-group" :class="videoClass">
        <view class="item" v-for="(item, index) in list" :key="index">
          <view class="item-warp">
            <view class="box">
              <!-- #ifndef APP-PLUS -->
              <video
                class="video"
                :src="item.src"
                :poster="item.imgurl"
                :show-fullscreen-btn="false"
                :enable-progress-gesture="false"
                object-fit="contain"
                play-btn-position="center"
              />
              <!--  #endif -->
              <!-- #ifdef APP-PLUS -->
              <lk-iframe-video
                class="video"
                :src="item.src"
                :poster="item.imgurl"
              >
              </lk-iframe-video>
              <!--  #endif -->
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [reform],
  computed: {
    videoClass() {
      return formatClass([
        `video-style-${this.items.params.style}`,
        `video-ratio-${this.items.params.ratio}`
      ]);
    }
  },
  created() {
    let arr = [];
    for (const key in this.items.data) {
      if (this.items.data.hasOwnProperty(key)) {
        const item = this.items.data[key];
        item.src = "";
        arr.push({
          ...item
        });
      }
    }
    this.list = arr;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.list.forEach(e => {
        e.src = e.videourl;
      });
    });
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.video-group {
  .item {
  }
  .item-warp {
    width: 100%;
    height: 0;
    position: relative;
    //border-radius: 20rpx;
    background: #fff;
  }
  .box {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .video {
    width: 100%;
    height: 100%;
    //border-radius: 20rpx;
  }
}
.video-style-2 {
  display: flex;
  flex-wrap: wrap;
  //padding: 8rpx;
}
.video-style-1 {
  //padding: 8rpx;
}
.video-style-1 .item {
  //padding: 8rpx;
}

.video-style-2 .item {
  width: 50%;
  //padding: 8rpx;'
}
.video-ratio-1 .item-warp {
  padding-bottom: 56.25%;
}
.video-ratio-2 .item-warp {
  padding-bottom: 75%;
}
.video-ratio-3 .item-warp {
  padding-bottom: 100%;
}
</style>
