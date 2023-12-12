<template>
  <view class="pages">
    <view class="header" v-if="tabs.length">
      <lk-tabs
        v-model="active"
        slot-title
        :active-color="theme.color"
        :line-color="theme.color"
        :nav-per-view="tabs.length > 4 ? 'auto' : tabs.length"
        @change="onTabChange"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <text>{{ tab.name }}</text>
        </lk-tab>
      </lk-tabs>
    </view>
    <view class="placeholder" v-if="tabs.length"></view>
    <lk-load-list
      ref="load"
      bottom="200"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-live-box
            :image="item.live_img"
            :title="item.live_title"
            :avatar="item.user_headimg"
            :name="item.uname"
            :state="item.state"
            :state-text="item.stateText"
            :like-text="item.likeText"
            :to="item.to"
          />
        </view>
      </view>
    </lk-load-list>
    <footer-tab :active="0" :anchor_id="anchor_id" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { GET_LIVECATEGORY, GET_LIVELIST } from "@/common/interface/live";
import loadMixin from "@/mixins/load-list";
import { wan } from "@/common/utils";
import footerTab from "./component/footer-tab";
function stateVal(val) {
  let obj = {
    "-1": "",
    0: "",
    1: "pre",
    2: "ing",
    3: "",
    4: "ed"
  };
  return obj[val] || "";
}
let showFlag = 0;
export default {
  name: "pages-live-index",
  data() {
    return {
      active: 1,
      tabs: [],
      params: {
        page_index: 1,
        page_size: 20,
        is_focus: "",
        is_recommend: "",
        live_cate: ""
      },
      upOption: {
        auto: false
      },
      anchor_id: 0 // 主播id，0不是主播
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad() {},
  onShow() {
    if (showFlag == 1) {
      this.resetList();
    }
  },
  onHide() {
    showFlag = 1;
  },
  onUnload() {
    showFlag = 0;
  },
  methods: {
    getCategory() {
      return new Promise((resolve, reject) => {
        GET_LIVECATEGORY()
          .then(({ data }) => {
            const list = data || [];
            this.tabs = list.map(e => {
              e.name = e.cate_name;
              e.is_focus = e.cate_id == -1;
              e.is_recommend = e.cate_id == 0;
              return e;
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    onTabChange(index) {
      const item = this.tabs[index];
      this.params.live_cate = item.cate_id;
      this.params.is_focus = item.is_focus || "";
      this.params.is_recommend = item.is_recommend || "";
      this.resetList();
    },
    loadInitEnd() {
      this.getCategory().then(() => {
        if (this.tabs.length) {
          const item = this.tabs[this.active];
          this.params.live_cate = item.cate_id;
          this.params.is_focus = item.is_focus || "";
          this.params.is_recommend = item.is_recommend || "";
        }
        this.$load.triggerUpScroll();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVELIST(this.params)
        .then(({ data }) => {
          let list = data.live_list || [];
          this.anchor_id = data.is_anchor ? data.anchor_id : 0;
          list.forEach((e, i) => {
            e.state = stateVal(e.status);
            if (this.anchor_id == e.anchor_id) {
              e.to = {
                path: "/packages/live/anchor/player",
                query: {
                  anchor_id: e.anchor_id,
                  live_id: e.live_id
                }
              };
            } else {
              e.to = {
                path: "/packages/live/player",
                query: {
                  anchor_id: e.anchor_id,
                  live_id: e.live_id
                }
              };
            }
            if (e.status == 1) {
              e.stateText = e.advance_date;
              e.likeText = (wan(e.wantsee_num) || 0) + "想看";
              e.to = {
                path: "/packages/live/notice",
                query: {
                  anchor_id: e.anchor_id,
                  live_id: e.live_id
                }
              };
            }
            if (e.status == 2) {
              e.stateText = (e.online_num || 0) + "人";
              e.likeText = wan(e.likes_num) || 0;
            }
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {
    footerTab
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
.placeholder {
  height: 88rpx;
}
.list {
  padding: 10rpx;
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: calc(50% - 20rpx);
    margin: 10rpx;
  }
}
</style>
