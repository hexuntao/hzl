<template>
  <view class="list-group">
    <view class="card-group-box">
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="3"
        :line="false"
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.name }}
        </lk-tab>
      </lk-tabs>
    </view>

    <view
      class="rank-box card-group-box"
      v-if="rankBox.length > 0"
      :style="{ background: theme.gradient }"
    >
      <view
        class="item"
        :class="'rank-' + item.ranking"
        v-for="(item, r) in rankBox"
        :key="r"
      >
        <view class="img">
          <lk-avatar :size="item.size" :src="item.user_headimg" />
          <text class="n">{{ item.ranking }}</text>
        </view>
        <view class="name text-nowrap">{{ item.nick_name }}</view>
        <view class="total text-nowrap">{{ item.number }}{{ item.unit }}</view>
      </view>
    </view>

    <view class="ranking-list card-group-box" v-if="listItems.length > 0">
      <lk-cell center :border="false" v-for="(item, l) in listItems" :key="l">
        <view slot="icon" class="num">{{ item.ranking }}</view>
        <view slot="title" class="title">
          <view class="img">
            <lk-avatar size="80" :src="item.user_headimg" />
          </view>
          <text class="name">{{ item.nick_name }}</text>
        </view>
        <view slot="rightIcon" class="total">
          <text class="text-maintone">{{ item.number }}</text>
          {{ item.unit }}
        </view>
      </lk-cell>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: "月榜",
          times: "month"
        },
        {
          name: "年榜",
          times: "year"
        },
        {
          name: "总榜",
          times: "all"
        }
      ]
    };
  },
  props: {
    list: Array
  },
  methods: {
    onTab(e) {
      this.$emit("change", this.tabs[e].times);
    }
  },
  computed: {
    rankBox() {
      const list = this.list.filter(e => {
        if (e.ranking == 1) {
          e.sort = 2;
          e.size = 160;
        }
        if (e.ranking == 2) {
          e.sort = 1;
          e.size = 120;
        }
        if (e.ranking == 3) {
          e.sort = 3;
          e.size = 120;
        }
        if (e.ranking < 4) {
          return e;
        }
      });
      return list.sort((a, b) => a.sort - b.sort);
    },
    listItems() {
      const list = this.list.filter(e => {
        if (e.ranking > 3) {
          return e;
        }
      });
      return list;
    }
  }
};
</script>

<style scoped lang="scss">
.head-tab {
  margin-top: 20rpx;
}

.list-group {
  margin-bottom: 160rpx;
}

.tab-card-group {
  margin: 20rpx 0;
}

.rank-box {
  display: flex;
  justify-content: space-around;
  background: #ff454e;
  padding: 30rpx 20rpx;
}

.rank-box .item {
  display: flex;
  flex: 1;
  flex-flow: column;
  color: #fff;
  font-size: 24rpx;
  text-align: center;
  line-height: 1.6;
  justify-content: flex-end;
}

.rank-box .item .img {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
}

.rank-box .item .img .n {
  position: absolute;
  bottom: -16rpx;
  left: 50%;
  margin-left: -16rpx;
  display: block;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  background: #fff;
  color: #666;
  border-radius: 50%;
  font-size: 20rpx;
}

.rank-box .item .img image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.rank-box .item .name,
.rank-box .item .total {
  max-width: 160rpx;
  margin: 0 auto;
  height: 40rpx;
}

.rank-box .item.rank-1 .img {
  width: 160rpx;
  height: 160rpx;
}

.rank-box .item.rank-1 .img .n {
  background: #ffca07;
  color: #f35e06;
}

.rank-box .item.rank-2 .img .n {
  background: #f3d66e;
  color: #f35e06;
}

.rank-box .item.rank-3 .img .n {
  background: #e6e1ce;
  color: #c76d37;
}

.ranking-list .num {
  font-size: 32rpx;
  margin-right: 40rpx;
  color: #666;
  display: block;
  width: 40rpx;
  text-align: center;
}

.ranking-list .title {
  display: flex;
  margin-right: 20rpx;
  align-items: center;
}

.ranking-list .img {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}
</style>
