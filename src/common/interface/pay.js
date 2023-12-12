import $Request from "@/api/requset";

// 获取支付信息
export function GET_PAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/paynew/getPayValue",
    data,
    isShowLoading: true,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}

// 线下支付
export function PAY_OFFLINE(data = {}, config = {}) {
  const url = "/paynew/offlinePay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}
// 银商微信支付
export function ADAPAYPAY_WECHAT(data = {}, config = {}) {
  const url = "/paynew/wchatAdapayPay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}
// 微信支付
export function PAY_WECHAT(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/paynew/wchatPay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 支付宝支付
export function PAY_ALIPAY(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/paynew/aliPay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 余额支付
export function PAY_BALANCE(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/paynew/balance_pay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    loadingText: "支付中",
    ...config
  });
}

// 获取支付结果
export function GET_PAYRESULT(data = {}, config = {}) {
  return $Request({
    url: "/order/get_pay_result_info",
    data,
    isShowLoading: true,
    isWriteIn: true,
    ...config
  });
}

// 获取相关虚拟币可支付信息
export function GET_BLOCKCHAINPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/getBlockChainBalance",
    data,
    ...config
  });
}


// 申请银行卡支付短信
export function APPLY_BANKCARDSMS(data = {}, config = {}) {
  return $Request({
    url: "/paynew/tlPayApplyAgree",
    data,
    isWriteIn: true,
    loadingText: "申请验证短信",
    isShowLoading: true,
    ...config
  });
}

// 获取银行卡支付短信
export function GET_BANKCARDSMS(data = {}, config = {}) {
  return $Request({
    url: "/paynew/paySmsAgree",
    data,
    isWriteIn: true,
    loadingText: "获取短信验证",
    isShowLoading: true,
    ...config
  });
}

// 银行卡支付
export function PAY_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/paynew/tlPay",
    data,
    isWriteIn: true,
    loadingText: "支付中",
    isShowLoading: true,
    ...config
  });
}

// 货款支付
export function PAY_PROCEEDS(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/paynew/proceeds_pay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// glopay 跨境支付
export function PAY_GLOPAY(data = {}, config = {}) {
  return $Request({
    url: "/paynew/GlobePay",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
