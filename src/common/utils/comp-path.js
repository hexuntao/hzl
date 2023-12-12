import { oldRoute, oldParamRoute } from "@/common/data/old-routes";
import {
  formatURLQuery,
  encodeUriParams,
  decodeUriParams
} from "@/common/utils";
import $Store from "@/store";

// #ifdef MP
import $System from "@/api/system";
import $Prompt from "@/api/prompt";
// #endif

// 查询路径，兼容旧路径，返回新规则路径
export function compPath(path) {
  let newPath = "";
  if (isExLink(path)) {
    // 存在外链情况
    openLink(path);
    return "";
  }
  if (oldRoute[path]) {
    newPath =
      oldRoute[path].path +
      formatURLQuery(`?${encodeUriParams(oldRoute[path].query)}`);
  } else {
    let arr = path.split("?"); // 判断路由是否携带query参数
    if (arr[1] && oldRoute[arr[0]]) {
      newPath =
        oldRoute[arr[0]].path +
        formatURLQuery(`?${encodeUriParams(decodeUriParams(path))}`);
    } else {
      newPath = paramRoute(arr[0]);
    }
  }
  return newPath;
}

// 必带带参数的路由
// 如 /diy/1
export function paramRoute(str) {
  let path = str;
  oldParamRoute.forEach(e => {
    if (
      str.indexOf(e.key) === 0 ||
      (str.indexOf($Store.state.domain) != -1 && str.indexOf(e.key) != -1)
    ) {
      // 与旧路由匹配的链接
      // 存在与自身域名和路由匹配的也属于旧路由
      const paramVal = str.split(e.key)[1]; // 旧路由是其中一种情况下，获取参数值
      path = e.fullPath + paramVal;
    }
  });
  return path;
}

// 判断是否外部链接
export function isExLink(path = "") {
  // #ifndef MP
  const origin = $Store.getters.route.origin.split("://").length
    ? $Store.getters.route.origin.split("://")[1]
    : "";
  return path.indexOf("http") === 0;
  // #endif

  // #ifdef MP
  return path.indexOf("http") === 0;
  // #endif
}

// 外部链接情况跳转方式
export function openLink(link) {
  // #ifdef APP-PLUS
  plus.runtime.openURL(link);
  // #endif

  // #ifdef H5
  location.assign(link);
  // window.open(link);
  // #endif

  // #ifdef MP
  $System.setClipboardData(link).then(() => {
    $Prompt.modal({
      content: "已自动复制网址，请在手机浏览器里粘贴该网址",
      showCancel: false
    });
  });
  // #endif
}
