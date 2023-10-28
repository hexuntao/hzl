import $Request from "@/api/requset";

// 获取数字资产设置
export function GET_BLOCKCHAINSET(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/blockChainSet",
    data,
    ...config
  });
}

// 获取eth资产信息
export function GET_BLOCKCHAINETHINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getEthWallet",
    data,
    ...config
  });
}

// 获取eos资产信息
export function GET_BLOCKCHAINEOSINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getEosWallet",
    data,
    ...config
  });
}

// 创建eth账户
export function CREAT_BLOCKCHAINETHACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEthWallet",
    data,
    isWriteIn: true,
    isShowLoading: true,
    loadingText: "创建中",
    ...config
  });
}

// 获取gas费用
export function GET_BLOCKCHAINETHGAS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/ethGas",
    data,
    ...config
  });
}

// 检测eth钱包地址是否存在
export function CHECK_BLOCKCHAINETHADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/checkEthAddress",
    data,
    isShowLoading: true,
    loadingText: "验证地址中",
    ...config
  });
}

// 交易明细详情
export function GET_BLOCKCHAINLOGDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/memberBlockChainRecordDetail",
    data,
    ...config
  });
}

// 验证eos账号是否存在
export function CHECK_BLOCKCHAINEOSACCOUNTNAME(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/checkEosAccountName",
    data,
    ...config
  });
}

// 创建eos钱包(购买内存)获取预订单交易号
export function CREATE_BLOCKCHAINEOSWALLET(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEosWallet",
    data,
    isWriteIn: true,
    ...config
  });
}

// 创建eos钱包(无需购买内存)
export function CREATE_BLOCKCHAINEOSWALLETUNPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEosWalletUnPay",
    data,
    isWriteIn: true,
    ...config
  });
}

// 创建eos钱包余额支付
export function PAY_BLOCKCHAINEOSBALANCEPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/balancePay",
    data,
    isWriteIn: true,
    ...config
  });
}

// 获取eth/eos图表
export function GET_BLOCKCHAINCHART(data = {}, config = {}) {
  // let url = config.type=='eos'?"/addons/blockchain/blockchain/" + config.type + "MarketInfo":'/addons/blockchain/blockchain/getKline'
  return $Request({
    url: "/addons/blockchain/blockchain/getKline",
    data,
    ...config
  });
}

// 抵押/赎回 eos
export function SUB_BLOCKCHAINRESOURCE(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/" + config.type,
    data,
    isShowLoading: true,
    loadingText: config.typeText + "中",
    isWriteIn: true,
    ...config
  });
}

// 换算 积分和eth、eos
export function COUNT_BLOCKCHAINEXPORT(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/pointExMoney",
    data,
    ...config
  });
}

// 获取货币列表
export function GET_BLOCKCHAINBILIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getTokenAccountList",
    data,
    ...config
  });
}

// 获取货币信息
export function GET_BLOCKCHAINBIINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getCurrencyWallet",
    data,
    ...config
  });
}

// 获取Gwei大小值
export function GET_BLOCKCHAINGWEISIZE(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGasGwei",
    data,
    ...config
  });
}

// 虚拟币跟积分兑换- 换算的金额
export function COUNT_BLOCKCHAINEXMONEY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/exchangeCurrency",
    data,
    ...config
  });
}

// 兑换
export function EXCHANGE_BLOCKCHAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/exchangeCurrencyPoint",
    data,
    isShowLoading: true,
    loadingText: "申请兑换中",
    ...config
  });
}

// 获取gas费用
export function GET_BLOCKCHAINGAS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGasPrice",
    data,
    ...config
  });
}

// 转账
export function TRANSFER_BLOCKCHAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/currencyTransfer",
    data,
    isShowLoading: true,
    loadingText: "申请转账中",
    ...config
  });
}

// 交易明细
export function GET_BLOCKCHAINLOGLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/memberCurrencyRecord",
    data,
    ...config
  });
}

// 导出eth/eos  keystore/私钥
export function EXPORT_BLOCKCHAINKEY(data = {}, config = {}) {
  let api = config.key == "keystore" ? "exportKeyStore" : "exportPrivateKey";
  return $Request({
    url: "/addons/blockchain/blockchain/" + api,
    data,
    isShowLoading: true,
    loadingText: "导出中",
    ...config
  });
}

// 支付金额转换成货币金额
export function TRAN_BLOCKCHAINPAYMONEY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getBlockChainBalance",
    data,
    ...config
  });
}

// 支付金额转换成货币金额
export function PAY_BLOCKCHAINCOIN(data = {}, config = {}) {
  return $Request({
    url: "/Member/currencyPay",
    data,
    loadingText: "支付中",
    ...config
  });
}

// 商品金额转换货币金额
export function GET_BLOCKCHAINGOODSTRANCOIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGoodsPrice",
    data,
    isShowLoading: true,
    ...config
  });
}
