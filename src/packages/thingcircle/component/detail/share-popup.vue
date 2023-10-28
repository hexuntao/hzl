<template>
  <lk-popup v-model="show" position="bottom" round closeable title="分享至">
    <view class="share-popup">
      <view class="items lk-hairline--bottom">
        <view class="item" @click="clickShare">
          <view class="img wx-img">
            <lk-button
              open-type="share"
              type="text"
              square
              icon-color="#ffffff"
              icon-prefix="v-icon"
              icon="v-icon-wx04"
              icon-size="22"
            ></lk-button>
          </view>
          <view class="text">微信好友</view>
        </view>
      </view>
      <view class="items">
        <view class="item" @click="clickCopyLink">
          <view class="img">
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-link-01"
              size="22"
            />
          </view>
          <view class="text">复制链接</view>
        </view>
        <view
          class="item"
          v-if="info.is_download_source == 1"
          @click="clickDownload"
        >
          <view class="img">
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-download"
              size="22"
            />
          </view>
          <view class="text">下载素材</view>
        </view>
        <view class="item" v-if="isOwn" @click="clickEdit">
          <view class="img">
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-edit"
              size="22"
            />
          </view>
          <view class="text">编辑</view>
        </view>
        <view class="item" v-if="isOwn" @click="clickRemove">
          <view class="img">
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-remove"
              size="22"
            />
          </view>
          <view class="text">删除</view>
        </view>
      </view>
    </view>
  </lk-popup>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import $System from "@/api/system";
import { isWeixin } from "@/common/utils";
import { DEL_THINGCIRCLE } from "@/common/interface/thingcircle";
// #ifdef APP-PLUS
import $Plugins from "@/api/plugins";
// #endif
export default {
  data() {
    return {};
  },
  props: {
    value: Boolean,
    info: Object
  },
  computed: {
    ...mapGetters({
      shareParams: "shareParams"
    }),
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    // 是否为自己
    isOwn() {
      let flag = false;
      if (this.memberInfo.uid && this.memberInfo.uid == this.info.user_id) {
        flag = true;
      }
      return flag;
    }
  },
  methods: {
    clickShare() {
      // #ifdef H5
      this.$Prompt.toast(
        isWeixin()
          ? "如需分享，请点击右上角进行分享"
          : "如需分享，请点击下方进行分享"
      );
      // #endif
      // #ifdef APP-PLUS
      uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: this.shareParams.link,
        title: this.shareParams.title,
        summary: this.shareParams.desc,
        imageUrl: this.shareParams.imgUrl,
        success: res => {
          this.$Prompt.toast({ title: "分享成功", icon: "success" });
        },
        fail: err => {
          console.log("fail:" + JSON.stringify(err));
        }
      });
      // #endif
    },
    clickSharePyq() {
      uni.share({
        provider: "weixin",
        scene: "WXSenceTimeline",
        type: 0,
        href: this.shareParams.link,
        title: this.shareParams.title,
        summary: this.shareParams.desc,
        imageUrl: this.shareParams.imgUrl,
        success: res => {
          this.$Prompt.toast({ title: "分享成功", icon: "success" });
        },
        fail: err => {
          console.log("fail:" + JSON.stringify(err));
        }
      });
    },
    clickCopyLink() {
      $System.setClipboardData(this.shareParams.link);
    },
    clickDownload() {
      const text = [this.info.title, this.info.content];
      if (this.info.topic_title) {
        text[0] = `#${this.info.topic_title}#${this.info.title}`;
      }
      $System.setClipboardData(text.join(" | "));
      // #ifndef H5
      this.info.img_temp_array.forEach(e => {
        this.downloadImg(e.pic_cover);
      });
      // #endif
    },
    clickEdit() {
      this.$Navigate.push({
        path: "/packages/thingcircle/release/index",
        query: {
          thing_id: this.info.id
        }
      });
    },
    clickRemove() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定删除干货吗？"
        })
        .then(() => {
          DEL_THINGCIRCLE({ ids: this.info.id })
            .then(() => {
              this.$Prompt
                .toast({
                  title: "删除成功",
                  icon: "success"
                })
                .then(() => {
                  this.$Navigate.replace("/pages/thingcircle/index");
                });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 下载图片
    downloadImg(url) {
      uni.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            uni.saveImageToPhotosAlbum({
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
.share-popup {
  .items {
    display: flex;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 200rpx;
      .img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90rpx;
        height: 90rpx;
        border-radius: 90rpx;
        border: 1px solid $text-light;
        color: $text-light;
      }
      .wx-img {
        background: #3abb08;
        border: 0;
      }
      .pyq-img {
        background: #a2cd16;
        border: 0;
      }
      .text {
        color: $text-gray;
        line-height: 48rpx;
      }
    }
  }
}
</style>
