import $Request from "@/api/requset";

//大转盘详情
export function GET_WHEELSURFINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/wheelsurfInfo",
    data,
    ...config
  });
}

//开始抽奖
export function GET_USERWHEELSURF(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/userWheelsurf",
    data,
    isWriteIn: true,
    ...config
  });
}

//用户当日抽奖的次数
export function GET_USERFREQUENCY(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/userFrequency",
    data,
    isWriteIn: true,
    ...config
  });
}

//中奖名单
export function GET_PRIZERECORDS(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/prizeRecords",
    data,
    ...config
  });
}
