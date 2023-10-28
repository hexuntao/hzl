import $Request from "@/api/requset";

// 获取会员签到信息
export function GET_SIGNININFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInInfo",
    data,
    ...config
  });
}

// 获取会员当月签到列表
export function GET_SIGNINLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInList",
    data,
    ...config
  });
}

// 获取会员签到记录
export function GET_SIGNINLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInRecord",
    data,
    ...config
  });
}

// 会员签到
export function SET_SIGNIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignIn",
    data,
    isWriteIn: true,
    ...config
  });
}
