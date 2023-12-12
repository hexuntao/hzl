<template>
  <view class="header" :style="fixed ? 'position:fixed' : 'position:relative'">
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
                tab.sort_type == 'DESC' ? 'rotate(180deg)' : 'rotate(0deg)'
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
          <view class="price-range">价格区间</view>
          <view class="condition-group">
            <view class="input-group">
              <lk-field
                type="number"
                v-model="tagParams.price_from"
                placeholder="最低价"
              />
              <text class="input-group-addon">~</text>
              <lk-field
                type="number"
                v-model="tagParams.price_to"
                placeholder="最高价"
              />
            </view>
          </view>
          <lk-cell center title="优惠券商品">
            <switch
              :color="theme.color"
              :checked="!!tagParams.show_coupon_goods"
              slot="rightIcon"
              @change="onClickRadio"
            />
          </lk-cell>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      tabs: [
        {
          name: "补贴",
          icon: "v-icon-sort2",
          sort: "commission",
          sort_type: "DESC"
        },
        {
          name: "销售量",
          icon: "v-icon-sort2",
          sort: "sales",
          sort_type: "DESC"
        },
        {
          name: "价格",
          icon: "v-icon-sort2",
          sort: "price",
          sort_type: "DESC"
        },
        {
          name: "筛选",
          icon: "v-icon-screen",
          disabled: true,
          sort: false
        }
      ],
      show: false,
      tagParams: {
        price_from: "",
        price_to: "",
        show_coupon_goods: 0
      }
    };
  },
  props: {
    fixed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      memberTexts: ({ member }) => member.texts
    })
  },
  mounted() {},
  methods: {
    // 商品排序
    onSort(index) {
      if (index == 3) {
        this.show = true;
        return;
      }
      let params = {};
      params.sort_name = this.tabs[index].sort;
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
    onClickRadio(e) {
      if (e.detail.value) {
        this.tagParams.show_coupon_goods = 1;
      } else {
        this.tagParams.show_coupon_goods = 0;
      }
    },
    // 重置筛选
    onReset() {
      this.tagParams.price_from = "";
      this.tagParams.price_to = "";
      this.tagParams.show_coupon_goods = 0;
    },
    // 确认筛选
    onOonfirm() {
      this.tagParams.price_from = this.tagParams.price_from
        ? parseFloat(this.tagParams.price_from)
        : "";
      this.tagParams.price_to = this.tagParams.price_to
        ? parseFloat(this.tagParams.price_to)
        : "";
      this.show = false;
      this.$emit("change", this.tagParams);
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
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
