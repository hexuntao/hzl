<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.task_img"
      :name="info.task_name || '-'"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        {{ info.task_kind_text || "" }}
      </view>
    </lk-header-panel>
    <view class="cell-group">
      <view class="title">任务时间</view>
      <view class="content">{{ info.timeText }}</view>
    </view>
    <view class="cell-group">
      <view class="title">任务要求</view>
      <view class="content">
        <view class="text" v-if="info.task_kind == 2">
          每隔
          <text class="price-color">{{ info.task_limit_time || "-" }}</text>
          小时可重新领取，领取后
          <text class="price-color">{{ info.task_limit_time || "-" }}</text>
          小时内完成
        </view>
        <view class="text" v-else>
          领取后
          <text class="price-color">{{ info.task_limit_time || "-" }}</text>
          小时内完成
        </view>
      </view>
    </view>
    <rule-reward-group
      v-for="(item, index) in info.task_rule_reward"
      :key="index"
      :items="item"
    />
    <view class="cell-group">
      <view class="title">任务说明</view>
      <view class="content">
        <lk-parser
          show-with-animation
          lazy-load
          :html="info.task_explain"
        ></lk-parser>
      </view>
    </view>
    <view class="foot-btn-group fixed" v-if="showReceiveBtn">
      <lk-button
        type="danger"
        round
        block
        :color="theme.gradient"
        :disabled="isDisabled"
        :loading="isLoading"
        @click="onReceive"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_TASKDETAIL } from "@/common/interface/task";
import ruleRewardGroup from "./component/rule-reward-group";
const kindText = {
  1: "单次任务",
  2: "周期任务",
  3: "单级海报任务",
  4: "多级海报任务"
};
export default {
  name: "packages-task-list",
  data() {
    return {
      info: {},
      params: {
        general_poster_id: ""
      },
      isLoading: false
    };
  },
  computed: {
    showReceiveBtn() {
      return this.info.task_kind == 3 || this.info.task_kind == 4
        ? this.info.is_get === 1
          ? true
          : false
        : false;
    },
    isDisabled() {
      return this.info.is_get != 0;
    },
    btnText() {
      return this.isDisabled ? this.info.end_task_time + " 失效" : "立即领取";
    }
  },
  onLoad(query) {
    this.params.general_poster_id = query.general_poster_id || "";
    if (query.user_task_id) {
      this.params.user_task_id = query.user_task_id;
    }
    this.getData();
  },
  methods: {
    getData() {
      GET_TASKDETAIL(this.params)
        .then(({ data }) => {
          const info = data.general_task_detail || {};
          this.info = info;
          this.info.task_kind_text = kindText[info.task_kind];
          this.info.timeText =
            info.start_task_time + " ~ " + info.end_task_time;
        })
        .catch(() => {});
    }
  },
  components: {
    ruleRewardGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  margin-bottom: 190rpx;
}
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.text {
  color: $text-gray;
}
.cell-group {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  line-height: 1.6;
  overflow: hidden;
  padding: $cell-padding;

  .title,
  .content {
    color: $text-gray;
  }
}
</style>
