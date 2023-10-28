import $Request from "@/api/requset";

// 砸金蛋详情
export function GET_SMASHEGGINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/smasheggInfo",
    data,
    ...config
  });
}

// 砸金蛋次数
export function GET_FREQUENCY(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/userFrequency",
    data,
    isWriteIn: true,
    ...config
  });
}

// 中奖名单
export function GET_PRIZERECORDS(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/prizeRecords",
    data,
    ...config
  });
}

//开始砸蛋
export function SET_USERSMASHEGG(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/userSmashegg",
    data,
    isWriteIn: true,
    ...config
  });
}
