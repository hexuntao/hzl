import $Request from "@/api/requset";

// 获取超级海报图片
export function GET_POSTERIMG(data = {}, config = {}) {
  return $Request({
    url: "/addons/poster/poster/getKindPoster",
    data,
    ...config
  });
}
