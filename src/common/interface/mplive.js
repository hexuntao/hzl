import $Request from "@/api/requset";

// 直播广场
export function GET_MPLIVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/mplive/mplive/getWapMpLiveList",
    data,
    noLogin: true,
    ...config
  });
}