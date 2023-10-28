<template>
  <view :class="items.id">
    <view class="card-group-box" v-if="isShow">
      <lk-button bing-mobile block :custom-style="cellStyle">
        <view class="cell-btn">
          <view class="icon">
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-bind-phone"
              size="32"
              :color="theme.color"
            />
          </view>
          <view class="content">
            <view :style="titleStyle" class="title">
              {{ items.params.title }}
            </view>
            <view :style="labelStyle" class="label">
              {{ items.params.desc }}
            </view>
          </view>
          <view class="right-icon">
            <lk-icon name="arrow" color="#909399" />
          </view>
        </view>
      </lk-button>
    </view>
  </view>
</template>

<script>
import reform from '../../mixin/reform';
import { formatStyle } from '@/common/utils/stringify';
import { pxTorpx } from '@/common/utils';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    ...mapGetters(['isShowBindMobile']),
    isShow() {
      return this.isShowBindMobile;
    },
    cellStyle() {
      return {
        background: this.items.style.background,
        height: 'auto',
      };
    },
    titleStyle() {
      return formatStyle({ color: this.items.style.titlecolor });
    },
    labelStyle() {
      return formatStyle({ color: this.items.style.desccolor });
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.cell-btn {
  display: flex;
  padding: 20rpx 0;
  align-items: center;
  .icon {
    flex: none;
  }
  .right-icon {
    flex: none;
    width: 32rpx;
    margin-left: 12rpx;
  }
  .content {
    flex: 1;
    min-width: 550rpx;
    display: flex;
    flex-flow: column;
    line-height: 48rpx;
    align-items: flex-start;
    text-align: left;
    .label {
      margin-top: 6rpx;
      color: $text-light;
      font-size: $font-size-sm;
      line-height: 36rpx;
    }
  }
}
</style>
