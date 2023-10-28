<template>
  <view class="tool-group">
    <view
      class="mode-box card-group-box"
      :style="active == 'mode' ? 'display:flex' : 'display:none'"
    >
      <text
        @click="selectMode('SD')"
        :class="params.mode == 'SD' ? 'active' : ''"
      >
        标清
      </text>
      <text
        @click="selectMode('HD')"
        :class="params.mode == 'HD' ? 'active' : ''"
      >
        高清
      </text>
      <text
        @click="selectMode('FHD')"
        :class="params.mode == 'FHD' ? 'active' : ''"
      >
        超清
      </text>
    </view>
    <view
      class="slider-box card-group-box"
      :style="show ? 'display:flex' : 'display:none'"
    >
      <view class="text">{{ sliderInfo.text }}</view>
      <slider
        class="slider"
        :value="sliderInfo.value"
        :block-size="20"
        :max="9"
        :active-color="theme.color"
        @change="sliderChange"
      />
      <view class="text">{{ sliderInfo.value }}</view>
    </view>
    <view class="tool-box card-group-box">
      <lk-grid-panel
        title="直播工具"
        cols="4"
        icon-prefix="v-icon"
        icon-size="22"
        :items="items"
        @item-click="onToolClick"
      />
    </view>
  </view>
</template>

<script>
// 默认工具参数
const defOption = {
  mode: "SD", //视频模式 SD（标清）, HD（高清）, FHD（超清）
  beauty: 5, //美颜
  whiteness: 5, //美白
  devicePosition: "front", //前置front或后置back
  enableMic: true //麦克风
};
export default {
  data() {
    return {
      active: "",
      index: 0,
      show: false
    };
  },
  props: {
    value: {
      type: Object,
      default: () => ({ ...defOption })
    }
  },
  computed: {
    params: {
      get() {
        return this.value;
      },
      set(e) {
        console.log(e);
      }
    },
    items() {
      let params = this.params;
      let arr = [
        {
          icon: "v-icon-flip",
          action: "devicePosition",
          title: "切换镜头"
        },
        {
          icon: "v-icon-stick",
          action: "beauty",
          slider: true,
          title: "美颜"
        },
        {
          icon: "v-icon-girl",
          action: "whiteness",
          slider: true,
          title: "美白"
        },
        {
          icon: "v-icon-yuan-02",
          action: "mode",
          title: "清晰度"
        },
        {
          icon: params.enableMic ? "v-icon-wheat" : "v-icon-no-wheat",
          action: "enableMic",
          title: "静音"
        }
      ];

      return arr;
    },
    sliderInfo() {
      const item = this.items[this.index];
      let value =
        this.show && this.params[this.active] ? this.params[this.active] : 0;
      return {
        text: item.title,
        value: value
      };
    }
  },
  methods: {
    sliderChange({ detail }) {
      const { value } = detail;
      this.params[this.active] = value;
      this.onChange();
    },
    selectMode(mode) {
      this.params.mode = mode;
      this.onChange();
    },
    onToolClick(e, index) {
      const item = this.items[index];
      this.index = index;
      this.active = item.action;
      this.show = !!e.slider;
      if (item.action == "devicePosition") {
        this.params.devicePosition =
          this.params.devicePosition == "front" ? "back" : "front";
        this.onChange();
      }
      if (item.action == "enableMic") {
        this.params.enableMic = !this.params.enableMic;
        this.onChange();
      }
    },
    onChange() {
      this.$emit("input", this.params);
      this.$emit("change", this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
.tool-box {
  position: relative;
  background: #ffffff;
  z-index: 1;
}
.slider-box {
  padding: $cell-padding;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 116rpx;
  .slider {
    flex: 1;
  }
  .text {
    flex: none;
    width: 80rpx;
    text-align: center;
    white-space: nowrap;
  }
}
.mode-box {
  padding: $cell-padding;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 116rpx;
  display: flex;
  justify-content: space-between;
  .active {
    color: $red;
    font-weight: 800;
  }
}
</style>
