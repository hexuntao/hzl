<template>
  <view :class="items.id">
    <view class="promote-group" :style="styles" v-if="isShow">
      <assemble-group
        v-if="items.params.promoteType == 'group'"
        :info="items.params"
        :title-color="items.style.titlecolor"
        @confirm="groupConfirm"
        @callback="initData"
      />
      <presell-group
        v-if="items.params.promoteType == 'presell'"
        :info="items.params"
        :goods-info="items.goodsInfo"
        :title-color="items.style.titlecolor"
      />
      <!-- #ifdef H5 -->
      <component
        v-for="(item, index) in items.data"
        :key="index"
        :is="item.key + '-group'"
        :items="item"
        :title-color="items.style.titlecolor"
      />
      <!--  #endif -->
      <!-- #ifndef H5 -->
      <block v-for="(item, index) in items.data" :key="index">
        <rebate-group
          v-if="item.key === 'rebate'"
          :items="item"
          :title-color="items.style.titlecolor"
        />
        <fullcut-group
          v-if="item.key === 'fullcut'"
          :items="item"
          :title-color="items.style.titlecolor"
        />
        <coupon-group
          v-if="item.key === 'coupon'"
          :items="item"
          :title-color="items.style.titlecolor"
        />
      </block>
      <!--  #endif -->
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, isEmpty } from "@/common/utils";
import rebateGroup from "./rebate-group";
import fullcutGroup from "./fullcut-group";
import couponGroup from "./coupon-group";
import presellGroup from "./presell-group";
import assembleGroup from "./assemble-group";
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    isShow() {
      let show = true;
      let arr = [];
      // 非活动情况下，判断是否有数据，促销优惠返利等信息都没数据情况下，不显示该组件
      if (!this.items.params.promoteType) {
        for (const key in this.items.data) {
          arr.push(this.items.data[key].show);
        }
        show = !arr.every(e => !e);
      }
      return show;
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    }
  },
  methods: {
    groupConfirm(data) {
      this.$emit("event", "group", data);
    },
    initData() {
      this.$emit("event", "initData");
    }
  },
  components: {
    rebateGroup,
    fullcutGroup,
    couponGroup,
    presellGroup,
    assembleGroup
  }
};
</script>

<style scoped lang="scss">
.promote-group {
}
</style>
