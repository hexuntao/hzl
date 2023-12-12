import $Request from "@/api/requset";

// 获取平台下所有门店列表
export function GET_STORELIST(data = {}, config = {}) {
  const url = config.isShopStore
    ? "/addons/store/store/getStoreListForWap"
    : "/addons/store/store/getAllStoreListForWap";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 获取门店信息
export function GET_STOREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/storeIndex",
    data,
    ...config
  });
}

// 获取门店商品分类
export function GET_STOREGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/getStoreGoodsCategoryList",
    data,
    ...config
  });
}

// 获取门店商品列表
export function GET_STOREGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/getStoreGoods",
    data,
    ...config
  });
}

// 获取门店购物车列表
export function GET_STORECARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/cart",
    data,
    ...config
  });
}

// 添加门店商品到门店购物车
export function ADD_STOREGOODSTOCART(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/addCart",
    data,
    isShowLoading: true,
    ...config
  });
}

// 删除购物车商品
export function REMOVE_STORECART(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/deleteCartGoods",
    data,
    isShowLoading: true,
    ...config
  });
}

// 修改购物车数量
export function EDIT_STORECARTNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/editCartNum",
    data,
    isShowLoading: true,
    ...config
  });
}

// 根据店铺id或商品id获取门店列表
export function GET_SHOPSTORELIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/getStoreList",
    data,
    ...config
  });
}

// 根据门店id获取门店列表
export function GET_STOREIDLIST(data = {}, config = {}) {
  return $Request({
    url: "/order/getStoreList",
    data,
    ...config
  });
}
