<template>
  <view class="swiper-box">
    <lk-swiper v-if="type === 'imgtext'" :height="swiperHeight" :list="list" />
    <swiper
      v-if="type === 'video'"
      class="swiper-video"
      vertical
      @change="change"
    >
      <swiper-item class="item" v-for="(item, index) in list" :key="index">
        <view class="video-box">
          <!-- #ifdef MP -->
          <video
            :id="'video_' + index"
            :data-index="index"
            class="video"
            :poster="item.poster"
            :src="item.video"
            :controls="false"
            play-btn-position="center"
            @play="play"
            @pause="pause"
            @ended="ended"
            @timeupdate="timeupdate"
            @waiting="waiting"
            @progress="progress"
            @loadedmetadata="loadedmetadata"
            @error="videoerror"
          />
          <!--  #endif -->
          <!-- #ifndef MP -->
          <video
            v-if="refArr[index]"
            :id="'video_' + index"
            :data-index="index"
            class="video"
            :poster="item.poster"
            :src="item.video"
            :controls="false"
            :show-play-btn="false"
            play-btn-position="center"
            :show-center-play-btn="false"
            :show-fullscreen-btn="false"
            x5-video-player-type="h5-page"
            x-webkit-airplay="allow"
            x5-video-player-fullscreen
            preload="none"
            @play="play"
            @pause="pause"
            @ended="ended"
            @timeupdate="timeupdate"
            @waiting="waiting"
            @progress="progress"
            @loadedmetadata="loadedmetadata"
            @error="videoerror"
          />
          <view class="controls" :class="showControlsClass">
            <lk-icon
              name="play-circle-o"
              size="60"
              color="#ffffff"
              @click="clickPlay(index)"
            />
          </view>
          <!--  #endif -->
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
function countSize(size) {
  var _size = size || "750,750";
  var a = _size.split(",");
  var w = a[0] || 0;
  var h = a[1] || 0;
  var s = w / uni.getSystemInfoSync().screenWidth;
  return h / s;
}
export default {
  data() {
    return {
      active: 0,
      swiperHeight: 0,
      refArr: []
    };
  },
  props: {
    type: String,
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    list() {
      const arr = [];
      this.items.forEach(({ id, img_temp_array, video_img }, i) => {
        img_temp_array.forEach(({ pic_cover, pic_size }) => {
          let obj = {};
          obj.id = id || "";
          obj.image = pic_cover || "";
          obj.video = this.type == "imgtext" ? "" : pic_cover || "";
          obj.poster = video_img.pic_cover || "";
          obj.height = countSize(pic_size) + "px";
          obj.fplaying = false;
          arr.push(obj);
        });
      });
      return arr;
    },
    showControlsClass() {
      return this.refArr[this.active] && !this.refArr[this.active].playing
        ? "show"
        : "hide";
    },
    ...mapState({
      domain: ({ domain }) => domain
    })
  },
  created() {
    this.swiperHeight =
      this.list[0] && this.list[0].height
        ? this.list[0].height
        : uni.getSystemInfoSync().screenWidth + "px";
  },
  mounted() {
    if (this.type === "video") {
		
		console.log( this.list);
		
      this.$nextTick(() => {
        this.list.forEach((e, i) => {
          this.refArr.push({
            ref: uni.createVideoContext("video_" + i, this),
            playing: false,
            fplaying: false
          });
        });
        setTimeout(() => {
          if (this.refArr[0]) {
            this.refArr[0].ref.play();
            this.refArr[0].fplaying = true;
          }
        }, 100);
      });
    }
  },
  methods: {

    change({ detail }) {
      this.active = detail.current;
      this.$emit("change", this.active);
      this.$nextTick(() => {
        this.refArr.forEach((e, i) => {
          if (i == detail.current) {
            e.ref.play();
            e.ref.fplaying = true;
          } else {
            e.ref.pause();
            e.ref.fplaying = false;
          }
        });
      });
    },
    clickPlay(index) {
      this.$nextTick(() => {
        this.refArr.forEach((e, i) => {
          if (i == this.active) {
            e.ref.play();
            // e.playing = true;
          } else {
            e.ref.pause();
            // e.playing = false;
          }
        });
      });
    },
    play({ type, target }) {
      // console.log(type, this.active, target.dataset.index);
      this.refArr[target.dataset.index].playing = true;
      this.$Prompt.clear();
    },
    pause({ type, target }) {
      // console.log(type, this.active, target.dataset.index);
      this.refArr[target.dataset.index].playing = false;
      this.$Prompt.clear();
    },
    ended({ type, target }) {
      // console.log(type, this.active, target.dataset.index);
      this.refArr[target.dataset.index].playing = false;
    },
    loadedmetadata({ type, target }) {
      // console.log(type, target);
    },
    timeupdate(e) {
      this.$Prompt.clear();
    },
    waiting(e) {
      this.$Prompt.loading("缓冲中");
    },
    progress(e) {
      // console.log(e);
    },
    videoerror(e) {
      // console.log(e);
      // alert(e.type);
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper-box {
}
.swiper-video {
  width: 100vw;
  height: 100vh;
  position: relative;
  .item {
    width: 100%;
    height: 100%;
  }
}
.video-box {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.video,
video {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}
.uni-video-container {
  z-index: 0;
}
.controls {
  width: 200rpx;
  height: 200rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.controls.show {
  display: flex;
}
.controls.hide {
  display: none;
}
.iframe-view {
  width: 90vw;
  height: 100vh;
}
</style>
