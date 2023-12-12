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
          <item-box
            :roomid="item.roomid"
            :image="item.cover_img"
            :title="item.name"
            :avatar="item.share_img"
            :name="item.anchor_name"
            :state="item.live_status"
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
import itemBox from "./component/item-box";

export default {
  name: "packages-prize-list",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MPLIVELIST(this.params)
        .then(({ data, total_count }) => {
          let list = data || [];
          this.concatList(list, total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {
    itemBox
  }
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
