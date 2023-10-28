import $Request from "@/api/requset";

// 用户端是否需要登录
export function GET_ISLOGIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/anticounterfeiting/anticounterfeiting/isLogin",
    data,
    ...config
  });
}
// 用户端查询防伪码
export function GET_SEARCHANTI(data = {}, config = {}) {
  return $Request({
    url:
      "/addons/anticounterfeiting/anticounterfeiting/searchAnticounterfeiting",
    data,
    errorCallback: true,
    ...config
  });
}
