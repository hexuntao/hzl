<template>
  <view class="pages">
    <view class="notice-tip" v-if="notice">{{ notice }}</view>
    <view class="card-panel card-group-box" v-if="itemsTotal.length">
      <view class="item" v-for="(item, index) in itemsTotal" :key="index">
        <text class="num">{{ item.title }}</text>
        <text class="text">{{ item.text }}</text>
      </view>
    </view>
    <view class="card-panel card-group-box" v-if="itemsMince.length">
      <view class="item" v-for="(item, index) in itemsMince" :key="index">
        <text class="num">{{ item.title }}</text>
        <text class="text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_ACHIEVEWARD } from "@/common/interface/agent";
export default {
  name: "packages-agent-achievereward",
  data() {
    return {
      notice: "",
      itemsTotal: [],
      itemsMince: []
    };
  },
  computed: {},
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_ACHIEVEWARD()
        .then(({ data }) => {
          if (data.month_day) {
            this.notice =
              "业绩将在每月" +
              data.month_day +
              "号凌晨发放，网络原因有可能导致延时。";
          }
          this.itemsTotal = [
            { title: "个人本月奖金", text: data.this_month_primoney || 0 },
            {
              title: "团队本月奖金",
              text: data.this_month_team_primoney || 0
            }
          ];
          this.itemsMince = [
            { title: "个人日销", text: data.today_primoney || 0 },
            { title: "个人月销", text: data.tomonth_primoney || 0 },
            { title: "个人累计销量", text: data.total_primoney || 0 },
            { title: "团队日销", text: data.team_day_primoney || 0 },
            { title: "团队月销", text: data.team_month_primoney || 0 },
            {
              title: "团队累计销量",
              text: data.team_total_primoney || 0
            }
          ];
        })
        .catch(error => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-tip {
  padding: 10px;
  color: #f56723;
  font-size: 12px;
  line-height: 1.5;
  background-color: #fff7cc;
}
</style>
