<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="head">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">{{ pointText }}</text>
        <view class="item">
          <view class="money">{{ points }}</view>
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
    </view>
 
    <lk-load-list
      ref="load"
      top="372"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >   <view class="info-item" v-if="btnGroup.length">
      <view
        class="info-list1"
        v-for="(item, index) in btnGroup"
        :key="index"
        @click="goPage(item.route)"
      >
        <image class="info-icon" :src="item.iconSrc"></image>
        <view class="info-text">{{ item.text }}</view>
      </view>
    </view>
      <view class="info-list">
        <view class="info-title">{{ pointText }}明细</view>
        <view class="list" v-for="(item, index) in list" :key="index">
          <view class="list-item">
            <view class="list-title">{{ item.type_name }}</view>
            <view class="list-tisp">{{ item.create_time }}</view>
          </view>
          <view class="list-item">
            <text :class="item.sign === 1 ? 'green-color' : 'green-color'">{{
              item.number
            }}</text>
          </view>
        </view>
      </view>
    </lk-load-list>
  </view>
 
</template>

<script>
import { GET_ASSETPOINTS } from "@/common/interface/property";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-property-points",
  data() {
    return {
      pageStyle: {
        background: "",
        title: "",
      },
      params: {
        page_index: 1,
        page_size: 20,
      },
      points: "",
    };
  },


  mixins: [loadMixin],
  computed: {
    ...mapState({
      config: ({ config }) => config,
      pointText: ({ member }) => member.texts.point_style
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}integral_bg.png`;
    },
    infoBg() {
      return this.theme.gradient;
    },
    btnGroup() {
      const { is_integarl_transfer } = this.config;
      let arr = [];
      if (is_integarl_transfer == 1) {
        arr.push({
          text: "转赠",
          route: "/packages/property/integraltransfer",
          disabled: false,
          isPlain: false,
          iconSrc: `${this.$store.getters.static.baseImgPath}withdraw.png`,
        });
      }
      return arr;
    },
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ASSETPOINTS(this.params)
        .then(({ data }) => {
          let list = data.point_detail.data || [];
          this.points = data.point;

          this.pageStyle.title = this.pointText;
          this.concatList(list, data.point_detail.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    
    goPage(url) {
      this.$Navigate.push(url);
    }
  
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f8f8f8;
}
.head {
  width: 100%;
  margin-bottom: 20rpx;
  background-color: #fff;
  position: fixed;
  z-index: 100;
}
.info {
  height: 300rpx;
  margin: 20rpx;
  border-radius: $border-radius-lg;
  position: relative;
  .text {
    padding: 74rpx 0 0 50rpx;
    font-size: 30rpx;
    color: $white;
    display: block;
  }
  .item {
    display: flex;
    padding: 52rpx 50rpx;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 100;
    .money {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 1.2;
      font-size: 80rpx;
      color: $white;
    }
  }
  .info-image {
    width: 100%;
    height: 300rpx;
    position: absolute;
    bottom: 0;
  }
}
.info-list {
  padding: 0 25px;
  background: #ffffff;
  .info-title {
    padding: 30rpx 20rpx;
    font-size: 30rpx;
    color: #333333;
    border-bottom: 2rpx solid #eeeeee;
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;
    border-bottom: 2rpx solid #eeeeee;
    &:last-of-type {
      border-bottom: 0;
    }
    .list-title {
      font-size: $font-size;
      color: #333333;
      margin-bottom: 22rpx;
    }
    .list-tisp {
      font-size: 26rpx;
      color: #999999;
    }
    .green-color {
      color: #4b0 !important;
    }
    .red-color {
      color: #ff454e !important;
    }
  }
}
.info-item {
  background: #ffffff;
  border-radius: $border-radius-lg;
  padding: 28rpx 0 30rpx;
  display: flex;
  justify-items: center;
  align-items: center;
  margin-bottom: 14rpx;
  .info-list1 {
    flex: 1;
    text-align: center;
    border-right: 2rpx solid #eeeeee;
    &:last-of-type {
      border-right: 0;
    }
    .info-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 24rpx;
    }
    .info-text {
      font-size: 26rpx;
      color: #333333;
    }
  }
}

</style>
