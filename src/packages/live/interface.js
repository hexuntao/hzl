import $Request from "@/api/requset";

// 获取观看记录
export function GET_LIVEHISTORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getWatchHistory",
    data,
    ...config
  });
}

// 获取主播小店商品
export function GET_LIVESHOPGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorGoodsList",
    data,
    ...config
  });
}

// 获取主播小店商品分类
export function GET_LIVESHOPGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getGoodsCate",
    data,
    ...config
  });
}

// 获取主播小店商品分类 商品列表
export function GET_LIVESHOPGOODSCATEGORYGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/pickGoods",
    data,
    ...config
  });
}

// 主播挑选商品
export function GET_LIVEPICKGOODS(data = {}, config = {}) {
  let url = config.isPicked
    ? "/addons/liveshopping/liveshopping/canclePickGoods"
    : "/addons/liveshopping/liveshopping/actPickGoods";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 获取粉丝列表
export function GET_LIVEFANSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getMyFans",
    data,
    ...config
  });
}

// 获取关注列表
export function GET_LIVEFOCUSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getMyFocus",
    data,
    ...config
  });
}

// 设置关注
export function SET_LIVEFOCUS(data = {}, config = {}) {
  let url = config.isFocued
    ? "/addons/liveshopping/liveshopping/cancleFocus"
    : "/addons/liveshopping/liveshopping/addFocus";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 设置点赞
export function SET_LIVELIKE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addLikes",
    data,
    ...config
  });
}

// 获取申请主播信息
export function GET_LIVEAPPLYANCHORINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/applyAnchor",
    data,
    ...config
  });
}

// 申请主播
export function APPLY_LIVEANCHOR(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actApplyAnchor",
    data,
    ...config
  });
}

// 获取举报类型
export function GET_LIVEREPORTVIOLATE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getViolationType",
    data,
    ...config
  });
}

// 举报直播间
export function REPORT_LIVEANCHOR(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addLiveReport",
    data,
    ...config
  });
}

// 开播申请数据
export function GET_LIVEANCHORAPPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getPlayData",
    data,
    errorCallback: true,
    ...config
  });
}

// 申请提交开播
export function APPLY_LIVEANCHORAPPLYPLAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/applyPlay",
    data,
    ...config
  });
}

// 获取直播预告信息
export function GET_LIVEANCHORADVANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAdvanceLiveData",
    data,
    ...config
  });
}

// 获取主播端添加商品列表
export function GET_LIVEANCHORGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorGoodsForAdd",
    data,
    ...config
  });
}

// 直播端商品添加
export function SET_LIVEANCHORGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actAnchorAddGoods",
    data,
    ...config
  });
}

// 直播端商品移除
export function SET_LIVEANCHORGOODSCANCLE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actAnchorCancleGoods",
    data,
    ...config
  });
}

// 直播端商品推荐
export function SET_LIVEANCHORGOODSRECOMMEND(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/recommendLiveGoods",
    data,
    ...config
  });
}

// 获取主播端主播信息
export function GET_LIVEANCHORINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorInfo",
    data,
    ...config
  });
}

// 获取推拉流地址
export function GET_LIVEPLAYERURL(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getLiveUrl",
    data,
    ...config
  });
}

// 下播
export function GET_LIVEANCHOREND(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actEndLive",
    data,
    noCancel: true,
    ...config
  });
}

// 直播结束统计信息
export function SET_LIVEANCHORENDSTATISTIC(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveLiveCountInfo",
    data,
    ...config
  });
}

// 获取直播结束统计信息
export function GET_LIVEANCHORENDSTATISTIC(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getliveEndData",
    data,
    ...config
  });
}

// 设置开播提醒
export function SET_LIVEREMIND(data = {}, config = {}) {
  let url = config.isRemind
    ? "/addons/liveshopping/liveshopping/addLiveRemind"
    : "/addons/liveshopping/liveshopping/cancleLiveRemind";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 获取直播商品列表
export function GET_LIVEGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorLiveGoodsList",
    data,
    ...config
  });
}

// 获取直播IM 用户签名
export function GET_LIVEUSERSIGN(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getUserSign",
    data,
    ...config
  });
}

//  记录 失去连接时间
export function SET_LIVEDISCONNECTTIME(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveDisconnectTime",
    data,
    noCancel: true,
    ...config
  });
}

// 获取直播间状态
export function GET_LIVEROOMSTATUS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getPlatformLiveStatus",
    data,
    ...config
  });
}

// 保存直播间群组id
export function SAVE_LIVEIMGROUPID(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveImGroupId",
    data,
    ...config
  });
}

// 获取礼物
export function GET_LIVEGIFTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getWapGiftList",
    data,
    ...config
  });
}

// 设置历史记录
export function SET_LIVEWATCHHISTORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addWatchHistory",
    data,
    ...config
  });
}

// 去除推流断开时间
export function DEL_LIVEDISCONNECTTIME(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/delDisconnectTime",
    data,
    ...config
  });
}
