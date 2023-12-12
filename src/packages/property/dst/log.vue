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
      <view class="info-list">
        <view class="info-title">DST账户明细</view>
        <view class="listall" v-for="(item, index) in list" :key="index">
          <view class="list">
            <view class="list-item">
              <view class="list-title">类型：{{ item.type_name }}</view>
              <view class="list-tisp">{{ item.create_time }}</view>
            </view>

            <view class="list-item">
              <text :class="item.sign === 1 ? 'green-color' : 'red-color'">{{
                item.number
              }}</text>
            </view>
          </view>

          <view class="listintro"> 备注：{{ item.text }} </view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from '@/mixins/load-list';
import { mapState } from 'vuex';
import { GET_ASSETACCOUNT } from '@/common/interface/property';
export default {
  data() {
    return {
      params: {
        account_type: 9,
      },
    };
  },
  onLoad(query) {},
  mixins: [loadMixin],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
    }),
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ASSETACCOUNT(this.params)
        .then(({ data }) => {
          let list = data.account_detail.data || [];
          this.concatList(list, data.account_detail.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.info-list {
  padding: 0 25px;
  background: #ffffff;
  .info-title {
    padding: 30rpx 20rpx;
    font-size: 30rpx;
    color: #333333;
    border-bottom: 2rpx solid #eeeeee;
  }
  .listall {
    border-bottom: 2rpx solid #eeeeee;
    padding: 30rpx 20rpx;
    margin-bottom: 22rpx;
  }
  .listintro {
    margin-top: 10rpx;
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-of-type {
      border-bottom: 0;
    }
    .list-title {
      font-size: $font-size;
      color: #333333;
      margin-bottom: 22rpx;
    }
    .list-tisp {
      font-size: 26rpx;
      color: #999999;
    }
    .green-color {
      color: #4b0 !important;
    }
    .red-color {
      color: #ff454e !important;
    }
  }
}
.info-item {
  background: #ffffff;
  border-radius: $border-radius-lg;
  padding: 28rpx 0 30rpx;
  display: flex;
  justify-items: center;
  align-items: center;
  margin-bottom: 14rpx;
  .info-list1 {
    flex: 1;
    text-align: center;
    border-right: 2rpx solid #eeeeee;
    &:last-of-type {
      border-right: 0;
    }
    .info-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 24rpx;
    }
    .info-text {
      font-size: 26rpx;
      color: #333333;
    }
  }
}
</style>
