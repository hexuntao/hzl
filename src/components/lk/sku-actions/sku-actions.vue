<template>
  <view class="sku-btn-actions">
    <!-- #ifdef H5 -->
    <component
      :is="promoteComponentName"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <!--  #endif -->
    <!-- #ifndef H5 -->
    <action-btn-normal
      v-if="promoteComponentName === 'action-btn-normal'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-presell
      v-if="promoteComponentName === 'action-btn-presell'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-seckill
      v-if="promoteComponentName === 'action-btn-seckill'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-group
      v-if="promoteComponentName === 'action-btn-group'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-bargain
      v-if="promoteComponentName === 'action-btn-bargain'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-limit
      v-if="promoteComponentName === 'action-btn-limit'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-disabled
      v-if="promoteComponentName === 'action-btn-disabled'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-study
      v-if="promoteComponentName === 'action-btn-study'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-luckyspell
      v-if="promoteComponentName === 'action-btn-luckyspell'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <!--  #endif -->
  </view>
</template>

<script>
import actionBtnNormal from "./action-btn-normal";
import actionBtnPresell from "./action-btn-presell";
import actionBtnSeckill from "./action-btn-seckill";
import actionBtnGroup from "./action-btn-group";
import actionBtnBargain from "./action-btn-bargain";
import actionBtnLimit from "./action-btn-limit";
import actionBtnDisabled from "./action-btn-disabled";
import actionBtnStudy from "./action-btn-study";
import actionBtnLuckyspell from "./action-btn-luckyspell";
export default {
  data() {
    return {};
  },
  props: {
    /**
     * 活动类型
     * normal    =>    普通商品类型(默认)
     * seckill   =>    秒杀商品类型
     * group     =>    拼团商品类型
     * presell   =>    预售商品类型
     * bargain   =>    砍价商品类型
     * limit     =>    限时商品类型
     * luckyspell     =>    幸运拼团
     */
    promoteType: {
      type: String,
      default: "normal"
    },
    // 活动相关参数
    promoteParams: Object,
    // 商品基本信息
    info: Object,
    /**
     * 单个行动按钮(为空则默认)
     * 传入指定类型，如  addCart/buy/group...
     * 只显示单个确定按钮
     */
    action: String,
    /**
     * 直接点击按钮,不验证规格
     */
    directClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    promoteComponentName() {
      let name = this.promoteType;
      if (
        name != "bargain" &&
        this.info.goodsState != 1 &&
        this.info.goodsStateText
      ) {
        name = "disabled";
      }
      if (this.info.isPaid) {
        name = "study";
      }
      return "action-btn-" + name;
    }
  },
  methods: {
    click(action, params = {}) {
      let info = Object.assign({ ...params }, this.info);
      if (!this.directClick && !info.selectedSkuComb) {
        return this.$Prompt.toast("请先选择规格");
      }
      this.$emit("action", action, info);
    }
  },
  components: {
    actionBtnNormal,
    actionBtnPresell,
    actionBtnSeckill,
    actionBtnGroup,
    actionBtnBargain,
    actionBtnLimit,
    actionBtnDisabled,
    actionBtnStudy,
    actionBtnLuckyspell
  }
};
</script>

<style scoped lang="scss">
.sku-btn-actions {
  width: 100%;
  flex: 1;
}
</style>
