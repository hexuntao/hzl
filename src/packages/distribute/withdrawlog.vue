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
          :value="item.status_name"
		  
      >
        <view
            slot="title"
    
        >
          {{ item.cash }}(手续费：{{item.tax}})
        </view>

        <view slot="label" class="label">
			<view v-if="item.memo!=''">{{item.memo}}</view>
			<view>{{ item.ask_for_date }}</view>
		</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_WITHDRAWLOG } from "@/common/interface/distribute";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-distribute-log",
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
    this.pageStyle.title = '提现记录';
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_WITHDRAWLOG(this.params)
          .then(({ data }) => {

            let list = data.withdraw_list;
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
