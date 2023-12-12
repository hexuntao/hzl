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
            :image="item.cover_img"
            :title="item.name"
            :avatar="item.share_img"
            :name="item.anchor_name"
            :state="item.state"
            @click="click(index)"
          />
        </view>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_MPLIVELIST } from "@/common/interface/mplive";
import loadMixin from "@/mixins/load-list";
import { mapGetters } from "vuex";
function stateVal(val) {
  let obj = {
    101: "ing",
    102: "pre",
    103: "ed",
    104: "ed",
    105: "",
    106: "",
    107: "ed"
  };
  return obj[val] || "";
}
export default {
  name: "pages-mplive-index",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapGetters({
      extendCode: "extendCode",
      shareParams: "shareParams"
    })
  },
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MPLIVELIST(this.params)
        .then(({ data, total_count }) => {
          let list = data || [];
          list.forEach((e, i) => {
            e.state = stateVal(e.live_status);
          });
          this.concatList(list, total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    click(index) {
      // #ifdef MP-WEIXIN
      const item = this.list[index];
      let roomid = item.roomid;
      let customParams = encodeURIComponent(
        JSON.stringify({
          path: this.shareParams.pagePath,
          extend_code: this.extendCode
        })
      );
      console.log(roomid, customParams);
      uni.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}&custom_params=${customParams}`
      });
      // #endif
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.list {
  height: auto;
  overflow: hidden;
  padding: 10rpx;
  display: flex;
  flex-wrap: wrap;
}
.item {
  position: relative;
  width: calc(50% - 20rpx);
  margin: 10rpx;
  background: #ffffff;
  overflow: hidden;
}
</style>
