<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view
        class="vui-cube"
        :class="'row-' + items.params.row"
        :style="itemBackground"
        v-if="items.params.row == '1'"
      >
        <view
          @click="click(list[0])"
          v-if="list.length == 1"
          class="item"
          :style="itemPadding"
        >
          <view class="image-box">
            <image :src="list[0].src" :style="{ background: list[0].bg }" />
          </view>
        </view>
        <view v-if="list.length > 1">
          <view
            @click="click(list[0])"
            class="vui-cube-left item"
            :style="itemPadding"
          >
            <view class="image-box">
              <image :src="list[0].src" :style="{ background: list[0].bg }" />
            </view>
          </view>
          <view class="vui-cube-right">
            <view
              @click="click(list[1])"
              v-if="list.length == 2"
              class="item"
              :style="itemPadding"
            >
              <view class="image-box">
                <image :src="list[1].src" :style="{ background: list[1].bg }" />
              </view>
            </view>
            <view v-if="list.length > 2">
              <view
                @click="click(list[1])"
                class="vui-cube-right1"
                :style="itemPadding"
              >
                <view class="image-box">
                  <image
                    :src="list[1].src"
                    :style="{ background: list[1].bg }"
                  />
                </view>
              </view>
              <view class="vui-cube-right2">
                <view
                  @click="click(list[2])"
                  v-if="list.length == 3"
                  class="item"
                  :style="itemPadding"
                >
                  <view class="image-box">
                    <image
                      :src="list[2].src"
                      :style="{ background: list[2].bg }"
                    />
                  </view>
                </view>
                <view
                  @click="click(list[2])"
                  v-if="list.length > 3"
                  class="item left"
                  :style="itemPadding"
                >
                  <view class="image-box">
                    <image
                      :src="list[2].src"
                      :style="{ background: list[2].bg }"
                    />
                  </view>
                </view>
                <view
                  @click="click(list[3])"
                  v-if="list.length >= 4"
                  class="item right"
                  :style="itemPadding"
                >
                  <view class="image-box">
                    <image
                      :src="list[3].src"
                      :style="{ background: list[3].bg }"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        class="vui-picturew"
        :style="itemBackground"
        :class="'row-' + items.params.row"
        v-if="items.params.row > 1"
      >
        <view
          @click="click(item)"
          class="item"
          :style="itemPadding"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="image-box" :style="{ height: item.vh }">
            <image
              :src="item.src"
              mode="widthFix"
              :style="{ background: item.bg }"
            />
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
  mixins: [mixin],
  computed: {
    itemPadding() {
      return formatStyle({
        padding:
          pxTorpx(this.items.style.paddingtop) +
          " " +
          pxTorpx(this.items.style.paddingleft)
      });
    },
    itemBackground() {
      return formatStyle({
        background: this.items.style.background
      });
    }
  },
  created() {
    let arr = [];
    this.dw =
      (uni.getSystemInfoSync().windowWidth -
        parseInt(this.items.style.paddingleft || 0)) /
      parseInt(this.items.params.row);
    if (this.items.data) {
      for (let i in this.items.data) {
        const item = this.items.data[i];
        item.show = false;
        item.src = "";
        item.vh = "";
        item.bg = "#f5f9ff";
        // item.bg = randomRgbaColor();
        if (this.items.params.row > 1) {
          // 根据图片高度自适应
          if (item.width) {
            item.vh =
              countForViewImgHeight(item.width, item.height, this.dw) + "px";
          }
        }
        arr.push({ ...item });
      }
    }
    this.list = arr;
  },
  async mounted() {
    if (this.items.params.row > 1 && this.list[0] && !this.list[0].width) {
      const res = await this.getImageInfo(this.list[0].imgurl);
      if (res.width) {
        this.list.forEach(e => {
          e.vh = countForViewImgHeight(res.width, res.height, this.dw) + "px";
        });
      }
    }
    this.initIntersection().then(() => {
      this.list.forEach(e => {
        e.show = true;
        e.src = addImgSrcDomain(e.imgurl);
        e.bg = "";
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
    click(item) {
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
.vui-cube {
  height: 0;
  width: 100%;
  margin: 0;
  padding-bottom: 50%;
  position: relative;
  overflow: hidden;
  .image-box {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    image {
      width: 100%;
      height: 100%;
      display: flex;
    }
  }
}

.vui-cube .vui-cube-left {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.vui-cube image {
  width: 100%;
  height: 100%;
}

.vui-cube .vui-cube-right {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  .item {
    width: 100%;
    height: 100%;
  }
}

.vui-cube .vui-cube-right1 {
  width: 100%;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.vui-cube .vui-cube-right2 {
  width: 100%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 0;
}

.vui-cube .vui-cube-right2 .left {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.vui-cube .vui-cube-right2 .right {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
}

.vui-picturew {
  height: auto;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
  }
  .image-box {
    width: 100%;
    overflow: hidden;
    position: relative;
    // height: 0;
    // padding-top: 100%;
    image {
      display: flex;
      width: 100%;
      height: 100%;
      border: none;
      // position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}

.vui-picturew.row-2 .item {
  width: 50%;
}

.vui-picturew.row-3 .item {
  width: 33.33333%;
}

.vui-picturew.row-4 .item {
  width: 25%;
}
</style>
