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
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @tap="chooseEvent(item.tec_id, item.name)"
      >
        <view class="head">
          <image :src="item.headimg"></image>
          <view class="info">
            <view class="name">{{ item.name }}</view>
            <view class="position">{{ item.level_name }}</view>
          </view>
        </view>
        <view class="label-list">
          <view class="label" v-for="(label, i) in item.tag" :key="i">{{
            label
          }}</view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import listcard from './component/listcard';
import { GET_CARDTECHNICIANLIST } from '@/common/interface/consumercard';
import loadMixin from '@/mixins/load-list';
import { formatDate } from '@/common/utils';
export default {
  name: '',
  data() {
    return {
      list: [],
      params: {
        page_index: 1,
        page_size: 20,
        state: 0,
      },
      card_id: '',
    };
  },
  mixins: [loadMixin],
  onLoad(options) {
    this.card_id = options.card_id;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_CARDTECHNICIANLIST({ card_id: this.card_id })
        .then(({ data }) => {
          let list = data || [];
          this.concatList(list, data.length);
        })
        .catch(error => {
          this.$load.endErr();
        });
    },
    chooseEvent(tec_id, name) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      // 上一个页面最后设置userdata
      prevPage.$vm.tec_id = tec_id;
      prevPage.$vm.tec_name = name;
      uni.navigateBack({
        //返回
        delta: 1,
      });
    },
  },

  computed: {},
  components: {
    listcard,
  },
};
</script>

<style lang="scss" scoped>
.item {
  background-color: #ffffff;
  margin: 10rpx 20rpx;
  border-radius: 10rpx;
  padding: 20rpx;
  .head {
    display: flex;
    image {
      width: 90rpx;
      height: 90rpx;
      background-color: #1cbbb4;
    }
    .info {
      flex: 1;
      margin: 0 0 0 20rpx;
      .name {
        font-weight: bold;
      }
    }
  }
  .label-list {
    margin: 10rpx 0 0 0;
    display: flex;
    .label {
      border-radius: 50rpx;
      background-color: #ffaa7f;
      padding: 4rpx 10rpx;
      margin: 0 10rpx;
      color: #ffffff;
    }
  }
}
</style>
