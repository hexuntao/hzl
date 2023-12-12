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
      <lk-cell v-for="(item, index) in list" :key="index">
        <view slot="title">
          <view>{{ item.name }}</view>
          <view class="left">
            <view>上级：{{ item.up_channel_name }}</view>
            <view>等级：{{ item.grade_name }}</view>
          </view>
        </view>
        <view slot="rightIcon">
          <view class="rigth">
            <view>推荐人：{{ item.referee_name }}</view>
            <view>下级：{{ item.down_channel_num }}</view>
          </view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_TEAMLIST } from "@/common/interface/channel";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-channel-team",
  data() {
    return {
      params: {
        page_index: 1
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_TEAMLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
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
.left {
  font-size: $font-size-sm;
  line-height: 40rpx;
  color: $text-gray;
}
.rigth {
  margin-top: 44rpx;
  font-size: $font-size-sm;
  color: $text-gray;
  line-height: 40rpx;
}
</style>
