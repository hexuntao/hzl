import $Request from "@/api/requset";

// 获取弹幕规则
export function GET_BARRAGERULE(data = {}, config = {}) {
  return $Request({
    url: "/addons/orderbarrage/orderbarrage/getOrderBarrageRuleApi",
    data,
    noCancel: true,
    ...config
  });
}

// 获取弹幕信息
export function GET_BARRAGEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/orderbarrage/orderbarrage/getOrderBarrageApi",
    data,
    noCancel: true,
    ...config
  });
}
