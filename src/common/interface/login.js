import $Request from "@/api/requset";

// 登录
export function LOGIN(data = {}, config = {}) {
  return $Request({
    url: "/login",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 退出登陆
export function LOGOUT(data = {}, config = {}) {
  return $Request({
    url: "/login/logout",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 注册
export function REGISTER(data = {}, config = {}) {
  return $Request({
    url: "/login/register",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 发送验证码
export function GET_MSGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/getVerificationCode",
    data,
    isShowLoading: true,
    ...config
  });
}
// 获取图片验证码
export function GET_IMGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/captchaSrc",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 判断手机是否存在
export function IS_HASMOBILE(data = {}, config = {}) {
  return $Request({
    url: "/login/mobile",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 获取邮箱验证码
export function GET_EMAILCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/getEmailVerificationCode",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 重设密码
export function RESET_PASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/login/resetPassword",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 第三方登录  包含微信小程序，公众号，app
export function OTHER_LOGIN(data = {}, config = {}) {
  let url = "/login/oauthLogin"; // 微信公众号

  // #ifdef APP-PLUS
  url = "/login/oauthAppLogin";
  // #endif

  // #ifdef MP-WEIXIN
  url = "/login/oauthLogin";
  // #endif

  return $Request({
    url,
    data,
    noLogin: true,
    noCancel: true,
    ...config
  });
}
// 关联账户
export function BIND_ACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/login/AssociateAccount",
    data,
    isShowLoading: true,
    ...config
  });
}
