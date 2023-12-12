import $Request from "@/api/requset";

// 获取课程商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/myCourse",
    data,
    ...config
  });
}

// 获取课程商品详情目录列表
export function GET_GOODSDETAIL_LIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/wapGetKnowledgePaymentList",
    data,
    ...config
  });
}

// 获取课程商品详情
export function GET_GOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/goods/seeKnowledgePayment",
    data,
    ...config
  });
}
