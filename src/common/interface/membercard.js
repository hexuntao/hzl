import $Request from "@/api/requset";

// 会员卡首页
export function GET_MEMBERCARDINDEX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardIndex",
    data,
    isShowLoading: true,
    ...config
  });
}

//会员卡余额明细
export function GET_MEMBERCARDBALANCELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardBalanceList",
    data,
    ...config
  });
}

//   -会员卡升级
export function GET_UPGRADEMEMBERCARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/upgradeMembercard",
    data,
    isShowLoading: true,
    ...config
  });
}

//   购买会员卡
export function MEMBERCARD_BUYMEMBERCARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/buyMembercard",
    data,
    ...config
  });
}

//   充值页面
export function GET_RECHARGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/recharge",
    data,
    ...config
  });
}

//   会员卡充值
export function MEMBERCARD_CREATERECHARGEORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/createRechargeOrder",
    data,
    ...config
  });
}

// 添加到微信卡包
export function MEMBERCARD_ADDMEMBERCARDTOWX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/addMembercardToWx",
    data,
    ...config
  });
}

// 会员卡余额流水详情
export function GET_MEMBERCARDDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/balanceDetail",
    data,
    ...config
  });
}

// 微信会员卡领取成功
export function MEMBERCARD_MEMBERCARDSUCCESSTOWX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardSuccessToWx",
    data,
    ...config
  });
}
