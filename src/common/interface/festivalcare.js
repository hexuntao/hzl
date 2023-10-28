import $Request from "@/api/requset";

//获取礼品
export function GET_ACCEPTFESTIVALCARE(data = {}, config = {}) {
  return $Request({
    url: "/addons/festivalcare/festivalcare/acceptFestivalcare",
    data,
    ...config
  });
}
