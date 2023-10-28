import $Request from "@/api/requset";

// 获取渠道商中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelIndex",
    data,
    noCancel: true,
    ...config
  });
}

// 获取渠道商申请信息
export function GET_APPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/applayChannelForm",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申请成为渠道商
export function APPLY_CHANNEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/applayChannel",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取商品分类
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelGoodsCategoryList",
    data,
    ...config
  });
}

// 获取商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelGradeGoods",
    data,
    ...config
  });
}

// 添加到购物车
export function ADD_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/addChannelCart",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取购物车列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelCartGoodsInfo",
    data,
    ...config
  });
}

// 删除购物车
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/deleteChannelCart",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改购物车数量
export function EDIT_CARTGOODSNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelCartAdjustNum",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 计算运费
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/countChannelFree",
    data,
    ...config
  });
}

// 获取确认订单信息
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelSettlement",
    data,
    ...config
  });
}

// 提交订单
export function CREATE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/orderCreate",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取我的团队
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getMyTeam",
    data,
    ...config
  });
}

// 获取云仓库日志
export function GET_DEPOTLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorageLog",
    data,
    ...config
  });
}

// 获取云仓库列表
export function GET_DEPOTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorage",
    data,
    ...config
  });
}

// 获取云仓库商品明细
export function GET_DEPOTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorageDetail",
    data,
    ...config
  });
}

// 获取我的业绩
export function GET_ACHIEVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/MyChannelPerformance",
    data,
    ...config
  });
}

// 获取财务信息
export function GET_FINANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/MyChannelBalance",
    data,
    ...config
  });
}

// 获取订单列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelOrderDetailList",
    data,
    ...config
  });
}

// 获取订单详情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getPurchaseOrderDetail",
    data,
    ...config
  });
}

// 关闭订单
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelOrderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 发货
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelOrderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 采购订单支付
export function GET_CHANNELORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/channelOrderPay",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
