<template>
  <view class="choice-address">
    <view class="address-tab">
      <lk-cell center is-link @click="show = true">
        <lk-icon
          slot="icon"
          :name="tabInfo.icon"
          square
          size="24"
          color="#9eabbd"
        />
        <view class="info">
          <view class="head">
            <view class="title">{{ tabInfo.title }}</view>
            <view class="value">{{ tabInfo.value }}</view>
          </view>
          <view class="label">{{ tabInfo.label }}</view>
        </view>
      </lk-cell>
    </view>
    <lk-popup-store
      v-model="show"
      :store_id="store_id"
      :list="list"
      @select="select"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      store_id: 0
    };
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tabInfo() {
      const info = this.info;
      this.store_id = info.store_id || 0;
      return {
        icon: info.store_id ? "location-o" : "add-o",
        title: info.store_id ? info.store_name : "添加门店",
        value: info.store_id ? info.store_tel : "",
        label: info.store_id
          ? `${info.province_name}${info.city_name}${info.dictrict_name}${info.address}`
          : ""
      };
    }
  },
  methods: {
    onAddress() {},
    select(item) {
      this.$emit("select", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.choice-address {
  .address-tab {
    position: relative;
    padding-bottom: 4rpx;
    .info {
      display: flex;
      flex-flow: column;
      .head {
        display: flex;
        justify-content: space-between;
      }
      .value {
        font-size: $font-size-sm;
        color: $text-light;
      }
      .label {
        font-size: $font-size-sm;
        color: $text-light;
        line-height: 36rpx;
      }
    }
  }

  .address-tab::before {
    content: "";
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4rpx;
    position: absolute;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 160rpx;
  }

  .items {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
    padding-bottom: 160rpx;
  }
}
</style>
