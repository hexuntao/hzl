<template>
  <lk-popup v-model="show" position="bottom" round closeable>
    <view class="sku">
      <slot
        name="skuHeader"
        :selected-sku="selectedSku"
        :selected-sku-comb="selectedSkuComb"
      >
        <sku-header
          :selected-sku="selectedSku"
          :sku="sku"
          :info="activeInfo"
          :quota="quota"
          :quota-used="quotaUsed"
          :sku-stock-num="stock"
          :hide-stock="hideStock"
          :hide-quota-text="hideQuotaText"
          :custom-stepper-config="customStepperConfig"
          :action="action"
          :spec-text="activeInfo.specText"
        >
          <view class="sku__goods-price">
            <view
              class="first-letter"
              v-if="action === 'group' || action === 'luckyspell'"
            >
              {{ activeInfo.groupGoodsPriceText }}
            </view>
            <block v-else-if="promoteType == 'presell'">
              <view class="sku__goods-flex">
                <view class="promote-text">{{
                  activeInfo.frontMoneyText
                }}</view>
                <view class="first-letter">
                  {{ activeInfo.frontMoneyPrice }}
                </view>
              </view>
              <view class="sku__goods-flex">
                <view class="promote-text">{{ activeInfo.allMoneyText }}</view>
                <view class="first-letter">
                  {{ activeInfo.allMoneyPrice }}
                </view>
              </view>
            </block>
            <view :class="activeInfo.firstLetterClass" v-else>
              {{ activeInfo.goodsPriceText }}
			  <text v-if="activeInfo.ptmoney!=0 && activeInfo.ptmoney!=null">
				  +{{ activeInfo.ptmoney }}积分
			  </text>
			  
			  
            </view>
          </view>
        </sku-header>
      </slot>
      <view class="sku-body">
        <slot name="skuBodyTop" :selected-sku="selectedSku" />
        <view v-if="hasSku" :class="skuGroupClass">
          <sku-row
            v-for="(skuTreeItem, i) in skuTree"
            :key="i"
            :sku-row="skuTreeItem"
          >
            <sku-row-item
              v-for="(skuValue, v) in skuTreeItem.v"
              :key="v"
              :sku-key-str="skuTreeItem.k_s"
              :sku-value="skuValue"
              :selected-sku="selectedSku"
              :sku-list="sku.list"
              @sku-select="onSelect"
            />
          </sku-row>
        </view>
        <slot
          name="skuStepper"
          :selected-sku="selectedSku"
          :selected-sku-comb="selectedSkuComb"
          :selected-num="selectedNum"
        >
          <sku-stepper
            ref="skuStepper"
            :info="activeInfo"
            :quota="quota"
            :hide-stock="hideStock"
            :quota-used="quotaUsed"
            :least-num="least"
            :selected-num="selectedNum"
            :stepper-title="stepperTitle"
            :sku-stock-num="stock"
            :hide-quota-text="hideQuotaText"
            :selected-sku-comb="selectedSkuComb"
            :disable-stepper-input="disableStepperInput"
            :custom-stepper-config="customStepperConfig"
            :action="action"
            @num-change="onNumChange"
            @sku-over-limit="onOverLimit"
            @change="stepperChange"
          />
        </slot>
      </view>
      <slot name="skuForm">
        <form-group :items="formList" ref="formGroup" v-if="isForm" />
        <view style="height:110rpx" v-if="isForm"></view>
      </slot>
      <slot name="skuAction">
        <view class="sku-foot">
          <lk-sku-actions
            :info="activeInfo"
            :promote-type="promoteType"
            :promote-params="promoteParams"
            :action="action"
            @action="onAction"
          />
        </view>
      </slot>
    </view>
  </lk-popup>
</template>

