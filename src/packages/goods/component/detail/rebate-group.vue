<template>
  <view class="rebate-group" v-if="isShow">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ items.text }}
      </view>
      <view class="value">
        <text
          class="tag"
          :style="tagStyles"
          v-for="(value, t) in cellValue"
          :key="t"
        >
          {{ value }}
        </text>
      </view>
    </lk-cell>
    <lk-popup v-model="show" position="bottom" round closeable title="商品返利">
      <view>
        <lk-cell class="item" v-for="(item, index) in list" :key="index">
          <view class="title">{{ item.title }}</view>
          <view class="name">
            <view v-for="(text, index) in item.value" :key="index">
              {{ text }}
            </view>
          </view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { formatStyle, formatClass } from '@/common/utils/stringify';
export default {
  data() {
    return {
      show: false,
    };
  },
  props: {
    titleColor: {
      type: String,
      default: '#606266',
    },
    items: [Object, Array],
  },
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
      distributeTexts: ({ distribute }) => distribute.texts,
    }),
    isShow() {
      this.items.show = !!this.list.length;
      return !!this.list.length;
    },
    cellValue() {
      return this.list.map(({ name }) => name);
    },
    list() {
      const data = this.items.data || {};
      let arr = [];
      const { commission } = this.distributeTexts;
      const { point_style } = this.memberTexts;
      let commission1 = parseFloat(data.commission1) || 0;
      let commission2 = parseFloat(data.commission2) || 0;
      let commission3 = parseFloat(data.commission3) || 0;
      let commission_point1 = parseFloat(data.commission_point1) || 0;
      let commission_point2 = parseFloat(data.commission_point2) || 0;
      let commission_point3 = parseFloat(data.commission_point3) || 0;
      let is_point = parseFloat(data.is_point) || 0;
      let point = parseFloat(data.point) || 0;
      if (commission1 || commission2 || commission3) {
        let obj = {};
        obj.title = '购物返佣';
        obj.name = '返' + commission;
        obj.value = [];
        if (commission1) {
          let text = '一级购物可得约 ' + commission1 + ' ' + commission;
          if (commission_point1) {
            text += ' + ' + commission_point1 + ' ' + point_style;
          }
          obj.value.push(text);
        }
        if (commission2) {
          let text = '二级购物可得约 ' + commission2 + ' ' + commission;
          if (commission_point2) {
            text += ' +' + commission_point2 + ' ' + point_style;
          }
          obj.value.push(text);
        }
        if (commission3) {
          let text = '三级级购物可得约 ' + commission3 + ' ' + commission;
          if (commission_point3) {
            text += ' + ' + commission_point3 + ' ' + point_style;
          }
          obj.value.push(text);
        }
        arr.push(obj);
      }
      if (is_point && point) {
        let obj = {};
        obj.title = '购物返利';
        obj.value = ['购买该商品可得约 ' + point + point_style];
        obj.name = '返' + point_style;
        arr.push(obj);
      }
      return arr;
    },
    tagStyles() {
      return formatStyle({
        color: this.theme.color,
        backgroundColor: this.theme.opacity,
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.rebate-group {
  //display: flex;
  display: none;
  .title {
    width: 100rpx;
    color: $text-gray;
  }

  .value {
    display: flex;
    align-items: center;
    height: 48rpx;
  }

  .value .tag {
    white-space: nowrap;
    margin-right: 10rpx;
    font-size: $font-size-sm;
    display: flex;
    align-items: center;
    line-height: normal;
    overflow: hidden;
    border-radius: 0.8em;
    padding: 0.1em 0.6em;
    color: $red;
    background-color: #fae9e6;
  }

  .item .title {
    width: auto;
    font-size: $font-size;
    color: $red;
  }

  .item .name {
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }
}
</style>
