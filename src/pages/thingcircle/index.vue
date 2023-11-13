<template>
  <view class="pages">
    <view>
      <header-tab @change="onTabSearch" />
      <lk-load-list
        ref="load"
        top="240"
        bottom="200"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="list">
          <block v-if="showType == 1">
            <single-column
              v-for="(items, index) in list"
              :key="index"
              :items="items"
            />
          </block>
          <block v-if="showType == 2">
            <lk-waterfall
              v-model="list"
              ref="waterfallList"
              @get-list="getList"
            >
              <view class="left-list" slot="left">
                <diallel-column
                  v-for="(items, index) in leftList"
                  :key="index"
                  :items="items"
                />
              </view>
              <view class="right-list" slot="right">
                <diallel-column
                  v-for="(items, index) in rightList"
                  :key="index"
                  :items="items"
                />
              </view>
            </lk-waterfall>
          </block>
        </view>
      </lk-load-list>
    </view>

    <footer-tab :active="0" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import loadMixin from '@/mixins/load-list';
import waterfall from '@/mixins/waterfall';
import thingcircleMixin from '@/mixins/thingcircle';
import headerTab from './component/header-tab';
import singleColumn from './component/single-column';
import diallelColumn from './component/diallel-column';
import { formatStyle } from '@/common/utils/stringify';
import footerTab from './component/footer-tab';
import { GET_THINGCIRCLELIST } from '@/common/interface/thingcircle';
// 获取系统状态栏
let systemInfo = uni.getSystemInfoSync();
export default {
  name: 'pages-thingcircle-index',
  data() {
    return {
      showType: 1, //显示类型，1单排，2两列
      params: {
        page_index: 1,
        page_size: 12,
        search_text: '',
        lng: '',
        lat: '',
        follow: '',
      },
      tabs2: [],
    };
  },
  mixins: [loadMixin, thingcircleMixin, waterfall],
  onLoad() {
    if (this.$refs.waterfallList) {
      this.$refs.waterfallList.clear();
    }
    this.upCallback(1);
  },
  onShow() {
    if (this.$refs.waterfallList) {
      this.$refs.waterfallList.clear();
    }
    this.upCallback(1);
  },
  onPullDownRefresh() {
    if (this.$refs.waterfallList) {
      this.$refs.waterfallList.clear();
    }
    this.upCallback(1);
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;

      GET_THINGCIRCLELIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.showType = data.display_model == 1 ? 2 : 1;
          list.forEach(e => {
            e.download_source = parseInt(data.is_download_source) || 0;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTabSearch(params) {
      params.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...params });
      if (this.showType == 2) {
        this.$refs.waterfallList.clear();
      }
      this.resetList();
    },
  },

  components: {
    headerTab,
    singleColumn,
    diallelColumn,
    footerTab,
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin: 20rpx 0;
}
.left-list {
  padding-left: 10rpx;
}
.right-list {
  padding-right: 10rpx;
}
</style>
