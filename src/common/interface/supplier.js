import $Request from "@/api/requset";

// 获取供应商申请结果
export function GET_SUPPLIERRESULT(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierResult",
    data,
    ...config
  });
}

// 供应商入驻
export function SET_SUPPLIERAPPLY(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierApply",
    data,
    ...config
  });
}

// 获取供应商申请协议
export function GET_SUPPLIERPROTOCOL(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierProtocol",
    data,
    ...config
  });
}

// 获取分类列表
export function GET_CATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier//getCategory",
    data,
    ...config
  });
}
