<template>
  <view class="catalog-tab s-tabs-nav-wrap">
    <scroll-view
      v-if="list.length"
      class="scroll-wrap"
      scroll-with-animation
      scroll-x
      :scroll-left="scrollLeft"
    >
    <view class="scroll-view">
      <view class="s-tab-nav-view">
        <view
          v-for="(item, index) of list"
          class="s-tab-nav"
          :class="[
          getActive == index ? 'current-color' : '',
          ]"
          :key="index"
          @click="navClick(index, item)"
        >
        <text class="tit">{{ item.knowledge_payment_name }}</text>
        <view class="tisp" v-if="!info.is_buy">
          <text class="try" v-if="item.text != ''">{{ item.text }}</text>
          <text class="tisp-lock icons icons-lock" v-else></text>
        </view>
        </view>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollLeft: 0,
      diffLeft:0,
      active: 0,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    info:Object,
    getActive: [Number, String],
  },
  watch:{
    getActive(e){
      this.refreshNavScroll();
    }
  },
  mounted() {
    this.refreshNavScroll(true);
  },
  methods: {
    navClick(index) {
      this.$emit('changeData',index);
    },
    refreshNavScroll(isInit) {
      const _this = this
      _this.$nextTick(() => {
        const query = () => uni.createSelectorQuery().in(_this);
        query()
          .select(".s-tabs-nav-wrap")
          .boundingClientRect()
          .exec(([wrap]) => {
            query()
              .select(".s-tab-nav-view")
              .boundingClientRect()
              .exec(([view]) => {
                if (isInit) {
                  _this.diffLeft = view.left - wrap.left;
                }
                const setNavScroll = item => {
                  if (item) {
                    const centerLeft = (wrap.width - item.width) / 2;
                    _this.scrollLeft =
                      Math.abs(view.left - wrap.left - _this.diffLeft) +
                      (item.left - centerLeft - wrap.left);
                  }
                };
                  query()
                    .selectAll(".s-tab-nav")
                    .boundingClientRect()
                    .exec(([list]) => {
                      setNavScroll(list[_this.getActive]);
                  });
              });
          });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
/*课程目录*/
.catalog-tab {
  width: 100%;
  height: 160rpx;
  background: #fff;
  padding: 0 30rpx;
  margin-bottom: 40rpx;

  .scroll-wrap {
    height: 100%;
    overflow-x: auto;
    ::-webkit-scrollbar {
      display: none;
    }

    // #ifdef H5
    /deep/ {
      & .uni-scroll-view > div {
        height: 100%;
      }
    }

    // #endif
  }

  .scroll-view {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
  }

  .s-tab-nav-view {
    display: inline-flex;
    height: 160rpx;
  }

  .s-tab-nav {
    width: 280rpx;
    border: 1px solid #b4b4b4;
    border-radius: 10rpx;
    height: 100%;
    font-size: $font-size;
    padding: 26rpx 30rpx 0 30rpx;
    font-size: 26rpx;
    margin-right: 20rpx;
    &.is-disabled {
      color: #c8c9cc !important;
    }

    .tit {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      height:60rpx;
      margin-bottom: 10rpx;
    }

    .tisp {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .try {
        width: 90rpx;
        height: 32rpx;
        display: block;
        line-height: 32rpx;
        font-size: 24rpx;
        color: #f23030;
        border: 1px solid #f23030;
        border-radius: 4rpx;
        text-align: center;
      }

      .tisp-lock {
        flex: 1;
        display: block;
        text-align: right;
        color: #9e9e9e;
      }
    }
  }

  .s-tab-nav:last-child {
    margin-right: 0;
  }

  .current-color {
    border: 1px solid #fe753a;
    color: #fe753a;
  }
}
</style>