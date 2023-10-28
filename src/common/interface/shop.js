import $Request from "@/api/requset";

// 获取店铺首页
export function GET_SHOPINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopInfo",
    data,
    ...config
  });
}

// 获取店铺组
export function GET_SHOPGROUP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopgroup",
    data,
    ...config
  });
}

// 获取店铺列表
export function GET_SHOPLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopSearch",
    data,
    ...config
  });
}

// 店铺收藏
export function SET_COLLECTSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/collectShop",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 店铺取消收藏
export function CANCEL_COLLECTSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/cancelCollectShop",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 店铺收藏列表
export function GET_SHOPCOLLECTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/myShopCollection",
    data,
    ...config
  });
}

// 申请入驻店铺
export function APPLY_SHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/applyForWap",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取店铺相关协议
export function GET_SHOPAPPLYPROTOCOL(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getShopProtocolByWap",
    data,
    ...config
  });
}

// 获取店铺申请入驻状态
export function GET_SHOPAPPLYSTATE(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getApplyStateByWap",
    data,
    ...config
  });
}

// 获取店铺申请入驻状态
export function GET_SHOPAPPLYCUSTOMFORM(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getApplyCustomForm",
    data,
    ...config
  });
}
