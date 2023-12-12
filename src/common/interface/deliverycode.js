import $Request from "@/api/requset";

//获取领劵码列表
export function GET_RECEIVEGOODSCODELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/receivegoodscode/receivegoodscode/getReceiveGoodsCodeList",
    data,
    ...config
  });
}

//绑定领劵码
export function BIND_RECEIVEGOODSCODETOUSER(data = {}, config = {}) {
  return $Request({
    url: "/addons/receivegoodscode/receivegoodscode/bindReceiveGoodsCodeToUser",
    data,
    ...config
  });
}