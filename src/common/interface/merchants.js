import $Request from "@/api/requset";

// 招商员
// 招商中心
export function GET_MERCHANTSCENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsCenter",
    data,
    noCancel: true,
    ...config
  });
}

// 申请成为招商员表单页面，获取申请协议，logo
export function GET_MERCHANTSAPPLYSHOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsApplyShow",
    data,
    ...config
  });
}

// 提交申请为招商员
export function MERCHANTSAPPLYSUBMIT(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsApply",
    data,
    ...config
  });
}

// 业绩订单
export function GET_WAPGETPROMOTIONORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionOrder",
    data,
    ...config
  });
}

// 推广的店铺
export function GET_WAPGETPROMOTIONSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionShop",
    data,
    ...config
  });
}

// 推广的招商员
export function GET_WAPGETPROMOTIONMERCHANTS(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionMerchants",
    data,
    ...config
  });
}

// 招商码
export function GET_PROMOTIONCODE(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/promotionCode",
    data,
    ...config
  });
}

// 业绩详情
export function GET_WAPGETACHIEVEMENTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetAchievementDetail",
    data,
    ...config
  });
}

// 业绩流水
export function GET_WAPGETACHIEVEMENTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetAchievementList",
    data,
    ...config
  });
}

// 业绩提现表单页面
export function GET_ACHIEVEMENTWITHDRAWALSHOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/achievementWithdrawalShow",
    data,
    ...config
  });
}

// 业绩提现
export function GET_ACHIEVEMENTWITHDRAWAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/achievementWithdrawal",
    data,
    ...config
  });
}
