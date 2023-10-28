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
      <lk-cell v-for="(item, index) in list" :key="index" label="签到成功">
        <view slot="title" class="title">
          <view class="positive">{{ item.name }}</view>
          <view class="title-right">{{ item.sign_in_time }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_SIGNINLOG } from "@/common/interface/signin";
import { formatDate } from "@/common/utils";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-signin-log",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "暂无签到"
        }
      }
    };
  },
  onLoad() {},
  mixins: [loadMixin],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_SIGNINLOG()
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
.title {
  display: flex;
  justify-content: space-between;
  line-height: 40rpx;
}
.positive {
  color: $green;
}
.title-right {
  font-size: $font-size-sm;
  color: $text-light;
  white-space: nowrap;
}
</style>
