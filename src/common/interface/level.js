import $Request from "@/api/requset";
// 等级类型列表
export function GET_PAYGRADELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/getPayGradeList",
    data,
    ...config
  });
}

//   等级类型信息
export function GET_PAYGRADEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/getPayGradeInfo",
    data,
    ...config
  });
}

// 购买等级

export function CREATEPURCHASEORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/createPurchaseOrder",
    data,
    ...config
  });
}
