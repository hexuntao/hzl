<template>
  <view class="pages">
    <lk-search
      v-model="value"
      placeholder="请输入关键词"
      action="搜索"
      @search="onSearch"
    />
    <lk-tabs
      v-model="active"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="2"
      :lineScale="1"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <view class="search-history" v-if="historyList.length">
      <view class="history-head">历史搜索</view>
      <view class="history-list">
        <lk-cell
          clickable
          v-for="(item, index) in historyList"
          :key="index"
          :value="item.query.search_text"
          :to="item"
        />
      </view>
      <view class="history-foot">
        <lk-button round @click="removeHistory">清空历史记录</lk-button>
      </view>
    </view>
    <view class="empty" v-else>暂无搜索记录</view>
  </view>
</template>

<script>
import $Storage from "@/api/storage";
export default {
  name: "packages-cps-search",
  data() {
    return {
      value: "",
      active: 0,
      type: "",
      tabs: [
        {
          name: "京东",
          type: "jd"
        },
        {
          name: "拼多多",
          type: "pdd"
        }
      ],
      historyList: []
    };
  },
  onLoad(query) {
    this.type = query.type;
    if (this.type == "jd") {
      this.active = 0;
    }
    if (this.type == "pdd") {
      this.active = 1;
    }

    let to = {
      path: "/packages/cps/search/result",
      query: {
        search_text: "",
        type: this.type
      }
    };
    this.to = to;
    if ($Storage.get("history_key_" + this.type)) {
      this.historyList = $Storage.get("history_key_" + this.type);
    }
  },
  methods: {
    onTab(index) {
      if (index == 0) {
        this.type = "jd";
        this.to.query.type = "pdd";
      }
      if (index == 1) {
        this.type = "pdd";
        this.to.query.type = "pdd";
      }
    },
    onSearch(value) {
      let to = this.to;
      const search_text = value.trim();
      if (!search_text) return this.$Prompt.toast("内容不能为空");
      to.query.search_text = search_text;
      this.saveHistory(to);
      this.$Navigate.push(to).then(() => {
        this.historyList = $Storage.get("history_key_" + this.type);
      });
    },
    saveHistory(query) {
      let searches = $Storage.get("history_key_" + this.type)
        ? $Storage.get("history_key_" + this.type)
        : [];
      this.insertArray(
        searches,
        query,
        (item) => {
          return item === query;
        },
        15
      );
      $Storage.set("history_key_" + this.type, searches);
      return searches;
    },
    insertArray(arr, val, compare, maxLen) {
      console.log(val);
      const index = arr.findIndex(compare);
      if (index === 0) {
        return;
      }
      if (index > 0) {
        arr.splice(index, 1);
      }
      arr.unshift(val);
      if (maxLen && arr.length > maxLen) {
        arr.pop();
      }
    },
    removeHistory() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定删除所有历史记录？"
        })
        .then(() => {
          $Storage.remove("history_key_" + this.type);
          this.historyList = [];
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.search-history {
  margin-top: 20rpx;
  height: calc(100% - 120rpx);
}

.search-history .history-head {
  padding: 40rpx 28rpx;
  font-weight: 800;
}

.search-history .history-list {
  overflow-y: auto;
  max-height: calc(100% - 360rpx);
}

.history-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx;
}
</style>
