import $Store from "@/store";
import $Prompt from "@/api/prompt";
import $Other from "@/api/other";
import routes from "@/router/routes";
import {
  isObject,
  formatURLQuery,
  encodeUriParams,
  routePathToName,
  isBrowser
} from "@/common/utils";
import { compPath } from "./comp-path";

/**
 * 导航跳转方法名（判断传入的方法名是否符合跳转）
 * @param {string} method 方法名
 * @param {string} path 路由
 * @returns 方法名
 */
function navMethod(method, path) {
  // #ifdef H5
  return isTabbarRoute(path)
    ? "reLaunch"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
  // #ifdef APP-PLUS
  return isTabbarRoute(path)
    ? "redirectTo"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
  // #ifdef MP-WEIXIN
  return isTabbarRoute(path)
    ? path.split("?")[0] == "/pages/goods/list" ||
      path.split("?")[0] == "/pages/order/list"
      ? "reLaunch"
      : "switchTab"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
}

//判断是否为tabbar页面
export function isTabbarRoute(route = "") {
  let flag = false;
  if (typeof route !== "string") {
    return flag;
  }
  if (route === "/") {
    return true;
  }
  if (route.indexOf("pages") !== -1) {
    route = route.split("?")[0];
    flag = $Store.state.config.tabbar.list.some(({ path }) => route === path);
  }
  return flag;
}

/**
 * 路由跳转
 * @param {*} method 导航跳转方法名
 * @param {object/string} options 路由参数（如传入路由信息对象，统一返回string形式的url链接并带上参数）
 * @returns {object}
 * 返回url跟跳转方法名
 */
export function navigate(method = "navigateTo", options = {}) {
  let url = "";
  if (isObject(options)) {
    let { path, query, appid, mpath } = Object.assign({}, options);
    /**
     * 跳转其他小程序
     * appid 为小程序appid，mpath 跳转的小程序路径
     */
    if (appid) {
      // #ifdef H5
      console.log("跳转小程序：" + appid);
      // #endif
      $Other.toMiniProgram({
        appid: appid,
        path: mpath
      });
      return false;
    }

    const URLQuery = formatURLQuery(`?${encodeUriParams(query)}`);
    url = `${path}${URLQuery}`;
    method = navMethod(method, path); // 判断后的路由方法名
  } else {
    url = options;
    method = navMethod(method, options); // 判断后的路由方法名
  }

  // 获取当前路由对象
  let route = routes[routePathToName(url)];

  if (!route) {
    // 找不到路由情况，尝试查找旧路由
    // console.log(url, "==>", compPath(url));
    url = compPath(url);
    if (!url) return false;
    method = navMethod(method, url); // 判断后的路由方法名
    route = routes[routePathToName(url)];
  }

  if (!route) {
    console.log("未找到相关页面");
    return {
      url: "/packages/mall/notice?type=404",
      method: "navigateTo"
    };
  }

  // #ifdef MP-WEIXIN
  console.log("会员信息", $Store.state.member.info);
  // #endif

  if (!$Store.state.isWeixin && !route.meta.noLogin && !$Store.getters.token) {
    //未登录情况跳转到登录页面
    $Store.commit("setLoginBeforePath", url); //url包含路由参数
    return {
      url: "/packages/login/index",
      method: "navigateTo"
    };
  }
  if (route.meta.addon) {
    const addonArr =
      typeof route.meta.addon == "string"
        ? [route.meta.addon]
        : route.meta.addon || [];
    if (!addonArr.some(e => !!$Store.state.config.addons[e])) {
      //未开启相关应用
      return {
        url: "/packages/mall/notice?type=noaddon&addon=" + route.meta.addon,
        method: "navigateTo"
      };
    }

    // 招商员
    if (
      route.meta.addon == "merchants" &&
      $Store.state.member.info.is_merchants == 0
    ) {
      $Prompt
        .modal({
          title: "提示",
          content: `您未成为招商员，请前往申请`,
          confirmText: "前往申请"
        })
        .then(() => {
          uni.navigateTo({
            url: "/packages/merchant/apply"
          });
        })
        .catch(() => {});
      return false;
    }

    // 需要是分销商才能进入的应用页面
    const pageDistribe = {
      distribution: 1,
      microshop: 1,
      channel: 1,
      areabonus: 1,
      globalbonus: 1,
      teambonus: 1
    };
    if (
      addonArr.some(e => !!pageDistribe[e]) &&
      $Store.state.member.info.isdistributor != 2
    ) {
      $Prompt
        .modal({
          title: "提示",
          content: `您未成为${$Store.state.distribute.texts.distributor_name}`,
          confirmText: "前往申请"
        })
        .then(() => {
          uni.navigateTo({
            url: "/packages/distribute/apply"
          });
        })
        .catch(() => {});
      return false;
    }
		if (
		  route.meta.addon === "technician" &&
		  $Store.state.member.info.user_tel == ""
		) {
		  $Prompt
		    .modal({
		      title: "提示",
		      content: `您还没绑定手机号`,
		      confirmText: "前往绑定"
		    })
		    .then(() => {
		      uni.navigateTo({
		        url: "/pages/member/bind"
		      });
		    })
		    .catch(() => {});
		  return false;
		}
  }

  // #ifdef H5
  if (route.meta.refresh && $Store.state.isWeixin && isBrowser("ios")) {
    location.replace($Store.getters.route.origin + url);
    return false;
  }
  // #endif

  return {
    method,
    url
  };
}
