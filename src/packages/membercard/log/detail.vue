<template>
  <view class="pages">
    <view class="head">
      <view class="title">{{ detail.type_name }}</view>
      <view
        class="value"
        :class="detail.change_money > 0 ? 'positive' : 'negative'"
      >{{ detail.change_money }}</view>
    </view>
    <lk-cell v-for="(item, index) in items" :key="index" :title="item.title">
      <view :style="{ color: item.color }" class="text-nowrap" v-html="item.value"></view>
    </lk-cell>
    <view class="tip-text" v-if="footTip">{{ footTip }}</view>
  </view>
</template>

<script>
import { GET_MEMBERCARDDETAIL } from "@/common/interface/membercard";
import { formatDate, yuan } from "@/common/utils";
export default {
  name: "packages-membercard-log-detail",
  data() {
    return {
      items: [],
      detail: {}
    };
  },
  computed: {
    footTip() {
      let text =
        "提示：提现过程中，提现金额将暂时进入冻结余额，提现成功后该笔提现的冻结余额将会扣除，如果提现失败则冻结余额解冻，该笔提现不成立。";
      return this.detail.from_type == 8 ? text : "";
    }
  },
  onLoad(options) {
    GET_MEMBERCARDDETAIL({ id: options.id }).then(res => {
      this.detail = res.data;
      this.items = this.dataToArr(res.data);
    });
  },
  methods: {
    statuColor(state) {
      let name = "#ff9900";
      if (state == -1 || state == 4) {
        name = "#ff454e";
      } else if (state == 3) {
        name = "#4b0";
      }
      return name;
    },
    statuName(state) {
      let name = "处理中";
      if (state == -1 || state == 4) {
        name = "失败";
      } else if (state == 3) {
        name = "成功";
      }
      return name;
    },
    dataToArr(data) {
      let arr = [
        {
          title: "交易单号",
          value: data.records_no
        },
        {
          title: "时间",
          value: data.create_time
        }
      ];
      if (data.from_type == 8) {
        arr.push(
          {
            title: "状态",
            value: this.statuName(data.status),
            color: this.statuColor(data.status)
          },
          {
            title: "提现金额",
            value: yuan(data.number)
          },
          {
            title: "手续费",
            value: yuan(data.charge)
          },
          {
            title: "余额",
            value: yuan(data.balance)
          }
        );
      } else {
        arr.push({
          title: "余额",
          value: yuan(data.balance)
        });
      }
      if (data.msg) {
        arr.push({
          title: "理由",
          value: data.msg
        });
      }
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.head {
  text-align: center;
  font-size: 32rpx;
  line-height: 1.8;
  margin: 60rpx 0;
}

.head .value {
  font-weight: 800;
}
.positive {
  color: #4b0;
}

.negative {
  color: $red;
}
.tip-text {
  margin: 20rpx 30rpx;
  font-size: 24rpx;
  color: $red;
  line-height: 1.4;
}
.text-nowrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
