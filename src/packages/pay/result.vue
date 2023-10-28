<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-result-state-panel :state="stateType" :message="resultStateMessage" />
    <view class="btn-group">
      <lk-button
        class="btn"
        v-for="(item, index) in footBtnItems"
        :key="index"
        round
        size="small"
        :to="item.to"
      >
        {{ item.text }}
      </lk-button>
    </view>
    <cell-assemble :record_id="info.group_record_id" v-if="showGroup" />
    <lk-cell-add-wxcard v-if="showAddWxCard" :params="info.card_ids" card />
    <cell-store-info v-if="showOffline" :info="info.card_store" />
    <cell-message-tip v-if="messageTip" :message="messageTip" />
    <cell-pay-gift v-if="showAddGift" />
    <cell-luckly-spell
      v-if="showLucklySpell"
      :order_id="info.order_id"
      :out_trade_no="out_trade_no"
    />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_PAYRESULT } from "@/common/interface/pay";
import { mapState } from "vuex";
import cellAssemble from "./component/cell-assemble";
import cellStoreInfo from "./component/cell-store-info";
import cellMessageTip from "./component/cell-message-tip";
import cellPayGift from "./component/cell-pay-gift";
import cellLucklySpell from "./component/cell-lucklyspell";
export default {
  name: "pages-pay-result",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      from: "",
      loading: true,
      out_trade_no: null,
      info: {
        pay_status: -1
      }
    };
  },
  computed: {
    ...mapState(["member"]),
    /**
     * 页面类型
     * mall ==> 普通
     * recharge ==> 充值
     * channel ==> 渠道商
     * integral ==> 积分
     * microshop ==> 微店
     * group ==> 拼团
     * store ==> 门店
     * offlinePay ==>线下支付
     * offline ==> 线下
     * paygift ==> 支付有礼
     * blockchain ==> 区块链钱包
     * dpay ==> 货到付款
     */
    pageType() {
      if (this.loading) {
        return "";
      }
      const info = this.info;
      let name = "mall";
      if (info.offline) {
        name = "offlinePay";
      } else if (info.is_integral_order) {
        name = "integral";
      } else if (info.blockchain_order) {
        name = "blockchain";
      } else if (info.dpay_order) {
        name = "dpay";
      } else if (info.order_from == 2) {
        name = "recharge";
      } else if (info.is_channel) {
        name = "channel";
      } else if (info.is_agent) {
        name = "agent";
      } else if (
        info.order_type == 2 ||
        info.order_type == 3 ||
        info.order_type == 4 ||
        info.order_type == 11
      ) {
        name = "microshop";
      } else if (info.group_record_id) {
        name = "group";
      } else if (info.shipping_type == 2) {
        name = "store";
      } else if (info.card_store && info.card_store.store_name) {
        name = "offline";
      } else if (info.pay_gift_status) {
        name = "paygift";
      } else if (info.luckyspell_id && info.luckyspell_id > 0) {
        name = "lucklyspell";
      }
      return name;
    },
    navbarTitle() {
      if (this.loading) {
        return "";
      }
      const info = this.info;
      let title = "";
      if (this.pageType == "blockchain") {
        title = "提交成功";
      } else if (this.pageType == "integral" && info.pay_status == 2) {
        title = "兑换成功";
      } else if (this.pageType == "recharge") {
        if (info.pay_status == 2) {
          title = "充值成功";
        } else if (info.pay_status == 0) {
          title = "充值失败";
        }
      } else if (this.pageType == "dpay" && info.pay_status == 2) {
        title = "提交成功";
      } else if (this.pageType == "offlinePay") {
        title = "提交成功";
      } else if (this.pageType) {
        if (info.pay_status == 2) {
          title = "支付成功";
        } else if (info.pay_status == 0) {
          title = "支付失败";
        }
      }
      return title;
    },
    resultStateMessage() {
      if (this.loading) {
        return "";
      }
      let message = this.navbarTitle;
      if (this.pageType == "blockchain") {
        message = "链上交易处理中";
      } else if (this.pageType == "dpay") {
        message = "订单提交成功";
      }
      return message;
    },
    // 结果状态
    stateType() {
      if (this.loading) {
        return "";
      }
      let type = "";
      if (this.pageType == "blockchain") {
        type = "pay-success";
      } else if (this.pageType == "offlinePay") {
        type = "pay-success";
      } else if (this.pageType == "recharge") {
        type = this.info.pay_status == 2 ? "recharge-success" : "recharge-fail";
      } else if (this.pageType) {
        type = this.info.pay_status == 2 ? "pay-success" : "pay-fail";
      }
      return type;
    },
    showGroup() {
      const info = this.info;
      return (
        this.pageType == "group" && info.pay_status == 2 && info.group_record_id
      );
    },
    showAddWxCard() {
      const info = this.info;
      return (
        this.pageType == "offline" &&
        info.pay_status == 2 &&
        !info.wx_card_state
      );
    },
    showOffline() {
      const info = this.info;
      return (
        this.pageType == "offline" && info.pay_status == 2 && info.card_store
      );
    },
    showAddGift() {
      const info = this.info;
      return (
        this.pageType == "paygift" &&
        info.pay_status == 2 &&
        info.pay_gift_status == 1
      );
    },
    showLucklySpell() {
      const info = this.info;
      return this.pageType == "lucklyspell" && info.pay_status == 2;
    },
    messageTip() {
      let text = "";
      if (this.pageType == "store" && this.info.pay_status == 2) {
        text =
          "O2O订单请前往“订单列表”或“订单详情”查看核销码到对应门店进行核销。";
      } else if (this.pageType == "blockchain") {
        text =
          "虚拟货币交易需要等区块链上处理完成才算支付成功，支付成功后商城才能安排发货，请耐心等待并关注订单状态。";
      }
      return text;
    },
    // 支付来源路径
    payFromPath() {
      let path = "/pay/payment";
      if (this.from === "membercard") {
        path = "/pay/membercard";
      }
      if (this.from === "level") {
        path = "/pay/level";
      }
      return path;
    },
    footBtnItems() {
      if (this.loading) {
        return [];
      }
      const info = this.info;
      const type = this.pageType;
      let arr = [];
      if (type == "channel") {
        // 渠道商相关操作
        arr.push(
          { text: "微商中心", to: "/pages/channel/index" },
          {
            text: "查看订单",
            to: {
              path: "/packages/channel/order/list",
              query: {
                type: info.is_channel
              }
            }
          }
        );
      } else if (type == "offlinePay") {
        // 线下支付相关操作
        arr.push(
          {
            text: "继续购物",
            to: "/pages/mall/index"
          },
          {
            text: "查看订单",
            to: "/pages/order/list"
          }
        );
      } else if (type == "agent") {
        // 代理渠道相关操作
        arr.push(
          { text: "代理中心", to: "/pages/agent/index" },
          {
            text: "查看订单",
            to: {
              path: "/packages/agent/order/list",
              query: {
                type: info.is_agent
              }
            }
          }
        );
      } else if (type == "integral") {
        //积分商城相关操作
        arr.push(
          { text: "继续兑换", to: "/pages/integral/index" },
          { text: "查看订单", to: "/pages/order/list" }
        );
      } else if (type == "microshop") {
        // 微店相关操作
        if (info.pay_status != 2) {
          arr.push({
            text: "重新支付",
            to: {
              path: "/pay/payment",
              query: {
                out_trade_no: this.out_trade_no
              }
            }
          });
        }
        arr.push({
          text: info.pay_status == 2 ? "前往微店" : "返回微店",
          to: "/pages/microshop/index"
        });
      } else if (type == "recharge") {
        // 充值相关操作
        if (info.pay_status == 2) {
          arr.push({ text: "继续购物", to: "/pages/mall/index" });
        } else {
          arr.push({
            text: "重新支付",
            to: {
              path: this.payFromPath,
              query: {
                out_trade_no: this.out_trade_no,
                hash: "recharge"
              }
            }
          });
        }
        arr.push({
          text: "充值记录",
          to: "/packages/property/rechargelog')"
        });
      } else if (type == "blockchain") {
        // 区块链相关操作
        arr.push(
          {
            text: "继续购物",
            to: "/pages/mall/index"
          },
          {
            text: "查看订单",
            to: "/pages/order/list"
          }
        );
      } else if (type == "dpay") {
        // 货到付款
        arr.push(
          {
            text: "继续购物",
            to: "/pages/mall/index"
          },
          {
            text: "查看订单",
            to: "/pages/order/list"
          }
        );
      } else if (type) {
        // 普通下单相关操作
        if (info.pay_status == 2) {
          arr.push({ text: "继续购物", to: "/pages/mall/index" });
        } else {
          arr.push({
            text: "重新支付",
            to: {
              path: this.payFromPath,
              query: {
                out_trade_no: this.out_trade_no
              }
            }
          });
        }
        arr.push({
          text: "查看订单",
          to: info.order_id
            ? "/packages/order/detail?order_id=" + info.order_id
            : "/pages/order/list"
        });
      }
      return arr;
    }
  },
  onLoad(options) {
    const { blockchain_order, dpay_order, out_trade_no, from } = options;
    this.from = from;
    if (blockchain_order) {
      this.info.blockchain_order = blockchain_order;
      this.info.pay_status = 2;
      this.loading = false;
      this.pageStyle.title = this.navbarTitle;
    } else if (dpay_order) {
      this.info.dpay_order = dpay_order;
      this.info.pay_status = 2;
      this.loading = false;
      this.pageStyle.title = this.navbarTitle;
    } else {
      this.out_trade_no = out_trade_no;
      this.getPayResultInfo();
    }
  },
  methods: {
    // 获取支付结果信息
    getPayResultInfo() {
      GET_PAYRESULT({ out_trade_no: this.out_trade_no })
        .then(({ data }) => {
          this.info = data;
          // if (getSession("shopkeeper_id") && data.pay_status == 2) {
          //   removeSession("shopkeeper_id");
          // }
          this.loading = false;
          this.pageStyle.title = this.navbarTitle;
        })
        .catch(() => {});
    }
  },
  components: {
    cellAssemble,
    cellStoreInfo,
    cellMessageTip,
    cellPayGift,
    cellLucklySpell
  }
};
</script>

<style lang="scss" scoped>
.btn-group {
  padding: 40rpx 0;
  background: #ffffff;
  display: flex;
  justify-content: center;
  .btn {
    margin: 0 20rpx;
  }
}
</style>