<script>
import skuHeader from "./component/sku-header";
import skuRow from "./component/sku-row";
import skuRowItem from "./component/sku-row-item";
import skuStepper from "./component/sku-stepper";
import formGroup from "@/components/custom/form-group";
import {
  isAllSelected,
  isSkuChoosable,
  getSkuComb,
  getSelectedSkuValues
} from "./utils/skuHelper";
import { LIMIT_TYPE, UNSELECTED_SKU_VALUE_ID } from "./constants";
import { defaultGoodsData, defaultSkuInfo, defaultActiveInfo } from "./data";
import { isDef, yuan, isEmpty } from "@/common/utils";
import { formatClass } from "@/common/utils/stringify";
import mixinPriceText from "@/mixins/price-text";
import { mapState } from "vuex";

const { QUOTA_LIMIT } = LIMIT_TYPE;

//计算总库存
function countAllStock(list = []) {
  let stock = 0;
  list.forEach(e => {
    if (e.presell_num) {
      stock += parseInt(e.presell_num);
    } else {
      stock += parseInt(e.stock_num);
    }
  });
  return stock;
}
function countAllBargainStock(list = []) {
  let stock = 0;
  list.forEach(e => {
    if (e.presell_num) {
      stock += parseInt(e.presell_num);
    } else {
      stock += parseInt(e.bargain_stock_num);
    }
  });
  return stock;
}
/**
 * state 商品状态
 * 1  ==> 正常
 * -1 ==> 无库存
 * -2 ==> 无权限购买
 * -3 ==> 超出最大限购量
 * -4 ==> 积分不足
 * 0  ==> 下架
 */
function goodsState(goods, stock, maxBuy) {
  if (!goods.state) {
    return 0;
  }
  if (typeof goods.is_allow_buy === "boolean" && !goods.is_allow_buy) {
    return -2;
  }
  if (maxBuy === -1) {
    return -3;
  }
  if (goods.goods_type == 10 && goods.member_point < goods.point) {
    return -4;
  }
  if (!stock) {
    return -1;
  }
  return goods.state;
}

