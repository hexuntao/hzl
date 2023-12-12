import $Request from "@/api/requset";

export function GET_ACCEPTFOLLOWGIFT(data = {}, config = {}) {
  return $Request({
    url: "/addons/followgift/followgift/acceptFollowgift",
    data,
    ...config
  });
}
