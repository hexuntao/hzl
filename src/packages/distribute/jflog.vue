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
        :value="item.add_time"
      >
        <view slot="title" :class="item.total_pv > 0 ? 'positive' : 'negative'">
          {{ item.total_pv }}
        </view>
        <!-- <view slot="label" class="label">{{ item.introduce }}</view> -->
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_COMMISSIONJFLOG } from '@/common/interface/distribute';
import loadMixin from '@/mixins/load-list';
import { mapState } from 'vuex';
export default {
  name: 'packages-distribute-log',
  data() {
    return {
      pageStyle: {
        background: '',
        title: '',
      },
      bonus_type_all: [],
      params: {
        page_index: 1,
        page_size: 20,
        bonus_id: 0,
        status: 1,
      },
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts,
    }),
  },
  onLoad(query) {
    this.params.status = query.status;
  },
  onShow() {
    this.pageStyle.title = this.params.status == 1 ? '已结积分' : '未结积分'; //this.distributeTexts.commission_details;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COMMISSIONJFLOG(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.positive {
  color: $green;
}
.negative {
  color: $red;
}
.navclick {
  background-color: #f8f8f8;
}
.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 40rpx;
}
</style>
