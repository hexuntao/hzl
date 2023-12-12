<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-tabs
      v-if="tabs.length"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell class="item" v-for="(item, index) in list" :key="index">
        <view class="img" slot="icon">
          <lk-avatar :src="item.user_headimg" />
        </view>
        <view slot="title">
          <view class="info">
            <view class="box">
              <view class="name">{{ item.member_name }}</view>
              <view class="level-name">{{ item.distributor_level_name }}</view>
            </view>
            <view class="box">
              <view>团队三级内:</view>
              <view>{{ item.agentcount || 0 }}人</view>
            </view>
            <view class="box">
              <view>团队所有:</view>
              <view>{{ item.all_child || 0 }}人</view>
            </view>
            <view class="box">
              <view>下线客户:</view>
              <view>{{ item.user_count || 0 }}人</view>
            </view>
          </view>
        </view>

        <view slot="rightIcon" class="commission-text">
          <text>{{ distributeTexts.commission }}</text
          >: <text>{{ item.commission || 0 }}</text
          >元
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_TEAMLIST } from "@/common/interface/agent";
import { mapActions, mapState } from "vuex";
export default {
  name: "packages-agent-team",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      distribution_pattern: 0,
      params: {
        page_index: 1,
        page_size: 20,
        type: 1
      },
      detail: {},
      teamCount: {
        team1: 0,
        team2: 0,
        team3: 0
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.getDistributeInfo();
  },
  onShow() {
    this.pageStyle.title = this.distributeTexts.my_team;
  },
  computed: {
    ...mapState({
      distributeInfo: ({ distribute }) => distribute.info,
      distributeTexts: ({ distribute }) => distribute.texts
    }),
    tabs() {
      const { team1, team2, team3 } = this.distributeTexts;
      let arr = [];
      for (let i = 1; i <= this.distributeInfo.distribution_pattern; i++) {
        if (i == 1)
          arr.push({
            name: team1 + "(" + this.teamCount.team1 + ")",
            type: 1
          });
        if (i == 2)
          arr.push({
            name: team2 + "(" + this.teamCount.team2 + ")",
            type: 2
          });
        if (i == 3)
          arr.push({
            name: team3 + "(" + this.teamCount.team3 + ")",
            type: 3
          });
      }
      return arr;
    }
  },
  methods: {
    ...mapActions(["getDistributeInfo"]),
    onTab(index) {
      this.params.type = this.tabs[index].type;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_TEAMLIST(this.params)
        .then(({ data }) => {
          this.teamCount = {
            team1: data.number1 || 0,
            team2: data.number2 || 0,
            team3: data.number3 || 0
          };
          let list = data.data || [];
          let user_count = {
            1: "user_count",
            2: "user_count2",
            3: "user_count3"
          };
          list.forEach(e => {
            e.user_num = e[user_count[this.params.type]] || 0;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  font-size: 24rpx;
  line-height: 40rpx;
}
.box .name {
  color: #323233;
}
.img {
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
}

.img image {
  display: block;
  width: 100%;
  height: 100%;
}

.info {
  flex: 1;
}

.level-name {
  padding-left: 20rpx;
  color: #606266;
  font-size: 24rpx;
}

.commission-text {
  padding-left: 20rpx;
  color: #606266;
  font-size: 24rpx;
}
</style>
