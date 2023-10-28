<template>
  <view class="pages">
    <view class="header">
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="3"
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.name }}
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <list-item v-for="(item, index) in list" :key="index" :items="item">
        <task-state :state="params.task_status" slot="right" />
      </list-item>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_TASKLIST } from "@/common/interface/task";
import loadMixin from "@/mixins/load-list";
import listItem from "@/pages/task/component/list-item";
import taskState from "./component/task-state";
export default {
  name: "packages-task-list",
  data() {
    return {
      tabs: [
        {
          name: "进行中",
          task_status: 1
        },
        {
          name: "已完成",
          task_status: 2
        },
        {
          name: "已失效",
          task_status: 3
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        task_status: 1
      },
      upOption: {
        empty: {
          tip: "没有相关任务"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  methods: {
    onTab(index) {
      this.params.task_status = this.tabs[index].task_status;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_TASKLIST(this.params)
        .then(({ data }) => {
          let list = data.user_task_info.task_info || [];
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {
    listItem,
    taskState
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
</style>
