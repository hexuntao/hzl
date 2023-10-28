<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell
        v-for="(item, index) in list"
        :key="index"
        :value="item.create_time"
      >
        <view
          slot="title"
          :class="item.commission > 0 ? 'positive' : 'negative'"
        >
          {{ item.commission }}
        </view>
        <view slot="label" class="label">{{ item.text }}</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_COMMISSIONLOG } from "@/common/interface/agent";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-agent-log",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts
    })
  },
  onLoad() {},
  onShow() {
    this.pageStyle.title = this.distributeTexts.commission_details;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COMMISSIONLOG(this.params)
        .then(({ data }) => {
          let list = data.data;
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
.positive {
  color: $green;
}
.negative {
  color: $red;
}

.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
</style>
