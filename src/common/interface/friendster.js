import $Request from "@/api/requset";

// 获取	朋友圈素材分类
export function GET_CATEGORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/friendscircleCategoryList",
    data,
    ...config
  });
}

// 获取	朋友圈列表
export function GET_WAPGETMATERIALLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/wapGetMaterialList",
    data,
    ...config
  });
}

// 获取	朋友圈点赞
export function ADDREPEATNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/addRepeatNum",
    data,
    ...config
  });
}