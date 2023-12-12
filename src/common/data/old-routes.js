// h5端旧路由
// #ifndef MP-WEIXIN
export const oldRoute = {
  "/": { path: "/pages/mall/index", query: {} },
  "/mall": { path: "/pages/mall/index", query: {} },
  "/mall/index": { path: "/pages/mall/index", query: {} },
  "/diy": { path: "/packages/mall/diy", query: { id: "" } },
  "/goods/category": { path: "/pages/goods/category", query: {} },
  "/goods/list": { path: "/pages/goods/list", query: {} },
  "/goods/detail": { path: "/packages/goods/detail", query: { goods_id: "" } },
  "/mall/cart": { path: "/pages/mall/cart", query: {} },
  "/shop/home": { path: "/packages/shop/home", query: { shop_id: "" } },
  "/shop/home/0": { path: "/packages/shop/home", query: { shop_id: 0 } },
  "/shop/list": { path: "/pages/shop/list", query: {} },
  "/shop/collection": { path: "/packages/shop/collect", query: {} },
  "/shop/apply": { path: "/packages/shop/business/index", query: {} },
  "/shop/centre": { path: "/packages/shop/business/index", query: {} },
  "/store/list": { path: "/pages/store/list", query: {} },
  "/member/centre": { path: "/pages/member/index", query: {} },
  "/member/level": { path: "/packages/member/level", query: {} },
  "/order/list": { path: "/pages/order/list", query: {} },
  "/property": { path: "/pages/property/index", query: {} },
  "/property/balance": { path: "/packages/property/balance", query: {} },
  "/property/withdraw": { path: "/packages/property/withdraw", query: {} },
  "/property/recharge": { path: "/packages/property/recharge", query: {} },
  "/property/log": { path: "/packages/property/log", query: {} },
  "/property/points": { path: "/packages/property/points", query: {} },
  "/property/account": { path: "/packages/property/account/list", query: {} },
  "/coupon/list": { path: "/packages/coupon/list", query: {} },
  "/giftvoucher/list": { path: "/packages/giftvoucher/list", query: {} },
  "/consumercard/list": { path: "/packages/consumercard/list", query: {} },
  "/goods/collection": { path: "/packages/goods/collect", query: {} },
  "/address/list": { path: "/packages/member/address/list", query: {} },
  "/account/set": { path: "/packages/member/set", query: {} },
  "/message": { path: "/pages/message/index", query: {} },
  "/course/list": { path: "/packages/course/list", query: {} },
  "/seckill/list": { path: "/packages/seckill/list", query: {} },
  "/bargain/list": { path: "/packages/bargain/list", query: {} },
  "/assemble/list": { path: "/packages/assemble/list", query: {} },
  "/coupon/centre": { path: "/pages/coupon/index", query: {} },
  "/signin": { path: "/pages/signin/index", query: {} },
  "/signin/index": { path: "/pages/signin/index", query: {} },
  "/prize/list": { path: "/packages/prize/list", query: {} },
  "/commission/centre": { path: "/pages/distribute/index", query: {} },
  "/commission/level": { path: "/packages/distribute/level", query: {} },
  "/commission/order": { path: "/packages/distribute/order", query: {} },
  "/commission/detail": { path: "/packages/distribute/detail", query: {} },
  "/commission/withdraw": { path: "/packages/distribute/withdraw", query: {} },
  "/commission/log": { path: "/packages/distribute/log", query: {} },
  "/commission/team": { path: "/packages/distribute/team", query: {} },
  "/commission/customer": { path: "/packages/distribute/customer", query: {} },
  "/commission/qrcode": { path: "/packages/distribute/qrcode", query: {} },
  "/commission/ranking": { path: "/packages/distribute/ranking", query: {} },
  "/commission/certificate": {
    path: "/packages/distribute/credential",
    query: {}
  },
  "/bonus/centre": { path: "/pages/bonus/index", query: {} },
  "/bonus/detail": { path: "/packages/bonus/detail", query: {} },
  "/bonus/log": { path: "/packages/bonus/log", query: {} },
  "/bonus/order": { path: "/packages/bonus/order", query: {} },
  "/bonus/level/1": { path: "/packages/bonus/level", query: { type: 1 } },
  "/bonus/level/2": { path: "/packages/bonus/level", query: { type: 2 } },
  "/bonus/level/3": { path: "/packages/bonus/level", query: { type: 3 } },
  "/integral/index": { path: "/pages/integral/index", query: {} },
  "/integral/category": {
    path: "/packages/integral/goods/category",
    query: {}
  },
  "/integral/goods/list": { path: "/packages/integral/goods/list", query: {} },

  "/certificate/index": { path: "/packages/credential/index", query: {} },
  "/credential/index": { path: "/packages/credential/index", query: {} },
  "/credential/result": { path: "/packages/credential/result", query: {} },
  "/channel/centre": { path: "/pages/channel/index", query: {} },
  "/microshop/centre": { path: "/pages/microshop/index", query: {} },
  "/task/centre": { path: "/pages/task/index", query: {} },
  "/thingcircle/index": { path: "/pages/thingcircle/index", query: {} },
  "/thingcircletwo/index": { path: "/pages/thingcircletwo/index", query: {} },
  "/thingcircle/home": { path: "/pages/thingcircle/index", query: {} },
  "/thingcircletwo/home": { path: "/pages/thingcircletwo/index", query: {} },
  "/anticounterfeiting/index": {
    path: "/packages/anticounterfeiting/index",
    query: {}
  },
  "/help/index": { path: "/pages/help/index", query: {} }
};
// #endif

