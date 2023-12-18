import $Request from '@/api/requset';

// 直播广场
export function GET_MPLIVELIST(data = {}, config = {}) {
  return $Request({
    url: '/addons/mplive/mplive/getWapMpLiveList',
    data,
    noLogin: true,
    ...config,
  });
}

// 视频号直播id
export function GET_VIDEOLIST(data = {}, config = {}) {
  return $Request({
    url: '/addons/video/video/videoLiveListWap',
    data,
    noLogin: true,
    ...config,
  });
}

// 更新视频号信息
export function UPDATEVIDEOLIVE(data = {}, config = {}) {
  return $Request({
    url: '/addons/video/video/updateVideoLive',
    data,
    noLogin: true,
    ...config,
  });
}

// 更新视频号预约直播
export function UPDATEVIDEOTRAILER(data = {}, config = {}) {
  return $Request({
    url: '/addons/video/video/updateVideoTrailer',
    data,
    noLogin: true,
    ...config,
  });
}
