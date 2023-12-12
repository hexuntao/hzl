<template>
  <view class="condition-box">
    <view class="card-group-box">
      <lk-cell :icon="iconImg" :value="title">
        <image :src="rightIconImg" slot="rightIcon" class="right-icon" />
      </lk-cell>
      <view class="cell">
        <view class="item" v-for="(item, index) in items" :key="index">
          <view>
            {{ item.index }}
            {{ item.text }}
            <text v-if="item.money" class="price-color">
              {{ item.money }}
            </text>
            <text v-if="item.unit">
              {{ item.unit }}
            </text>
            <!-- <text
            v-if="item.linkText"
            class="text-link"
            @click="toLink(item.link)"
          >
            {{ item.linkText }}
          </text> -->
          </view>
          <view v-if="item.linkText">
            <lk-button theme-color plain round size="mini" :to="item.link">{{
              item.linkText
            }}</lk-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    title: String,
    items: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapGetters(["static"]),
    iconImg() {
      return this.static.baseImgPath + "xingxing-icon.png";
    },
    rightIconImg() {
      return this.static.baseImgPath + "weidabiao.png";
    }
  },
  methods: {
    toLink(link) {
      this.$Navigate.push(link);
    }
  }
};
</script>

<style lang="scss" scoped>
.condition-box {
  position: relative;
  overflow: hidden;
}
.cell {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 40rpx;
  .item {
    padding: 10rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.right-icon {
  width: 88rpx;
  height: 88rpx;
  display: block;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
