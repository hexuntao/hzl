import $Request from "@/api/requset";

// 购物车列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/cart",
    data,
    noCancel: true,
    ...config
  });
}

// 删除购物车
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/goods/delete_car_goods",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改购物车数量
export function EDIT_CARTNUM(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartAdjustNum",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 根据店铺id和门店id获取购物车信息
export function GET_SHOPCARTINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartGetGoodsList",
    data,
    isShowLoading: true,
    ...config
  });
}

// 编辑购物车信息
export function EDIT_CARTINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartEditSkuOrNum",
    data,
    isShowLoading: true,
    ...config
  });
}
