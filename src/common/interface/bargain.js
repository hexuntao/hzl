import $Request from "@/api/requset";

// 砍价列表
export function GET_BARGAINLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/getBargainList",
    data,
    ...config
  });
}
// 砍价详情
export function GET_BARGAINDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/myActionBargain",
    data,
    ...config
  });
}
// 帮砍
export function SUB_BARGAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/helpBargain",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 我的砍价列表
export function GET_MYBARGAINLIST(data = {}) {
  return $Request({
    url: "/addons/bargain/bargain/myBargainList",
    data
  });
}
// 关闭用户参加的砍价活动
export function CLOSEUSERBARGAIN(data = {}) {
  return $Request({
    url: "/addons/bargain/bargain/closeUserBargain",
    data
  });
}
