<template>
  <view class="pages">
    <view class="download">
      <view class="tipopen" v-if="showtip">
        <view class="tip">
          <view class="imgtip">
            <image :src="opentipimg" />
          </view>
          <view class="tipbtn">
            微信不能下载，请在右上角"选择浏览器中打开"后再试
            <view class="tipok" @click="tip">知道了</view>
          </view>
        </view>
      </view>
      <view>
        <view class="headname">
          <view class="logo" v-if="download.logo">
            <image :src="download.logo" />
          </view>
          <view>
            <view class="title">{{ download.app_name }}</view>
            <view class="icon">
              <view
                v-for="(item, index) in content1"
                :key="index"
                class="iconitem"
              >
                <view>
                  <lk-icon :name="item.icon" size="13" class-prefix="v-icon" />
                </view>
                <view>{{ item.name }}</view>
              </view>
            </view>
          </view>
          <lk-button
            class="btn"
            :plain="false"
            round
            color="#058ce6"
            @click="safedownload"
            >安全下载</lk-button
          >
          <view class="content2">
            <view
              v-for="(item, index) in download.download_tip"
              :key="index"
              class="content2name"
            >
              <text>{{ item }}</text>
            </view>
          </view>
        </view>
        <view>
          <view class="introduced">应用介绍</view>
          <view class="images">
            <view v-for="(item, index) in list" :key="index" @click="preview">
              <image :src="item.image" class="images1" />
            </view>
          </view>
        </view>
        <view class="detail">应用详情：</view>
        <view class="detail1">{{ download.update_content }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { isBrowser, isWeixin } from "@/common/utils";
import { GET_APPVERSIONIFNO } from "@/common/interface/config";
export default {
  name: "packages-mall-download",
  data() {
    return {
      showtip: false,
      type: "",
      download: {},
      content1: [
        {
          icon: "v-icon-stars",
          name: "5.0分"
        },
        { icon: "", name: "" },
        {
          icon: "v-icon-collect",
          name: ""
        }
      ],
      list: []
    };
  },
  computed: {
    opentipimg() {
      return this.$store.getters.static.baseImgPath + "openurltip.png";
    }
  },
  onLoad(query) {
    if (isBrowser("ios")) {
      this.type = 1;
    } else {
      this.type = 2;
    }
    GET_APPVERSIONIFNO({ type: this.type }).then(({ code, data }) => {
      if (code == 1) {
        this.download = data;
        this.content1[1].name = "v" + data.version_num;
        if (isBrowser("ios")) {
          this.content1[2].name = data.ios_size + data.ios_unit;
        } else {
          this.content1[2].name = data.android_size + data.android_unit;
        }
        this.list = data.img_temp_array;
      }
    });
  },
  methods: {
    safedownload() {
      let url = "";
      if (isBrowser("ios")) {
        url = this.download.ios_url;
      } else {
        if (isWeixin()) {
          this.showtip = true;
        } else {
          url = this.download.apk_url;
        }
      }
      if (url) {
        window.open(url);
      }
    },
    tip() {
      this.showtip = false;
    },
    preview() {
      const urls = this.list.map(e => e.image || e);
      uni.previewImage({
        urls: urls
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.download {
  width: 750rpx;
  margin-bottom: 40rpx;
}
.logo {
  margin: 0 auto;
}
.headname {
  width: 700rpx;
  margin: 0rpx auto;
  padding-top: 40rpx;
  text-align: center;
}
.logo image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 30rpx;
}
/deep/.btn {
  margin: 30rpx !important;
  display: flex;
}
.title {
  font-size: 40rpx;
  color: #2b2f37;
  font-weight: 600;
  padding: 20rpx 0;
}

.icon {
  display: flex;
  justify-content: center;
  align-content: center;
}
.iconitem {
  color: #c8cdd1;
  padding-right: 20rpx;
  display: flex;
  border-right: 2rpx solid #dcdfe2;
  height: 30rpx;
  &:last-child {
    border-right: none;
  }
}
.content2 {
  display: flex;
  justify-content: center;
  align-content: center;
}
.content2name {
  color: #5acb93;
  margin-right: 20rpx;
  width: 150rpx;
  height: 40rpx;
  background-color: #edfaf0;
  border-radius: 20rpx;
  font-weight: 600;
}
.introduced {
  font-size: 34rpx;
  font-weight: 600;
  margin: 30rpx;
}
.images {
  width: 700rpx;
  display: flex;
  overflow-x: auto;
  margin: 0 20rpx;
}

.images1 {
  display: flex;
  width: 250rpx;
  height: 400rpx;

  margin: 10rpx;
}
.detail {
  font-size: 30rpx;
  margin: 30rpx;
}
.detail1 {
  color: #333333;
  padding: 0 40rpx;
  font-size: 30rpx;
}
.tipopen {
  width: 750rpx;
  height: 100%;
  position: fixed;
  background-color: #1e1e1e;
  opacity: 0.8;
  z-index: 9999;
}
.tipbtn {
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  top: 220rpx;
  right: 180rpx;
  color: #fff;
}
.tipok {
  width: 110rpx;
  height: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1e1e1e;
  background-color: #fff;
  margin: 10rpx auto;
}
.tip {
  width: 400rpx;
  height: 400rpx;
  .imgtip {
    width: 200rpx;
    height: 200rpx;
    position: absolute;
    right: 50rpx;
    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
}
</style>
