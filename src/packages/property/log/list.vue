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
      <lk-cell
        :value="item.create_time"
        v-for="(item, index) in list"
        :key="index"
      >
	  <view>
	    <view slot="title" >
		
			<view style="width:50%;float:left;">{{ item.account_type_name }}</view>
			<view :class="item.number > 0 ? 'positive' : 'negative'" style="width:50%;float:left;text-align:right;">
			  {{ item.number }}
			</view>
		
		</view>
        <view slot="title">
			<view style="width:50%;float:left;">{{ item.type_name }}</view>
			<view class="time" style="width:50%;float:left;text-align:right;">{{ item.create_time }}</view>
		</view>
        <!-- <view
          slot="label"
          class="label"
          :class="item.status == 4 || item.status == -1 ? 'text-through' : ''"
          >余额： {{ item.balance }}</view>-->
        <view> 
         
          
        </view>
		</view>
		<view style="width:100%;">备注：{{item.text}}</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_ASSETBALANCELOG } from "@/common/interface/property";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-property-log-list",
  data() {
    return {
      isProceeds: false,
      params: {}
    };
  },
  onLoad(query) {
    this.isProceeds = query.hash == "proceeds";
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    })
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      const isProceeds = this.isProceeds;
      setTimeout(() => {
        GET_ASSETBALANCELOG(this.params, { isProceeds }).then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.positive {
  color: #4b0;
}
.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
}
.negative {
  color: #ff454e;
}
.text-through {
  text-decoration: line-through;
}
</style>
