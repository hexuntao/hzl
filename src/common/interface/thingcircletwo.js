import $Request from "@/api/requset";

// 干货列表（首页）
export function GET_THINGCIRCLETWOLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoList",
    data,
    ...config
  });
}

// 用户干货信息（我的）
export function GET_THINGCIRCLETWOUSERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoUser",
    data,
    ...config
  });
}

//用户干货列表（我的）
export function GET_THINGCIRCLETWOUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getUserThingList",
    data,
    ...config
  });
}

//粉丝生活
export function GET_THINGCIRCLETWODETAIL(data = {}, config = {}) {
  let urlLast =
    config.pageType == "video"
      ? "getThingcircletwoVideoDetail"
      : "getThingcircletwoDetail";
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/" + urlLast,
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}

export function GET_THINGCIRCLETWOVEDIODETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoVideoDetail",
    data,
    noLogin: true,
    ...config
  });
}

// 获取用户评论回复
export function GET_THINGCIRCLETWOREPLY(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoReply",
    data,
    ...config
  });
}

// 用户关注
export function GET_THINGCIRCLETWOFOLLOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/attentionThingcircletwo",
    data,
    ...config
  });
}

// 用户收藏
export function GET_THINGCIRCLETWOCOLLECTION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/collectionThingcircletwo",
    data,
    ...config
  });
}

// 获取用户关注列表
export function GET_ATTENTIONUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/attentionUserList",
    data,
    ...config
  });
}

// 获取用户粉丝列表
export function GET_FANSUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/fansUserList",
    data,
    ...config
  });
}

//发布干货
export function ADD_RELEASEDRY(data = {}, config = {}) {
  const url = data.thing_id
    ? "/addons/thingcircletwo/thingcircletwo/updateThingcircletwoWap"
    : "/addons/thingcircletwo/thingcircletwo/addThingcircletwoWap";
  return $Request({
    url: url,
    data,
    ...config
  });
}

//用户点赞干货
export function GET_THINGCIRCLETWOLIKES(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/likesThingcircletwo",
    data,
    ...config
  });
}

//评论干货
export function ADD_THINGCIRCLETWOCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/pushThingcircletwoComment",
    data,
    ...config
  });
}

//干货评论列表
export function GET_COMMENTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getComment",
    data,
    ...config
  });
}

//获取举报类型
export function GET_VIOLATIONLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getViolationList",
    data,
    ...config
  });
}

//用户举报
export function ADD_VIOLATION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/addViolation",
    data,
    ...config
  });
}

//用户回复
export function REPLY_THINGCIRCLETWOCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/replyThingcircletwoComment",
    data,
    ...config
  });
}

//删除用户评论
export function DEL_THINGCIRCLETWOCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/delComment",
    data,
    ...config
  });
}

//用户点赞评论
export function GET_THINGCIRCLETWOLIKESCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/likesThingcircletwoComment",
    data,
    ...config
  });
}

//用户推荐商品列表
export function GET_RECOMMENDGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getRecommendGoods",
    data,
    ...config
  });
}

//话题搜索列表（一级）
export function GET_TOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getTopicList",
    data,
    ...config
  });
}
//话题搜索列表（一级）
export function GET_TOPICLISTTREE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getTopicListTree",
    data,
    ...config
  });
}
//话题搜索列表（一级）
export function GET_TOPICLISTSECOND(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getAllSecond",
    data,
    ...config
  });
}

//话题列表（二级）
export function GET_NEXTTOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getLowerTopicList",
    data,
    ...config
  });
}

//消息中心
export function GET_THINGCIRCLETWOMESSAGECENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoMessageCenter",
    data,
    ...config
  });
}

//消息通知
export function GET_THINGCIRCLETWOMESSAGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoMessage",
    data,
    ...config
  });
}

//消息点赞和收藏
export function GET_THINGCIRCLETWOLAC(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoLac",
    data,
    ...config
  });
}

//消息评论和@
export function GET_THINGCIRCLETWOAT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getThingcircletwoComment",
    data,
    ...config
  });
}

//分享
export function GET_SHAREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getShareInfo",
    data,
    ...config
  });
}

//获取定位地址信息
export function GET_THINGCIRCLETWOAREA(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/getarea",
    data,
    ...config
  });
}

//获取设置文案
export function GET_THINGCIRCLETWOTEXTS(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/thingcircletwoCopyStyle",
    data,
    ...config
  });
}

//删除干货
export function DEL_THINGCIRCLETWO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircletwo/thingcircletwo/delThingcircletwoForWap",
    data,
    ...config
  });
}
