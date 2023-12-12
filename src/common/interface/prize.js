import $Request from "@/api/requset";

// 奖品列表
export function GET_PRIZELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/myPrize",
    data,
    ...config
  });
}

// 奖品确认
export function GET_PRIZEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/prizeDetail",
    data,
    isWriteIn: true,
    ...config
  });
}

// 领取奖品
export function GET_ACCEPTPRIZE(data = {}, config = {}) {
  return $Request({
    url: "/member/acceptPrize",
    data,
    isWriteIn: true,
    ...config
  });
}
