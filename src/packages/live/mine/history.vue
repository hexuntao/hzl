<template>
  <view class="pages">
    <lk-load-list
      ref="load"
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
          />
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_LIVEHISTORYLIST } from "../interface";
import loadMixin from "@/mixins/load-list";
import { wan } from "@/common/utils";
function stateVal(val) {
  let obj = {
    "-1": "",
    "0": "",
    "1": "pre",
    "2": "ing",
    "3": "",
    "4": "ed"
  };
  return obj[val] || "";
}
export default {
  name: "packages-live-mine-history",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {}
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVEHISTORYLIST(this.params)
        .then(({ data }) => {
          let list = data.history_list || [];
          this.anchor_id = data.is_anchor ? data.anchor_id : 0;
          list.forEach((e, i) => {
            e.state = stateVal(e.status);
            if (e.status == 1) {
              e.stateText = e.advance_date;
              e.likeText = (wan(e.wantsee_num) || 0) + "想看";
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
  components: {}
};
</script>

<style lang="scss" scoped>
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
