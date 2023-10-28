import $Request from "@/api/requset";
import $UploadFile from "@/api/uploadFile";

// 客服信息
export function GET_QLKEFUINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/qlkefu/qlkefu/qlkefuInfo",
    data,
    ...config
  });
}

// 消息通知
export function GET_MESSAGENOTICELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getMpSystemMessage",
    data,
    ...config
  });
}

// 客服咨询列表
export function GET_QLKEFUCHATLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/qlkefu/qlkefu/chatList",
    data,
    ...config
  });
}

// 客服验证
export function GET_QLKEFUVERIFY(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/verifyInfo",
    data,
    errorCallback: true,
    isShowLoading: true,
    ...config
  });
}

// 客服聊天记录
export function GET_QLKEFUCHATLOG(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/getChatLog",
    data,
    ...config
  });
}

// 客服更新访客信息
export function GET_QLKEFUUPDATEUSER(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/updateUserInfo",
    data,
    ...config
  });
}

// 客服聊天上传图片
export function GET_QLKEFUUPADIMG(data = {}, config = {}) {
  return $UploadFile({
    url: "/index/upload/uploadImg",
    ...data,
    ...config
  });
}
