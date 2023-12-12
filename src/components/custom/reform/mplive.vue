<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <view v-if="viewLoaded" class="mplive-list">
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
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import { GET_MPLIVELIST } from "@/common/interface/mplive";
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
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      list: []
    };
  },
  mixins: [reform],
  computed: {
    ...mapGetters({
      extendCode: "extendCode",
      shareParams: "shareParams"
    })
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getMpliveList()
        .then(list => {
          this.viewLoading = false;
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getMpliveList() {
      return new Promise((resovle, reject) => {
        const num = parseInt(this.items.params.recommendnum);
        this.params.page_size = num || 10;
        GET_MPLIVELIST(this.params)
          .then(({ data, total_count }) => {
            let arr = data || [];
            let list = [];
            arr.forEach((e, i) => {
              e.state = stateVal(e.live_status);
              if (i < num) {
                list.push(e);
              }
            });
            resovle(list);
          })
          .catch(() => {
            reject();
          });
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

<style scoped lang="scss">
.mplive-list {
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
