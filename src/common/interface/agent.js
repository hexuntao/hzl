import $Request from "@/api/requset";

// 获取成为分销商信息
export function GET_APPLYCOMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributorApply_show",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申请成为分销商
export function APPLY_COMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributorapply",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 完善资料，提交表单
export function APPLY_REPLENISHINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/dataComplete",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取分销中心信息
export function GET_AGENTCENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributionCenter",
    method: "post",
    data,
    noCancel: true,
    isWriteIn: true,
    ...config
  });
}

// 获取分销佣金详情
export function GET_COMMISSIONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/myCommissiona",
    method: "post",
    data,
    ...config
  });
}

// 获取分销佣金明细
export function GET_COMMISSIONLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionDetail",
    method: "post",
    data,
    ...config
  });
}

// 获取我的团队
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/teamList",
    method: "post",
    data,
    ...config
  });
}

// 获取渠道部门
export function GET_CUSTOMERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/customerList",
    method: "post",
    data,
    ...config
  });
}

// 获取佣金提现信息
export function GET_WITHDRAWINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionWithdraw_show",
    method: "post",
    data,
    ...config
  });
}

// 佣金提现
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionWithdraw",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取推广码
export function GET_EXTENDCODE(data = {}, config = {}) {
  return $Request({
    url: "/member/qrcode",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 分享链接或者扫码成为下线
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    method: "post",
    data,
    ...config
  });
}

// 获取分销设置相关文案字眼
export function GET_AGENTSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributionSet",
    method: "post",
    data,
    ...config
  });
}

// 获取分销推荐排行榜、佣金排行榜、积分排行榜
export function GET_COMMISSIONRANKING(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/ranking",
    method: "post",
    data,
    ...config
  });
}

//分红分销等级
export function GET_UPBONUESLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/upbonusLevel",
    method: "post",
    data,
    errorCallback: true,
    ...config
  });
}

// 获取业绩奖
export function GET_ACHIEVEWARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getAchievementDeatil",
    method: "post",
    data,
    ...config
  });
}

// 获取渠道商申请信息
export function GET_APPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/applayChannelForm",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申请成为渠道商
export function APPLY_CHANNEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/applayChannel",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取商品分类
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelGoodsCategoryList",
    method: "post",
    data,
    ...config
  });
}

// 获取商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelGradeGoods",
    method: "post",
    data,
    ...config
  });
}

// 添加到购物车
export function ADD_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/addAgentCart",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取购物车列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelCartGoodsInfo",
    method: "post",
    data,
    ...config
  });
}

// 删除购物车
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/deleteAgentCart",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改购物车数量
export function EDIT_CARTGOODSNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelCartAdjustNum",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 计算运费
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/countChannelFree",
    method: "post",
    data,
    ...config
  });
}

// 获取确认订单信息
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelSettlement",
    method: "post",
    data,
    ...config
  });
}

// 提交订单
export function CREATE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/orderCreate",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取云仓库日志
export function GET_DEPOTLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorageLog",
    method: "post",
    data,
    ...config
  });
}

// 获取云仓库列表
export function GET_DEPOTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorage",
    method: "post",
    data,
    ...config
  });
}

// 获取云仓库商品明细
export function GET_DEPOTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorageDetail",
    method: "post",
    data,
    ...config
  });
}

// 获取我的业绩
export function GET_ACHIEVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/MyChannelPerformance",
    method: "post",
    data,
    ...config
  });
}

// 获取财务信息
export function GET_FINANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/MyChannelBalance",
    method: "post",
    data,
    ...config
  });
}

// 获取订单列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url:
      data.buy_type == "commission"
        ? "/addons/agent/agent/distributionOrder"
        : "/addons/agent/agent/getChannelOrderDetailList",
    method: "post",
    data,
    ...config
  });
}

// 获取订单详情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getPurchaseOrderDetail",
    method: "post",
    data,
    ...config
  });
}

// 关闭订单
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelOrderClose",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 发货
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelOrderClose",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 采购订单支付
export function GET_AGENTORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/agentOrderPay",
    method: "post",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
