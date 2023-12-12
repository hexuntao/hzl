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
        <view slot="title" :class="item.bonus > 0 ? 'positive' : 'negative'">
          {{ item.bonus }}
        </view>
        <view slot="label" class="label">{{ item.text }}</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_BONUSLOG } from "@/common/interface/bonus";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-bonus-log",
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
  mixins: [loadMixin, bonusMixin],
  computed: {
    ...mapState({
      bonusTexts: ({ bonus }) => bonus.texts
    })
  },
  onLoad() {},
  onShow() {
    this.pageStyle.title = this.bonusTexts.common.bonus_details;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_BONUSLOG(this.params)
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
