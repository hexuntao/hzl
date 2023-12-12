<template>
  <page-meta
    :background-color="pageStyle.background"
    :page-style="'background:' + pageStyle.background"
  >
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <share-poster :info="goodsInfo" ref="share-poster" />
    <view class="reform-view">
      <goods-reform-group :show="show" :items="items" @event="onEvent" />
    </view>
	<floater-fixed
	  :items="floaterItems"
	  :key="floaterItems.timestamp"
	  v-if="floaterItems.id"
	/>
	<!-- #ifdef MP-WEIXIN -->
	<lk-floater-kefu />
	<!--  #endif -->
    <lk-sku
      v-if="hackReset"
      v-model="showSku"
      :info="goodsData"
      :action="skuAction"
      :promote-type="promoteType"
      :promote-params="promoteParams"
      :form-list="formList"
      @get-active-info="onGoodsInfo"
      @action="onSkuAction"
      @close="onSkuClose"
    />
    <goods-action-bar
      v-if="show"
      :goods-info="goodsInfo"
      :promote-type="promoteType"
      :promote-params="promoteParams"
      @action="onShowSku"
    />
    <!-- #ifndef H5 -->
    <lk-barrage></lk-barrage>
    <!--  #endif -->
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import goodsReformGroup from "./component/detail/goods-reform-group";
import goodsActionBar from "./component/detail/goods-action-bar";
import sharePoster from "./component/detail/share-poster";
import floaterFixed from "@/components/custom/reform/floater";
import reformLoad from "@/mixins/reform-load";
import { goodsCustomData } from "./data";
import {
  GET_GOODSDETAIL,
  ADD_CART,
  GET_GOODSINFO,
  GET_GOODSMOREINFO,
  SET_GOODSFORMDATA,
  SET_RECOMMENDGOODS
} from "@/common/interface/goods";
import { yuan, isEmpty } from "@/common/utils";

let addCartFlag = true; // 防止重复点击添加多次购物车
let goodsFormFlag = true; // 防止重复点击提交表单

