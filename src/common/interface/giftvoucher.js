import $Request from "@/api/requset";

// 礼品券列表
export function GET_GIFTVOUCHERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/userGiftvoucher",
    data,
    ...config
  });
}

// 礼品券详情
export function GET_GIFTVOUCHERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/userGiftvoucherInfo",
    data,
    ...config
  });
}

// 领取礼品券
export function RECEIVE_GIFVOUCHER(data = {}, config = {}) {
	let url = config.isGive
	  ? "/addons/giftvoucher/giftvoucher/sendGiftvoucherToFriend"
	  : "/addons/giftvoucher/giftvoucher/giftvoucherReceive";
  return $Request({
    url: url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 礼品券详情领取页
export function GET_GIFTVOUCHERDETAILRECEIVE(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/giftvoucherDetail",
    data,
    ...config
  });
}

// 礼品券适用门店
export function GET_GIFTVOUCHERSTORE(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/giftvoucherStore",
    data,
    ...config
  });
}
