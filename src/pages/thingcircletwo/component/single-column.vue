<template>
  <view class="cell-item">
    <view class="avatar">
      <lk-avatar :src="items.user_headimg" size="80" />
    </view>
    <view class="wrapper">
      <view class="info">
        <view class="name" @click="toDetail">{{ items.thing_user_name }}</view>
        <view class="title" @click="toDetail">
          <text class="topic" v-if="items.topic_title">
            #{{ items.topic_title }}#
          </text>
          <text class="text">{{ items.title }}</text>
        </view>
        <view class="content" v-if="items.content">
          <view
            class="text"
            style="line-height:20px"
            :style="contentAll.height"
            :id="'content_' + items.id"
            @click="toDetail"
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
          <image :src="img.src" mode="aspectFill" @click="toDetail" />
        </view>
      </view>
      <view class="location" v-if="items.location">
        {{ items.location }}
      </view>
      <view class="time-like-fabulous">
        <view class="time">{{ createTimeText }}</view>
        <view class="like-fabulous">
          <view
            class="download"
            v-if="items.download_source"
            @click="onDownloadSource"
          >
            <lk-icon class-prefix="v-icon" size="12" name="v-icon-download" />
            <view class="text">下载素材</view>
          </view>
          <view class="like">
            <lk-button
              bing-mobile
              type="text"
              icon-size="12"
              icon-prefix="v-icon"
              :icon="likeIcon.name"
              :custom-style="{
                color: likeIcon.color
              }"
              @click="onLike"
            >
              <view class="text">{{ likesText }}</view>
            </lk-button>
          </view>
          <view class="fabulous">
            <lk-icon name="comment-o" />
            <view class="text">{{ commentCountText }}</view>
          </view>
        </view>
      </view>
      <view class="comment" v-if="items.comment.total_count">
        <view
          class="item"
          v-for="(item, cindex) in items.comment.data"
          :key="cindex"
        >
          <text class="comment-name">{{ item.thing_user_name }}：</text>
          <text class="comment-content">{{ item.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_THINGCIRCLETWOLIKES } from "@/common/interface/thingcircletwo";
import { wan, timeText } from "@/common/utils";
import $System from "@/api/system";
let likeFlag = true;
export default {
  data() {
    return {
      showAllText: false,
      showAll: false,
      likes: this.items.likes || 0,
      isLike: this.items.is_like
    };
  },
  props: {
    items: Object
  },
  computed: {
    imageList() {
      let arr = [];
      if (this.items.thing_type == 2) {
        arr.push({
          src: this.items.video_img.pic_cover
        });
      } else {
        arr = this.items.img_temp_array.map(e => {
          e.src = e.pic_cover;
          return e;
        });
      }
      return arr;
    },
    contentAll() {
      return {
        height: this.showAll ? "height:100px" : "",
        text: this.showAll ? "全文" : "收起"
      };
    },
    likeIcon() {
      return {
        name: this.isLike ? "v-icon-love-02-f" : "v-icon-love-02",
        color: this.isLike ? "#f44" : ""
      };
    },
    likesText() {
      return wan(this.likes);
    },
    commentCountText() {
      return wan(this.items.comment.total_count);
    },
    createTimeText() {
      return timeText(this.items.create_time);
    }
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
          .boundingClientRect(data => {
            if (data) {
              this.showAllText = data.height > 100;
              this.showAll = data.height > 100;
            }
          })
          .exec();
      });
    },
    onLike() {
      if (!likeFlag) {
        return;
      }
      likeFlag = false;
      GET_THINGCIRCLETWOLIKES({
        thing_id: this.items.id
      })
        .then(res => {
          this.likes = res.count;
          this.isLike = !this.isLike;
          likeFlag = true;
        })
        .catch(() => {
          likeFlag = true;
        });
    },
    toDetail() {
      this.$Navigate.push({
        path: "/packages/thingcircletwo/detail",
        query: {
          type: this.items.thing_type == 2 ? "video" : "imgtext",
          thing_id: this.items.id
        }
      });
    },
    onDownloadSource() {
      const text = [this.items.title, this.items.content];
      if (this.items.topic_title) {
        text[0] = `#${this.items.topic_title}#${this.items.title}`;
      }
      $System.setClipboardData(text.join(" | "));
      // #ifndef H5
      let arr = [];
      if (this.items.thing_type == 2) {
        arr.push({
          type: "video",
          src: this.items.video_img.pic_cover
        });
      } else {
        arr = this.items.img_temp_array.map(e => {
          e.src = e.pic_cover;
          e.type = "img";
          return e;
        });
      }
      arr.forEach(e => {
        this.downloadSource(e.src, e.type);
      });
      // #endif
    },
    // 下载资源
    downloadSource(url, type = "img") {
      const saveType =
        type == "video" ? "saveVideoToPhotosAlbum" : "saveImageToPhotosAlbum";
      uni.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            uni[saveType]({
              filePath: res.tempFilePath,
              success: e => {
                this.$Prompt.toast("保存成功");
              },
              fail: err => {
                // #ifdef MP-WEIXIN
                uni.getSetting({
                  complete: ({ authSetting }) => {
                    if (!authSetting["scope.writePhotosAlbum"]) {
                      this.$Prompt
                        .modal({
                          title: "提示",
                          content:
                            "检测到您保存到相册权限未开启，是否前往设置开启？"
                        })
                        .then(() => {
                          uni.openSetting({
                            complete: set => {}
                          });
                        })
                        .catch(() => {});
                    } else {
                      this.$Prompt.toast(err.errMsg);
                    }
                  }
                });
                // #endif
              }
            });
          } else {
            this.$Prompt.toast(res.errMsg);
          }
        },
        fail: ({ errMsg }) => {
          this.$Prompt.toast(errMsg);
        }
      });
    }
  }
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
      color: $blue-color;
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
    width: 504rpx;
    .img {
      margin: 4rpx;
      width: 160rpx;
      height: 160rpx;
      overflow: hidden;
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
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    color: $text-light;
    .time {
      display: flex;
      flex-flow: row;
    }
    .download {
      display: flex;
      flex-flow: row;
      align-items: center;
      font-size: $font-size-sm;
      line-height: 28rpx;
      height: 28rpx;
    }
    .like-fabulous {
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
      line-height: 28rpx;
      height: 28rpx;
      align-items: center;
    }
    .fabulous {
      display: flex;
      flex-flow: row;
      margin-left: 20rpx;
      line-height: 28rpx;
      height: 28rpx;
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
