<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>

  <view class="header">
    <lk-search
      v-model="params.search_text"
      placeholder="会员id/昵称"
      action="搜索"
      @search="onSearch"
    />
  </view>

  <view>
    <picker
      mode="selector"
      :range="shoparr"
      :range-key="shop_id"
      @change="bindPickerChange"
      style="
        background-color: #fff;
        padding: 20rpx 30rpx;
        border: 1rpx solid #f1f1f1;
        margin-bottom: 20rpx;
      "
    >
      <view class="picker"> 商户选择：{{ shoparr[index] || '' }} </view>
    </picker>
  </view>

  <view style="background-color: #fff; border-bottom: 1rpx solid #f8f8f8">
    <view
      @click="goPage1(item.bonus_id)"
      style="width: 25%; text-align: center; float: left; padding: 20rpx 0"
      v-for="(item, index) in bonus_type_all"
      :key="index"
      slot="title"
      :class="item.bonus_id == params.bonus_id ? 'navclick' : ''"
    >
      {{ item.bonus_name }}
    </view>
    <view style="clear: both"></view>
  </view>

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
        <view>
          <view
            slot="title"
            :class="item.all_money > 0 ? 'positive' : 'negative'"
          >
            <view v-if="item.order_uid > 0" style="color: #000">
              <view style="width: 50%; float: left"
                >下单人ID：{{ item.order_uid }}
              </view>
              <view
                :class="item.all_money > 0 ? 'positive' : 'negative'"
                style="width: 50%; float: left; text-align: right"
              >
                {{ item.all_money }}
              </view>
            </view>
            <view v-if="item.order_uid > 0" style="color: #000">
              下单人昵称：{{ item.order_nick_name }}
            </view>
            <view style="color: #000">商家：{{ item.shop_name }}</view>
          </view>
        </view>

        <view style="width: 100%">{{ item.introduce }}</view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_COMMISSIONLOG } from '@/common/interface/distribute';
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
      shoparr: [],
      lnarr: [],
      dnarr: [],
      index: '',
      params: {
        page_index: 1,
        page_size: 20,
        bonus_id: 0,
        status: 1,
        shop_id: 0,
        search_text: '',
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
    this.params.shop_id = query.shop_id || 0;
  },
  onShow() {
    this.pageStyle.title = this.params.status == 1 ? '已结佣金' : '未结佣金'; //this.distributeTexts.commission_details;
  },
  methods: {
    bindPickerChange(e) {
      console.log('选中值为', e.detail.value);
      this.index = e.detail.value;
      this.params.shop_id = this.dnarr[this.index];

      let page1 = {
        num: 1,
      };
      this.upCallback(page1);
    },
    onSearch() {
      let page1 = {
        num: 1,
      };
      this.upCallback(page1);
    },
    goPage1(bonus_id) {
      this.params.bonus_id = bonus_id;
      let page1 = {
        num: 1,
      };
      this.upCallback(page1);
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COMMISSIONLOG(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.shoparr = data.shoparr;
          this.lnarr = data.lnarr;
          this.dnarr = data.dnarr;
          this.index = this.lnarr[this.params.shop_id];

          this.params.bonus_id = data.bonus_id;
          this.bonus_type_all = data.bonus_type_all;
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
