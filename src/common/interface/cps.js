import $Request from "@/api/requset";

//获取第三方精选商品列表
export function GET_GETOPENGOODS(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getOpenGoods",
    data,
    ...config
  });
}

//获取商品类目
export function GET_GETGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsCategory",
    data,
    ...config
  });
}
// 根据平台类型获取各平台的商品列表
export function GET_GETGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsList",
    data,
    ...config
  });
}

//获取各平台的商品详情
export function GET_GETGOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsDetail",
    data,
    ...config
  });
}
//前端获取返佣规则
export function GET_GETCOMMISSIONRULE(data = {}, config = {}) {
  return $Request({
    url: "/addons/cpsunion/cpsunion/wapGetCommissionRule",
    data,
    ...config
  });
}

//领券购买
export function GET_USECOUPONBUY(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/useCouponBuy",
    data,
    ...config
  });
}