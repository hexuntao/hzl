import $Request from "@/api/requset";

// 微店中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopCenter",
    data,
    noCancel: true,
    ...config
  });
}

//确认订单信息
export function GET_SHOPINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/orderMicroShopInfo",
    data,
    isWriteIn: true,
    ...config
  });
}

//等级中心
export function GET_GRADEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopLevelCenter",
    data,
    ...config
  });
}

//立即续费
export function GET_RENEW(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/immediateRenewal",
    data,
    ...config
  });
}

//立即升级
export function GET_UPGRADE(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/upgradeLevel",
    data,
    ...config
  });
}

// 获取微店收益明细
export function GET_MICROSHOPLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitDetail",
    data,
    ...config
  });
}

//微店收益详情
export function GET_MICROSHOPDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/myProfit",
    data,
    ...config
  });
}

// 获取收益提现信息
export function GET_WITHDRAWSINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitShow",
    data,
    ...config
  });
}

// 收益提现
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitWithdraw",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 微店设置
export function SET_SHOPSET(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopSet",
    data,
    ...config
  });
}

// 挑选微店商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsList",
    data,
    ...config
  });
}

// 挑选微店商品分类
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/goods/categoryInfo",
    data,
    ...config
  });
}

//挑选商品、取消选中商品
export function GET_SELECTGOODS(data = {}, config = {}) {
  const url = config.isChecked
    ? "/addons/microshop/microshop/selectGoods"
    : "/addons/microshop/microshop/delGoods";
  return $Request({
    url,
    data,
    ...config
  });
}

//取消选中商品
export function GET_DELGOOdS(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/delGoods",
    data,
    ...config
  });
}

//预览微店商品
export function GET_MICROSHOPGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShop",
    data,
    ...config
  });
}

//预览微店中商品分类(返回值为三级分类信息)
export function GET_PREVIEWMICROSHOGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShopGoods",
    data,
    ...config
  });
}

//预览微店中商品分类
export function GET_PREVIEWMICROSHOPCATEGROY(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShopCategory",
    data,
    ...config
  });
}
