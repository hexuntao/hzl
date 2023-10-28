<template>
  <view
    class="header"
    :class="{ 'tab-top': isCurrent }"
    :style="fixed ? 'position:fixed;' : 'position:relative'"
  >
    <lk-tabs
      slot-title
      :active-color="theme.color"
      :line-color="theme.color"
      nav-per-view="4"
      :line="false"
    >
      <lk-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :disabled="tab.disabled"
      >
        <view
          class="tab-item"
          :class="tab.disabled ? 'disabled-color' : ''"
          @click="onSort(index)"
        >
          <text>{{ tab.name }}</text>
          <view
            v-if="tab.icon"
            :style="{
              transform:
                tab.sort_type == 'DESC' ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          >
            <lk-icon :name="tab.icon" class-prefix="v-icon" />
          </view>
        </view>
      </lk-tab>
    </lk-tabs>
    <lk-popup v-model="show" position="right">
      <view class="screen-popup">
        <view class="screen-condition">
          <view class="btn-group">
            <view class="btn-box" v-for="(tag, index) in tags" :key="index">
              <lk-button
                size="small"
                block
                type="default"
                :color="tag.selected ? theme.color : ''"
                @click="tagSelect(index, tag.selected)"
              >
                {{ tag.name }}
              </lk-button>
            </view>
          </view>
          <view class="price-range">价格区间</view>
          <view class="condition-group">
            <view class="input-group">
              <lk-field
                type="number"
                v-model="tagParams.min_price"
                placeholder="最低价"
              />
              <text class="input-group-addon">~</text>
              <lk-field
                type="number"
                v-model="tagParams.max_price"
                placeholder="最高价"
              />
            </view>
          </view>
        </view>
        <view class="foot">
          <view class="btn reset e-handle" @click="onReset">重置</view>
          <view
            class="btn sub e-handle"
            :style="{ background: theme.gradient }"
            @click="onOonfirm"
          >
            确定
          </view>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_MEMBERSETTEXT } from "@/common/interface/member";
export default {
  data() {
    return {
      tabs: [
        {
          name: "默认",
          sort: "",
        },
        {
          name: "销售量",
          icon: "v-icon-sort2",
          sort: "sales",
          sort_type: "DESC",
        },
        {
          name: "价格",
          icon: "v-icon-sort2",
          sort: "price",
          sort_type: "DESC",
        },
        {
          name: "筛选",
          icon: "v-icon-screen",
          disabled: true,
          sort: false,
        },
      ],
      show: false,
      tags: [
        {
          name: "推荐",
          type: "is_recommend",
          selected: false,
        },
        {
          name: "新品",
          type: "is_new",
          selected: false,
        },
        {
          name: "热卖",
          type: "is_hot",
          selected: false,
        },
        {
          name: "促销",
          type: "is_promotion",
          selected: false,
        },
        {
          name: "包邮",
          type: "is_shipping_free",
          selected: false,
        },
      ],
      tagParams: {
        min_price: "",
        max_price: "",
        is_recommend: 0,
        is_new: 0,
        is_hot: 0,
        is_promotion: 0,
        is_shipping_free: 0,
      },
    };
  },
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    GET_MEMBERSETTEXT().then((res) => {
      if (res.config.addons.membercard == 1) {
        this.tags.push({
          name: res.data.plus,
          type: "is_plus_member",
          selected: false,
        });
      }
    });
  },
  methods: {
    // 商品排序
    onSort(index) {
      if (index == 3) {
        this.show = true;
        return;
      }
      let params = {};
      params.order = this.tabs[index].sort;
      if (this.tabs[index].sort_type) {
        //升序降序
        params.sort = this.tabs[index].sort_type;
        if (this.tabs[index].sort_type == "DESC") {
          this.tabs[index].sort_type = "ASC";
        } else {
          this.tabs[index].sort_type = "DESC";
        }
      } else {
        // 默认
        params.sort = "";
      }
      this.$emit("change", params);
    },
    // 选择标签
    tagSelect(index, flag) {
      this.tags[index].selected = !flag;
      this.tagParams[this.tags[index].type] = this.tags[index].selected ? 1 : 0;
    },
    // 重置筛选
    onReset() {
      this.tagParams.min_price = "";
      this.tagParams.max_price = "";
      this.tagParams.is_recommend = 0;
      this.tagParams.is_new = 0;
      this.tagParams.is_hot = 0;
      this.tagParams.is_promotion = 0;
      this.tagParams.is_shipping_free = 0;
      this.tags.forEach((e) => {
        e.selected = false;
      });
    },
    // 确认筛选
    onOonfirm() {
      this.tagParams.min_price = this.tagParams.min_price
        ? parseFloat(this.tagParams.min_price)
        : "";
      this.tagParams.max_price = this.tagParams.max_price
        ? parseFloat(this.tagParams.max_price)
        : "";
      this.show = false;
      this.$emit("change", this.tagParams);
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
.tab-top {
  top: 0;
}
.tab-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.disabled-color {
  color: $text-color;
}
.screen-popup {
  position: relative;
  width: 60vw;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  .condition-group {
    display: flex;
    padding: 20rpx;
    border-bottom: 2rpx solid #ddd;
  }
  .btn-group {
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx;
    border-bottom: 2rpx solid #ddd;
  }
  .btn-group .btn-box {
    width: 50%;
    padding: 10rpx;
  }

  .btn-group .btn.selected {
    background: $red;
    color: #ffffff;
  }

  .price-range {
    padding: 30rpx 20rpx 0px;
    color: $text-gray;
  }

  .input-group {
    display: flex;
    align-items: center;
    flex-flow: row;
  }

  .input-group .input-group-addon {
    padding: 20rpx;
    color: $text-gray;
  }

  .foot {
    position: absolute;
    bottom: 0;
    display: flex;
    z-index: 1;
    width: 100%;
    align-items: center;
  }

  .foot .btn {
    flex: 1;
    text-align: center;
    line-height: 100rpx;
    height: 100rpx;
  }

  .foot .btn.reset {
    background: #f8f8f8;
    color: $text-gray;
  }
  .foot .btn.sub {
    background: $red;
    color: #ffffff;
  }
}
</style>
