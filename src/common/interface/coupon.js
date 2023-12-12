import $Request from "@/api/requset";

// 领券中心
export function GET_COUPONCENTRE(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponCentre",
    data,
    ...config
  });
}

// 获取商品详情优惠券列表
export function GET_SHOPCOUPONLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/goodsCouponList",
    data,
    ...config
  });
}

// 我的优惠券列表
export function GET_COUPONLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getcouplist",
    data,
    ...config
  });
}

// 获取优惠券详情
export function GET_COUPONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponDetail",
    data,
    ...config
  });
}

// 获取优惠券详情适用商品列表
export function GET_COUPONDETAILGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponGoodsList",
    data,
    ...config
  });
}

// 领取优惠券
export function RECEIVE_COUPON(data = {}, config = {}) {
  // isGive 领取赠送的优惠券
  let url = config.isGive
    ? "/addons/coupontype/coupontype/sendCouponToFriend"
    : "/addons/coupontype/coupontype/userArchiveCoupon";
  return $Request({
    url: url,
    data,
    isShowLoading: true,
    isWriteIn: true,
    ...config
  });
}

// 根据id获取优惠券
export function GET_COUPONFORID(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/Coupontype/getCouponTypeList",
    data,
    ...config
  });
}