export default {
  data() {
    return {
      cname: "sku",
      selectedSku: {},
      selectedNum: 1,
      show: this.value
    };
  },
  props: {
    info: {
      type: [String, Object],
      default: defaultGoodsData
    },
    formList: {
      type: Array,
      default: () =>([])
    },
    promoteType: {
      type: String,
      default: "normal"
    },
    promoteParams: {
      type: Object,
      default: () => ({})
    },
    action: String,
    value: Boolean,
    // sku: Object,
    // goods: Object,
    // quota: Number,
    // cartText: String,
    // buyText: String,
    // quotaUsed: Number,
    // goodsId: [Number, String],
    hideStock: Boolean,
    hideQuotaText: Boolean,
    stepperTitle: String,
    customSkuValidator: Function,
    closeOnClickOverlay: Boolean,
    disableStepperInput: Boolean,
    resetStepperOnHide: Boolean,
    resetSelectedSkuOnHide: Boolean,
    /**
     * 初始sku数据
     * id  ==> 选中的skuid
     * num ==> 选中的数量
     */
    initialSku: {
      type: Object,
      default: () => ({})
    },
    showSoldoutSku: {
      type: Boolean,
      default: true
    },
    // showAddCartBtn: {
    //   type: Boolean,
    //   default: true
    // },
    // messageConfig: {
    //   type: Object,
    //   default: () => ({
    //     placeholderMap: {},
    //     uploadImg: () => Promise.resolve(),
    //     uploadMaxSize: 5
    //   })
    // },
    customStepperConfig: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
      if (!val) {
        const selectedSkuValues = getSelectedSkuValues(
          this.sku.tree,
          this.selectedSku
        );

        // this.$emit("sku-close", {
        //   selectedSkuValues,
        //   selectedNum: this.selectedNum,
        //   selectedSkuComb: this.selectedSkuComb
        // });

        this.$emit("close", this.action, this.activeInfo);
        // 砍价活动跟拼团活动隐藏时重置sku
        if (
          this.resetStepperOnHide ||
          this.promoteType == "bargain" ||
          this.promoteType == "group"
        ) {
          this.resetStepper();
        }

        if (
          this.resetSelectedSkuOnHide ||
          this.promoteType == "bargain" ||
          this.promoteType == "group"
        ) {
          this.resetSelectedSku(this.skuTree);
        }
      }
    },
    skuTree(val) {
      // this.resetSelectedSku(val);// 暂且取消skutree发生变化时重置选中sku
    }
  },
  mixins: [mixinPriceText],
  beforeDestroy() {
    this.show = false;
  },
  computed: {
    ...mapState({
      memberText: ({ member }) => member.texts
    }),
    skuGroupClass() {
      return formatClass([
        "sku-group-container",
        {
          "sku-group-container--hide-soldout": !this.showSoldoutSku
        }
      ]);
    },
    isSkuCombSelected() {
      return isAllSelected(this.sku.tree, this.selectedSku);
    },
    isSkuEmpty() {
      return Object.keys(this.sku).length === 0;
    },
    hasSku() {
      return !this.sku.none_sku;
    },
    selectedSkuComb() {
      // if (!this.hasSku) {
      //   return {
      //     id: this.sku.collection_id,
      //     price: parseFloat(this.sku.price),
      //     stock_num: this.sku.stock_num
      //   };
      // }
      if (!this.hasSku || this.isSkuCombSelected) {
        return getSkuComb(this.sku.list, this.selectedSku);
      }
      return null;
    },
    skuTree() {
      return this.sku.tree || [];
    },
    imageList() {
      const imageList = [this.activeInfo.picture];
      if (this.skuTree.length > 0) {
        const treeItem =
          this.skuTree.filter(item => item.k_s === "s1")[0] || {};
        if (!treeItem.v) {
          return;
        }
        treeItem.v.forEach(vItem => {
          const img = vItem.imgUrl || vItem.img_url;
          if (img) {
            imageList.push(img);
          }
        });
      }
      return imageList;
    },
    // 库存
    stock() {
      let num = this.activeInfo.stock || 0;
      //单个显示砍价sku时，取砍价库存
      if (this.action == "bargain") {
        num = this.activeInfo.bargainStock;
      }
      return num;
    },
    //限购
    quota() {
      let quota = this.activeInfo.maxBuy || 0;
      //单个显示拼团sku时，限购取拼团限购量
      if (this.action == "group") {
        quota = this.activeInfo.groupMaxBuy;
      }
      if (this.action == "bargain") {
        quota = this.activeInfo.bargainMaxBuy;
      }
      return quota;
    },
    //
    quotaUsed() {
      return this.activeInfo.quotaUsed || 0;
    },
    //起购
    least() {
      let least = this.activeInfo.minBuy || 1;
      if (this.promoteType == "group" && this.action == "group") {
        // 拼团活动 ,触发拼团sku弹窗，起购为拼团的起购量
        least = this.activeInfo.groupMinBuy;
      }
      if (this.promoteType == "bargain" && this.action == "bargain") {
        // 砍价活动，触发拼团砍价sku弹窗，起购数量为1
        least = 1;
      }
      return least || 1;
    },

    // sku数据
    sku() {
      if (!this.info) return defaultSkuInfo;
      const info = JSON.parse(JSON.stringify(this.info));
      let sku = info.sku || {};
      sku.tree = sku.tree || [];
      sku.list = sku.list || [];
      sku.price = info.min_price;
      sku.market_price = info.min_market_price;
      if (this.promoteType == "group" || this.promoteType == "luckyspell") {
        //拼团商品价格及限购
        sku.group_price = sku.list.length > 0 ? sku.list[0].group_price : 0;
        sku.group_limit_buy =
          sku.list.length > 0 ? sku.list[0].group_limit_buy : 0;
      }
      sku.stock_num = countAllStock(sku.list);
      sku.bargain_stock_num = countAllBargainStock(sku.list);
      sku.min_buy = info.min_buy || 0;
      sku.max_buy = info.max_buy || 0;
      sku.collection_id = !sku.tree.length ? sku.list[0].id : 0;
      sku.none_sku = !sku.tree.length;
      sku.hide_stock = false;
      sku.stock =
        this.action == "bargain" ? sku.bargain_stock_num : sku.stock_num;
      sku.list.forEach(e => {
        e.stock = this.action == "bargain" ? e.bargain_stock_num : e.stock_num;
      });
      // console.log("sku", sku);
      return sku;
    },

    // 初始sku
    initialSkuInfo() {
      let init = {};
      if (this.initialSku) {
        this.sku.list.forEach(e => {
          if (this.initialSku.id == e.id) {
            e.s &&
              e.s.forEach((s, i) => {
                for (let k in e) {
                  if (e[k] == s) {
                    init[k] = Number(s);
                  }
                }
              });
          }
        });
        init.selectedNum = this.initialSku.num || this.least;
      }
      return init;
    },

    // 当前商品包括sku信息
    activeInfo() {
      if (!this.info) return defaultActiveInfo;
      let selectedSkuComb = this.selectedSkuComb;
      let selectedNum = this.selectedNum;
      const info = Object.assign({}, this.info);
      let goods = {};
      goods.is_can_bei_zhihuan = info.is_can_bei_zhihuan;
      goods.id = info.goods_id;
      goods.title = info.goods_name;
      goods.subTitle = info.sub_title;
      goods.shopId = info.shop_id;
      goods.shopName = info.shop_name;
      goods.picture = info.goods_image;
      goods.posterPrice = info.poster_price || 0;
      goods.goodsType = info.goods_type;
      goods.point = info.point;

      goods.ptmoney = info.ptmoney;
      console.log('aabb11223344aabb');
      console.log(info);

      goods.promoteType = this.promoteType;
      goods.selectedNum = selectedNum;
      goods.selectedSkuComb = selectedSkuComb;
      goods.isCollect = info.is_collection;
      goods.isHasSku = this.hasSku;
      goods.stock = this.currentSkuStock(selectedSkuComb);
      goods.noEditNum = info.goods_type == 4 || info.goods_type == 6; //知识付费，预约商品不显示 步进器 ，默认购买数为1件

      if (goods.isHasSku) {
        goods.specText = selectedSkuComb
          ? selectedSkuComb.sku_name
          : "请选择规格";
      } else {
        goods.specText = "已选：" + selectedNum + "件";
      }
      goods.minBuy = goods.noEditNum
        ? 1
        : this.currentSkuMinBuy(selectedSkuComb);
      goods.maxBuy = goods.noEditNum
        ? 1
        : this.currentSkuMaxBuy(selectedSkuComb);
      goods.goodsPrice = this.currentPrice(selectedSkuComb);
      goods.goodsPriceText = this.formatPriceText(
        goods.goodsPrice,
        goods.point
      );
      goods.firstLetterClass = this.firstLetterClass(
        goods.goodsPrice,
        goods.point
      );
      goods.marketPrice = this.currentMarketPrice(selectedSkuComb);
      if (this.promoteType == "group") {
        //拼团商品价格
        goods.groupGoodsPrice = this.currentGroupPrice(selectedSkuComb);
        goods.groupGoodsPriceText = yuan(goods.groupGoodsPrice);
        goods.groupMaxBuy = goods.noEditNum
          ? 1
          : this.currentGroupSkuMaxBuy(selectedSkuComb);
        goods.groupMinBuy = goods.noEditNum
          ? 1
          : this.currentGroupSkuMinBuy(selectedSkuComb);
      }
      if (this.promoteType == "luckyspell") {
        // 幸运拼团
        goods.groupGoodsPrice = this.currentGroupPrice(selectedSkuComb);
        goods.groupGoodsPriceText = yuan(goods.groupGoodsPrice);
        goods.noEditNum = true;
      }
      if (this.promoteType == "presell") {
        //预售定金和尾款
        goods.frontMoney = this.presellInfo(selectedSkuComb).frontMoney;
        goods.frontMoneyPrice = yuan(goods.frontMoney);
        goods.tailMoney = this.presellInfo(selectedSkuComb).tailMoney;
        goods.allMoney = this.presellInfo(selectedSkuComb).allMoney;
        goods.allMoneyPrice = yuan(goods.allMoney);
        goods.frontMoneyText = "定金：";
        goods.allMoneyText = "预售价：";
      }
      if (this.promoteType == "bargain") {
        goods.bargainMaxBuy = goods.noEditNum
          ? 1
          : this.currentBargainSkuMaxBuy(selectedSkuComb);
        goods.bargainStock = this.currentBargainStock(selectedSkuComb);
        goods.bargainGoodsState = goodsState(
          info,
          goods.bargainStock,
          goods.bargainMaxBuy
        );
        goods.bargainGoodsStateText = this.goodsStateText(
          goods.bargainGoodsState
        );
      }
      goods.goodsState = goodsState(info, goods.stock, goods.maxBuy);
      goods.goodsStateText = this.goodsStateText(goods.goodsState);
      if (info.goods_type == 4) {
        goods.isPaid = !!this.info.is_buy;
      }
      if (info.goods_type == 10) {
        goods.buyBtnText = "立即兑换";
      }
      if (info.goods_type == 6) {
        goods.buyBtnText = "立即预约";
      }
      this.$emit("get-active-info", goods);
      return goods;
    },
    isForm() {
      return !isEmpty(this.formList);
    }
  },
  created() {
    // const skuEventBus = this.$Events;
    // this.skuEventBus = skuEventBus;

    // skuEventBus.$on("sku:close", this.onClose);
    // skuEventBus.$on("sku:select", this.onSelect);
    // skuEventBus.$on("sku:numChange", this.onNumChange);
    // skuEventBus.$on("sku:previewImage", this.onPreviewImage);
    // skuEventBus.$on("sku:overLimit", this.onOverLimit);
    // skuEventBus.$on("sku:addCart", this.onAddCart);
    // skuEventBus.$on("sku:buy", this.onBuy);

    this.resetStepper();
    this.resetSelectedSku(this.skuTree);

    // 组件初始化后的钩子，抛出skuEventBus
    // this.$emit("after-sku-create", skuEventBus);
  },
  methods: {
    stepperChange(event) {
      this.$emit("stepper-change", event);
    },
    resetStepper() {
      const { skuStepper } = this.$refs;
      const { selectedNum } = this.initialSkuInfo;
      const num = isDef(selectedNum) ? selectedNum : 1;

      if (skuStepper && skuStepper.setCurrentNum) {
        skuStepper.setCurrentNum(num);
      } else {
        this.selectedNum = num;
      }
    },
    resetSelectedSku(skuTree) {
      this.selectedSku = {};
      // 重置 selectedSku
      skuTree.forEach(item => {
        this.selectedSku[item.k_s] =
          this.initialSkuInfo[item.k_s] || UNSELECTED_SKU_VALUE_ID;
      });
      // 只有一个 sku 规格值时默认选中
      skuTree.forEach(item => {
        const key = item.k_s;
        const valueId = item.v[0].id;
        if (
          item.v.length === 1 &&
          isSkuChoosable(this.sku.list, this.selectedSku, { key, valueId })
        ) {
          this.selectedSku[key] = valueId;
        }
      });
    },
    // getSkuMessages() {
    //   return this.$refs.skuMessages ? this.$refs.skuMessages.getMessages() : {};
    // },
    // getSkuCartMessages() {
    //   return this.$refs.skuMessages
    //     ? this.$refs.skuMessages.getCartMessages()
    //     : {};
    // },
    // validateSkuMessages() {
    //   return this.$refs.skuMessages
    //     ? this.$refs.skuMessages.validateMessages()
    //     : "";
    // },
    // onClose() {
    //   this.show = false;
    // },
    onSelect(skuValue) {
      // 点击已选中的sku时则取消选中
      this.selectedSku =
        this.selectedSku[skuValue.skuKeyStr] === skuValue.id
          ? {
              ...this.selectedSku,
              [skuValue.skuKeyStr]: UNSELECTED_SKU_VALUE_ID
            }
          : { ...this.selectedSku, [skuValue.skuKeyStr]: skuValue.id };
      this.$emit("sku-selected", {
        skuValue,
        selectedSku: this.selectedSku,
        selectedSkuComb: this.selectedSkuComb
      });
    },
    onPreviewImage(indexImage) {
      const index = this.imageList.findIndex(image => image === indexImage);
      const cbParams = {
        index,
        imageList: this.imageList,
        indexImage
      };
      this.$emit("preview-on", cbParams);
    },
    onOverLimit(data) {
      const { action, limitType, quota, quotaUsed, least } = data;
      const { handleOverLimit } = this.customStepperConfig;
      if (handleOverLimit) {
        handleOverLimit(data);
        return;
      }
      if (action === "minus") {
        this.$Prompt.toast(`起购${this.least}件`);
      } else if (action === "plus") {
        if (limitType === QUOTA_LIMIT) {
          let msg = `限购${quota}件`;
          if (quotaUsed > 0) msg += `，${`你已购买${quotaUsed}件`}`;
          this.$Prompt.toast(msg);
        } else {
          this.$Prompt.toast("库存不足");
        }
      }
    },
    validateSku() {
      if (this.selectedNum === 0) {
        return "商品已经无法购买啦";
      }
      // if (this.isSkuCombSelected) {
      //   return this.validateSkuMessages();
      // }
      // 自定义sku校验
      if (this.customSkuValidator) {
        const err = this.customSkuValidator(this);
        if (err) return err;
      }
      return "请先选择商品规格";
    },
    onAddCart() {
      this.onBuyOrAddCart("add-cart");
    },
    onBuy() {
      this.onBuyOrAddCart("buy-clicked");
    },
    onBuyOrAddCart(type) {
      const error = this.validateSku();
      if (error) {
        this.$Prompt.toast(error);
      } else {
        this.$emit(type, this.getSkuData());
      }
    },

    // 限制最大输入数量
    onNumChange(num) {
      num = num <= 0 ? 1 : num;
      let quota = this.activeInfo.maxBuy;
      let limitFlag = quota > 0; // 活动限购量 真为限购 否为不限购
      let stock = this.activeInfo.stock; // 库存量
      let _limit = quota > stock ? stock : quota; //限购量
      let limitNum = num > _limit ? _limit : num; //当前数量不能大于限购数
      let limitStockNum = num > stock ? stock : num; //普通数量不能大于库存
      this.selectedNum = limitFlag ? limitNum : limitStockNum;
    },
    //当前sku库存
    currentSkuStock(selectedSkuComb) {
      let stock = 0;
      stock = selectedSkuComb ? selectedSkuComb.stock_num : this.sku.stock_num;
      return parseInt(stock) || 0;
    },
    // 当前砍价sku库存
    currentBargainStock(selectedSkuComb) {
      let stock = 0;
      stock = selectedSkuComb
        ? selectedSkuComb.bargain_stock_num
        : this.sku.bargain_stock_num;
      return parseInt(stock) || 0;
    },
    //当前sku限购
    currentSkuMaxBuy(selectedSkuComb) {
      let num = 0;
      num = selectedSkuComb ? selectedSkuComb.max_buy : this.sku.max_buy;
      return parseInt(num) || 0;
    },
    //当前sku起购
    currentSkuMinBuy(selectedSkuComb) {
      let num = 0;
      num = selectedSkuComb ? selectedSkuComb.least_buy : this.sku.min_buy;
      return parseInt(num) || 0;
    },
    //当前拼团sku限购
    currentGroupSkuMaxBuy(selectedSkuComb) {
      let num = 0;
      num = selectedSkuComb
        ? selectedSkuComb.group_limit_buy
        : this.sku.group_limit_buy;
      return parseInt(num) || 0;
    },
    //当前拼团sku起购
    currentGroupSkuMinBuy(selectedSkuComb) {
      let num = 0;
      num = selectedSkuComb
        ? selectedSkuComb.group_least_buy
        : this.sku.group_least_buy;
      return parseInt(num) || 1;
    },
    //当前砍价sku限购
    currentBargainSkuMaxBuy(selectedSkuComb) {
      let num = 0;
      num = selectedSkuComb
        ? selectedSkuComb.bargain_max_buy
        : this.sku.bargain_max_buy;
      return parseInt(num) || 0;
    },
    // 商品售价
    currentPrice(selectedSkuComb) {
      let price = selectedSkuComb
        ? selectedSkuComb.price //sku的价格单位为分，所以需转换为单位元显示
        : this.sku.price;
      return price;
    },
    // 市场价格
    currentMarketPrice(selectedSkuComb) {
      let price = selectedSkuComb
        ? selectedSkuComb.market_price
        : this.sku.market_price;
      return price;
    },
    // 拼团商品价格
    currentGroupPrice(selectedSkuComb) {
      const roundFix = 2; //拼团价格不取整
      //无规格时默认取sku list 第一条price
      let groupPrice = parseFloat(
        selectedSkuComb
          ? selectedSkuComb.group_price || 0
          : this.sku.group_price || 0
      ).toFixed(roundFix);
      return groupPrice;
    },
    // 预售价格库存信息
    presellInfo(selectedSkuComb) {
      let defaultInfo = this.sku.list[0];
      let obj = {};
      if (selectedSkuComb) {
        obj.frontMoney = selectedSkuComb.first_money;
        obj.tailMoney =
          parseFloat(selectedSkuComb.all_money) -
          parseFloat(selectedSkuComb.first_money);
        obj.maxBuy = selectedSkuComb.max_buy;
        obj.stock = selectedSkuComb.presell_num;
        obj.allMoney = selectedSkuComb.all_money;
      } else {
        //无规格时默认取sku list 第一条price
        obj.frontMoney = defaultInfo.first_money;
        obj.tailMoney =
          parseFloat(defaultInfo.all_money) -
          parseFloat(defaultInfo.first_money);
        obj.maxBuy = defaultInfo.max_buy;
        obj.stock = defaultInfo.presell_num;
        obj.allMoney = defaultInfo.all_money;
      }
      // console.log(obj)
      return obj;
    },
    // 商品状态名称
    goodsStateText(state) {
      let text = "";
      if (state == 0) {
        text = "商品已下架";
      } else if (state == -2) {
        text = "无购买权限";
      } else if (state == -3) {
        text = "已超出最大限购量";
      } else if (state == -1) {
        text = "商品已售罄";
      } else if (state == -4) {
        text = this.memberText.point_style + "不足";
      }
      return text;
    },
    onAction(action, data) {
      /**
       * action 触发方法名称汇总
       * data   返回当前sku数据（活动商品会携带相关活动参数）
       *
       * addCard  =>  加入购物车
       * buy      =>  立即购买
       * bargain  =>  砍价
       * group    =>  发起拼团
       * presell  =>  预售
       * seckill  =>  秒杀
       * seckill  =>  秒杀
       */
      if (this.isForm) {
        let form_data = this.$refs["formGroup"]
          ? this.$refs["formGroup"].getFormData()
          : "";
        if (!form_data) return false;
        data.form_data = JSON.stringify(form_data);
      }
      this.$emit("action", action, data);
    }
  },
  components: {
    skuHeader,
    skuRow,
    skuRowItem,
    skuStepper,
    formGroup
  }
};
</script>

<style scoped lang="scss">
.sku {
  font-size: $font-size;
  background: $white;
  overflow-y: visible;
  padding-bottom: 120rpx;
  height: calc(70vh + 88rpx);
  position: relative;
  .sku-foot {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 10rpx;
    z-index: 1;
  }
  &-container {
  }
  .sku-body {
  }
  .sku-group-container {
    margin-left: 30rpx;
    padding: 24rpx 0 4rpx;
    max-height: 600rpx;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  .sku__goods-price {
    color: $red;
    font-size: $font-size-lg;
    font-weight: 800;
  }
  .promote-text {
    font-size: $font-size-sm;
    font-weight: 400;
  }
  .sku__goods-flex {
    display: flex;
    flex-flow: row;
    align-items: flex-end;
  }
}
</style>
