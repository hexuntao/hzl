import $Request from "@/api/requset";

// 获取消费卡列表
export function GET_CONSUMERCARDLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCard",
    data,
    ...config
  });
}

// 获取消费卡详情
export function GET_CONSUMERCARDDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCardDetail",
    data,
    ...config
  });
}

// 获取消费卡核销记录
export function GET_CONSUMERCARDLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCardRecord",
    data,
    ...config
  });
}

// 获取添加微信卡券的卡券参数
export function GET_WXCARDPARAMS(data = {}, config = {}) {
  return $Request({
    url: "/member/getwxCard",
    data,
    isShowLoading: true,
    ...config
  });
}

// 微信卡券领取成功后执行
export function GET_WXCARDSTATE(data = {}, config = {}) {
  return $Request({
    url: "/member/getwxCardUse",
    data,
    ...config
  });
}

// 预约技师-技师列表 （用户端 > 卡券详情）
export function GET_CARDTECHNICIANLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/technician/technician/getCardTechnicianList",
    data,
    ...config
  });
}
// 到店时间-技师列表 （用户端 > 卡券详情）
export function GET_RESERVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/technician/technician/reserveList",
    data,
    ...config
  });
}
// 选择完成技师+时间 （用户端 > 卡券详情）
export function RESERVETECHNICIAN(data = {}, config = {}) {
  return $Request({
    url: "/addons/technician/technician/reserveTechnician",
    data,
    ...config
  });
}