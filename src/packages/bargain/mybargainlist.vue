<template>
  <view>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="card-group-box" v-for="(item, index) in list" :key="index">
        <lk-goods-card
          cell-padding
          :image="item.pic_cover"
          :to="
            `/packages/bargain/detail?goods_id=${item.goods_id}&bargain_id=${item.bargain_id}&bargain_uid=${uid}`
          "
        >
          <view slot="title">
            已砍
            <text class="text-maintone">{{ item.already_bargain_money }}</text>
            元，还剩
            <text class="text-maintone">{{ item.can_bargain_money }}</text>
            元
          </view>
          <view slot="tags" class="tags">
            <view>
              <view>
                <lk-count-down
                  color="red"
                  :time="item.end_bargain_time * 1000"
                  @finish="getData(item.bargain_id)"
                />
                <text>失效</text>
              </view>
            </view>
          </view>
          <view slot="bottom" class="text-maintone flex">
            <view> 已砍：{{ item.bargain_sales }}件</view>
            <lk-button
              round
              type="danger"
              theme-color
              size="mini"
              :to="
                `/packages/bargain/detail?goods_id=${item.goods_id}&bargain_id=${item.bargain_id}&bargain_uid=${uid}`
              "
            >
              继续砍价
            </lk-button>
          </view>
        </lk-goods-card>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import {
  GET_MYBARGAINLIST,
  CLOSEUSERBARGAIN
} from "@/common/interface/bargain";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      }
    };
  },
  computed: {
    ...mapState({
      uid: ({ member }) => member.info.uid
    })
  },
  mixins: [loadMixin],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_MYBARGAINLIST(this.params)
        .then(({ data }) => {
          let list = data || [];
          list.forEach(e => {
            e.to = {
              path: "/packages/goods/detail",
              query: { goods_id: e.bargain_id }
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    getData(bargain_id) {
      CLOSEUSERBARGAIN({ bargain_id: bargain_id }).then(({ code, message }) => {
        if (code == 0) {
          this.resetList();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.text-maintone {
  color: $red;
}
.now {
  height: 80rpx;
  color: $white;
  text-align: center;
  padding: 20rpx 0;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mybargainnow {
  height: 80rpx;
  background-color: #fff;
  text-align: center;
  padding: 20rpx 0;
}
.tags {
  color: #a7a8a9;
  margin-top: 20rpx;
  line-height: 48rpx;
}
</style>
