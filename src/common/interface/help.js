import $Request from "@/api/requset";

// 获取帮助中心列表
export function GET_HELPLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesCategoryList",
    data,
    ...config
  });
}

// 获取帮助列表分类
export function GET_HELPCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesCategoryDetail",
    data,
    ...config
  });
}

// 获取文章详情
export function GET_HELPDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesDetail",
    data,
    ...config
  });
}
