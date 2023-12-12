<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view :class="isBorderBg ? 'menu-box' : ''">
        <image
          v-if="isBorderBg"
          class="bg"
          :src="items.style.borderbg"
          mode="widthFix"
        />
        <lk-grid-panel
          :style="{ position: 'relative', zIndex: 1 }"
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
      isBorderBg: false, // 是否背景图片
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
    if (this.items.style.isBorderBg == 1) {
      this.isBorderBg = true;
      // this.isCard = false;
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
          iconcolor: item.iconcolor,
          iconclass: item.icon,
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
        if (e.type == '2') {
          e.iconPrefix = 'v-icon';
          e.iconcolor && (e.iconColor = e.iconcolor);
        }
        e.icon = e.type == '2' ? e.iconclass : addImgSrcDomain(e.imgurl);
      });
    });
  },
  methods: {
    click(item) {
      if (item.appid) {
        return this.toLink({
          appid: item.appid,
          mpath: item.mpath,
        });
      }
      this.toLink(item.linkurl);
    },
  },
  components: {},
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
.menu-box {
  padding: 100rpx 0 0;
  position: relative;
  overflow: hidden;
  margin: 24rpx;
  border-radius: 20rpx;
}
.bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
