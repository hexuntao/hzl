<template>
  <view class="pages">
    <view class="card-group-box" v-if="isEmptyobj">
      <view :style="{ background: theme.gradient }" class="now"
        >正在进行中</view
      >

      <lk-goods-card cell-padding :image="my_bargain_info.pic_cover">
        <view slot="title">
          已砍
          <text class="text-maintone">{{
            my_bargain_info.already_bargain_money
          }}</text>
          元，还剩
          <text class="text-maintone">{{
            my_bargain_info.can_bargain_money
          }}</text>
          元
        </view>
        <view slot="tags" class="tags">
          <view>
            <view>
              <lk-count-down
                color="red"
                :time="my_bargain_info.end_bargain_time * 1000"
              />
              <text>失效</text>
            </view>
          </view>
        </view>
        <view slot="bottom" class="text-maintone flex">
          <view> 已砍：{{ my_bargain_info.bargain_sales }}件</view>
          <lk-button
            round
            type="danger"
            theme-color
            size="mini"
            :to="
              `/packages/bargain/detail?goods_id=${my_bargain_info.goods_id}&bargain_id=${my_bargain_info.bargain_id}&bargain_uid=${uid}`
            "
          >
            继续砍价
          </lk-button>
        </view>
      </lk-goods-card>

      <view
        class="text-maintone mybargainnow"
        v-if="my_bargain_num > 1"
        @click="mybargainlist"
      >
        您还有{{ my_bargain_num }}个砍价活动进行中>>
      </view>
    </view>

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
          :to="item.to"
          :image="item.pic_cover_url"
          :title="item.goods_name"
        >
          <view slot="tags" class="tagsmoney">{{
            item.start_money | yuan
          }}</view>
          <view slot="bottom" class="text-maintone flex">
            已砍{{ item.bargain_sales }}件

            <lk-button
              round
              type="danger"
              theme-color
              size="mini"
              :to="item.to"
            >
              {{
                item.lowest_money == 0
                  ? "砍价免费拿"
                  : `最低砍至${item.lowest_money}元`
              }}
            </lk-button>
          </view>
        </lk-goods-card>
      </view>
    </lk-load-list>

    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_BARGAINLIST } from "@/common/interface/bargain";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
import { isEmpty } from "@/common/utils";
export default {
  name: "packages-bargain-list",
  data() {
    return {
      my_bargain_info: {},
     
      my_bargain_num: "",
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          type: "goods",
          tip: "暂无砍价相关商品"
        }
      }
    };
  },
  computed: {
    ...mapState({
      uid: ({ member }) => member.info.uid
    }),
    isEmptyobj(){
      return isEmpty(this.my_bargain_info)? false : true
    }
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.params.shop_id = query.shop_id || "";
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_BARGAINLIST(this.params)
        .then(({ data }) => {
          this.my_bargain_info = data.my_bargain_list.my_bargain_info;
          this.my_bargain_num = data.my_bargain_list.my_bargain_num;
          let list = data.bargain_list || [];
          list.forEach(e => {
            e.to = {
              path: "/packages/goods/detail",
              query: { goods_id: e.goods_id }
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    mybargainlist() {
      this.$Navigate.push("/packages/bargain/mybargainlist");
    }
  }
};
</script>

<style lang="scss" scoped>
.tags {
  margin-top: 20rpx;
  line-height: 48rpx;
}

.time-box {
  border-radius: 8rpx;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.time-box .text {
  color: #fff;
  padding: 0 12rpx;
}

.time-box .text.ing {
  background: $red;
}

.time-box .text.not {
  background: $green;
}

.time-box .time {
  padding: 0 12rpx;
}
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
.tagsmoney {
  text-decoration: line-through;
  color: #a7a8a9;
}
</style>
