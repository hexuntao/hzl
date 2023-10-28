<template>
  <view>
    <lk-cell
      :title="items.label"
      :required="items.required"
      :value="value"
      is-link
      @click="show = true"
    />
    <lk-popup
      v-model="show"
      position="bottom"
      round
      closeable
      :title="items.label"
    >
      <view class="timer-group" v-if="tabs.length">
        <lk-tabs
          v-model="active"
          slot-title
          :active-color="theme.color"
          :line-color="theme.color"
        >
          <lk-tab v-for="(tab, b) in tabs" :key="b">
            <view class="tab-title">
              <view>{{ tab.week_days }}</view>
              <view>{{ tab.days }}</view>
            </view>
          </lk-tab>
        </lk-tabs>
        <view class="tab-content" v-if="tabs[active]">
          <view
            class="item"
            v-for="(item, index) in tabs[active].rules"
            :key="index"
            :class="item.disabled ? 'disabled' : ''"
            :style="{
              color: item.checked ? theme.color : '',
              background: item.checked ? theme.opacity : '',
              borderColor: item.checked ? theme.opacity : ''
            }"
            @click="select(index)"
          >
            <view>{{ item.time }}</view>
            <view>{{ item.label }}</view>
          </view>
        </view>
        <view class="tab-footer">
          <lk-button class="btn" block square @click="show = false">
            取消
          </lk-button>
          <lk-button class="btn" theme-color block square @click="confirm">
            确定<text v-if="selectTimeText">{{ selectTimeText }}</text>
          </lk-button>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import form from "../../mixin/form";
function objToArr(obj) {
  let arr = [];
  for (const key in obj) {
    arr.push(obj[key]);
  }
  return arr;
}
const year = new Date().getFullYear();
export default {
  data() {
    return {
      show: false,
      active: 0,
      value: "",
      tabs: [],

      days: "",
      time: ""
    };
  },
  mixins: [form],
  computed: {
    selectTimeText() {
      let text = "";
      if (this.days && this.time) {
        text = `(${this.days} ${this.time})`;
      }
      return text;
    }
  },
  mounted() {
    let arr = [];
    let obj = this.items.list || {};
    for (const key in obj) {
      let items = obj[key];
      items.rules = [];
      for (const r in items.time_rules) {
        let item = items.time_rules[r];
        item.label = "剩余" + item.num;
        item.disabled = !parseInt(item.num || 0);
        item.checked = false;
        items.rules.push({
          ...item
        });
      }
      arr.push({ ...items });
    }
    this.tabs = arr;
    this.value = this.items.value;
  },
  methods: {
    select(i) {
      const item = this.tabs[this.active].rules[i];
      if (!item.disabled) {
        this.tabs.forEach((t, t_i) => {
          t.rules.forEach((r, r_i) => {
            if (this.active == t_i && i == r_i) {
              r.checked = !r.checked;
              this.days = r.checked ? t.days : "";
              this.time = r.checked ? r.time : "";
            } else {
              r.checked = false;
            }
          });
        });
      }
    },
    confirm() {
      this.items.value = `${this.days},${this.time}`;
      this.value = `${this.days} ${this.time}`;
      this.show = false;
    }
  }
};
</script>

<style scoped lang="scss">
.timer-group {
  width: 100%;
  background: #fff;
  position: relative;
}
.tab-title {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
}
.tab-content {
  padding: 10rpx;
  height: 600rpx;
  overflow-y: auto;
  .item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(33.33334% - 20rpx);
    height: 98rpx;
    border-radius: 10rpx;
    margin: 10rpx;
    border-radius: 10rpx;
    padding: 12rpx 20rpx;
    font-size: $font-size-sm;
    line-height: 36rpx;
    background-color: #f1f3f6;
  }
  .item.disabled {
    opacity: 0.8;
    background-color: #eeeeee;
  }
}
.tab-footer {
  display: flex;
  align-items: center;
  width: 100%;
  .btn {
    flex: 1;
  }
}
</style>
