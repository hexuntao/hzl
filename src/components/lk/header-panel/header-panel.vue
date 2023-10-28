<template>
  <view class="header" :style="styles">
    <view class="wrap">
      <view class="avatar">
        <lk-avatar size="max" :src="avatar" />
      </view>
      <view class="content">
        <view class="name">
          {{ name || '' }}
        </view>
        <view class="name" v-if="nameTag">
          {{ nameTag || '' }}
        </view>
        <view class="name" v-if="nameTag2">
          {{ nameTag2 || '' }}
        </view>
        <slot />
      </view>
      <slot name="right" />
    </view>

    <view>
      <picker
        mode="selector"
        :range="getShopList"
        range-key="shop_name"
        @change="bindPickerChange"
        style="margin: -10rpx 0rpx; text-align: right"
      >
        切换商户
      </picker>
    </view>

    <view style="font-size: 24rpx; margin-top: 30rpx">
      <view
        @tap="toLink('/packages/goods/collect')"
        style="float: left; width: 25%; text-align: center"
      >
        <lk-icon name="goods-collect" square size="30" color="#fff" />
        <view>我的收藏</view>
      </view>

      <view
        @tap="toLink('/pages/signin/index')"
        style="float: left; width: 25%; text-align: center"
      >
        <lk-icon name="sign" square size="30" color="#fff" />
        <view>签到中心</view>
      </view>

      <view
        @tap="toLink('/pages/message/index')"
        style="float: left; width: 25%; text-align: center"
      >
        <lk-icon name="newspaper-o" square size="30" color="#fff" />
        <view>消息列表</view>
      </view>

      <view
        @tap="toLink('/pages/property/index2')"
        style="float: left; width: 25%; text-align: center"
      >
        <lk-icon name="card" square size="30" color="#fff" />
        <view>卡券包</view>
      </view>
      <view style="clear: both"></view>
    </view>

    <slot name="bottom" />
  </view>
</template>

<script>
import { formatStyle } from '@/common/utils/stringify';
import { GET_SHOP } from '@/common/interface/property';
// 获取系统状态栏
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
  data() {
    return {
      shoparr: [],
      getShopList: [],
      lnarr: [],
      dnarr: [],
      sid: 0,
    };
  },
  props: {
    avatar: String,
    name: [String, Number],
    num1: [String, Number],
    num2: [String, Number],
    num3: [String, Number],
    nameTag: [String, Number],
    nameTag2: [String, Number],
    nameTagLink: [String, Object],
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    shopid: {
      type: [Number],
      default: 0,
    },
    marginBottom: {
      type: [Number, String],
      default: 0,
    },
    // 置顶通栏顶部bar
    topBar: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    styles() {
      return formatStyle({
        //background: this.theme.gradient,

        marginBottom: this.marginBottom + 'rpx',
        ...this.customStyle,
      });
    },
    // 转换字符数值为真正的数值
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif

      // #ifdef MP
      // 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
      // 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
      // return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
      return systemInfo.platform == 'ios' ? 44 : 48;
      // #endif
    },
    topBarStyle() {
      // #ifdef H5
      return '';
      // #endif

      // 在小程序端生效
      let sH = systemInfo.statusBarHeight; // 状态栏高度
      let nH = this.navbarHeight; //导航栏高度
      let style = {
        height: sH + nH + 'px',
      };
      return formatStyle(style);
    },
  },
  mounted() {
    this.getshop();
  },
  methods: {
    bindPickerChange(e) {
      console.log('选中值为', e.detail.value);
      var index = e.detail.value;
      var shop_id = this.getShopList[index]['shop_id'];

      if (shop_id == 0) {
        uni.reLaunch({
          url: '/pages/member/index',
        });
      } else {
        return this.$Navigate.push({
          path: '/packages/shop/member?shop_id=' + shop_id,
        });
      }
    },
    getshop() {
      GET_SHOP().then(({ code, data }) => {
        this.getShopList = data.getShopList;
        this.shoparr = data.shoparr;
        this.lnarr = data.lnarr;
        this.dnarr = data.dnarr;
        //this.sid = this.lnarr[this.shopid];

        console.log('fdfadfaf+' + this.sid);
      });
    },
    toLink(link) {
      if (this.shopid > 0) {
        this.$Navigate.push(link + '?shop_id=' + this.shopid);
      } else {
        this.$Navigate.push(link);
      }
    },
    tagLink() {
      if (this.nameTagLink) {
        this.$Navigate.push(this.nameTagLink);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  //background-color:#a32d2a;
  padding: 35rpx 30rpx;
  min-height: 240rpx;
  color: #fff;
  margin: 0rpx 30rpx 30rpx 30rpx;
  border-radius: 30rpx;
}
.wrap {
  display: flex;
  flex-flow: row;
  .avatar {
    width: 170rpx;
    flex: none;
    margin-right: 30rpx;
  }
  .name {
    font-size: 26rpx;
    line-height: 48rpx;
    height: 48rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 340rpx;
  }
  .name-tag {
    display: inline-flex;
    border-radius: 40rpx;
    height: 32rpx;
    min-width: 100rpx;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    color: $text-gray;
    font-size: $font-size-xs;
    margin-left: 16rpx;
    vertical-align: text-top;
  }
  .content {
    flex: 1;
    display: flex;
    flex-flow: column;
    color: inherit;
  }
}
</style>
