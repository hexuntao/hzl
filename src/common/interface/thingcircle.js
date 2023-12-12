import $Request from "@/api/requset";

// 干货列表（首页）
export function GET_THINGCIRCLELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleList",
    data,
    ...config
  });
}

// 用户干货信息（我的）
export function GET_THINGCIRCLEUSERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleUser",
    data,
    ...config
  });
}

//用户干货列表（我的）
export function GET_THINGCIRCLEUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getUserThingList",
    data,
    ...config
  });
}

//粉丝生活
export function GET_THINGCIRCLEDETAIL(data = {}, config = {}) {
  let urlLast =
    config.pageType == "video"
      ? "getThingcircleVideoDetail"
      : "getThingcircleDetail";
  return $Request({
    url: "/addons/thingcircle/thingcircle/" + urlLast,
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}

export function GET_THINGCIRCLEVEDIODETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleVideoDetail",
    data,
    noLogin: true,
    ...config
  });
}

// 获取用户评论回复
export function GET_THINGCIRCLEREPLY(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleReply",
    data,
    ...config
  });
}

// 用户关注
export function GET_THINGCIRCLEFOLLOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/attentionThingcircle",
    data,
    ...config
  });
}

// 用户收藏
export function GET_THINGCIRCLECOLLECTION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/collectionThingcircle",
    data,
    ...config
  });
}

// 获取用户关注列表
export function GET_ATTENTIONUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/attentionUserList",
    data,
    ...config
  });
}

// 获取用户粉丝列表
export function GET_FANSUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/fansUserList",
    data,
    ...config
  });
}

//发布干货
export function ADD_RELEASEDRY(data = {}, config = {}) {
  const url = data.thing_id
    ? "/addons/thingcircle/thingcircle/updateThingcircleWap"
    : "/addons/thingcircle/thingcircle/addThingcircleWap";
  return $Request({
    url: url,
    data,
    ...config
  });
}

//用户点赞干货
export function GET_THINGCIRCLELIKES(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/likesThingcircle",
    data,
    ...config
  });
}

//评论干货
export function ADD_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/pushThingcircleComment",
    data,
    ...config
  });
}

//干货评论列表
export function GET_COMMENTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getComment",
    data,
    ...config
  });
}

//获取举报类型
export function GET_VIOLATIONLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getViolationList",
    data,
    ...config
  });
}

//用户举报
export function ADD_VIOLATION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/addViolation",
    data,
    ...config
  });
}

//用户回复
export function REPLY_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/replyThingcircleComment",
    data,
    ...config
  });
}

//删除用户评论
export function DEL_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/delComment",
    data,
    ...config
  });
}

//用户点赞评论
export function GET_THINGCIRCLELIKESCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/likesThingcircleComment",
    data,
    ...config
  });
}

//用户推荐商品列表
export function GET_RECOMMENDGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getRecommendGoods",
    data,
    ...config
  });
}

//话题搜索列表（一级）
export function GET_TOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getTopicList",
    data,
    ...config
  });
}
//话题搜索列表（一级）
export function GET_TOPICLISTTREE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getTopicListTree",
    data,
    ...config
  });
}
//话题搜索列表（一级）
export function GET_TOPICLISTSECOND(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getAllSecond",
    data,
    ...config
  });
}

//话题列表（二级）
export function GET_NEXTTOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getLowerTopicList",
    data,
    ...config
  });
}

//消息中心
export function GET_THINGCIRCLEMESSAGECENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleMessageCenter",
    data,
    ...config
  });
}

//消息通知
export function GET_THINGCIRCLEMESSAGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleMessage",
    data,
    ...config
  });
}

//消息点赞和收藏
export function GET_THINGCIRCLELAC(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleLac",
    data,
    ...config
  });
}

//消息评论和@
export function GET_THINGCIRCLEAT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleComment",
    data,
    ...config
  });
}

//分享
export function GET_SHAREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getShareInfo",
    data,
    ...config
  });
}

//获取定位地址信息
export function GET_THINGCIRCLEAREA(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getarea",
    data,
    ...config
  });
}

//获取设置文案
export function GET_THINGCIRCLETEXTS(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/thingcircleCopyStyle",
    data,
    ...config
  });
}

//删除干货
export function DEL_THINGCIRCLE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/delThingcircleForWap",
    data,
    ...config
  });
}
