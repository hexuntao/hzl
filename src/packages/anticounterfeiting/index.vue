<template>
  <view class="pages">
    <view class="banner">
      <image :src="banner.src" mode="widthFix" />
    </view>
    <view class="cell-group">
      <view class="field-title">防伪溯源商品查询</view>
      <view class="field-box">
        <lk-field
          v-model="anti_code"
          type="text"
          placeholder="请输入防伪码"
          clearable
          background="#f5f9ff"
          right-icon="qr"
          @click-right-icon="onScan"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          @click="onQuery"
        >
          查询
        </lk-button>
      </view>
    </view>
    <view class="cell-group">
      <view class="tips">
        <view class="item">
          <view class="title">防伪溯源查询方法：</view>
          <view>1.输入商品防伪标签中的防伪溯源码，点击查询；</view>
          <view>1.点击输入框右侧的扫一扫图标，扫描防伪二维码；</view>
        </view>
        <view class="item">
          <view class="title">查询结果说明：</view>
          <view>
            1.如果该防伪码首次被查询，则说明是正品；
          </view>
          <view>
            2.如果该二维码被查询过，若非本人所为，则说明可能是伪劣假冒商品；
          </view>
          <view>3.如果防伪码错误，则说明该商品未经官方验证。</view>
        </view>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_ISLOGIN } from "@/common/interface/anticounterfeiting";
import $System from "@/api/system";
import { getUriParam } from "@/common/utils";
export default {
  name: "packages-anticounterfeiting-index",
  data() {
    return {
      banner: {
        src: ""
      },
      anti_code: ""
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_ISLOGIN().then(({ data }) => {
        this.banner.src = data.advert_pic;
        this.banner.link = data.advert_pic_link;
      });
    },
    onQuery() {
      if (!this.anti_code) {
        return this.$Prompt.toast("请输入防伪码！");
      }
      this.$Navigate.push({
        path: "/packages/anticounterfeiting/result",
        query: {
          anti_code: this.anti_code
        }
      });
    },
    onScan() {
      $System.scanCode().then(({ result }) => {
        const anti_code = getUriParam(result, "anti_code");
        if (anti_code) {
          this.$Navigate.push({
            path: "/packages/anticounterfeiting/result",
            query: {
              anti_code
            }
          });
        } else {
          this.$Prompt.modal({
            title: "提示",
            content: "防伪码错误，请核对后重试",
            showCancel: false
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cell-group {
  margin: 20rpx 0;
  background: #ffffff;
}
.field-box {
  margin: 0 30rpx;
  border-radius: 8rpx;
  overflow: hidden;
}
.field-title {
  padding: $cell-padding;
  text-align: center;
  font-size: $font-size-lg;
}
.tips {
  padding: $cell-padding;
  line-height: 1.6;
  color: $text-light;
  font-size: $font-size-sm;
  .item {
    margin-bottom: 10rpx;
  }
  .title {
    font-size: $font-size;
  }
}
</style>
