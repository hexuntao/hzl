import $Request from "@/api/requset";

//查询证书页
export function GET_SEARCHCREDENTIAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/searchUserCredentialPage",
    data,
    isWriteIn: true,
    ...config
  });
}

//授权证书查询结果
export function GET_CREDENTIALRESULT(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/searchUserCredential",
    data,
    isWriteIn: true,
    noShowMessage: true,
    ...config
  });
}

//获取授权证书
export function GET_CREDENTIAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/getUserCredential",
    data,
    isWriteIn: true,
    ...config
  });
}

//活获取证书是否设置过微信号
export function GET_USERWECHAT(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/getUserWchat",
    data,
    ...config
  });
}
