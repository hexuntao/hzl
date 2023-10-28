import routes from "@/router/routes";
import {
  platform,
  isWeixin,
  routePathToName,
  formatURLQuery,
  encodeUriParams,
  getUriParam
} from "@/common/utils";

import env from "@/config";

let envConfig = env[process.env.NODE_ENV];

const tabbarHeight = uni.upx2px(100);

let website_id = envConfig.WEBSITE_ID || 0;

// #ifdef H5
import $Storage from "@/api/storage";
if (getUriParam(location.search, "website_id")) {
  website_id = getUriParam(location.search, "website_id");
  $Storage.setSession("website_id", website_id);
} else {
  website_id = $Storage.getSession("website_id") || website_id;
}
// #endif

export default {
  state: {
    version: envConfig.VERSION,
    appName: envConfig.NAME, // 应用名称
    authKey: envConfig.AUTH_KEY,
    domain:
      platform("H5") && process.env.NODE_ENV === "production"
        ? location.origin
        : envConfig.DOMAIN, // 域名
    subDomain:
      platform("H5") && process.env.NODE_ENV === "production"
        ? location.origin
        : envConfig.SUBDOMAIN, // 子域名、二级域名，独立域名
    website_id: website_id,
    // #ifdef H5
    isWeixin: isWeixin(),
    // #endif
    // #ifndef H5
    isWeixin: false,
    // #endif
    loginBeforePath: "/pages/mall/index",
    currentRoute: { path: "pages/mall/index", query: {} },
    //自定义分享参数
    customShareParam: {
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    },
    // 微信小程序基本信息
    mpWxBaseInfo: {
      // #ifdef MP-WEIXIN
      ...__wxConfig.accountInfo
      // #endif
    },
    requestList: []
  },
  getters: {
    //接口请求基础地址
    apiBaseUrl: state => {
      let baseUrl = state.domain + "/" + envConfig.BASE_API;
      // #ifdef H5
      baseUrl =
        process.env.NODE_ENV == "development"
          ? "/api"
          : "/" + envConfig.BASE_API;
      // #endif
      return baseUrl;
    },
    // 静态资源路径以及各种占位图和各种出错图片合集
    static: state => {
      const baseImgPath = state.domain + "/public/app/images/";
      return {
        baseImgPath: baseImgPath,
        noAvatar: baseImgPath + "no-avatar.png",
        noGoods: baseImgPath + "no-goods.png",
        noShop: baseImgPath + "no-shop.png",
        noRectangle: baseImgPath + "no-rectangle.png",
        noSquare: baseImgPath + "no-square.png"
      };
    },
    windowBottom: (state, root) => {
      // #ifndef MP-WEIXIN
      return root.route.meta.isTabBar ? tabbarHeight : 0;
      // #endif
      // #ifdef MP-WEIXIN
      return 0;
      // #endif
    },
    // 当前路由信息
    route: (state, root, { config }) => {
      let urlArr = [state.domain, "wap"]; // wap为h5二级目录
      const { path, query } = state.currentRoute;
      const obj = routes[routePathToName(path)] || {};
      const fullPath = obj.path + formatURLQuery(`?${encodeUriParams(query)}`);
      const origin = urlArr.join("/");
      urlArr.push(fullPath.substr(1));
      if (obj.meta) {
        obj.meta.isTabBar = config.tabbar.list.some(e => e.path === obj.path);
      }
      return {
        origin,
        url: urlArr.join("/"),
        path: obj.path,
        name: obj.name,
        query,
        encodeQuery: encodeUriParams(query),
        params: {},
        meta: { ...obj.meta },
        title: obj.title,
        fullPath
      };
    },
    // 当前页面分享参数
    shareParams: (state, getters) => {
      const { route, extendCode, encodeUid } = getters;
      let urlArr = [state.domain, "wap"]; // wap为h5二级目录
      let path = ""; // 分享类型为当前页路径，否则默认首页 (注意：不带/)
      let title = state.config.mall_name || "";
      let desc = "我刚刚发现了一个很不错的商城，赶快来看看吧。";
      let imgUrl = /*state.config.logo || getters.static.noSquare ||*/ ''; // 添加默认图片，防止分享报错
      let query = {}; //当前分享的参数
      const excludeKeys = [
        "extend_code",
        "scene",
        "poster_id",
        "poster_type",
        "user_token",
        "state",
        "code",
        "uid"
      ];
      //排除指定参数key
      for (const key in route.query) {
        if (!excludeKeys.some(e => e == key)) {
          query[key] = route.query[key];
        }
      }
      if (route.meta.shareType === "current") {
        path = route.meta.pagePath;
        title = route.title + " - " + title;
      } else {
        path = "pages/mall/index";
      }
      const custom = state.customShareParam; // 自定义的分享参数
      path = custom.path || path;
      desc = custom.desc || desc;
      title = custom.title || title;
      imgUrl = custom.imgUrl || imgUrl;
      query = Object.assign({ ...query }, { ...custom.query });
      urlArr.push(path);
      let url = urlArr.join("/");
      if (extendCode) {
        // 分享参数需带上会员推广码
        query.extend_code = extendCode;
      }
      if (custom.shareUid && encodeUid) {
        // 自定义参数存在shareUid,表示需要携带用户uid
        query.uid = encodeUid;
      }
      const URLQuery = formatURLQuery(`?${encodeUriParams(query)}`);
      const link = platform("MP") ? path + URLQuery : url + URLQuery; //小程序当前路径(不带/)，其他为h5/app是带域名的路径
      return {
        title,
        desc,
        imgUrl,
        link,
        pagePath: path,
        scene: query,
        query: encodeUriParams(query)
      };
    }
  },
  mutations: {
    // 设置第三方平台数据
    setExtConfig(state, config = {}) {
      if (config.domain) {
        state.domain = config.domain;
        state.subDomain = config.domain_wap;
        state.website_id = config.website_id;
        state.appName = config.project_name || envConfig.NAME;
        state.authKey = config.auth_key || envConfig.AUTH_KEY;
      } else {
        state.domain = envConfig.DOMAIN;
        state.subDomain = envConfig.SUBDOMAIN;
        state.website_id = envConfig.WEBSITE_ID;
        state.appName = envConfig.NAME;
        state.authKey = envConfig.AUTH_KEY;
      }
      console.log(__wxConfig);
    },
    // 设置登录之前的路径
    setLoginBeforePath(state, path) {
      state.loginBeforePath = path;
    },
    // 设置当前路由信息
    setCurrentRoute(state, route = {}) {
      state.currentRoute = { ...route };
    },
    // 设置分享参数
    setShareParam(state, params = {}) {
      state.customShareParam = Object.assign({}, { ...params });
    },
    // 设置需要取消请求的列表
    setRequestList(state, cancel) {
      state.requestList.push({ cancel });
    },
    // 取消请求并清除列表
    clearRequestList(state) {
      state.requestList.forEach(e => {
        e.cancel.abort();
      });
      state.requestList = [];
    }
  },
  actions: {}
};
