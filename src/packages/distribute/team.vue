<template>
  <view class="header">
    <lk-search
      v-model="params.search_text"
      placeholder="会员号/会员id/昵称/手机号"
      action="搜索"
      @search="onSearch"
    />
  </view>

  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>

  <view class="icon-tabs-group">
    <view class="tabs-box">
      <view class="tabs">
        <lk-tabs
          active-color="#000"
          :line-color="theme.color"
          color="#acacac"
          slot-title
          nav-per-view="2"
          @change="onChange"
        >
          <lk-tab v-for="(tab, index) in tabs" :key="index">
            <text style="color: 28rpx">{{ tab.name }}({{ tab.count }})</text>
          </lk-tab>
        </lk-tabs>
      </view>
    </view>
  </view>

  <view class="pages">
    <lk-cell class="item" v-for="(item, index) in list" :key="index">
      <view class="img" slot="icon">
        <lk-avatar :src="item.user_headimg" />
      </view>
      <view slot="title">
        <view class="info">
          <view class="box">
            <view class="name">ID：{{ item.uid }}</view>
          </view>
          <view class="box">
            <view class="name">昵称：{{ item.nick_name }}</view>
          </view>
          <!--          <view class="box">
            <view class="name">手机：{{ item.mobile }}</view>
          </view>-->
          <view class="box">
            <view class="name">等级：{{ item.distributor_level_name }}</view>
          </view>
          <view class="box">
            <view>推广：</view>
            <view>{{ item.user_count || 0 }}人</view>
          </view>
        </view>
      </view>

      <view slot="rightIcon" class="commission-text">
        <text>{{ distributeTexts.commission }}</text
        >: <text>{{ item.total_commission || 0 }}</text
        >元
      </view>
    </lk-cell>
  </view>
</template>

<script>
import loadMixin from '@/mixins/load-list';
import { GET_TEAMLIST } from '@/common/interface/distribute';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'packages-distribute-team',
  data() {
    return {
      pageStyle: {
        background: '',
        title: '',
      },
      tabs: [
        {
          name: '一级',
          count: 0,
        },
        {
          name: '二级',
          count: 0,
        },
      ],
      params: {
        type: 1,
        search_text: '',
      },
      detail: {},
      list: [],
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.upCallback();
  },
  onShow() {
    this.pageStyle.title = this.distributeTexts.my_team;
  },
  computed: {
    ...mapState({
      distributeInfo: ({ distribute }) => distribute.info,
      distributeTexts: ({ distribute }) => distribute.texts,
    }),
  },
  methods: {
    ...mapActions(['getDistributeInfo']),
    onChange(index) {
      this.params.type = index + 1;
      this.upCallback();
    },
    onSearch() {
      this.upCallback();
    },
    upCallback() {
      GET_TEAMLIST(this.params)
        .then(({ data }) => {
          this.tabs[0].count = data.data.oneCount;
          this.tabs[1].count = data.data.twoCount;
          this.list = data.data.list;
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
  },
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
