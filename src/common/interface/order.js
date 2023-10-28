import $Request from "@/api/requset";

// 计算运费
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/goods/count_free",
    data,
    ...config
  });
}

// 确认订单
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/orderInfo",
    data,
    errorCallback: true,
    isWriteIn: true,
    noShowMessage: true,
    ...config
  });
}

// 提交订单
export function CREATE_ORDER(data = {}, config = {}) {
  let url = config.isStoreOrder
    ? "/order/StoreOrderCreate"
    : "/order/orderCreate";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 订单列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/order/orderlist",
    data,
    ...config
  });
}

// 订单详情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/order/orderDetail",
    data,
    ...config
  });
}

// 获取收货地址列表
export function GET_ORDERZHIHUANG(data = {}, config = {}) {
  return $Request({
    url: "/order/zhihuan",
    method: "post",
    data,
    noCancel: true,
    ...config
  });
}

// 获取订单申请售后信息
export function GET_REFUNDINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/refundDetail",
    data,
    ...config
  });
}

// 提交申请售后
export function APPLY_REFUNDASK(data = {}, config = {}) {
  return $Request({
    url: "/order/refundAsk",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 提交申请售后
export function APPLY_HG(data = {}, config = {}) {
  return $Request({
    url: "/order/refundHg",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}


// 取消申请售后
export function CANCEL_REFUNDASK(data = {}, config = {}) {
  return $Request({
    url: "/order/cancelOrderRefund",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 提交退货信息
export function SUB_ZHIHUANEXPRESS(data = {}, config = {}) {
  return $Request({
    url: "/order/orderGoodsZhihuanExpress",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 提交退货信息
export function SUB_HUIGOUEXPRESS(data = {}, config = {}) {
  return $Request({
    url: "/order/orderGoodsHuigouExpress",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 提交退货信息
export function SUB_REFUNDEXPRESS(data = {}, config = {}) {
  return $Request({
    url: "/order/orderGoodsRefundExpress",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 关闭订单
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/order/orderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 删除订单
export function EDLETE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/order/deleteOrder",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 确认收货
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/order/orderTakeDelivery",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 订单商品评价/订单商品再次评价
export function ADD_ORDEREVALUATE(data = {}, config = {}) {
  let url = config.isAgain
    ? "/order/addOrderEvaluateAgain"
    : "/order/addOrderEvaluate";
  return $Request({
    url,
    data,
    isShowLoading: true,
    ...config
  });
}

// 获取物流信息
export function GET_LOGISTICSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/order/orderShippingInfo",
    data,
    ...config
  });
}

// 再次购买
export function ADD_BUYAGAIN(data = {}, config = {}) {
  return $Request({
    url: "/goods/buyAgain",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取订单支付信息
export function GET_ORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/orderPay",
    data,
    isShowLoading: true,
    errorCallback: true,
    ...config
  });
}

// 获取尾款支付单号
export function GET_TAILMONEYNO(data = {}, config = {}) {
  return $Request({
    url: "/pay/pay_last_money",
    data,
    isShowLoading: true,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 货到付款
export function PAY_DPAY(data = {}, config = {}) {
  return $Request({
    url: "/Member/dPay",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取物流公司
export function GET_EXPRESSCOMPANY(data = {}, config = {}) {
  return $Request({
    url: "/order/getvExpressCompany",
    data,
    ...config
  });
}