// 微信小程序端旧路由
// #ifdef MP-WEIXIN
export const oldRoute = {
  "pages/index/index": { path: "/pages/mall/index", query: {} },
  "pages/category/index": { path: "/pages/goods/category", query: {} },
  "pages/goodlist/index": { path: "/pages/goods/list", query: {} },
  "pages/shopcart/index": { path: "/pages/mall/cart", query: {} },
  "pages/shop/home/index": {
    path: "/packages/shop/home",
    query: { shop_id: 0 }
  },
  "pages/shop/home/index?shopId=0": {
    path: "/packages/shop/home",
    query: { shop_id: 0 }
  },
  "pages/shop/list/index": { path: "/pages/shop/list", query: {} },
  "pages/custom/index": { path: "/packages/mall/diy", query: { page_id: "" } },
  "pages/shop/centre/index": {
    path: "/packages/shop/business/index",
    query: {}
  },
  "pages/member/index": { path: "/pages/member/index", query: {} },
  "pages/order/list/index": { path: "/pages/order/list", query: {} },
  "package/pages/property/myProperty/index": {
    path: "/pages/property/index",
    query: {}
  },
  "package/pages/property/balance/index": {
    path: "/packages/property/balance",
    query: {}
  },
  "package/pages/property/withdraw/index": {
    path: "/packages/property/withdraw",
    query: {}
  },
  "package/pages/property/recharge/index": {
    path: "/packages/property/recharge",
    query: {}
  },
  "package/pages/property/log/index": {
    path: "/packages/property/log/list",
    query: {}
  },
  "package/pages/property/points/index": {
    path: "/packages/property/points",
    query: {}
  },
  "package/pages/coupon/list/index": {
    path: "/packages/coupon/list",
    query: {}
  },
  "package/pages/giftvoucher/list/index": {
    path: "/packages/giftvoucher/list",
    query: {}
  },
  "package/pages/consumercard/detail/index": {
    path: "/packages/consumercard/list",
    query: {}
  },
  "package/pages/property/account/index": {
    path: "/packages/property/account/list",
    query: {}
  },
  "pages/shop/collection/index": {
    path: "/packages/shop/collect",
    query: {}
  },
  "pages/goods/collection/index": {
    path: "/packages/goods/collect",
    query: {}
  },
  "package/pages/address/addresslist/index": {
    path: "/packages/member/address/list",
    query: {}
  },
  "package/pages/account/set/index": {
    path: "/packages/member/set",
    query: {}
  },
  "packageSecond/pages/messageCenter/index": {
    path: "/pages/message/index",
    query: {}
  },
  "package/pages/seckill/list/index": {
    path: "/packages/seckill/list",
    query: {}
  },
  "package/pages/bargain/list/index": {
    path: "/packages/bargain/list",
    query: {}
  },
  "package/pages/assemble/list/index": {
    path: "/packages/assemble/list",
    query: {}
  },
  "package/pages/coupon/centre/index": {
    path: "/pages/coupon/index",
    query: {}
  },
  "package/pages/signin/index/index": {
    path: "/pages/signin/index",
    query: {}
  },
  "package/pages/prize/list/list": {
    path: "/packages/prize/list",
    query: {}
  },
  "pages/commission/centre/index": {
    path: "/pages/distribute/index",
    query: {}
  },
  "pages/commission/order/index": {
    path: "/packages/distribute/order",
    query: {}
  },
  "pages/commission/detail/index": {
    path: "/packages/distribute/detail",
    query: {}
  },
  "pages/commission/withdraw/index": {
    path: "/packages/distribute/withdraw",
    query: {}
  },
  "pages/commission/log/index": {
    path: "/packages/distribute/log",
    query: {}
  },
  "pages/commission/team/index": {
    path: "/packages/distribute/team",
    query: {}
  },
  "pages/commission/customer/index": {
    path: "/packages/distribute/customer",
    query: {}
  },
  "pages/commission/qrcode/index": {
    path: "/packages/distribute/qrcode",
    query: {}
  },
  "packageSecond/pages/bonus/centre/index": {
    path: "/pages/bonus/index",
    query: {}
  },
  "packageSecond/pages/bonus/detail/index": {
    path: "/packages/bonus/detail",
    query: {}
  },
  "packageSecond/pages/bonus/log/index": {
    path: "/packages/bonus/log",
    query: {}
  },
  "packageSecond/pages/bonus/order/index": {
    path: "/packages/bonus/order",
    query: {}
  },
  "package/pages/integral/index/index": {
    path: "/pages/integral/index",
    query: {}
  },
  "package/pages/integral/category/category": {
    path: "/packages/integral/goods/category",
    query: {}
  },
  "package/pages/integral/goods/list/list": {
    path: "/packages/integral/goods/list",
    query: {}
  },
  "packageSecond/pages/credential/code/index": {
    path: "/packages/credential/index",
    query: {}
  },
  "packageSecond/pages/credential/search/index": {
    path: "/packages/credential/index",
    query: {}
  },
  "package/pages/channel/centre/index": {
    path: "/pages/channel/index",
    query: {}
  },
  "package/pages/microshop/centre/centre": {
    path: "/pages/microshop/index",
    query: {}
  },
  "packageSecond/pages/course/list/index": {
    path: "/packages/course/list",
    query: {}
  },
  "package/pages/task/centre/index": {
    path: "/pages/task/index",
    query: {}
  },
  "packageSecond/pages/anticounterfeiting/search/index": {
    path: "/packages/anticounterfeiting/index",
    query: {}
  },
  "packageSecond/pages/goodthingcircle/home/index": {
    path: "/pages/thingcircle/index",
    query: {}
  },
  "packageSecond/pages/goodthingcircletwo/home/index": {
    path: "/pages/thingcircletwo/index",
    query: {}
  },
  "packageSecond/pages/live/square/index": {
    path: "/pages/live/index",
    query: {}
  },
  "packageSecond/pages/mplive/index": {
    path: "/pages/mplive/index",
    query: {}
  }
};
// #endif

