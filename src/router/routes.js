export default {
  "pages-mall-index": {
    path: "/pages/mall/index", name: "pages-mall-index", alias: ["/", "/mall", "/mall/index", "pages/index/index"],
    meta: {
      id: 1, name: "pages-mall-index", isNVue: false, pagePath: "pages/mall/index",
      isQuit: true, isEntry: true, isTabBar: true, tabBarIndex: 0, windowTop: 44, possTabBar: true, noLogin: true
    },
    title: "商城首页"
  },
  "pages-customize-one": {
    path: "/pages/customize/one", name: "pages-customize-one", alias: ["pages/customize/one"],
    meta: {
      name: "pages-customize-one", isNVue: false, pagePath: "pages/customize/one",
      isQuit: true,isTabBar: true,  windowTop: 44, possTabBar: true, noLogin: true
    },
    title: ""
  },
  "pages-customize-two": {
    path: "/pages/customize/two", name: "pages-customize-two", alias: ["pages/customize/two"],
    meta: {
      name: "pages-customize-two", isNVue: false, pagePath: "pages/customize/two",
      isQuit: true,isTabBar: true,  windowTop: 44, possTabBar: true, noLogin: true
    },
    title: ""
  },
  "pages-customize-three": {
    path: "/pages/customize/three", name: "pages-customize-three", alias: ["pages/customize/three"],
    meta: {
      name: "pages-customize-three", isNVue: false, pagePath: "pages/customize/three",
		isQuit: true,isTabBar: true,  windowTop: 44, possTabBar: true, noLogin: true
    },
    title: ""
  },
  
  "pages-mall-cart": {
    path: "/pages/mall/cart", name: "pages-mall-cart", alias: ["/mall/cart", "pages/shopcart/index"],
    meta: {
      id: 2, name: "pages-mall-cart", isNVue: false, pagePath: "pages/mall/cart", isQuit: true,
      isTabBar: true, tabBarIndex: 3, windowTop: 44, possTabBar: true, noLogin: true
    },
    title: "购物车"
  },
  "pages-goods-list": {
    path: "/pages/goods/list", name: "pages-goods-list", alias: ["/goods/list", "pages/goodlist/index"],
    meta: {
      name: "pages-goods-list", isNVue: false, pagePath: "pages/goods/list",
      windowTop: 44, possTabBar: true, noLogin: true, shareType: "current"
    },
    title: "商品列表"
  },
  "pages-goods-categorygoods": {
    path: "/pages/goods/categorygoods", name: "pages-goods-categorygoods", alias: ["/goods/categorygoods", "pages/goodlist/index"],
    meta: {
      name: "pages-goods-categorygoods", isNVue: false, pagePath: "pages/goods/categorygoods",
      windowTop: 44, possTabBar: true, noLogin: true, shareType: "current"
    },
    title: "商城"
  },
  "pages-goods-category": {
    path: "/pages/goods/category", name: "pages-goods-category", alias: ["/goods/category", "pages/category/index"],
    meta: {
      id: 3, name: "pages-goods-category", isNVue: false, pagePath: "pages/goods/category", isQuit: true,
      isTabBar: true, tabBarIndex: 1, windowTop: 44,possTabBar: true, noLogin: true, shareType: "current"
    },
    title: "商品分类"
  },
  "pages-order-list": {
    path: "/pages/order/list", name: "pages-order-list", alias: ["/order/list", "pages/order/list/index"],
    meta: {
      name: "pages-order-list", isNVue: false, pagePath: "pages/order/list", windowTop: 44, possTabBar: true
    },
    title: "订单列表"
  },
  "pages-member-index": {
    path: "/pages/member/index", name: "pages-member-index", alias: ["/member/centre", "pages/member/index"],
    meta: {
      id: 4, name: "pages-member-index", isNVue: false, pagePath: "pages/member/index",
      isQuit: true, isTabBar: true, tabBarIndex: 4, windowTop: 44, possTabBar: true, shareType: "current"
    },
    title: "会员中心"
  },
  "pages-property-index": {
    path: "/pages/property/index", name: "pages-property-index", alias: ["/property/centre", "pages/property/myProperty/index"],
    meta: {
      name: "pages-property-index", isNVue: false, pagePath: "pages/property/index", windowTop: 44, possTabBar: true
    },
    title: "我的资产"
  },
  "pages-property-index2": {
    path: "/pages/property/index2", name: "pages-property-index2", alias: ["/property/centre", "pages/property/myProperty/index"],
    meta: {
      name: "pages-property-index2", isNVue: false, pagePath: "pages/property/index2", windowTop: 44, possTabBar: true
    },
    title: "我的卡券"
  },
  "pages-coupon-index": {
    path: "/pages/coupon/index", name: "pages-coupon-index", alias: ["/coupon/centre", "pages/coupon/centre/index"],
    meta: {
      name: "pages-coupon-index", isNVue: false, pagePath: "pages/coupon/index",windowTop: 44, possTabBar: true, noLogin: true, shareType: "current", addon: "coupontype"
    },
    title: "领券中心"
  },
  "pages-shop-list": {
    path: "/pages/shop/list", name: "pages-shop-list", alias: ["/shop/list", "pages/shop/list/index"],
    meta: {
      id: 5, name: "pages-shop-list", isNVue: false, pagePath: "pages/shop/list",
      isQuit: true, isTabBar: true, tabBarIndex: 2, windowTop: 44, possTabBar: true, noLogin: true, shareType: "current", addon: "shop"
    },
    title: "店铺街"
  },
  "pages-store-list": {
    path: "/pages/store/list", name: "pages-store-list", alias: ["/store/list"],
    meta: {
      name: "pages-store-list", isNVue: false, pagePath: "pages/store/list", windowTop: 44, possTabBar: true, noLogin: true, shareType: "current", addon: "store"
    },
    title: "门店列表"
  },
  "pages-distribute-index": {
    path: "/pages/distribute/index", name: "pages-distribute-index", alias: ["/commission/centre", "pages/commission/centre/index"],
    meta: {
      name: "pages-distribute-index", isNVue: false, pagePath: "pages/distribute/index",
      windowTop: 44, possTabBar: true, shareType: "current", addon: "distribution"
    },
    title: "分销中心"
  },

"pages-ptmoney-index": {
    path: "/pages/ptmoney/index", name: "pages-ptmoney-index", alias: ["/ptmoney/index"],
    meta: {
      name: "pages-ptmoney-index", isNVue: false, pagePath: "pages/ptmoney/index",
      windowTop: 44, possTabBar: true, shareType: "current", addon: "distribution"
    },
    title: "积分中心"
  },
  "pages-ptmoney-red": {
    path: "/pages/ptmoney/red", name: "pages-ptmoney-red", alias: ["/ptmoney/red"],
    meta: {
      name: "pages-ptmoney-red", isNVue: false, pagePath: "pages/ptmoney/red",
      windowTop: 44, possTabBar: true, shareType: "current", addon: "distribution"
    },
    title: "月度分红"
  },
  "pages-integral-index": {
    path: "/pages/integral/index",
    name: "pages-integral-index",
    alias: ["/integral/index", "pages/integral/index/index"],
    meta: {
      name: "pages-integral-index",
      isNVue: false,
      pagePath: "pages/integral/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "积分商城"
  },
  "pages-thingcircle-index": {
    path: "/pages/thingcircle/index",
    name: "pages-thingcircle-index",
    alias: ["/thingcircle/index"],
    meta: {
      name: "pages-thingcircle-index",
      isNVue: false,
      pagePath: "pages/thingcircle/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "thingcircle"
    },
    title: "社交圈"
  },
  "pages-thingcircle-indextwo": {
    path: "/pages/thingcircle/indextwo",
    name: "pages-thingcircle-indextwo",
    alias: ["/thingcircle/indextwo"],
    meta: {
      name: "pages-thingcircle-indextwo",
      isNVue: false,
      pagePath: "pages/thingcircle/indextwo",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
	  isTabBar: true,
      shareType: "current",
      addon: "thingcircle"
    },
    title: "社交圈"
  },
  "pages-thingcircletwo-index": {
    path: "/pages/thingcircletwo/index",
    name: "pages-thingcircletwo-index",
    alias: ["/thingcircletwo/index"],
    meta: {
      name: "pages-thingcircletwo-index",
      isNVue: false,
      pagePath: "pages/thingcircletwo/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "thingcircletwo"
    },
    title: "商务圈"
  },

  "pages-message-index": {
    path: "/pages/message/index",
    name: "pages-message-index",
    alias: ["/message"],
    meta: {
      name: "pages-message-index",
      isNVue: false,
      pagePath: "pages/message/index",
      windowTop: 44,
      possTabBar: true
    },
    title: "消息中心"
  },
  "pages-task-index": {
    path: "/pages/task/index",
    name: "pages-task-index",
    alias: ["/task/centre", "pages/task/centre/index"],
    meta: {
      name: "pages-task-index",
      isNVue: false,
      pagePath: "pages/task/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "taskcenter"
    },
    title: "任务中心"
  },
  "pages-signin-index": {
    path: "/pages/signin/index",
    name: "pages-signin-index",
    alias: ["/signin", "/signin/index", "pages/signin/index/index"],
    meta: {
      name: "pages-signin-index",
      isNVue: false,
      pagePath: "pages/signin/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "signin"
    },
    title: "每日签到"
  },
  "pages-help-index": {
    path: "/pages/help/index",
    name: "pages-help-index",
    meta: {
      name: "pages-help-index",
      isNVue: false,
      pagePath: "pages/help/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "helpcenter"
    },
    title: "帮助中心"
  },
  "pages-mplive-index": {
    path: "/pages/mplive/index",
    name: "pages-mplive-index",
    meta: {
      name: "pages-mplive-index",
      isNVue: false,
      pagePath: "pages/mplive/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      noLogin: true,
      addon: "mplive"
    },
    title: "小程序直播"
  },
  "pages-live-index": {
    path: "/pages/live/index",
    name: "pages-live-index",
    meta: {
      name: "pages-live-index",
      isNVue: false,
      pagePath: "pages/live/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      noLogin: true,
      addon: "liveshopping"
    },
    title: "直播列表"
  },
  "pages-merchant-index": {
    path: "/pages/merchant/index",
    name: "pages-merchant-index",
    meta: {
      name: "pages-merchant-index",
      isNVue: false,
      pagePath: "pages/merchant/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "merchants"
    },
    title: "招商中心"
  },

  "packages-mall-search": {
    path: "/packages/mall/search",
    name: "packages-mall-search",
    meta: {
      name: "packages-mall-search",
      isNVue: false,
      pagePath: "packages/mall/search",
      windowTop: 44,
      noLogin: true
    },
    title: "搜索"
  },
  "packages-mall-diy": {
    path: "/packages/mall/diy",
    name: "packages-mall-diy",
    meta: {
      name: "packages-mall-diy",
      isNVue: false,
      pagePath: "packages/mall/diy",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "",
    paramExplain: "page_id:页面id"
  },
  "packages-mall-notice": {
    path: "/packages/mall/notice",
    name: "packages-mall-notice",
    meta: {
      name: "packages-mall-notice",
      isNVue: false,
      pagePath: "packages/mall/notice",
      windowTop: 44,
      noLogin: true
    },
    title: ""
  },
  "packages-mall-contract": {
    path: "/packages/mall/contract",
    name: "packages-mall-contract",
    meta: {
      name: "packages-mall-contract",
      isNVue: false,
      pagePath: "packages/mall/contract",
      windowTop: 44,
      noLogin: true
    },
    title: "协议"
  },
  "packages-mall-download": {
    path: "/packages/mall/download",
    name: "packages-mall-download",
    meta: {
      name: "packages-mall-download",
      isNVue: false,
      pagePath: "packages/mall/download",
      windowTop: 44,
      noLogin: true
    },
    title: "下载"
  },
  "packages-goods-detail": {
    path: "/packages/goods/detail",
    name: "packages-goods-detail",
    meta: {
      name: "packages-goods-detail",
      isNVue: false,
      pagePath: "packages/goods/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "商品详情",
    paramExplain: "goods_id:商品id"
  },
  "packages-goods-screen": {
    path: "/packages/goods/screen",
    name: "packages-goods-screen",
    meta: {
      name: "packages-goods-screen",
      isNVue: false,
      pagePath: "packages/goods/screen",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "商品列表",
    paramExplain: "goods_ids:商品id组"
  },
  "packages-goods-collect": {
    path: "/packages/goods/collect",
    name: "packages-goods-collect",
    alias: ["/goods/collection", "pages/goods/collection/index"],
    meta: {
      name: "packages-goods-collect",
      isNVue: false,
      pagePath: "packages/goods/collect",
      windowTop: 44
    },
    title: "商品收藏"
  },
  "packages-goods-share": {
    path: "/packages/goods/share",
    name: "packages-goods-share",
    meta: {
      name: "packages-goods-share",
      isNVue: false,
      pagePath: "packages/goods/share",
      windowTop: 44
    },
    title: "商品分享",
    paramExplain: "goods_id:商品id"
  },
  "packages-goods-schedule": {
    path: "/packages/goods/schedule",
    name: "packages-goods-schedule",
    meta: {
      name: "packages-goods-schedule",
      isNVue: false,
      pagePath: "packages/goods/schedule",
      windowTop: 44,
      shareType: "current"
    },
    title: "预约详情",
    paramExplain: "custom_id"
  },
  "packages-goods-evaluate": {
    path: "/packages/goods/evaluate",
    name: "packages-goods-evaluate",
    meta: {
      name: "packages-goods-evaluate",
      isNVue: false,
      pagePath: "packages/goods/evaluate",
      windowTop: 44,
      noLogin: true
    },
    title: "评价",
    paramExplain: "goods_id"
  },
  "packages-login-index": {
    path: "/packages/login/index",
    name: "packages-login-index",
    meta: {
      name: "packages-login-index",
      isNVue: false,
      pagePath: "packages/login/index",
      windowTop: 44,
      noLogin: true
    },
    title: "登录"
  },
  "packages-login-register": {
    path: "/packages/login/register",
    name: "packages-login-register",
    meta: {
      name: "packages-login-register",
      isNVue: false,
      pagePath: "packages/login/register",
      windowTop: 44,
      noLogin: true
    },
    title: "会员注册"
  },
  "packages-login-forget": {
    path: "/packages/login/forget",
    name: "packages-login-forget",
    meta: {
      name: "packages-login-forget",
      isNVue: false,
      pagePath: "packages/login/forget",
      windowTop: 44,
      noLogin: true
    },
    title: "忘记密码"
  },
  "pay-payment": {
    path: "/pay/payment",
    name: "pay-payment",
    meta: {
      name: "pay-payment",
      isNVue: false,
      pagePath: "/pay/payment",
      windowTop: 44,
      refresh: true
    },
    title: "收银台",
    paramExplain: "out_trade_no:交易号"
  },
  "pay-level": {
    path: "/pay/level",
    name: "pay-level",
    meta: {
      name: "pay-level",
      isNVue: false,
      pagePath: "/pay/level",
      windowTop: 44,
      refresh: true
    },
    title: "收银台",
    paramExplain: "out_trade_no:交易号"
  },
  "pay-wallet": {
    path: "/pay/wallet",
    name: "pay-wallet",
    meta: {
      name: "pay-wallet",
      isNVue: false,
      pagePath: "/pay/wallet",
      windowTop: 44,
      refresh: true
    },
    title: "收银台",
    paramExplain: "out_trade_no:交易号"
  },
  "pay-membercard": {
    path: "/pay/membercard",
    name: "pay-membercard",
    meta: {
      name: "pay-membercard",
      isNVue: false,
      pagePath: "/pay/membercard",
      windowTop: 44,
      refresh: true
    },
    title: "收银台",
    paramExplain: "out_trade_no:交易号"
  },
  "packages-pay-payment": {
    path: "/packages/pay/payment",
    name: "packages-pay-payment",
    meta: {
      name: "packages-pay-payment",
      isNVue: false,
      pagePath: "packages/pay/payment",
      windowTop: 44,
      refresh: true
    },
    title: "收银台",
    paramExplain: "out_trade_no:交易号"
  },
  "packages-pay-result": {
    path: "/packages/pay/result",
    name: "packages-pay-result",
    meta: {
      name: "packages-pay-result",
      isNVue: false,
      pagePath: "packages/pay/result",
      windowTop: 44
    },
    title: "支付结果",
    paramExplain: "out_trade_no:交易号"
  },
  "packages-pay-guide": {
    path: "/packages/pay/guide",
    name: "packages-pay-guide",
    meta: {
      name: "packages-pay-guide",
      isNVue: false,
      pagePath: "packages/pay/guide",
      windowTop: 44,
      noLogin: true
    },
    title: "支付提示",
    paramExplain: "param:支付提示所需参数object"
  },
  "packages-pay-wallet": {
    path: "/packages/pay/wallet",
    name: "packages-pay-wallet",
    meta: {
      name: "packages-pay-wallet",
      isNVue: false,
      pagePath: "packages/pay/wallet",
      windowTop: 44,
      refresh: true
    },
    title: "创建钱包"
  },
  "packages-order-confirm": {
    path: "/packages/order/confirm",
    name: "packages-order-confirm",
    meta: {
      name: "packages-order-confirm",
      isNVue: false,
      pagePath: "packages/order/confirm",
      windowTop: 44
    },
    title: "确认订单",
    paramExplain: "param:确认订单所需参数object"
  },
  "packages-order-detail": {
    path: "/packages/order/detail",
    name: "packages-order-detail",
    meta: {
      name: "packages-order-detail",
      isNVue: false,
      pagePath: "packages/order/detail",
      windowTop: 44
    },
    title: "订单详情",
    paramExplain: "order_id:订单id"
  },
  "packages-order-post": {
    path: "/packages/order/post",
    name: "packages-order-post",
    meta: {
      name: "packages-order-post",
      isNVue: false,
      pagePath: "packages/order/post",
      windowTop: 44
    },
    title: "退货退款",
    paramExplain: "param:退货退款订单所需参数object"
  },

  "packages-order-return_hg": {
    path: "/packages/order/return_hg",
    name: "packages-order-return_hg",
    meta: {
      name: "packages-order-return_hg",
      isNVue: false,
      pagePath: "packages/order/return_hg",
      windowTop: 45
    },
    title: "申请回购",
    paramExplain: "param:退货退款订单所需参数object"
  },

  "packages-order-logistics": {
    path: "/packages/order/logistics",
    name: "packages-order-logistics",
    meta: {
      name: "packages-order-logistics",
      isNVue: false,
      pagePath: "packages/order/logistics",
      windowTop: 44
    },
    title: "物流信息",
    paramExplain: "order_id:订单id"
  },
  "packages-order-evaluate": {
    path: "/packages/order/evaluate",
    name: "packages-order-evaluate",
    meta: {
      name: "packages-order-evaluate",
      isNVue: false,
      pagePath: "packages/order/evaluate",
      windowTop: 44
    },
    title: "商品评价",
    paramExplain: "param:订单信息所需参数object"
  },
  "packages-member-set": {
    path: "/packages/member/set",
    name: "packages-member-set",
    meta: {
      name: "packages-member-set",
      isNVue: false,
      pagePath: "packages/member/set",
      windowTop: 44
    },
    title: "账号设置"
  },
  "packages-member-info": {
    path: "/packages/member/info",
    name: "packages-member-info",
    meta: {
      name: "packages-member-info",
      isNVue: false,
      pagePath: "packages/member/info",
      windowTop: 44
    },
    title: "基本信息"
  },
  "packages-member-avatar": {
    path: "/packages/member/avatar",
    name: "packages-member-avatar",
    meta: {
      name: "packages-member-avatar",
      isNVue: false,
      pagePath: "packages/member/avatar",
      windowTop: 44
    },
    title: "修改头像"
  },
  "packages-member-post": {
    path: "/packages/member/post",
    name: "packages-member-post",
    meta: {
      name: "packages-member-post",
      isNVue: false,
      pagePath: "packages/member/post",
      windowTop: 44
    },
    title: "账号修改"
  },
  "packages-member-relevant": {
    path: "/packages/member/relevant",
    name: "packages-member-relevant",
    meta: {
      name: "packages-member-relevant",
      isNVue: false,
      pagePath: "packages/member/relevant",
      windowTop: 44
    },
    title: "关联账号"
  },
  "packages-member-level": {
    path: "/packages/member/level",
    name: "packages-member-level",
    meta: {
      name: "packages-member-level",
      isNVue: false,
      pagePath: "packages/member/level",
      windowTop: 44
    },
    title: "等级详情"
  },
  "packages-member-address-list": {
    path: "/packages/member/address/list",
    name: "packages-member-address-list",
    meta: {
      name: "packages-member-address-list",
      isNVue: false,
      pagePath: "packages/member/address/list",
      windowTop: 44
    },
    title: "收货地址"
  },
  "packages-member-address-post": {
    path: "/packages/member/address/post",
    name: "packages-member-address-post",
    meta: {
      name: "packages-member-address-post",
      isNVue: false,
      pagePath: "packages/member/address/post",
      windowTop: 44
    },
    title: "编辑收货地址",
    paramExplain: "type:编辑还是添加"
  },
  "packages-member-invoice-list": {
    path: "/packages/member/invoice/list",
    name: "packages-member-invoice-list",
    meta: {
      name: "packages-member-invoice-list",
      isNVue: false,
      pagePath: "packages/member/invoice/list",
      windowTop: 44
    },
    title: "发票抬头管理"
  },
  "packages-member-invoice-post": {
    path: "/packages/member/invoice/post",
    name: "packages-member-invoice-post",
    meta: {
      name: "packages-member-invoice-post",
      isNVue: false,
      pagePath: "packages/member/invoice/post",
      windowTop: 44
    },
    title: "编辑发票抬头"
  },
  "packages-property-account-list": {
    path: "/packages/property/account/list",
    name: "packages-property-account-list",
    meta: {
      name: "packages-property-account-list",
      isNVue: false,
      pagePath: "packages/property/account/list",
      windowTop: 44
    },
    title: "账户列表"
  },
  "packages-property-account-post": {
    path: "/packages/property/account/post",
    name: "packages-property-account-post",
    meta: {
      name: "packages-property-account-post",
      isNVue: false,
      pagePath: "packages/property/account/post",
      windowTop: 44
    },
    title: "编辑账户",
    paramExplain: "type:编辑还是添加,param:编辑账户所需参数object"
  },
  "packages-property-account-detail": {
    path: "/packages/property/account/detail",
    name: "packages-property-account-detail",
    meta: {
      name: "packages-property-account-detail",
      isNVue: false,
      pagePath: "packages/property/account/detail",
      windowTop: 44
    },
    title: "账户详情",
    paramExplain: "param:账户详情所需参数object"
  },
  "packages-property-balance": {
    path: "/packages/property/balance",
    name: "packages-property-balance",
    meta: {
      name: "packages-property-balance",
      isNVue: false,
      pagePath: "packages/property/balance",
      windowTop: 44
    },
    title: "余额"
  },

  "packages-property-account": {
    path: "/packages/property/account",
    name: "packages-property-account",
    meta: {
      name: "packages-property-account",
      isNVue: false,
      pagePath: "packages/property/account",
      windowTop: 44
    },
    title: "余额"
  },

  "packages-property-webview": {
    path: "/packages/property/webview",
    name: "packages-property-webview",
    meta: {
      name: "packages-property-webview",
      isNVue: false,
      pagePath: "packages/property/webview",
      windowTop: 44
    },
    title: "跳转"
  },

  "packages-property-log-list": {
    path: "/packages/property/log/list",
    name: "packages-property-log-list",
    meta: {
      name: "packages-property-log-list",
      isNVue: false,
      pagePath: "packages/property/log/list",
      windowTop: 44
    },
    title: "余额明细"
  },
  "packages-property-log-detail": {
    path: "/packages/property/log/detail",
    name: "packages-property-log-detail",
    meta: {
      name: "packages-property-log-detail",
      isNVue: false,
      pagePath: "packages/property/log/detail",
      windowTop: 44
    },
    title: "余额详情",
    paramExplain: "detail_id:详情id"
  },
  "packages-property-recharge": {
    path: "/packages/property/recharge",
    name: "packages-property-recharge",
    meta: {
      name: "packages-property-recharge",
      isNVue: false,
      pagePath: "packages/property/recharge",
      windowTop: 44
    },
    title: "充值"
  },
  "packages-property-rechargelog": {
    path: "/packages/property/rechargelog",
    name: "packages-property-rechargelog",
    meta: {
      name: "packages-property-rechargelog",
      isNVue: false,
      pagePath: "packages/property/rechargelog",
      windowTop: 44
    },
    title: "充值记录"
  },
  
  
  
  "packages-property-withdraw": {
    path: "/packages/property/withdraw",
    name: "packages-property-withdraw",
    meta: {
      name: "packages-property-withdraw",
      isNVue: false,
      pagePath: "packages/property/withdraw",
      windowTop: 44
    },
    title: "提现"
  },
  
  "packages-property-withdrawlog": {
    path: "/packages/property/withdrawlog",
    name: "packages-property-withdrawlog",
    meta: {
      name: "packages-property-withdrawlog",
      isNVue: false,
      pagePath: "packages/property/withdrawlog",
      windowTop: 44
    },
    title: "提现记录"
  },
  "packages-property-points": {
    path: "/packages/property/points",
    name: "packages-property-points",
    meta: {
      name: "packages-property-points",
      isNVue: false,
      pagePath: "packages/property/points",
      windowTop: 44
    },
    title: "积分"
  },
  "packages-property-change": {
    path: "/packages/property/change",
    name: "packages-property-change",
    meta: {
      name: "packages-property-change",
      isNVue: false,
      pagePath: "packages/property/change",
      windowTop: 44
    },
    title: "兑换"
  },
"packages-property-changelog": {
    path: "/packages/property/changelog",
    name: "packages-property-changelog",
    meta: {
      name: "packages-property-changelog",
      isNVue: false,
      pagePath: "packages/property/changelog",
      windowTop: 44
    },
    title: "兑换记录"
  },
  "packages-property-transfer": {
    path: "/packages/property/transfer",
    name: "packages-property-transfer",
    meta: {
      name: "packages-property-transfer",
      isNVue: false,
      pagePath: "packages/property/transfer",
      windowTop: 44
    },
    title: "转账"
  },
	"packages-property-transferlog": {
    path: "/packages/property/transferlog",
    name: "packages-property-transferlog",
    meta: {
      name: "packages-property-transferlog",
      isNVue: false,
      pagePath: "packages/property/transferlog",
      windowTop: 44
    },
    title: "转账记录"
  },


  "packages-shop-home": {
    path: "/packages/shop/home",
    name: "packages-shop-home",
    meta: {
      name: "packages-shop-home",
      isNVue: false,
      pagePath: "packages/shop/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "shop"
    },
    title: "店铺首页",
    paramExplain: "shop_id:店铺id"
  },

  "packages-shop-member": {
    path: "/packages/shop/member",
    name: "packages-shop-member",
    meta: {
      name: "packages-shop-member",
      isNVue: false,
      pagePath: "packages/shop/member",
      windowTop: 44,
      noLogin: true,
      isTabBar: true,
      shareType: "current",
      addon: "shop"
    },
    title: "我的",
    paramExplain: "shop_id:店铺id"
  },

  "packages-shop-category": {
    path: "/packages/shop/category",
    name: "packages-shop-category",
    meta: {
      name: "packages-shop-category",
      isNVue: false,
      pagePath: "packages/shop/category",
      windowTop: 44,
      noLogin: true,
      isTabBar: true,
      shareType: "current",
      addon: "shop"
    },
    title: "分类",
    paramExplain: "shop_id:店铺id"
  },

  "packages-shop-collect": {
    path: "/packages/shop/collect",
    name: "packages-shop-collect",
    meta: {
      name: "packages-shop-collect",
      isNVue: false,
      pagePath: "packages/shop/collect",
      windowTop: 44
    },
    title: "店铺收藏",
    addon: "shop"
  },
  "packages-shop-search": {
    path: "/packages/shop/search",
    name: "packages-shop-search",
    meta: {
      name: "packages-shop-search",
      isNVue: false,
      pagePath: "packages/shop/search",
      windowTop: 44,
      noLogin: true,
      addon: "shop"
    },
    title: "店铺搜索"
  },
  "packages-shop-business-index": {
    path: "/packages/shop/business/index",
    name: "packages-shop-business-index",
    meta: {
      name: "packages-shop-business-index",
      isNVue: false,
      pagePath: "packages/shop/business/index",
      windowTop: 44,
      possTabBar: true,
      addon: "shop"
    },
    title: "商家中心"
  },
  "packages-shop-business-apply": {
    path: "/packages/shop/business/apply",
    name: "packages-shop-business-apply",
    meta: {
      name: "packages-shop-business-apply",
      isNVue: false,
      pagePath: "packages/shop/business/apply",
      windowTop: 44,
      possTabBar: true,
      addon: "shop"
    },
    title: "商家入驻"
  },
  "packages-shop-business-result": {
    path: "/packages/shop/business/result",
    name: "packages-shop-business-result",
    meta: {
      name: "packages-shop-business-result",
      isNVue: false,
      pagePath: "packages/shop/business/result",
      windowTop: 44,
      addon: "shop"
    },
    title: "申请状态"
  },
  "packages-store-home": {
    path: "/packages/store/home",
    name: "packages-store-home",
    meta: {
      name: "packages-store-home",
      isNVue: false,
      pagePath: "packages/store/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "store"
    },
    title: "门店首页",
    paramExplain: "store_id:门店id"
  },
  "packages-store-search": {
    path: "/packages/store/search",
    name: "packages-store-search",
    meta: {
      name: "packages-store-search",
      isNVue: false,
      pagePath: "packages/store/search",
      windowTop: 44,
      noLogin: true,
      addon: "store"
    },
    title: "门店搜索"
  },
  "packages-coupon-list": {
    path: "/packages/coupon/list",
    name: "packages-coupon-list",
    meta: {
      name: "packages-coupon-list",
      isNVue: false,
      pagePath: "packages/coupon/list",
      windowTop: 44,
      addon: "coupontype"
    },
    title: "我的优惠券"
  },
  "packages-coupon-detail": {
    path: "/packages/coupon/detail",
    name: "packages-coupon-detail",
    meta: {
      name: "packages-coupon-detail",
      isNVue: false,
      pagePath: "packages/coupon/detail",
      windowTop: 44,
      addon: "coupontype"
    },
    title: "优惠券详情",
    paramExplain: "coupon_id:优惠券id"
  },
  "packages-coupon-receive": {
    path: "/packages/coupon/receive",
    name: "packages-coupon-receive",
    meta: {
      name: "packages-coupon-receive",
      isNVue: false,
      pagePath: "packages/coupon/receive",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "coupontype"
    },
    title: "领取优惠券",
    paramExplain: "coupon_id:优惠券id"
  },
  "packages-distribute-apply": {
    path: "/packages/distribute/apply",
    name: "packages-distribute-apply",
    meta: {
      name: "packages-distribute-apply",
      isNVue: false,
      pagePath: "packages/distribute/apply",
      windowTop: 44,
      addon: "distribution"
    },
    title: "申请分销商"
  },
  "packages-distribute-qrcode": {
    path: "/packages/distribute/qrcode",
    name: "packages-distribute-qrcode",
    meta: {
      name: "packages-distribute-qrcode",
      isNVue: false,
      pagePath: "packages/distribute/qrcode",
      windowTop: 44,
      addon: "distribution"
    },
    title: "推广码"
  },
  "packages-distribute-detail": {
    path: "/packages/distribute/detail",
    name: "packages-distribute-detail",
    meta: {
      name: "packages-distribute-detail",
      isNVue: false,
      pagePath: "packages/distribute/detail",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金"
  },
  "packages-distribute-log": {
    path: "/packages/distribute/log",
    name: "packages-distribute-log",
    meta: {
      name: "packages-distribute-log",
      isNVue: false,
      pagePath: "packages/distribute/log",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金明细"
  },
  "packages-distribute-jflog": {
    path: "/packages/distribute/jflog",
    name: "packages-distribute-jflog",
    meta: {
      name: "packages-distribute-jflog",
      isNVue: false,
      pagePath: "packages/distribute/jflog",
      windowTop: 44,
      addon: "distribution"
    },
    title: "积分明细"
  },
  "packages-distribute-order": {
    path: "/packages/distribute/order",
    name: "packages-distribute-order",
    meta: {
      name: "packages-distribute-order",
      isNVue: false,
      pagePath: "packages/distribute/order",
      windowTop: 44,
      addon: "distribution"
    },
    title: "分销订单"
  },
  "packages-distribute-team": {
    path: "/packages/distribute/team",
    name: "packages-distribute-team",
    meta: {
      name: "packages-distribute-team",
      isNVue: false,
      pagePath: "packages/distribute/team",
      windowTop: 44,
      addon: "distribution"
    },
    title: "我的团队"
  },
  "packages-distribute-customer": {
    path: "/packages/distribute/customer",
    name: "packages-distribute-customer",
    meta: {
      name: "packages-distribute-customer",
      isNVue: false,
      pagePath: "packages/distribute/customer",
      windowTop: 44,
      addon: "distribution"
    },
    title: "渠道部门"
  },
  "packages-distribute-withdraw": {
    path: "/packages/distribute/withdraw",
    name: "packages-distribute-withdraw",
    meta: {
      name: "packages-distribute-withdraw",
      isNVue: false,
      pagePath: "packages/distribute/withdraw",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金提现"
  },
  "packages-distribute-withdrawlog": {
    path: "/packages/distribute/withdrawlog",
    name: "packages-distribute-withdrawlog",
    meta: {
      name: "packages-distribute-withdrawlog",
      isNVue: false,
      pagePath: "packages/distribute/withdrawlog",
      windowTop: 44,
      addon: "distribution"
    },
    title: "提现记录"
  },
  "packages-distribute-credential": {
    path: "/packages/distribute/credential",
    name: "packages-distribute-credential",
    meta: {
      name: "packages-distribute-credential",
      isNVue: false,
      pagePath: "packages/distribute/credential",
      windowTop: 44,
      addon: "distribution"
    },
    title: "授权证书"
  },
  "packages-distribute-ranking": {
    path: "/packages/distribute/ranking",
    name: "packages-distribute-ranking",
    meta: {
      name: "packages-distribute-ranking",
      isNVue: false,
      pagePath: "packages/distribute/ranking",
      windowTop: 44,
      addon: "distribution"
    },
    title: "排行榜"
  },
  "packages-distribute-level": {
    path: "/packages/distribute/level",
    name: "packages-distribute-level",
    meta: {
      name: "packages-distribute-level",
      isNVue: false,
      pagePath: "packages/distribute/level",
      windowTop: 44,
      addon: "distribution"
    },
    title: "等级详情"
  },
  "packages-bonus-apply": {
    path: "/packages/bonus/apply",
    name: "packages-bonus-apply",
    meta: {
      name: "packages-bonus-apply",
      isNVue: false,
      pagePath: "packages/bonus/apply",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "申请分销商"
  },
  "packages-bonus-detail": {
    path: "/packages/bonus/detail",
    name: "packages-bonus-detail",
    meta: {
      name: "packages-bonus-detail",
      isNVue: false,
      pagePath: "packages/bonus/detail",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分红金额"
  },
  "packages-bonus-log": {
    path: "/packages/bonus/log",
    name: "packages-bonus-log",
    meta: {
      name: "packages-bonus-log",
      isNVue: false,
      pagePath: "packages/bonus/log",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分红明细"
  },
  "packages-bonus-order": {
    path: "/packages/bonus/order",
    name: "packages-bonus-order",
    meta: {
      name: "packages-bonus-order",
      isNVue: false,
      pagePath: "packages/bonus/order",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分红订单"
  },
  "packages-bonus-credential": {
    path: "/packages/bonus/credential",
    name: "packages-bonus-credential",
    meta: {
      name: "packages-bonus-credential",
      isNVue: false,
      pagePath: "packages/bonus/credential",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "授权证书"
  },
  "packages-bonus-level": {
    path: "/packages/bonus/level",
    name: "packages-bonus-level",
    meta: {
      name: "packages-bonus-level",
      isNVue: false,
      pagePath: "packages/bonus/level",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "等级详情",
    paramExplain: "type:等级类型"
  },
  "packages-bonus-delivery-list": {
    path: "/packages/bonus/delivery/list",
    name: "packages-bonus-delivery-list",
    meta: {
      name: "packages-bonus-delivery-list",
      isNVue: false,
      pagePath: "packages/bonus/delivery/list",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "发货订单",
    paramExplain: ""
  },
  "packages-bonus-delivery-post": {
    path: "/packages/bonus/delivery/post",
    name: "packages-bonus-delivery-post",
    meta: {
      name: "packages-bonus-delivery-post",
      isNVue: false,
      pagePath: "packages/bonus/delivery/post",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "订单发货",
    paramExplain: ""
  },
  "packages-channel-apply": {
    path: "/packages/channel/apply",
    name: "packages-channel-apply",
    meta: {
      name: "packages-channel-apply",
      isNVue: false,
      pagePath: "packages/channel/apply",
      windowTop: 44,
      addon: "channel"
    },
    title: "申请分销商"
  },
  "packages-channel-goods": {
    path: "/packages/channel/goods",
    name: "packages-channel-goods",
    meta: {
      name: "packages-channel-goods",
      isNVue: false,
      pagePath: "packages/channel/goods",
      windowTop: 44,
      addon: "channel"
    },
    title: "商品",
    paramExplain: "type:商品类型(采购/提货)"
  },
  "packages-channel-team": {
    path: "/packages/channel/team",
    name: "packages-channel-team",
    meta: {
      name: "packages-channel-team",
      isNVue: false,
      pagePath: "packages/channel/team",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的团队"
  },
  "packages-channel-depot-index": {
    path: "/packages/channel/depot/index",
    name: "packages-channel-depot-index",
    meta: {
      name: "packages-channel-depot-index",
      isNVue: false,
      pagePath: "packages/channel/depot/index",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的仓库"
  },
  "packages-channel-depot-log": {
    path: "/packages/channel/depot/log",
    name: "packages-channel-depot-log",
    meta: {
      name: "packages-channel-depot-log",
      isNVue: false,
      pagePath: "packages/channel/depot/log",
      windowTop: 44,
      addon: "channel"
    },
    title: "云仓日志"
  },
  "packages-channel-depot-list": {
    path: "/packages/channel/depot/list",
    name: "packages-channel-depot-list",
    meta: {
      name: "packages-channel-depot-list",
      isNVue: false,
      pagePath: "packages/channel/depot/list",
      windowTop: 44,
      addon: "channel"
    },
    title: "云仓库"
  },
  "packages-channel-depot-detail": {
    path: "/packages/channel/depot/detail",
    name: "packages-channel-depot-detail",
    meta: {
      name: "packages-channel-depot-detail",
      isNVue: false,
      pagePath: "packages/channel/depot/detail",
      windowTop: 44,
      addon: "channel"
    },
    title: "商品明细",
    paramExplain: "sku_id:商品skuid"
  },
  "packages-channel-achieve": {
    path: "/packages/channel/achieve",
    name: "packages-channel-achieve",
    meta: {
      name: "packages-channel-achieve",
      isNVue: false,
      pagePath: "packages/channel/achieve",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的业绩"
  },
  "packages-channel-finance": {
    path: "/packages/channel/finance",
    name: "packages-channel-finance",
    meta: {
      name: "packages-channel-finance",
      isNVue: false,
      pagePath: "packages/channel/finance",
      windowTop: 44,
      addon: "channel"
    },
    title: "财务管理"
  },
  "packages-channel-order-list": {
    path: "/packages/channel/order/list",
    name: "packages-channel-order-list",
    meta: {
      name: "packages-channel-order-list",
      isNVue: false,
      pagePath: "packages/channel/order/list",
      windowTop: 44,
      addon: "channel"
    },
    title: "订单列表",
    paramExplain: "type:订单类型"
  },
  "packages-channel-order-detail": {
    path: "/packages/channel/order/detail",
    name: "packages-channel-order-detail",
    meta: {
      name: "packages-channel-order-detail",
      isNVue: false,
      pagePath: "packages/channel/order/detail",
      windowTop: 44,
      addon: "channel"
    },
    title: "订单详情",
    paramExplain: "type:订单类型,order_id:订单id"
  },
  "packages-channel-order-confirm": {
    path: "/packages/channel/order/confirm",
    name: "packages-channel-order-confirm",
    meta: {
      name: "packages-channel-order-confirm",
      isNVue: false,
      pagePath: "packages/channel/order/confirm",
      windowTop: 44,
      addon: "channel"
    },
    title: "确认订单",
    paramExplain: "type:商品类型"
  },
  "packages-channel-credential": {
    path: "/packages/channel/credential",
    name: "packages-channel-credential",
    meta: {
      name: "packages-channel-credential",
      isNVue: false,
      pagePath: "packages/channel/credential",
      windowTop: 44,
      addon: "channel"
    },
    title: "授权证书"
  },
  

  "packages-regionagent-level": {
    path: "/packages/regionagent/level",
    name: "packages-regionagent-level",
    meta: {
      name: "packages-regionagent-level",
      isNVue: false,
      pagePath: "packages/regionagent/level",
      windowTop: 44,
      addon: "regionagent"
    },
    title: "等级详情"
  },
  
  "packages-microshop-apply": {
    path: "/packages/microshop/apply",
    name: "packages-microshop-apply",
    meta: {
      name: "packages-microshop-apply",
      isNVue: false,
      pagePath: "packages/microshop/apply",
      windowTop: 44,
      addon: "microshop"
    },
    title: "申请"
  },
  "packages-microshop-home": {
    path: "/packages/microshop/home",
    name: "packages-microshop-home",
    meta: {
      name: "packages-microshop-home",
      isNVue: false,
      pagePath: "packages/microshop/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "微店"
  },
  "packages-microshop-qrcode": {
    path: "/packages/microshop/qrcode",
    name: "packages-microshop-qrcode",
    meta: {
      name: "packages-microshop-qrcode",
      isNVue: false,
      pagePath: "packages/microshop/qrcode",
      windowTop: 44,
      addon: "microshop"
    },
    title: "分享微店"
  },
  "packages-microshop-profit-detail": {
    path: "/packages/microshop/profit/detail",
    name: "packages-microshop-profit-detail",
    meta: {
      name: "packages-microshop-profit-detail",
      isNVue: false,
      pagePath: "packages/microshop/profit/detail",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店收益"
  },
  "packages-microshop-profit-log": {
    path: "/packages/microshop/profit/log",
    name: "packages-microshop-profit-log",
    meta: {
      name: "packages-microshop-profit-log",
      isNVue: false,
      pagePath: "packages/microshop/profit/log",
      windowTop: 44,
      addon: "microshop"
    },
    title: "收益明细"
  },
  "packages-microshop-profit-withdraw": {
    path: "/packages/microshop/profit/withdraw",
    name: "packages-microshop-profit-withdraw",
    meta: {
      name: "packages-microshop-profit-withdraw",
      isNVue: false,
      pagePath: "packages/microshop/profit/withdraw",
      windowTop: 44,
      addon: "microshop"
    },
    title: "收益提现"
  },
  "packages-microshop-level": {
    path: "/packages/microshop/level",
    name: "packages-microshop-level",
    meta: {
      name: "packages-microshop-level",
      isNVue: false,
      pagePath: "packages/microshop/level",
      windowTop: 44,
      addon: "microshop"
    },
    title: "等级中心"
  },
  "packages-microshop-goods-category": {
    path: "/packages/microshop/goods/category",
    name: "packages-microshop-goods-category",
    meta: {
      name: "packages-microshop-goods-category",
      isNVue: false,
      pagePath: "packages/microshop/goods/category",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "商品分类"
  },
  "packages-microshop-goods-list": {
    path: "/packages/microshop/goods/list",
    name: "packages-microshop-goods-list",
    meta: {
      name: "packages-microshop-goods-list",
      isNVue: false,
      pagePath: "packages/microshop/goods/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "商品列表"
  },
  "packages-microshop-set-index": {
    path: "/packages/microshop/set/index",
    name: "packages-microshop-set-index",
    meta: {
      name: "packages-microshop-set-index",
      isNVue: false,
      pagePath: "packages/microshop/set/index",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店管理"
  },
  "packages-microshop-set-info": {
    path: "/packages/microshop/set/info",
    name: "packages-microshop-set-info",
    meta: {
      name: "packages-microshop-set-info",
      isNVue: false,
      pagePath: "packages/microshop/set/info",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店信息"
  },
  "packages-microshop-set-logo": {
    path: "/packages/microshop/set/logo",
    name: "packages-microshop-set-logo",
    meta: {
      name: "packages-microshop-set-logo",
      isNVue: false,
      pagePath: "packages/microshop/set/logo",
      windowTop: 44,
      addon: "microshop"
    },
    title: "logo"
  },
  "packages-microshop-order-confirm": {
    path: "/packages/microshop/order/confirm",
    name: "packages-microshop-order-confirm",
    meta: {
      name: "packages-microshop-order-confirm",
      isNVue: false,
      pagePath: "packages/microshop/order/confirm",
      windowTop: 44,
      addon: "microshop"
    },
    title: "确认订单"
  },
  "packages-microshop-credential": {
    path: "/packages/microshop/credential",
    name: "packages-microshop-credential",
    meta: {
      name: "packages-microshop-credential",
      isNVue: false,
      pagePath: "packages/microshop/credential",
      windowTop: 44,
      addon: "microshop"
    },
    title: "授权证书"
  },
  "packages-integral-goods-list": {
    path: "/packages/integral/goods/list",
    name: "packages-integral-goods-list",
    meta: {
      name: "packages-integral-goods-list",
      isNVue: false,
      pagePath: "packages/integral/goods/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品列表"
  },
  "packages-integral-goods-category": {
    path: "/packages/integral/goods/category",
    name: "packages-integral-goods-category",
    meta: {
      name: "packages-integral-goods-category",
      isNVue: false,
      pagePath: "packages/integral/goods/category",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品分类"
  },
  "packages-integral-goods-detail": {
    path: "/packages/integral/goods/detail",
    name: "packages-integral-goods-detail",
    meta: {
      name: "packages-integral-goods-detail",
      isNVue: false,
      pagePath: "packages/integral/goods/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品详情",
    paramExplain: "goods_id:商品id"
  },
  "packages-integral-order-confirm": {
    path: "/packages/integral/order/confirm",
    name: "packages-integral-order-confirm",
    meta: {
      name: "packages-integral-order-confirm",
      isNVue: false,
      pagePath: "packages/integral/order/confirm",
      windowTop: 44,
      addon: "integral"
    },
    title: "确认订单",
    paramExplain: "param:确认订单所需参数object"
  },
  "packages-message-notice": {
    path: "/packages/message/notice",
    name: "packages-message-notice",
    meta: {
      name: "packages-message-notice",
      isNVue: false,
      pagePath: "packages/message/notice",
      windowTop: 44
    },
    title: "消息通知"
  },
  "packages-message-list": {
    path: "/packages/message/list",
    name: "packages-message-list",
    meta: {
      name: "packages-message-list",
      isNVue: false,
      pagePath: "packages/message/list",
      windowTop: 44
    },
    title: "消息列表"
  },
  "packages-message-chat": {
    path: "/packages/message/chat",
    name: "packages-message-chat",
    meta: {
      name: "packages-message-chat",
      isNVue: false,
      pagePath: "packages/message/chat",
      windowTop: 44,
      addon: "qlkefu"
    },
    title: "消息会话",
    paramExplain: "seller:商户标识,kefu_code:客服标识"
  },
  "packages-wheelsurf-index": {
    path: "/packages/wheelsurf/index",
    name: "packages-wheelsurf-index",
    meta: {
      name: "packages-wheelsurf-index",
      isNVue: false,
      pagePath: "packages/wheelsurf/index",
      windowTop: 44,
      shareType: "current",
      addon: "wheelsurf",
      noLogin: true
    },
    title: "幸运大转盘",
    paramExplain: "wheelsurf_id:大转盘id"
  },
  "packages-smashegg-index": {
    path: "/packages/smashegg/index",
    name: "packages-smashegg-index",
    meta: {
      name: "packages-smashegg-index",
      isNVue: false,
      pagePath: "packages/smashegg/index",
      windowTop: 44,
      shareType: "current",
      addon: "smashegg",
      noLogin: true
    },
    title: "砸金蛋",
    paramExplain: "smashegg_id:砸金蛋id"
  },
  "packages-prize-list": {
    path: "/packages/prize/list",
    name: "packages-prize-list",
    meta: {
      name: "packages-prize-list",
      isNVue: false,
      pagePath: "packages/prize/list",
      windowTop: 44
    },
    title: "奖品列表"
  },
  "packages-prize-confirm": {
    path: "/packages/prize/confirm",
    name: "packages-prize-confirm",
    meta: {
      name: "packages-prize-confirm",
      isNVue: false,
      pagePath: "packages/prize/confirm",
      windowTop: 44
    },
    title: "奖品确认"
  },
  "packages-prize-result": {
    path: "/packages/prize/result",
    name: "packages-prize-result",
    meta: {
      name: "packages-prize-result",
      isNVue: false,
      pagePath: "packages/prize/result",
      windowTop: 44
    },
    title: "领取结果"
  },
  "packages-scratchcard-index": {
    path: "/packages/scratchcard/index",
    name: "packages-scratchcard-index",
    meta: {
      name: "packages-scratchcard-index",
      isNVue: false,
      pagePath: "packages/scratchcard/index",
      windowTop: 44,
      shareType: "current",
      addon: "scratchcard",
      noLogin: true
    },
    title: "刮刮乐",
    paramExplain: "scratchcard_id:刮刮乐id"
  },
  "packages-followgift-index": {
    path: "/packages/followgift/index",
    name: "packages-followgift-index",
    meta: {
      name: "packages-followgift-index",
      isNVue: false,
      pagePath: "packages/followgift/index",
      windowTop: 44,
      shareType: "current",
      addon: "followgift"
    },
    title: "关注有礼",
    paramExplain: "followgift_id:关注有礼id"
  },
  "packages-festivalcare-index": {
    path: "/packages/festivalcare/index",
    name: "packages-festivalcare-index",
    meta: {
      name: "packages-festivalcare-index",
      isNVue: false,
      pagePath: "packages/festivalcare/index",
      windowTop: 44,
      shareType: "current",
      addon: "festivalcare"
    },
    title: "节日关怀",
    paramExplain: "festivalcare_id:节日关怀id"
  },
  "packages-signin-log": {
    path: "/packages/signin/log",
    name: "packages-signin-log",
    meta: {
      name: "packages-signin-log",
      isNVue: false,
      pagePath: "packages/signin/log",
      windowTop: 44,
      addon: "signin"
    },
    title: "签到明细"
  },
  "packages-task-list": {
    path: "/packages/task/list",
    name: "packages-task-list",
    meta: {
      name: "packages-task-list",
      isNVue: false,
      pagePath: "packages/task/list",
      windowTop: 44,
      addon: "taskcenter"
    },
    title: "我的任务"
  },
  "packages-task-detail": {
    path: "/packages/task/detail",
    name: "packages-task-detail",
    meta: {
      name: "packages-task-detail",
      isNVue: false,
      pagePath: "packages/task/detail",
      windowTop: 44,
      addon: "taskcenter"
    },
    title: "任务详情",
    paramExplain: "task_id:任务id"
  },
  "packages-course-list": {
    path: "/packages/course/list",
    name: "packages-course-list",
    meta: {
      name: "packages-course-list",
      isNVue: false,
      pagePath: "packages/course/list",
      windowTop: 44
    },
    title: "我的课程"
  },
  "packages-course-detail": {
    path: "/packages/course/detail",
    name: "packages-course-detail",
    meta: {
      name: "packages-course-detail",
      isNVue: false,
      pagePath: "packages/course/detail",
      windowTop: 44
    },
    title: "课程详情",
    paramExplain: "goods_id:商品id/knowledge_payment_id:课程id"
  },
  "packages-invoice-detail": {
    path: "/packages/invoice/detail",
    name: "packages-invoice-detail",
    meta: {
      name: "packages-invoice-detail",
      isNVue: false,
      pagePath: "packages/invoice/detail",
      windowTop: 44,
      addon: "invoice"
    },
    title: "发票详情",
    paramExplain: "order_no:订单no"
  },
  "packages-anticounterfeiting-index": {
    path: "/packages/anticounterfeiting/index",
    name: "packages-anticounterfeiting-index",
    meta: {
      name: "packages-anticounterfeiting-index",
      isNVue: false,
      pagePath: "packages/anticounterfeiting/index",
      windowTop: 44,
      noLogin: true,
      addon: "anticounterfeiting"
    },
    title: "防伪溯源商品查询"
  },
  "packages-anticounterfeiting-result": {
    path: "/packages/anticounterfeiting/result",
    name: "packages-anticounterfeiting-result",
    meta: {
      name: "packages-anticounterfeiting-result",
      isNVue: false,
      pagePath: "packages/anticounterfeiting/result",
      windowTop: 44,
      noLogin: true,
      addon: "anticounterfeiting"
    },
    title: "查询结果"
  },
  "packages-credential-index": {
    path: "/packages/credential/index",
    name: "packages-credential-index",
    meta: {
      name: "packages-credential-index",
      isNVue: false,
      pagePath: "packages/credential/index",
      windowTop: 44,
      noLogin: true,
      addon: "credential"
    },
    title: "查询授权证书"
  },
  "packages-credential-result": {
    path: "/packages/credential/result",
    name: "packages-credential-result",
    meta: {
      name: "packages-credential-result",
      isNVue: false,
      pagePath: "packages/credential/result",
      windowTop: 44,
      addon: "credential"
    },
    title: "授权证书查询结果"
  },
  "packages-thingcircle-report": {
    path: "/packages/thingcircle/report",
    name: "packages-thingcircle-report",
    meta: {
      name: "packages-thingcircle-report",
      isNVue: false,
      pagePath: "packages/thingcircle/report",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "举报评论",
    paramExplain: "comment_id:举报评论id"
  },
  "packages-thingcircletwo-report": {
    path: "/packages/thingcircletwo/report",
    name: "packages-thingcircletwo-report",
    meta: {
      name: "packages-thingcircletwo-report",
      isNVue: false,
      pagePath: "packages/thingcircletwo/report",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "举报评论",
    paramExplain: "comment_id:举报评论id"
  },
  "packages-thingcircle-fans": {
    path: "/packages/thingcircle/fans",
    name: "packages-thingcircle-fans",
    meta: {
      name: "packages-thingcircle-fans",
      isNVue: false,
      pagePath: "packages/thingcircle/fans",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的粉丝"
  },
  "packages-thingcircletwo-fans": {
    path: "/packages/thingcircletwo/fans",
    name: "packages-thingcircletwo-fans",
    meta: {
      name: "packages-thingcircletwo-fans",
      isNVue: false,
      pagePath: "packages/thingcircletwo/fans",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "我的粉丝"
  },
  "packages-thingcircle-release-index": {
    path: "/packages/thingcircle/release/index",
    name: "packages-thingcircle-release-index",
    meta: {
      name: "packages-thingcircle-release-index",
      isNVue: false,
      pagePath: "packages/thingcircle/release/index",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "发布干货"
  },

  "packages-thingcircle-follow": {
    path: "/packages/thingcircle/follow",
    name: "packages-thingcircle-follow",
    meta: {
      name: "packages-thingcircle-follow",
      isNVue: false,
      pagePath: "packages/thingcircle/follow",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的关注"
  },
  "packages-thingcircletwo-follow": {
    path: "/packages/thingcircletwo/follow",
    name: "packages-thingcircletwo-follow",
    meta: {
      name: "packages-thingcircletwo-follow",
      isNVue: false,
      pagePath: "packages/thingcircletwo/follow",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "我的关注"
  },

  "packages-thingcircle-release-goods": {
    path: "/packages/thingcircle/release/goods",
    name: "packages-thingcircle-release-goods",
    meta: {
      name: "packages-thingcircle-release-goods",
      isNVue: false,
      pagePath: "packages/thingcircle/release/goods",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "推荐商品"
  },
  "packages-thingcircletwo-release-goods": {
    path: "/packages/thingcircletwo/release/goods",
    name: "packages-thingcircletwo-release-goods",
    meta: {
      name: "packages-thingcircletwo-release-goods",
      isNVue: false,
      pagePath: "packages/thingcircletwo/release/goods",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "推荐商品"
  },
  "packages-thingcircle-release-topic": {
    path: "/packages/thingcircle/release/topic",
    name: "packages-thingcircle-release-topic",
    meta: {
      name: "packages-thingcircle-release-topic",
      isNVue: false,
      pagePath: "packages/thingcircle/release/topic",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "话题"
  },
  "packages-thingcircletwo-release-topic": {
    path: "/packages/thingcircletwo/release/topic",
    name: "packages-thingcircletwo-release-topic",
    meta: {
      name: "packages-thingcircletwo-release-topic",
      isNVue: false,
      pagePath: "packages/thingcircletwo/release/topic",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "话题"
  },
  "packages-thingcircle-collect": {
    path: "/packages/thingcircle/collect",
    name: "packages-thingcircle-collect",
    meta: {
      name: "packages-thingcircle-collect",
      isNVue: false,
      pagePath: "packages/thingcircle/collect",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "赞和收藏"
  },
  "packages-thingcircletwo-collect": {
    path: "/packages/thingcircletwo/collect",
    name: "packages-thingcircletwo-collect",
    meta: {
      name: "packages-thingcircletwo-collect",
      isNVue: false,
      pagePath: "packages/thingcircletwo/collect",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "赞和收藏"
  },
  "packages-thingcircle-comment": {
    path: "/packages/thingcircle/comment",
    name: "packages-thingcircle-comment",
    meta: {
      name: "packages-thingcircle-comment",
      isNVue: false,
      pagePath: "packages/thingcircle/comment",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "评论和@"
  },
  "packages-thingcircletwo-comment": {
    path: "/packages/thingcircletwo/comment",
    name: "packages-thingcircletwo-comment",
    meta: {
      name: "packages-thingcircletwo-comment",
      isNVue: false,
      pagePath: "packages/thingcircletwo/comment",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "评论和@"
  },
  "packages-thingcircle-notice": {
    path: "/packages/thingcircle/notice",
    name: "packages-thingcircle-notice",
    meta: {
      name: "packages-thingcircle-notice",
      isNVue: false,
      pagePath: "packages/thingcircle/notice",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "消息通知"
  },
  "packages-thingcircletwo-notice": {
    path: "/packages/thingcircletwo/notice",
    name: "packages-thingcircletwo-notice",
    meta: {
      name: "packages-thingcircletwo-notice",
      isNVue: false,
      pagePath: "packages/thingcircletwo/notice",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "消息通知"
  },
  "packages-thingcircle-mine": {
    path: "/packages/thingcircle/mine",
    name: "packages-thingcircle-mine",
    meta: {
      name: "packages-thingcircle-mine",
      isNVue: false,
      pagePath: "packages/thingcircle/mine",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的",
    paramExplain: ""
  },
  "packages-thingcircletwo-mine": {
    path: "/packages/thingcircletwo/mine",
    name: "packages-thingcircletwo-mine",
    meta: {
      name: "packages-thingcircletwo-mine",
      isNVue: false,
      pagePath: "packages/thingcircletwo/mine",
      windowTop: 44,
      addon: "thingcircletwo"
    },
    title: "我的",
    paramExplain: ""
  },
  "packages-thingcircle-detail": {
    path: "/packages/thingcircle/detail",
    name: "packages-thingcircle-detail",
    meta: {
      name: "packages-thingcircle-detail",
      isNVue: false,
      pagePath: "packages/thingcircle/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "thingcircle"
    },
    title: "粉丝生活",
    paramExplain: "thing_id:圈id"
  },
  "packages-thingcircletwo-detail": {
    path: "/packages/thingcircletwo/detail",
    name: "packages-thingcircletwo-detail",
    meta: {
      name: "packages-thingcircletwo-detail",
      isNVue: false,
      pagePath: "packages/thingcircletwo/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "thingcircletwo"
    },
    title: "粉丝生活",
    paramExplain: "thing_id:圈id"
  },

  "packages-assemble-list": {
    path: "/packages/assemble/list",
    name: "packages-assemble-list",
    meta: {
      name: "packages-assemble-list",
      isNVue: false,
      pagePath: "packages/assemble/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "groupshopping"
    },
    title: "拼团列表"
  },
  "packages-assemble-detail": {
    path: "/packages/assemble/detail",
    name: "packages-assemble-detail",
    meta: {
      name: "packages-assemble-detail",
      isNVue: false,
      pagePath: "packages/assemble/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "groupshopping"
    },
    title: "拼团详情",
    paramExplain: "record_id:团id"
  },
  "packages-seckill-list": {
    path: "/packages/seckill/list",
    name: "packages-seckill-list",
    meta: {
      name: "packages-seckill-list",
      isNVue: false,
      pagePath: "packages/seckill/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "seckill"
    },
    title: "秒杀列表"
  },
  "packages-bargain-list": {
    path: "/packages/bargain/list",
    name: "packages-bargain-list",
    meta: {
      name: "packages-bargain-list",
      isNVue: false,
      pagePath: "packages/bargain/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "砍价列表"
  },
  "packages-bargain-mybargainlist": {
    path: "/packages/bargain/mybargainlist",
    name: "packages-bargain-mybargainlist",
    meta: {
      name: "packages-bargain-mybargainlist",
      isNVue: false,
      pagePath: "packages/bargain/mybargainlist",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "我的砍价列表"
  },
  "packages-bargain-detail": {
    path: "/packages/bargain/detail",
    name: "packages-bargain-detail",
    meta: {
      name: "packages-bargain-detail",
      isNVue: false,
      pagePath: "packages/bargain/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "砍价详情",
    paramExplain: "goods_id:商品id,bargain_id:砍价id,bargain_uid:砍价用户id"
  },
  "packages-giftvoucher-list": {
    path: "/packages/giftvoucher/list",
    name: "packages-giftvoucher-list",
    meta: {
      name: "packages-giftvoucher-list",
      isNVue: false,
      pagePath: "packages/giftvoucher/list",
      windowTop: 44,
      addon: "giftvoucher"
    },
    title: "礼品券列表"
  },
  "packages-giftvoucher-detail": {
    path: "/packages/giftvoucher/detail",
    name: "packages-giftvoucher-detail",
    meta: {
      name: "packages-giftvoucher-detail",
      isNVue: false,
      pagePath: "packages/giftvoucher/detail",
      windowTop: 44,
      addon: "giftvoucher"
    },
    title: "礼品券详情",
    paramExplain: "record_id:礼品券记录id"
  },
  "packages-giftvoucher-receive": {
    path: "/packages/giftvoucher/receive",
    name: "packages-giftvoucher-receive",
    meta: {
      name: "packages-giftvoucher-receive",
      isNVue: false,
      pagePath: "packages/giftvoucher/receive",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "giftvoucher"
    },
    title: "领取礼品券",
    paramExplain: "giftvoucher_id:礼品券id"
  },
  "packages-voucherpackage-index": {
    path: "/packages/voucherpackage/index",
    name: "packages-voucherpackage-index",
    meta: {
      name: "packages-voucherpackage-index",
      isNVue: false,
      pagePath: "packages/voucherpackage/index",
      windowTop: 44,
      noLogin: true,
      addon: "voucherpackage"
    },
    title: "券包详情",
    paramExplain: "voucher_package_id:券包id"
  },
  "packages-consumercard-list": {
    path: "/packages/consumercard/list",
    name: "packages-consumercard-list",
    meta: {
      name: "packages-consumercard-list",
      isNVue: false,
      pagePath: "packages/consumercard/list",
      windowTop: 44
    },
    title: "消费卡"
  },
  "packages-consumercard-detail": {
    path: "/packages/consumercard/detail",
    name: "packages-consumercard-detail",
    meta: {
      name: "packages-consumercard-detail",
      isNVue: false,
      pagePath: "packages/consumercard/detail",
      windowTop: 44
    },
    title: "消费卡详情",
    paramExplain: "card_id:消费卡id"
  },
	"packages-consumercard-post": {
	  path: "/packages/consumercard/post",
	  name: "packages-consumercard-post",
	  meta: {
	    name: "packages-consumercard-post",
	    isNVue: false,
	    pagePath: "packages/consumercard/post",
	    windowTop: 44
	  },
	  title: "选择技师",
	},
	"packages-consumercard-technician": {
	  path: "/packages/consumercard/technician",
	  name: "packages-consumercard-technician",
	  meta: {
	    name: "packages-consumercard-technician",
	    isNVue: false,
	    pagePath: "packages/consumercard/technician",
	    windowTop: 44
	  },
	  title: "选择技师列表",
	},
	
	
	"packages-technician-post": {
	  path: "/packages/technician/post",
	  name: "packages-technician-post",
	  alias: ["/technician/post"],
	  meta: {
	    name: "packages-technician-post",
	    isNVue: false,
	    pagePath: "packages/technician/post",
	    windowTop: 44,
	    possTabBar: true,
	    noLogin: true,
	    shareType: "current",
			addon: "technician"
	  },
	  title: "申请技师"
	},
	"packages-technician-professional": {
	  path: "/packages/technician/professional",
	  name: "packages-technician-professional",
	  alias: ["/technician/professional"],
	  meta: {
	    name: "packages-technician-professional",
	    isNVue: false,
	    pagePath: "packages/technician/professional",
	    windowTop: 44,
	    possTabBar: true,
	    noLogin: true,
	    shareType: "current",
	  },
	  title: "选择技能"
	},
	
	
	
  "packages-deliverycode-list": {
    path: "/packages/deliverycode/list",
    name: "packages-deliverycode-list",
    meta: {
      name: "packages-deliverycode-list",
      isNVue: false,
      pagePath: "packages/deliverycode/list",
      windowTop: 44
    },
    title: "领货码"
  },
  "packages-deliverycode-bindcode": {
    path: "/packages/deliverycode/bindcode",
    name: "packages-deliverycode-bindcode",
    meta: {
      name: "packages-deliverycode-bindcode",
      isNVue: false,
      pagePath: "packages/deliverycode/bindcode",
      windowTop: 44
    },
    title: "绑定领货码"
  },
  "packages-help-list": {
    path: "/packages/help/list",
    name: "packages-help-list",
    meta: {
      name: "packages-help-list",
      isNVue: false,
      pagePath: "packages/help/list",
      windowTop: 44,
      addon: "helpcenter"
    },
    title: "帮助分类列表",
    paramExplain: ""
  },
  "packages-help-detail": {
    path: "/packages/help/detail",
    name: "packages-help-detail",
    meta: {
      name: "packages-help-detail",
      isNVue: false,
      pagePath: "packages/help/detail",
      windowTop: 44,
      noLogin: true,
      addon: "helpcenter"
    },
    title: "帮助详情",
    paramExplain: "detail_id:帮助文章id"
  },
  "packages-mplive-list": {
    path: "/packages/mplive/list",
    name: "packages-mplive-list",
    meta: {
      name: "packages-mplive-list",
      isNVue: false,
      pagePath: "packages/mplive/list",
      windowTop: 44,
      shareType: "current",
      addon: "mplive"
    },
    title: "直播广场",
    paramExplain: ""
  },
  "packages-membercard-index": {
    path: "/packages/membercard/index",
    name: "packages-membercard-index",
    meta: {
      name: "packages-membercard-index",
      isNVue: false,
      pagePath: "packages/membercard/index",
      windowTop: 44,
      addon: "membercard"
    },
    title: "会员卡",
    paramExplain: ""
  },
  "packages-membercard-code": {
    path: "/packages/membercard/code",
    name: "packages-membercard-code",
    meta: {
      name: "packages-membercard-code",
      isNVue: false,
      pagePath: "packages/membercard/code",
      windowTop: 44,
      addon: "membercard"
    },
    title: "会员码",
    paramExplain: ""
  },
  "packages-membercard-profit": {
    path: "/packages/membercard/profit",
    name: "packages-membercard-profit",
    meta: {
      name: "packages-membercard-profit",
      isNVue: false,
      pagePath: "packages/membercard/profit",
      windowTop: 44,
      addon: "membercard"
    },
    title: "权益介绍",
    paramExplain: ""
  },
  "packages-membercard-recharge": {
    path: "/packages/membercard/recharge",
    name: "packages-membercard-recharge",
    meta: {
      name: "packages-membercard-recharge",
      isNVue: false,
      pagePath: "packages/membercard/recharge",
      windowTop: 44,
      addon: "membercard"
    },
    title: "充值",
    paramExplain: ""
  },
  "packages-membercard-upgrade": {
    path: "/packages/membercard/upgrade",
    name: "packages-membercard-upgrade",
    meta: {
      name: "packages-membercard-upgrade",
      isNVue: false,
      pagePath: "packages/membercard/upgrade",
      windowTop: 44,
      addon: "membercard"
    },
    title: "升级",
    paramExplain: ""
  },
  "packages-membercard-log-list": {
    path: "/packages/membercard/log/list",
    name: "packages-membercard-log-list",
    meta: {
      name: "packages-membercard-log-list",
      isNVue: false,
      pagePath: "packages/membercard/log/list",
      windowTop: 44,
      addon: "membercard"
    },
    title: "明细列表",
    paramExplain: ""
  },
  "packages-membercard-log-detail": {
    path: "/packages/membercard/log/detail",
    name: "packages-membercard-log-detail",
    meta: {
      name: "packages-membercard-log-detail",
      isNVue: false,
      pagePath: "packages/membercard/log/detail",
      windowTop: 44,
      addon: "membercard"
    },
    title: "明细详情",
    paramExplain: ""
  },
  "packages-live-player": {
    path: "/packages/live/player",
    name: "packages-live-player",
    meta: {
      name: "packages-live-player",
      isNVue: false,
      pagePath: "packages/live/player",
      windowTop: 44,
      shareType: "current",
      addon: "liveshopping"
    },
    title: "直播间"
  },
  "packages-live-notice": {
    path: "/packages/live/notice",
    name: "packages-live-notice",
    meta: {
      name: "packages-live-notice",
      isNVue: false,
      pagePath: "packages/live/notice",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "开播通告"
  },
  "packages-live-end": {
    path: "/packages/live/end",
    name: "packages-live-end",
    meta: {
      name: "packages-live-end",
      isNVue: false,
      pagePath: "packages/live/end",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播结束"
  },
  "packages-live-report": {
    path: "/packages/live/report",
    name: "packages-live-report",
    meta: {
      name: "packages-live-report",
      isNVue: false,
      pagePath: "packages/live/report",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "举报"
  },
  "packages-live-anchor-player": {
    path: "/packages/live/anchor/player",
    name: "packages-live-anchor-player",
    meta: {
      name: "packages-live-anchor-player",
      isNVue: false,
      pagePath: "packages/live/anchor/player",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播间"
  },
  "packages-live-anchor-apply": {
    path: "/packages/live/anchor/apply",
    name: "packages-live-anchor-apply",
    meta: {
      name: "packages-live-anchor-apply",
      isNVue: false,
      pagePath: "packages/live/anchor/apply",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播申请"
  },
  "packages-live-anchor-info": {
    path: "/packages/live/anchor/info",
    name: "packages-live-anchor-info",
    meta: {
      name: "packages-live-anchor-info",
      isNVue: false,
      pagePath: "packages/live/anchor/info",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "开播信息"
  },
  "packages-live-anchor-notice": {
    path: "/packages/live/anchor/notice",
    name: "packages-live-anchor-notice",
    meta: {
      name: "packages-live-anchor-notice",
      isNVue: false,
      pagePath: "packages/live/anchor/notice",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "开播通告"
  },
  "packages-live-anchor-set": {
    path: "/packages/live/anchor/set",
    name: "packages-live-anchor-set",
    meta: {
      name: "packages-live-anchor-set",
      isNVue: false,
      pagePath: "packages/live/anchor/set",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "开播设置"
  },
  "packages-live-anchor-goods": {
    path: "/packages/live/anchor/goods",
    name: "packages-live-anchor-goods",
    meta: {
      name: "packages-live-anchor-goods",
      isNVue: false,
      pagePath: "packages/live/anchor/goods",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "添加商品"
  },
  "packages-live-anchor-end": {
    path: "/packages/live/anchor/end",
    name: "packages-live-anchor-end",
    meta: {
      name: "packages-live-anchor-end",
      isNVue: false,
      pagePath: "packages/live/anchor/end",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播结束"
  },
  "packages-live-mine-index": {
    path: "/packages/live/mine/index",
    name: "packages-live-mine-index",
    meta: {
      name: "packages-live-mine-index",
      isNVue: false,
      pagePath: "packages/live/mine/index",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的"
  },
  "packages-live-mine-apply": {
    path: "/packages/live/mine/apply",
    name: "packages-live-mine-apply",
    meta: {
      name: "packages-live-mine-apply",
      isNVue: false,
      pagePath: "packages/live/mine/apply",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "申请"
  },
  "packages-live-mine-info": {
    path: "/packages/live/mine/info",
    name: "packages-live-mine-info",
    meta: {
      name: "packages-live-mine-info",
      isNVue: false,
      pagePath: "packages/live/mine/info",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播信息"
  },
  "packages-live-mine-follow": {
    path: "/packages/live/mine/follow",
    name: "packages-live-mine-follow",
    meta: {
      name: "packages-live-mine-follow",
      isNVue: false,
      pagePath: "packages/live/mine/follow",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的关注"
  },
  "packages-live-mine-fans": {
    path: "/packages/live/mine/fans",
    name: "packages-live-mine-fans",
    meta: {
      name: "packages-live-mine-fans",
      isNVue: false,
      pagePath: "packages/live/mine/fans",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的粉丝"
  },
  "packages-live-mine-shop": {
    path: "/packages/live/mine/shop",
    name: "packages-live-mine-shop",
    meta: {
      name: "packages-live-mine-shop",
      isNVue: false,
      pagePath: "packages/live/mine/shop",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播小店"
  },
  "packages-live-mine-goods": {
    path: "/packages/live/mine/goods",
    name: "packages-live-mine-goods",
    meta: {
      name: "packages-live-mine-goods",
      isNVue: false,
      pagePath: "packages/live/mine/goods",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "挑选商品"
  },
  "packages-live-mine-history": {
    path: "/packages/live/mine/history",
    name: "packages-live-mine-history",
    meta: {
      name: "packages-live-mine-history",
      isNVue: false,
      pagePath: "packages/live/mine/history",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "观看历史"
  },
  "packages-merchant-apply": {
    path: "/packages/merchant/apply",
    name: "packages-merchant-apply",
    meta: {
      name: "packages-merchant-apply",
      isNVue: false,
      pagePath: "packages/merchant/apply",
      windowTop: 44,
      addon: "merchants"
    },
    title: "申请"
  },
  "packages-merchant-detail": {
    path: "/packages/merchant/detail",
    name: "packages-merchant-detail",
    meta: {
      name: "packages-merchant-detail",
      isNVue: false,
      pagePath: "packages/merchant/detail",
      windowTop: 44,
      addon: "merchants"
    },
    title: "详情"
  },
  "packages-merchant-log": {
    path: "/packages/merchant/log",
    name: "packages-merchant-log",
    meta: {
      name: "packages-merchant-log",
      isNVue: false,
      pagePath: "packages/merchant/log",
      windowTop: 44,
      addon: "merchants"
    },
    title: "明细"
  },
  "packages-merchant-member": {
    path: "/packages/merchant/member",
    name: "packages-merchant-member",
    meta: {
      name: "packages-merchant-member",
      isNVue: false,
      pagePath: "packages/merchant/member",
      windowTop: 44,
      addon: "merchants"
    },
    title: "招商员"
  },
  "packages-merchant-order": {
    path: "/packages/merchant/order",
    name: "packages-merchant-order",
    meta: {
      name: "packages-merchant-order",
      isNVue: false,
      pagePath: "packages/merchant/order",
      windowTop: 44,
      addon: "merchants"
    },
    title: "订单列表"
  },
  "packages-merchant-qrcode": {
    path: "/packages/merchant/qrcode",
    name: "packages-merchant-qrcode",
    meta: {
      name: "packages-merchant-qrcode",
      isNVue: false,
      pagePath: "packages/merchant/qrcode",
      windowTop: 44,
      addon: "merchants"
    },
    title: "推广码"
  },
  "packages-merchant-ranking": {
    path: "/packages/merchant/ranking",
    name: "packages-merchant-ranking",
    meta: {
      name: "packages-merchant-ranking",
      isNVue: false,
      pagePath: "packages/merchant/ranking",
      windowTop: 44,
      addon: "merchants"
    },
    title: "排行榜"
  },
  "packages-merchant-shop": {
    path: "/packages/merchant/shop",
    name: "packages-merchant-shop",
    meta: {
      name: "packages-merchant-shop",
      isNVue: false,
      pagePath: "packages/merchant/shop",
      windowTop: 44,
      addon: "merchants"
    },
    title: "店铺"
  },
  "packages-merchant-team": {
    path: "/packages/merchant/team",
    name: "packages-merchant-team",
    meta: {
      name: "packages-merchant-team",
      isNVue: false,
      pagePath: "packages/merchant/team",
      windowTop: 44,
      addon: "merchants"
    },
    title: "我的团队"
  },
  "packages-merchant-withdraw": {
    path: "/packages/merchant/withdraw",
    name: "packages-merchant-withdraw",
    meta: {
      name: "packages-merchant-withdraw",
      isNVue: false,
      pagePath: "packages/merchant/withdraw",
      windowTop: 44,
      addon: "merchants"
    },
    title: "提现"
  },
  "packages-level-index": {
    path: "/packages/level/index",
    name: "packages-level-index",
    meta: {
      name: "packages-level-index",
      isNVue: false,
      pagePath: "packages/level/index",
      windowTop: 44,
      addon: "paygrade"
    },
    title: "等级中心"
  },
  "packages-cps-list": {
    path: "/packages/cps/list",
    name: "packages-cps-list",
    meta: {
      name: "packages-cps-list",
      isNVue: false,
      pagePath: "packages/cps/list",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品列表"
  },
  "packages-cps-detail": {
    path: "/packages/cps/detail",
    name: "packages-cps-detail",
    meta: {
      name: "packages-cps-detail",
      isNVue: false,
      pagePath: "packages/cps/detail",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品详情"
  },
  "packages-cps-rule": {
    path: "/packages/cps/rule",
    name: "packages-cps-rule",
    meta: {
      name: "packages-cps-rule",
      isNVue: false,
      pagePath: "packages/cps/rule",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "规则"
  },
  "packages-cps-search": {
    path: "/packages/cps/search",
    name: "packages-cps-search",
    meta: {
      name: "packages-cps-search",
      isNVue: false,
      pagePath: "packages/cps/search",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品搜索"
  },
  "packages-cps-search-result": {
    path: "/packages/cps/search/result",
    name: "packages-cps-search-result",
    meta: {
      name: "packages-cps-search-result",
      isNVue: false,
      pagePath: "packages/cps/search/result",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "搜索结果"
  },
  "packages-friendster-index": {
    path: "/packages/friendster/index",
    name: "packages-friendster-index",
    meta: {
      name: "packages-friendster-index",
      isNVue: false,
      pagePath: "packages/friendster/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "friendscircle"
    },
    title: "朋友圈"
  },
"packages-lucklyspell-list": {
    path: "/packages/lucklyspell/list",
    name: "packages-lucklyspell-list",
    meta: {
      name: "packages-lucklyspell-list",
      isNVue: false,
      pagePath: "packages/lucklyspell/list",
      windowTop: 44,
      shareType: "current"
    },
    title: "幸运拼团列表"
  },
  "packages-lucklyspell-detail": {
    path: "/packages/lucklyspell/detail",
    name: "packages-lucklyspell-detail",
    meta: {
      name: "packages-lucklyspell-detail",
      isNVue: false,
      pagePath: "packages/lucklyspell/detail",
      windowTop: 44,
      shareType: "current"
    },
    title: "幸运拼团详情"
  },
  "packages-supplier-apply": {
    path: "/packages/supplier/apply",
    name: "packages-supplier-apply",
    meta: {
      name: "packages-supplier-apply",
      isNVue: false,
      pagePath: "packages/supplier/apply",
      windowTop: 44,
      shareType: "current",
      addon:"supplier"
    },
    title: "供应商入驻"
  }
};
