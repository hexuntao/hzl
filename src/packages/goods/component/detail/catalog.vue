<template>
  <view class="catalog card-group-box">
    <lk-cell title="目录" :border="false" />
    <view class="list" v-if="list.length">
      <lk-cell
        v-for="(item, index) in list"
        :key="index"
        :to="item.to"
        :title="item.knowledge_payment_name"
      >
        <view slot="label" class="label">
          <view class="text">{{ item.labelText }}</view>
          <view>
            <lk-tag v-if="item.labelTag" type="danger" round plain>
              {{ item.labelTag }}
            </lk-tag>
            <lk-icon v-if="item.labelIcon" name="lock"/>
          </view>
        </view>
      </lk-cell>
    </view>
    <view class="empty" v-else>暂无目录</view>
  </view>
</template>

<script>
import { GET_GOODSDETAIL_LIST } from "@/common/interface/course";
import { wan } from "@/common/utils";
export default {
  data() {
    return {
      list: [],
      showTag: false
    };
  },
  props: {
    info: Object
  },
  computed: {},
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      GET_GOODSDETAIL_LIST({ goods_id: this.info.goods_id }).then(
        ({ data }) => {
          let list = data.konwledge_payment_list || [];
          list.forEach(e => {
            e.to = {
              path: "/packages/course/detail",
              query: {
                goods_id: this.info.goods_id,
                knowledge_payment_id: e.knowledge_payment_id
              }
            };
            e.labelText = e.sales ? `${wan(e.sales)}次学习` : "";
            if (!data.is_buy) {
              if (e.knowledge_payment_is_see == -1) {
                e.labelIcon = "lock";
              } else {
                e.labelTag = e.knowledge_payment_type == 1 ? "试看" : "试学";
              }
            }
          });
          this.list = list;
          this.showTag = !data.is_buy;
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
.catalog {
  background: #ffffff;
  .list{
    max-height: 500rpx;
    overflow-y: auto;
    border-radius: 20rpx;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40rpx;
    .text {
      color: $text-light;
      font-size: $font-size-sm;
    }
  }
  .same {
    display: inline-block;
  }
  .same text {
    display: inline-block;
    width: 4rpx;
    height: 20rpx;
    margin-bottom: 0;
    background-color: $red;
    margin-left: 4rpx;
  }
  .same text.line1 {
    -webkit-animation: line 0.6s infinite ease-in-out alternate;
    -moz-animation: line 0.6s infinite ease-in-out alternate;
    animation: line 0.6s infinite ease-in-out alternate;
  }
  .same text.line2 {
    -webkit-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    animation: line 0.6s 0.2s infinite ease-in-out alternate;
  }
  .same text.line3 {
    -webkit-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    animation: line 0.6s 0.3s infinite ease-in-out alternate;
  }
  .same text.line4 {
    -webkit-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    animation: line 0.6s 0.15s infinite ease-in-out alternate;
  }
  @keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 30rpx;
    }
  }

  @-webkit-keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 30rpx;
    }
  }
}
</style>
