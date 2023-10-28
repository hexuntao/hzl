<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <lk-grid-panel
        :background="items.style.background"
        :card="isCard"
        :swiper="isPage"
        :row="pageRow"
        :size="items.style.size || ''"
        :icon-size="iconsize"
        :cols="items.style.rownum"
        :items="list"
        @item-click="click"
      />
    </view>
  </view>
</template>

<script>
import mixin from '../../mixin/reform';
import { formatStyle } from '@/common/utils/stringify';
import { pxTorpx, addImgSrcDomain, randomRgbaColor } from '@/common/utils';
export default {
  data() {
    return {
      isCard: true, //是否卡片
      isPage: false, //是否分页滑动
      pageRow: 1, //分页行数
      iconsize: 32,
      list: [],
    };
  },
  mixins: [mixin],
  computed: {},
  created() {
    let arr = [];
    this.isCard =
      typeof this.items.style.iscard != 'undefined'
        ? this.items.style.iscard == 1
        : true;
    this.isPage = this.items.style.type == 1 || this.items.style.type == 2;
    if (this.isPage) {
      this.pageRow = this.items.style.type || 1;
    }
    if (this.items.style.iconsize) {
      this.iconsize = parseInt(this.items.style.iconsize) / 2;
    }
    for (const key in this.items.data) {
      if (this.items.data.hasOwnProperty(key)) {
        const item = this.items.data[key];
        item.show = false;
        item.vh = '';
        item.iconStyle = formatStyle({
          background: '#f5f9ff',
          width: '84rpx',
          height: '84rpx',
        });
        arr.push({
          ...item,
          icon: '',
          title: item.text,
          text: item.label,
          titleColor: item.color,
        });
      }
    }
    this.list = arr;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.list.forEach(e => {
        e.iconStyle = '';
        e.icon = addImgSrcDomain(e.imgurl);
      });
    });
  },
  methods: {
    click(item) {
      var url = item.linkurl;
      if (url != 'pages/service/index' && url != '/pages/service/index') {
        if (url.indexOf('http') === 0) {
          return this.$Navigate.push({
            path: '/packages/property/webview',
            query: {
              linkurl: item.linkurl,
            },
          });
        }
        if (item.appid) {
          return this.toLink({
            appid: item.appid,
            mpath: item.mpath,
          });
        }
        console.log(item.linkurl);
        this.toLink(item.linkurl);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.menu .icon {
  height: 88rpx;
  margin: auto;
  text-align: center;
  line-height: 88rpx;
  margin-top: 20rpx;
}
.menu .icon .image {
  height: 88rpx;
  width: 88rpx;
  vertical-align: top;
}
.menu .text {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8rpx 8rpx 8rpx;
  color: $text-gray;
}
.menu .txt {
  font-size: $font-size-xs;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10rpx;
  height: 24rpx;
  text-align: center;
  color: $text-light;
}
.menu .num {
  color: $red;
  padding: 0 4rpx;
}
</style>
