import $Request from "@/api/requset";

// 获取成为分销商信息
export function GET_APPLYCOMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributorApply_show",
    data,
    isWriteIn: true,
    ...config
  });
}
// 获取分销佣金明细
export function GET_COMMISSIONREDLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/redbonus",
    data,
    ...config
  });
}


// 申请成为分销商 / 完善资料，提交表单
export function APPLY_COMMISSION(data = {}, config = {}) {
  const url = config.isReplenishInfo
    ? "/addons/distribution/distribution/dataComplete"
    : "/addons/distribution/distribution/distributorapply";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取分销中心信息
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionCenter",
    data,
    isWriteIn: true,
    noCancel: true,
    ...config
  });
}

// 获取分销佣金详情
export function GET_COMMISSIONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/myCommissiona",
    data,
    ...config
  });
}

// 获取分销佣金明细
export function GET_COMMISSIONLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionDetail",
    data,
    ...config
  });
}

// 获取分销佣金明细
export function GET_COMMISSIONJFLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionJfDetail",
    data,
    ...config
  });
}

// 获取分销订单
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionOrder",
    data,
    ...config
  });
}

// 获取我的团队
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/teamList",
    data,
    ...config
  });
}

// 获取渠道部门
export function GET_CUSTOMERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/customerList",
    data,
    ...config
  });
}

// 获取佣金提现信息
export function GET_WITHDRAWINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionWithdraw_show",
    data,
    ...config
  });
}
// 获取佣金提现信息
export function GET_WITHDRAWLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionWithdrawListBiz",
    data,
    ...config
  });
}

// 佣金提现
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionWithdraw",
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
    data,
    isWriteIn: true,
    ...config
  });
}

// 分享链接或者扫码成为下线
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    data,
    ...config
  });
}

// 获取分销设置相关文案字眼
export function GET_COMMISSIONSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionSet",
    data,
    noCancel: true,
    ...config
  });
}

// 获取分销推荐排行榜、佣金排行榜、积分排行榜
export function GET_COMMISSIONRANKING(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/ranking",
    data,
    ...config
  });
}

//分红分销等级
export function GET_UPBONUESLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/upbonusLevel",
    data,
    errorCallback: true,
    ...config
  });
}
