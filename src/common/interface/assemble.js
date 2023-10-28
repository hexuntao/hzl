import $Request from "@/api/requset";

// 拼团列表
export function GET_ASSEMBLELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/groupshopping/groupshopping/groupShoppingListForWap",
    data,
    ...config
  });
}
// 获取拼团详情
export function GET_ASSEMBLEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/groupshopping/groupshopping/getGroupMemberListForWap",
    data,
    ...config
  });
}
