import $Request from "@/api/requset";

// 获取成为代理商信息
export function GET_APPLYAGENTINFO(data = {}, config = {}) {
  return $Request({
    url: "/Member/applyagent",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申请成为代理
export function APPLY_AGENT(data = {}, config = {}) {
  const obj = {
    1: "/addons/globalbonus/Globalbonus/globalAgentApply", // 申请成为全球代理
    2: "/addons/areabonus/areabonus/areaAgentApply", // 申请成为区域代理
    3: "/addons/teambonus/Teambonus/teamAgentApply" // 申请成为团队代理
  };
  const url = obj[config.agentType] || "";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取分红中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonusIndex",
    data,
    noCancel: true,
    ...config
  });
}

// 获取分红金额
export function GET_BONUSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/Member/myBonus",
    data,
    ...config
  });
}

// 获取分红明细
export function GET_BONUSLOG(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonus_detail",
    data,
    ...config
  });
}

// 获取分红订单
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonus_order",
    data,
    ...config
  });
}

// 获取分红设置相关文案字眼
export function GET_BONUSSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/member/bonusSet",
    data,
    noCancel: true,
    ...config
  });
}

// 获取发货订单列表
export function GET_BONUSTEAMDELIVERYORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/teamCaptainDelivery",
    data,
    ...config
  });
}

// 获取队长发货详情
export function GET_BONUSTEAMDELIVERYDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/deliveryPageInfo",
    data,
    ...config
  });
}

// 队长发货
export function SET_BONUSTEAMDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/actCaptainDelivery",
    data,
    ...config
  });
}
