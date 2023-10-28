<template>
  <lk-cell :clickable="clickable" :is-link="isLink" center @click="click">
    <view slot="icon" class="img">
      <image :src="image" v-if="image" />
    </view>
    <view slot="title" class="title">
      {{ title }}
    </view>
    <view slot="label" class="label">
      <view class="label-name">{{ labels }}</view>
      <lk-icon
        v-if="showLabel"
        square
        :name="labelClass"
        @click="isShow = !isShow"
      />
    </view>
    <view slot="rightIcon">
      <slot name="rightIcon" />
    </view>
  </lk-cell>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  props: {
    title: String,
    image: String,
    label: String,
    labelText: String,
    clickable: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    labelClass() {
      return this.isShow ? "eye-o" : "closed-eye";
    },
    labels() {
      return this.isShow ? this.labelText : this.label;
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.label {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;
  color: $text-gray;
  .label-name {
    max-width: 85%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
