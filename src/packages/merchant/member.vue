
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
      <lk-cell class="item" v-for="(item, index) in list" :key="index">
        <view class="box">
          <view class="img">
            <image :src="item.user_headimg" />
          </view>
          <view class="info">
            <view>
              <view class="name">
                {{
                item.nick_name ? item.nick_name : item.user_name
                }}
              </view>
              <view class="shop">
                <view class="level-name">店铺：{{ item.total_shop_num }}</view>
                <view>招商员：{{item.total_merchants_num}}</view>
              </view>
            </view>
          </view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>
<script>
import loadMixin from "@/mixins/load-list";
import { GET_WAPGETPROMOTIONMERCHANTS } from "@/common/interface/merchants";
export default {
  name: "packages-merchant-customer",
  data() {
    return {
      params: {
        page_index: 1,
      },
      upOption: {
        empty: {
          type: "",
          tip: "没有数据",
        },
      },
    };
  },
  mixins: [loadMixin],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_WAPGETPROMOTIONMERCHANTS(this.params)
        .then((res) => {
          let list = res.data.data || [];
          this.concatList(list, res.data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
}

.img {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
}

.img image {
  display: block;
  width: 100%;
  height: 100%;
}

.info {
  display: flex;
  flex: 1;
}
.shop {
  display: flex;
}
.level-name {
  padding-right: 180rpx;
}
</style>

