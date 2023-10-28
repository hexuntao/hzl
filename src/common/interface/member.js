import $Request from "@/api/requset";
import $Store from "@/store";

// 获取会员信息
export function GET_MEMBERINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/memberIndex",
    data,
    noCancel: true,
    ...config
  });
}
export function getShopLevelName(data = {}, config = {}) {
  return $Request({
    url: "/member/getShopLevelName",
    data,
    noCancel: true,
    ...config
  });
}


// 分享链接或者扫码成为下线
export function EXTEND_SHOP(data = {}, config = {}) {
  return $Request({
    url: "/login/checkShop",
    data,
    noCancel: true,
    ...config
  });
}

// 分享链接或者扫码成为下线
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    data,
    noCancel: true,
    ...config
  });
}
// 获取账号信息
export function GET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/getMemberBaseInfo",
    data,
    ...config
  });
}
// 设置账号信息
export function SET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/saveMemberBaseInfo",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 验证手机短信验证码
export function VALID_MSGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/checkVerificationCode",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改密码
export function UPDATE_PASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/updatePassword",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改支付密码
export function UPDATE_PAYMENTPASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/updatePaymentPassword",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改手机
export function UPDATE_MOBILE(data = {}, config = {}) {
  return $Request({
    url: "/member/updateMobile",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 绑定邮箱
export function UPDATE_EMAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/updateEmail",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 获取关联账号
export function GET_ACCOUNTRELEVANT(data = {}, config = {}) {
  return $Request({
    url: "/member/associationList",
    data,
    ...config
  });
}
// 检查支付密码
export function CHECK_PAYPASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/check_pay_password",
    data,
    ...config
  });
}

// 获取文案
export function GET_MEMBERSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/config/copyStyle",
    data,
    noCancel: true,
    ...config
  });
}

// 等级详情
export function GET_MEMBERLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/member/memberLevel",
    data,
    ...config
  });
}

// 获取省市区
export function GET_AREA(data = {}, config = {}) {
  return $Request({
    url: "/goods/area",
    method: "post",
    data,
    isShowLoading: true,
    loadingText: "加载中",
    ...config
  });
}

// 获取收货地址列表
export function GET_ADDRESSLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/receiverAddressList",
    method: "post",
    data,
    noCancel: true,
    ...config
  });
}

// 收货地址详情
export function GET_ADDRESSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/receiverAddressDetail",
    method: "post",
    data,
    ...config
  });
}

// 保存收货地址
export function SAVE_ADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/saveReceiverAddress",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 删除收货地址
export function DEL_ADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/deleteAddress",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 设置默认收货地址
export function SET_DEFAULTADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/setDefaultAddress",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 获取国家
export function GET_COUNTRYLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getCountryList",
    method: "post",
    data,
    ...config
  });
}

// 获取订阅消息模板
export function GET_MPSUBSCRIDETEMPLATEID(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/getMpTemplateId"
      : "/addons/miniprogram/miniprogram/getMpTemplateId";
  return $Request({
    url,
    data,
    isShowLoading: true,
    noShowMessage: true,
    ...config
  });
}

// 设置订阅消息模板
export function SET_MPSUBSCRIDETEMPLATEIFNO(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/postUserMpTemplateInfo"
      : "/addons/miniprogram/miniprogram/postUserMpTemplateInfo";
  return $Request({
    url,
    data,
    ...config
  });
}

// 公众号 小程序 订阅通知
// 获取节点下模板ID
export function GET_NOTICETEMPLATEID(data = {}) {
  return $Request({
    url: "/addons/messagenotice/Messagenotice/getNoticeTemplateId",
    data
  });
}
// 订阅通知：用户授权情况
export function SET_POSTNOTICETEMPLATEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/messagenotice/messagenotice/postNoticeTemplateInfo",
    data,
    ...config
  });
}

// 获取用户发票信息列表

export function GET_USERINVOICELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getUserInvoiceList",
    data,
    ...config
  });
}

// 添加/编辑用户发票信息
export function ADDUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/addUserInvoice",
    data
  });
}

// 删除发票信息
export function DELUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/delUserInvoice",
    data
  });
}

// 获取默认用户发票信息
export function GET_USERINVOICEINFO(data = {}) {
  return $Request({
    url: "/member/getUserInvoiceInfo",
    data,
    isShowLoading: true
  });
}

// 设为默认发票
export function SETDEFAULTUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/setDefaultUserInvoice",
    data
  });
}

// 获取用户发票信息
export function GET_USERINVOICEINFOBYCOND(data = {}) {
  return $Request({
    url: "/member/getUserInvoiceInfoByCond",
    data,
    isShowLoading: true
  });
}
