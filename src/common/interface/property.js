import $Request from "@/api/requset";

// 获取资产信息
export function GET_ASSET(data = {}, config = {}) {
  return $Request({
    url: "/member/asset",
    data,
    ...config
  });
}
// 获取资产信息
export function GET_SHOP(data = {}, config = {}) {
  return $Request({
    url: "/member/shop",
    data,
    ...config
  });
}
// 获取提现账户列表
export function GET_ASSETACCOUNTLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_account",
    data,
    noCancel: true,
    ...config
  });
}

// 获取提现账户列表
export function GET_ACCOUNTHANG(data = {}, config = {}) {
  return $Request({
    url: "/member/accounthang",
    data,
    noCancel: true,
    ...config
  });
}

 
// 删除账户
export function DEL_ASSETACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/member/del_account",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 添加/编辑账户
export function SET_ASSETACCOUNT(data = {}, config = {}) {
  return $Request({
    url:
      config.type == "add"
        ? "/member/add_bank_account"
        : "/member/update_account",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 获取余额信息
export function GET_ASSETBALANCE(data = {}, config = {}) {
  return $Request({
    url: "/member/balance",
    data,
    ...config
  });
}

// 获取余额明细列表
export function GET_ASSETBALANCELOG(data = {}, config = {}) {
  let url =  "/member/balancewater";
  return $Request({
    url,
    data,
    ...config
  });
}

// 获取余额明细详情
export function GET_ASSETBALANCEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/balanceDetail",
    data,
    ...config
  });
}



// 创建充值余额订单
export function CREATE_ASSETRECHARORDER(data = {}, config = {}) {
  return $Request({
    url: "/member/createRechargeOrder",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

export function APPLY_GET_RECHARGELOGLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/rechargelog",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
export function APPLY_GET_CHANGELOG(data = {}, config = {}) {
  return $Request({
    url: "/member/changelog",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 提现余额
export function APPLY_ASSETWITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/member/withdraw",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}



export function APPLY_GET_WITHDRAWLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/withdrawlog",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 积分
export function GET_ASSETPOINTS(data = {}, config = {}) {
  return $Request({
    url: "/member/integralWater",
    data,
    ...config
  });
}
// 积分
export function GET_ASSETACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/member/accountWater",
    data,
    ...config
  });
}
// 积分
export function GET_ASSETACCOUNTMONTH(data = {}, config = {}) {
  return $Request({
    url: "/member/accountWaterMonth",
    data,
    ...config
  });
}
// 积分
export function GET_ASSETACCOUNTBUT(data = {}, config = {}) {
  return $Request({
    url: "/member/accountWaterBut",
    data,
    ...config
  });
}
// 银行列表
export function GET_BANKLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_list",
    data,
    ...config
  });
}

// 银行卡签约申请短信
export function GET_BANKSIGNINGSMS(data = {}, config = {}) {
  return $Request({
    url: "/Member/tlSigning",
    data,
    isShowLoading: true,
    loadingText: "获取短信验证",
    ...config
  });
}

// 签约银行卡
export function SIGNING_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/tlAgreeSigning",
    data,
    isShowLoading: true,
    loadingText: "签约中",
    ...config
  });
}

// 解绑银行卡
export function UNTYING_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/tlUntying",
    data,
    isShowLoading: true,
    loadingText: "解绑中",
    ...config
  });
}

// 签约银行卡列表
export function GET_BANKCARDLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/tl_bank_account",
    data,
    ...config
  });
}


// 余额转账
export function TRANSFER_BALANCE(data = {}, config = {}) {
  return $Request({
    url: "/member/transferBalance",
    data,
    isShowLoading: true,
    loadingText: "转账中",
    ...config
  });
}

export function APPLY_GET_TRANSFERLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/transferlog",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 余额积分兑换
export function EXCHANGE_BALANCE(data = {}, config = {}) {
  return $Request({
    url: "/member/change",
    data,
    isShowLoading: true,
    loadingText: "兑换中",
    ...config
  });
}

// 获取账户详情
export function GET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_account_detail",
    data,
    ...config
  });
}

// 更新银行自动账户
export function UPDATE_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/update_bank_account",
    data,
    ...config
  });
}

