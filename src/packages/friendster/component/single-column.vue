<template>
  <view class="cell-item">
    <view class="avatar">
      <lk-avatar :src="items.user_headimg" size="80" />
    </view>
    <view class="wrapper">
      <view class="info">
        <view class="name">{{ items.user_name }}</view>
        <view class="title">
          <text class="topic">
            {{ items.create_time }}
          </text>
          <text class="text">{{ items.title }}</text>
        </view>
        <view class="content" v-if="items.content">
          <view
            class="text"
            style="line-height:20px"
            :style="contentAll.height"
            :id="'content_' + items.id"
          >
            {{ items.content }}
          </view>
          <view class="show-all" v-if="showAllText" @tap="showAll = !showAll">
            {{ contentAll.text }}
          </view>
        </view>
      </view>
      <view class="img-group" v-if="imageList && imageList.length">
        <view class="img" v-for="(img, index) in imageList" :key="index">
          <image @click="toDetail(index)" :src="img.src" mode="aspectFill" />
        </view>
      </view>
      <view class="location" v-if="items.location">
        {{ items.location }}
      </view>
      <view class="time-like-fabulous">
        <navigator
          v-if="items.goods_id"
          :url="'/packages/goods/detail?goods_id=' + items.goods_id"
          class="time"
        >
          <lk-icon class-prefix="v-icon" size="12" name="v-icon-cart2" />
          {{ items.goods_name }}
        </navigator>
        <view class="like-fabulous">
          <view class="download" @click="downloadSource(items.id)">
            <lk-icon class-prefix="v-icon" size="12" name="v-icon-share-03" />
            <view class="text"
              >分享{{ repeat_num > 999 ? "999+" : repeat_num }}</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ADDREPEATNUM } from "@/common/interface/friendster";
import { wan, timeText } from "@/common/utils";
import $System from "@/api/system";
import { log } from "../../../common/utils/poster/app";
let likeFlag = true;
export default {
  data() {
    return {
      showAllText: false,
      showAll: false,
      likes: this.items.likes || 0,
      isLike: this.items.is_like,
      times: null,
      endtimes: true,
      repeat_num: "",
    };
  },
  props: {
    items: Object,
  },
  computed: {
    imageList() {
      let arr = [];
      if (this.items.thing_type == 2) {
        arr.push({
          src: this.items.video_img.pic_cover,
        });
      } else {
        arr = this.items.img_array.map((e) => {
          e.src = e.pic_cover;
          return e;
        });
      }
      this.repeat_num = this.items.repeat_num;
      return arr;
    },
    contentAll() {
      return {
        height: this.showAll ? "height:100px" : "",
        text: this.showAll ? "全文" : "收起",
      };
    },
  },
  mounted() {
    this.setContentHeight();
  },
  methods: {
    setContentHeight() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("#content_" + this.items.id)
          .boundingClientRect((data) => {
            if (data) {
              this.showAllText = data.height > 100;
              this.showAll = data.height > 100;
            }
          })
          .exec();
      });
    },
    toDetail(index) {
      let ImgArr = [];
      this.imageList.forEach((element) => {
        ImgArr.push(element.src);
      });
      uni.previewImage({
        current: index,
        urls: ImgArr,
        longPressActions: {
          success: function(data) {
            console.log(data);
          },
          fail: function(err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    downloadSource(id) {
      if (this.endtimes) {
        this.endtimes = false;
      } else {
        return false;
      }
      const text = this.items.content;
      $System.setClipboardData(text);
      ADDREPEATNUM({ material_id: id }).then((res) => {
        this.repeat_num = this.repeat_num + 1;
        if (res.code == 1) {
          // #ifdef MP-WEIXIN
          let arr = this.items.img_array;
          arr.map((e) => {
            this.getSourceTempPath(e);
          });
          // #endif
          // #ifdef APP-PLUS
          let arr = this.items.img_array;
          arr.map((e) => {
            this.getSourceTempPath(e);
          });
          // #endif
        }
      });
      this.times = setTimeout(() => {
        this.endtimes = true;
      }, 60000);
    },
    getSourceTempPath({ pic_cover }) {
      const downloadTask = uni.downloadFile({
        url: pic_cover,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath, //返回的临时路径
              success: function(res2) {
                uni.showToast({
                  title: "图片保存成功",
                  icon: "none",
                });
              },
              fail: function() {
                uni.showToast({
                  title: "保存失败，请稍后重试 ",
                  icon: "none",
                });
              },
            });
          }
        },
      });
      downloadTask.onProgressUpdate((res) => {
        uni.showToast({
          title: "下载进度" + res.progress,
          icon: "loading",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$blue-color: $blue;
.cell-item {
  display: flex;
  flex-flow: row;
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  position: relative;
}

.cell-item::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.avatar {
  margin-right: 20rpx;
  flex: none;
}
.wrapper {
  flex: 1;
  width: 100%;
  height: auto;
  font-size: $font-size-sm;
  word-break: break-all;
  .name {
    font-weight: 800;
    color: $blue-color;
    font-size: $font-size;
  }
  .title {
    line-height: 40rpx;
    .topic {
      color: #999999;
      margin-right: 10rpx;
    }
    .text {
    }
  }
  .content {
    display: flex;
    flex-flow: column;
    margin: 10rpx 0;
    .text {
      overflow: hidden;
    }
    .show-all {
      color: $blue-color;
    }
  }
  .img-group {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    margin: 0 -4rpx;
    width: 100%;
    .img {
      margin: 4rpx;
      width: 185rpx;
      height: 185rpx;
      overflow: hidden;
      background: $image-background;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .location {
    color: $blue-color;
  }
  .time-like-fabulous {
    color: $text-light;
    margin-top: 20rpx;
    font-size: 24rpx;
    .time {
      // display: flex;
      width: 400rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      background: #999999;
      padding-left: 5rpx;
      border-radius: 25rpx;
      float: left;
    }
    .download {
      display: flex;
      flex-flow: row;
      align-items: center;
      color: #2c9cf0;
      font-size: $font-size-sm;
    }
    .like-fabulous {
      margin-top: 7rpx;
      float: right;
      display: flex;
      flex-flow: row;
      align-items: center;
      .text {
        padding: 0 8rpx;
        line-height: 1.2;
      }
    }
    .like {
      display: flex;
      flex-flow: row;
      margin-left: 20rpx;
      justify-content: center;
      line-height: 40rpx;
      align-items: center;
    }
    .fabulous {
      display: flex;
      flex-flow: row;
      margin-left: 20rpx;
      line-height: 28rpx;
    }
  }
  .comment {
    background: $background-color;
    padding: 20rpx;
    margin-top: 10rpx;
    .item {
      line-height: 40rpx;
      .comment-name {
        color: $blue-color;
      }
    }
  }
}
</style>