export default {
  name: "packages-goods-detail",
  data() {
    return {
      items: {}, //装修数据
      pageStyle: {
        background: "",
        title: ""
      },
      hackReset: true,
      params: {},
      show: false,
      /**
       * 活动类型
       * normal    =>    普通商品类型(默认)
       * seckill   =>    秒杀商品类型
       * group     =>    拼团商品类型
       * presell   =>    预售商品类型
       * bargain   =>    砍价商品类型
       * limit     =>    限时商品类型
       */
      promoteType: "normal",
      promoteParams: {},
      goodsData: null,
      showSku: false,
      formList: [],
      info: {},
      skuAction: "", //sku触发行动类型，指触发哪个活动类型
      goodsInfo: {},
      current_record_id: "", //用户选中参加的团id
      deliveryInfo: {
        type: "express"
      }
    };
  },
  mixins: [reformLoad],
  watch: {},
  computed: {
    ...mapState({
      uid: ({ member }) => member.info.uid,
      mallInfo: ({ config }) => config.mallInfo,
      memberText: ({ member }) => member.texts,
      distributeText: ({ distribute }) => distribute.texts
    })
  },
  onShow() {
    uni.$once("clearDetailForm", res => {
      this.formList.map(item => {
        item.value = "";
        return item;
      });
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
    });
  },
  methods: {
    ...mapActions(["getCustom", "getCartList", "getMoreInfo"]),
    callLoad(query) {
      const { goods_id, record_id, channel_id, anchor_id } = query;
      let params = {
        goods_id: goods_id
      };
      if (record_id) {
        params.record_id = record_id;
      }
      if (channel_id) {
        params.channel_id = channel_id;
      }
      if (anchor_id) {
        params.anchor_id = anchor_id;
      }
      this.params = params;
      this.loadData();
    },
    loadData() {
      GET_GOODSDETAIL(this.params)
        .then(({ data }) => {
           if (data.is_allow_browse === false) {
            return this.$Prompt
              .modal({
                title: "提示",
                content: "您自身等级无权限浏览该商品",
                showCancel: false
              })
              .then(() => {
                this.$Navigate.back();
              });
          } 
		  
          this.goodsData = this.packageGoodsData(data);
          this.promoteType = this.packagePromoteData(data).type;
          this.promoteParams = this.packagePromoteData(data).info;
          this.pageStyle.title = String(data.goods_detail.goods_name || "");
          this.formList = data.goods_form_data ? data.goods_form_data : [];
          this.setWxShare({
            title: String(data.goods_detail.goods_name || ""),
            imgUrl: data.goods_detail.goods_image_yun,
            desc: `我刚刚在${this.mallInfo.name}发现了一个很不错的商品，赶快来看看吧。`
          });

          this.getCustom({
            type: 3,
            shop_id: data.goods_detail.shop_id
          })
            .then(({ items, page }) => {
              this.show = true;
              const customData = this.initCustomData(items);
              this.items = items; //装修数据
              const newItems = this.packageItemsData(customData, data);

              this.initLoadItems(newItems);
              this.pageStyle.background = page.background;

              this.getMoreInfo({
                goods_id: this.params.goods_id,
                block_price: data.block_price
              }).then(res => {
                if (res.data) {
                  data["blockchainPrice"] = res.data.blockchainPrice;

                  data["coupon_type_list"] = res.data.coupon_type_list
                    ? res.data.coupon_type_list
                    : [];
                  const customData = this.initCustomData(this.items);
                  const newItems = this.packageItemsData(customData, data);
                  this.initLoadItems(newItems);
                }
              });
              this.onRecommendGoods();
            })
            .catch(() => {});
        })

        .catch(() => {});
    },
    // 设置上架商品
    onRecommendGoods() {
      SET_RECOMMENDGOODS({ goods_id: this.params.goods_id }).then(data => {});
    },
    /**
     * 监听组件所触发回调方法
     * event  事件类型
     * data  事件携带参数数据
     */
    onEvent(event, data) {
      if (event === "specs") {
        this.skuAction = "";
        this.showSku = true;
      } else if (event === "group") {
        // 获取参加指定团 团id
        this.current_record_id = data;
        this.skuAction = "group";
        this.showSku = true;
      } else if (event === "delivery") {
        // if (this.deliveryInfo.type != data.type || data.type == "pickup") {
        //   this.getStoreGoodsDetail(data.type == "pickup" && data.id);
        // }
        // this.deliveryInfo = data;
      } else if (event === "initData") {
        // 初始数据
        this.loadData();
      } else if (event == "share") {
        // 生成分享海报
        this.$refs["share-poster"].buildPoster();
      }
    },
    // 兼容旧数据
    initCustomData(templateItems = {}) {
      let newItems = {};
      const arr = [
        "detail_fixed",
        "detail_promote",
        "detail_delivery",
        "detail_service"
      ]; //旧数据组件
      let service = {}; // 获取服务信息的装修旧数据
      for (let tkey in templateItems) {
        if (templateItems[tkey].id === "detail_service") {
          service =
            templateItems[tkey].data && !isEmpty(templateItems[tkey].data)
              ? templateItems[tkey].data
              : {};
        }
      }
      for (let key in templateItems) {
        const item = Object.assign({}, { ...templateItems[key] });
        if (arr.indexOf(item.id) != -1) {
          delete templateItems[key];
          if (item.id == "detail_fixed") {
            // 默认模板数据，重新赋值装修数据（初始化操作）
            newItems = { ...goodsCustomData.items };
          }
        } else {
          newItems[key] = { ...item };
        }
      }
      // 将服务信息的装修旧数据拼接到规格信息里面
      for (let nkey in newItems) {
        if (newItems[nkey].id === "detail_specs") {
          newItems[nkey].data =
            newItems[nkey].data && !isEmpty(newItems[nkey].data)
              ? newItems[nkey].data
              : service;
        }
      }
      return newItems;
    },
    // 组装商品所需数据
    packageGoodsData(data) {
      let info = {};
      // 组装sku所需数据格式
      info = data.goods_detail;
      info.goods_image = "";
      if (data.goods_detail.goods_image_yun) {
        info.goods_image = data.goods_detail.goods_image_yun;
      } else {
        info.goods_image = data.goods_detail.goods_images
          ? data.goods_detail.goods_images[0]
          : "";
      }
      info.is_allow_buy =
        typeof data.is_allow_buy == "boolean" ? data.is_allow_buy : true;
      return info;
    },
    // 组装活动商品所需数据
    packagePromoteData(data) {
      let type = "normal";
      let info = {};
      if (data.seckill_list.seckill_id) {
        type = "seckill";
      } else if (data.group_list.group_id) {
        type = "group";
      } else if (data.presell_list.presell_id) {
        type = "presell";
      } else if (data.bargain_list.bargain_id) {
        type = "bargain";
      } else if (data.limit_list && data.limit_list.discount_id) {
        type = "limit";
      } else if (data.luckyspell_list && data.luckyspell_list.luckyspell_id) {
        //幸运拼团
        type = "luckyspell";
      }
      if (type != "normal") {
        info = data[`${type}_list`] || {};
      }
      return {
        type,
        info
      };
    },
    // 组装装修数据所需数据
    packageItemsData(items, detail) {
      let data = Object.assign({}, items);
      for (let key in data) {
        let item = data[key];
        if (item.id === "detail_banner") {
          item.data = [];
          item.data = detail.goods_detail.goods_images || [];
          item.params = {};
          item.params.video = detail.goods_detail.video;
          item.goodsInfo = {};
          item.params.promoteType = this.promoteType;
          item.params.promoteParams = this.promoteParams;
          item.params.rebateCommission = detail.commission
            ? detail.commission
            : "";
          item.params.rebatePoint = detail.dis_point
            ? `${detail.dis_point}`
            : "";
        }
        if (item.id === "detail_info") {
          item.params = {};
          item.params.sales = detail.goods_detail.sales || 0;
          item.params.isCollect = detail.goods_detail.is_collection;
          item.params.postage = detail.goods_detail.shipping_fee;
          item.params.rebateCommission = detail.commission
            ? detail.commission
            : "";
          item.params.rebatePoint = detail.dis_point
            ? `${detail.dis_point}`
            : "";
          item.goodsInfo = {};
          item.params.promoteType = this.promoteType;
          item.params.promoteParams = this.promoteParams;
          item.params.digitalAsset = detail.blockchainPrice || {
            logo: "",
            service_charge: 0,
            symbol: "",
            symbol_price: 0
          };
          item.params.full_cut_list = detail.full_cut_list;
          item.params.coupon_type_list = detail.coupon_type_list;
          if (this.promoteType == "presell") {
            item.params.max_buy = 0;
          }
          // if (
          //   this.promoteType == "group" &&
          //   !this.params.record_id &&
          //   this.promoteParams.group_record_count
          // ) {
          //   item.params = this.promoteParams;
          //   item.params.promoteType = this.promoteType;
          // }
        }
        if (item.id === "detail_specs") {
          item.params = {};
          item.goodsInfo = {};
          item.params.valueText = "";
          item.params.isCurrent = false;
          item.params.showSpecs =
            detail.goods_detail.goods_type != 4 &&
            detail.goods_detail.goods_type != 6 &&
            this.promoteType != "bargain"; // 知识付费，预约商品，砍价活动商品 不显示选择规格栏目
          item.attribute = detail.goods_detail.goods_attribute_list || [];
          item.service = item.service || {};
        }
        if (item.id === "detail_shop") {
          item.params = {};
          item.params.id = detail.goods_detail.shop_id;
          item.params.logo = detail.shop_type_info.shop_logo;
          item.params.name = detail.shop_type_info.shop_name;
          item.params.delivery = detail.shop_type_info.shop_deliverycredit;
          item.params.desc = detail.shop_type_info.shop_desccredit;
          item.params.service = detail.shop_type_info.shop_servicecredit;
          item.params.comprehensive = detail.shop_type_info.comprehensive;
        }
        if (item.id === "detail_desc") {
          item.params = {};
          item.params.content = detail.goods_detail.description || "";
          item.params.goods_id = detail.goods_detail.goods_id;
          item.params.isCatalog = detail.goods_detail.goods_type == 4;
        }
        // if (item.id === "detail_promote") {
        //   item.data = item.data || {};
        //   item.params = {};
        //   for (const pKey in item.data) {
        //     let pItem = item.data[pKey];
        //     pItem.show = true;
        //     if (pItem.key == "fullcut") {
        //       pItem.data = detail.full_cut_list;
        //     } else if (pItem.key == "coupon") {
        //       pItem.data = detail.coupon_type_list || [];
        //       pItem.data.forEach(e => {
        //         e.loading = false;
        //         e.title = "";
        //       });
        //     } else if (pItem.key == "rebate") {
        //       pItem.data = { ...detail.distributor_res, ...detail.give_point };
        //     }
        //   }
        //   if (this.promoteType == "presell") {
        //     item.goodsInfo = {};
        //     item.params = this.promoteParams;
        //     item.params.promoteType = this.promoteType;
        //     item.params.max_buy = 0;
        //   }
        //   if (
        //     this.promoteType == "group" &&
        //     !this.params.record_id &&
        //     this.promoteParams.group_record_count
        //   ) {
        //     item.params = this.promoteParams;
        //     item.params.promoteType = this.promoteType;
        //   }
        // }
        // if (item.id === "detail_service") {
        //   item.params = {};
        //   item.params.show = detail.goods_detail.goods_type != 4;
        // }
        // 配送服务
        // if (item.id === "detail_delivery") {
        //   item.params = {};
        //   item.params.isCurrent = !!this.deliveryInfo.id;
        //   // item.params.show = detail.goods_detail.goods_type != 4;
        //   item.params.show = false; //未完善功能
        //   item.params.info = {};
        //   item.params.info.address =
        //     this.deliveryInfo && this.deliveryInfo.address;
        // }
      }
      return data;
    },
    // 监听商品sku
    onGoodsInfo(data) {
      this.goodsInfo = data;



      for (let key in this.items) {
        let item = this.items[key];
        if (item.id === "detail_banner") {
          item.goodsInfo = data;
        }
        if (item.id === "detail_info") {
          item.goodsInfo = data;
        }
        // if (item.id === "detail_promote") {
        //   if (this.promoteType == "presell") {
        //     item.goodsInfo = data;
        //   }
        // }
        if (item.id === "detail_specs") {
          item.goodsInfo = data;
          item.params.isCurrent = !!data.selectedSkuComb;
          item.params.valueText = data.specText;
        }
      }
    },
    // sku触发事件
    onSkuAction(action, data) {
      const $this = this;
      if (data.form_data) {
        $this
          .onGoodsForm(data.form_data)
          .then(() => {
            if (
              action === "buy" ||
              action === "group" ||
              action === "seckill" ||
              action === "presell" ||
              action === "luckyspell"
            ) {
              $this.onBuyNow(data);
            } else if (action === "addCart") {
              $this.onAddCart(data);
            } else if (action === "addZhihuan") {
              $this.onAddZhihuan(data);
            } else if (action == "bargain") {
              $this.onBargain(data);
            } else if (action == "study") {
              $this.onStudy(data);
            } else {
              console.log("暂无后续操作" + action);
            }
          })
          .catch(() => {
            $this.$Prompt.toast("商品表单提交失败！");
          });
      } else {
        if (
          action === "buy" ||
          action === "group" ||
          action === "seckill" ||
          action === "presell" ||
          action === "luckyspell"
        ) {
          $this.onBuyNow(data);
        } else if (action === "addCart") {
          $this.onAddCart(data);
        } else if (action === "addZhihuan") {
          $this.onAddZhihuan(data);
        } else if (action == "bargain") {
          $this.onBargain(data);
        } else if (action == "study") {
          $this.onStudy(data);
        } else {
          console.log("暂无后续操作" + action);
        }
      }
    },
    // 关闭sku
    onSkuClose(action) {
      if (action == "group" && this.current_record_id) {
        // 拼团活动，关闭sku时，清除用户参与指定团的id
        this.current_record_id = "";
      }
    },
    // 显示sku
    onShowSku(action) {
      if (action == "study") {
        this.onStudy({ goods_id: this.params.goods_id });
      } else {
        this.showSku = true;
        this.skuAction = action;
      }
    },
    // 加入购物车
    onAddCart(data) {
      if (!addCartFlag) return;
      addCartFlag = false;
      let params = {};
      params.num = data.selectedNum;
      params.sku_id = data.selectedSkuComb.id;
      if (this.routeQuery.shopkeeper_id) {
        //微店id
        params.shopkeeper_id = this.routeQuery.shopkeeper_id;
        // setSession("shopkeeper_id", this.routeQuery.shopkeeper_id);
      }
      if (data.seckill_id) {
        //秒杀商品加入购物车
        params.seckill_id = data.seckill_id;
      }
      if (this.params.anchor_id) {
        // 直播间过来商品
        params.anchor_id = this.params.anchor_id;
      }
      ADD_CART(params)
        .then(({ message }) => {
          this.$Prompt.toast({ icon: "success", title: message });
          if (this.showSku) {
            this.showSku = false;
            setTimeout(() => {
              addCartFlag = true;
            }, 200);
            this.getCartList({ update: true });
          }
        })
        .catch(() => {
          addCartFlag = true;
        });
    },
    // 立即购买
    onAddZhihuan(data) {


      let params = {};
      params.order_tag = "zhihuan";
      params.goodsType = data.goodsType;
      if (this.deliveryInfo && this.deliveryInfo.type == "express") {
        params.address_id = this.deliveryInfo.id;
      }
      if (this.routeQuery.shopkeeper_id) {
        //微店id
        params.shopkeeper_id = this.routeQuery.shopkeeper_id;
        // setSession("shopkeeper_id", this.routeQuery.shopkeeper_id);
      }
      if (data.presell_id) {
        params.presell_id = data.presell_id;
      }
      if (data.group_id) {
        params.group_id = data.group_id;
        if (this.current_record_id) {
          //表示用户自己选中参加哪个团
          params.record_id = this.current_record_id;
        } else if (data.record_id) {
          //存在record_id表示已经指定参数哪个团
          params.record_id = data.record_id;
        }
      }
      if (data.luckyspell_id) {
        // 幸运拼团
        params.luckyspell_id = data.luckyspell_id;
      }
      params.sku_list = [];
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum;
      sku_list_obj.sku_id = data.selectedSkuComb.id;
      sku_list_obj.shop_id = data.shopId;
      if (this.deliveryInfo && this.deliveryInfo.type == "pickup") {
        sku_list_obj.store_id = this.deliveryInfo.id;
        sku_list_obj.store_name = this.deliveryInfo.name;
      }
      if (data.seckill_id) {
        sku_list_obj.seckill_id = data.seckill_id;
      }
      if (this.params.channel_id) {
        sku_list_obj.channel_id = this.params.channel_id;
      }
      if (this.params.anchor_id) {
        // 直播间过来商品
        sku_list_obj.anchor_id = this.params.anchor_id;
      }
      params.sku_list.push(sku_list_obj);

      this.$Navigate
          .push({
            path: "/packages/order/confirm",
            query: {
              params: JSON.stringify(params)
            }
          })
          .then(() => {
            this.showSku = false;
          });
    },
    // 立即购买
    onBuyNow(data) {
      let params = {};
      params.order_tag = "buy_now";
      params.goodsType = data.goodsType;
      if (this.deliveryInfo && this.deliveryInfo.type == "express") {
        params.address_id = this.deliveryInfo.id;
      }
      if (this.routeQuery.shopkeeper_id) {
        //微店id
        params.shopkeeper_id = this.routeQuery.shopkeeper_id;
        // setSession("shopkeeper_id", this.routeQuery.shopkeeper_id);
      }
      if (data.presell_id) {
        params.presell_id = data.presell_id;
      }
      if (data.group_id) {
        params.group_id = data.group_id;
        if (this.current_record_id) {
          //表示用户自己选中参加哪个团
          params.record_id = this.current_record_id;
        } else if (data.record_id) {
          //存在record_id表示已经指定参数哪个团
          params.record_id = data.record_id;
        }
      }
      if (data.luckyspell_id) {
        // 幸运拼团
        params.luckyspell_id = data.luckyspell_id;
      }
      params.sku_list = [];
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum;
      sku_list_obj.sku_id = data.selectedSkuComb.id;
      sku_list_obj.shop_id = data.shopId;
      if (this.deliveryInfo && this.deliveryInfo.type == "pickup") {
        sku_list_obj.store_id = this.deliveryInfo.id;
        sku_list_obj.store_name = this.deliveryInfo.name;
      }
      if (data.seckill_id) {
        sku_list_obj.seckill_id = data.seckill_id;
      }
      if (this.params.channel_id) {
        sku_list_obj.channel_id = this.params.channel_id;
      }
      if (this.params.anchor_id) {
        // 直播间过来商品
        sku_list_obj.anchor_id = this.params.anchor_id;
      }
      params.sku_list.push(sku_list_obj);

      this.$Navigate
        .push({
          path: "/packages/order/confirm",
          query: {
            params: JSON.stringify(params)
          }
        })
        .then(() => {
          this.showSku = false;
        });
    },
    // 砍价
    onBargain(data) {
      let query = {
        goods_id: data.id,
        bargain_id: data.bargain_id,
        bargain_uid: data.bargain_uid
      };
      if (this.params.anchor_id) {
        // 直播间过来商品
        query.anchor_id = this.params.anchor_id;
      }
      this.$Navigate.push({
        path: "/packages/bargain/detail",
        query: query
      });
    },
    //商品独立表单提交
    onGoodsForm(form_data) {
      if (!goodsFormFlag) return false;
      goodsFormFlag = false;
      let params = {
        goods_form_id: this.goodsData.goods_form_id,
        custom_id: this.goodsData.custom_id,
        goods_id: this.goodsData.goods_id,
        custom_data: form_data
      };
      return new Promise((resolve, reject) => {
        SET_GOODSFORMDATA(params)
          .then(res => {
            setTimeout(() => {
              goodsFormFlag = true;
            }, 1000);
            resolve();
          })
          .catch(() => {
            setTimeout(() => {
              goodsFormFlag = true;
            }, 1000);
            reject();
          });
      });
    },
    // 学习课程
    onStudy(data) {
      this.$Navigate.push({
        path: "/packages/course/detail",
        query: {
          goods_id: data.goods_id
        }
      });
    },
    //
    getStoreGoodsDetail(storeId) {
      // let params = Object.assign({}, this.params);
      // storeId && (params.store_id = storeId);
      // GET_GOODSINFO(params, { loading: true }).then(({ data }) => {
      //   let goodsData = this.goodsData;
      //   let storeGoodsData = data.goods_detail;
      //   for (const key in storeGoodsData) {
      //     if (goodsData.hasOwnProperty(key)) {
      //       goodsData[key] = storeGoodsData[key];
      //     }
      //   }
      // });
    }
  },
  components: {
    goodsReformGroup,
    goodsActionBar,
    sharePoster,
	floaterFixed
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 160rpx;
  padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}
</style>
