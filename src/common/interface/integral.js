import $Request from "@/api/requset";

//商品分类
export function GET_CATEGORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/integralcategorylist",
    data,
    noLogin: true,
    ...config
  });
}

//商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/goodsList",
    data,
    noLogin: true,
    ...config
  });
}

//商品详情
export function GET_GOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/goodsdetail",
    data,
    noLogin: true,
    errorCallback: true,
    ...config
  });
}

//确认订单
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/orderInfo",
    data,
    errorCallback: true,
    isWriteIn: true,
    ...config
  });
}

//立即支付
export function PAY_INTEGRALPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/integralPay",
    data,
    errorCallback: true,
    isWriteIn: true,
    ...config
  });
}

// 判断余额支付是否设置过密码
export function GET_INTEGRALPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/getMemberBalancePoint",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