// 必带带参数旧路由
// 如 /diy/1
// #ifndef MP-WEIXIN
export const oldParamRoute = [
  {
    key: "/diy/",
    queryKey: "page_id",
    path: "/packages/mall/diy",
    fullPath: "/packages/mall/diy?page_id="
  },
  {
    key: "/goods/detail/",
    queryKey: "goods_id",
    path: "/packages/goods/detail",
    fullPath: "/packages/goods/detail?goods_id="
  },
  {
    key: "/shop/home/",
    queryKey: "shop_id",
    path: "/packages/shop/home",
    fullPath: "/packages/shop/home?shop_id="
  },
  {
    key: "/coupon/receive/",
    queryKey: "coupon_type_id",
    path: "/packages/coupon/receive",
    fullPath: "/packages/coupon/receive?coupon_type_id="
  },
  {
    key: "/giftvoucher/receive/",
    queryKey: "gift_voucher_id",
    path: "/packages/giftvoucher/receive",
    fullPath: "/packages/giftvoucher/receive?gift_voucher_id="
  },
  {
    key: "/voucherpackage/",
    queryKey: "voucher_package_id",
    path: "/packages/voucherpackage/index",
    fullPath: "/packages/voucherpackage/index?voucher_package_id="
  },
  {
    key: "/smashegg/centre/",
    queryKey: "smash_egg_id",
    path: "/packages/smashegg/index",
    fullPath: "/packages/smashegg/index?smash_egg_id="
  },
  {
    key: "/wheelsurf/centre/",
    queryKey: "wheelsurf_id",
    path: "/packages/wheelsurf/index",
    fullPath: "/packages/wheelsurf/index?wheelsurf_id="
  }
];
// #endif

// #ifdef MP-WEIXIN
export const oldParamRoute = [
  {
    key: "pages/custom/index",
    queryKey: "page_id",
    path: "/packages/mall/diy",
    fullPath: "/packages/mall/diy?page_id="
  },
  {
    key: "pages/goods/detail/index",
    queryKey: "goods_id",
    path: "/packages/goods/detail",
    fullPath: "/packages/goods/detail?goods_id="
  },
  {
    key: "pages/shop/home/index",
    queryKey: "shop_id",
    path: "/packages/shop/home",
    fullPath: "/packages/shop/home?shop_id="
  }
];
// #endif
