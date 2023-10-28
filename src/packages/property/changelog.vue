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
          :value="item.service_charge_show"
      >
	  <view slot="title">{{ item.account_type_name }}</view>
        <view slot="title">兑换账户：{{ item.change_account_type_name }}</view>
    
		
		<view slot="label" class="label">
			<view>{{ item.create_time }}</view>
		</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { APPLY_GET_CHANGELOG } from "@/common/interface/property";

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
		  account_type:0,
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
  onLoad(query) {
	  this.params.account_type = query.account_type;
  },
  onShow() {
    this.pageStyle.title = '兑换记录';
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      APPLY_GET_CHANGELOG(this.params)
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
