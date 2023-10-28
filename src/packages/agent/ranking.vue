<template>
  <view class="pages">
    <lk-tabs
      v-model="active"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>

    <ranking-group :list="list" @change="onRankChange" />

    <view
      class="foot"
      v-if="info.ranking"
      :style="{ background: theme.gradient }"
    >
      <view class="info-left">
        <view class="num">{{ info.ranking }}</view>
        <view class="img">
          <lk-avatar size="80" :src="info.user_headimg" />
        </view>
        <view class="name">{{ info.nick_name }}</view>
      </view>
      <view class="info-right">
        <text class="total">{{ info.number }}{{ info.unit }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_COMMISSIONRANKING } from "@/common/interface/agent";
import rankingGroup from "./component/ranking-group";
import { mapState } from "vuex";
export default {
  name: "packages-agent-ranking",
  data() {
    return {
      active: 0,
      list: [],
      info: {},
      params: {
        types: 1,
        times: "month",
        psize: 10
      }
    };
  },
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
      distributeTexts: ({ distribute }) => distribute.texts
    }),
    tabs() {
      const { point_style } = this.memberTexts;
      const { commission } = this.distributeTexts;
      return [
        {
          name: "推荐榜",
          types: 1,
          unit: "人",
          number: "total"
        },
        {
          name: `${commission}榜`,
          types: 2,
          unit: `${commission}`,
          number: "commissions"
        },
        {
          name: `${point_style}榜`,
          types: 3,
          unit: `${point_style}`,
          number: "points"
        }
      ];
    }
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_COMMISSIONRANKING(this.params, { loadingText: "加载中" })
        .then(({ data }) => {
          const { number, unit } = this.tabs[this.active];
          this.list = data.rankinglists.map(item => {
            item.number = item[number];
            item.unit = unit;
            return item;
          });
          this.info = data.user;
          this.info.unit = unit;
          this.info.number = data.user[number];
        })
        .catch(() => {});
    },
    onTab(e) {
      this.active = e;
      this.params.types = this.tabs[e].types;
      this.list = [];
      this.getData();
    },
    onRankChange(times) {
      this.params.times = times;
      this.getData();
    }
  },
  components: {
    rankingGroup
  }
};
</script>

<style lang="scss" scoped>
.foot {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  background: #ff454e;
  color: #fff;
  padding: 0 30rpx;
  align-items: center;
}

.info-left {
  display: flex;
  align-items: center;
}

.num {
  font-size: 36rpx;
  font-weight: 800;
  width: 80rpx;
  text-align: center;
}

.img {
  width: 80rpx;
  height: 80rpx;
  margin: 0 20rpx;
}

.img image {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
