import md5 from "@/common/lib/md5.min";
import $Store from "@/store";
import config from "@/config";

export const envConfig = config[process.env.NODE_ENV];

/**
 * 获取当前平台  H5/APP/MP...
 * @param {string} value 传入指定平台名称 返回Boolean
 */
export function platform(value) {
  let name = "";
  let isMp = false;

  // #ifdef APP-PLUS-NVUE
  name = "APPNVUE";
  // #endif

  // #ifdef APP-PLUS
  name = "APP";
  // #endif

  // #ifdef H5
  name = "H5";
  // #endif

  // #ifdef MP-ALIPAY
  name = "ALIPAY";
  isMp = true;
  // #endif

  // #ifdef MP-BAIDU
  name = "BAIDU";
  isMp = true;
  // #endif

  // #ifdef MP-QQ
  name = "QQ";
  isMp = true;
  // #endif

  // #ifdef MP-WEIXIN
  name = "WEIXIN";
  isMp = true;
  // #endif

  // #ifdef MP-TOUTIAO
  name = "TOUTIAO";
  isMp = true;
  // #endif

  return value ? value === name || (value === "MP" && isMp) : name;
}

/**
 * 判断是否在微信环境
 */
export function isWeixin() {
  // #ifndef H5
  return false;
  // #endif
  if (!navigator) return false;
  const ua = navigator.userAgent.toLowerCase();
  return !!(ua.match(/MicroMessenger/i) == "micromessenger");
}

/**
 * 判断客户端系统
 * system  系统名称  android/ios
 */
export function isBrowser(system) {
  const pf = uni.getSystemInfoSync().platform;
  return system === pf;
  // if (!navigator || !system) return null;
  // const arr = ["android", "ios"];
  // if (arr.indexOf(system) == -1) return null;
  // var u = navigator.userAgent;
  // var s = {
  //   android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端
  //   ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  // };
  // return s[system];
}

/**
 * 验证请求接口签名
 * @param obj  请求参数
 * @returns string
 */
export function authSign(obj, key) {
  let api_key = key || $Store.state.authKey;
  // console.log(obj)
  // let newObj = "";
  // if (obj && typeof obj == "object") {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       obj[key] = obj[key] === undefined ? "" : obj[key];
  //     }
  //   }
  //   newObj = Object.keys(obj).join("");
  // }
  return md5(api_key + String(obj).toLocaleLowerCase());
}

/**
 * 首字母大写
 */
export function firstToUpperCase(str) {
  var temp = [];
  str = str.toLowerCase();
  temp = str.split(" ");
  for (var i = 0; i < temp.length; i++) {
    var str_temp = temp[i].charAt(0);
    str_temp = str_temp.toUpperCase();
    temp[i] = temp[i].replace(temp[i].charAt(0), str_temp);
  }
  str = temp.join(" ");
  return str;
}

/**
 * 时间日期转时间戳
 */
export function dateToTimestamp(time, millisecond) {
  time = String(time || "");
  var timestr = time.indexOf("-") != -1 ? time.replace(/-/g, "/") : time;
  var date = new Date(timestr);
  var time1 = date.getTime(); //毫秒
  var time3 = Math.round(date / 1000); // 秒
  if (millisecond) {
    return time1;
  } else {
    return time3;
  }
}

/**
 * 处理时间戳
 * @param {*} timestamp 时间戳
 * @param {*} fmt 日期格式(YYYY-MM-DD hh:mm:ss)
 */
export function formatDate(timestamp = "", fmt = "YYYY-MM-DD") {
  // yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
  timestamp = parseInt(timestamp);
  // 如果为null,则格式化当前时间
  if (timestamp == null) timestamp = Number(new Date());
  /**
   * 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
   * 或者存在负数情况
   */

  if (timestamp.toString().length <= 10 || timestamp < 0) {
    timestamp *= 1000;
  }

  let date = new Date(timestamp);
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "D+": date.getDate().toString(), // 日
    "h+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      var tkey = ret[1];
      var val = tkey.length == 1 ? opt[k] : opt[k].padStart(tkey.length, "0");
      fmt = fmt.replace(tkey, val);
    }
  }
  return fmt;
}
/**
 * 时间戳转为 时分秒 多久之前
 * @param value 秒
 */
export function formatSeconds(value) {
  var theTime = parseInt(value); // 秒
  var middle = 0; // 分
  var hour = 0; // 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (middle > 0) {
    result = "" + parseInt(middle) + "分" + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + "小时" + result;
  }
  return result;
}

/**
 * 时间戳转为多久之前
 * @param String timestamp 时间戳
 * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
 * 如果为布尔值false，无论什么时间，都返回多久以前的格式
 */
export function dateFormatFrom(timestamp = "", format = "YYYY-MM-DD") {
  if (timestamp == null) timestamp = Number(new Date());
  timestamp = parseInt(timestamp);
  // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
  if (timestamp.toString().length == 10) timestamp *= 1000;
  var timer = new Date().getTime() - timestamp;
  timer = parseInt(timer / 1000);
  // 如果小于5分钟,则返回"刚刚",其他以此类推
  let tips = "";
  // console.log(timer);
  switch (true) {
    case timer < 300:
      tips = "刚刚";
      break;
    case timer >= 300 && timer < 3600:
      tips = parseInt(timer / 60) + "分钟前";
      break;
    case timer >= 3600 && timer < 86400:
      tips = parseInt(timer / 3600) + "小时前";
      break;
    case timer >= 86400 && timer < 2592000:
      tips = parseInt(timer / 86400) + "天前";
      break;
    default:
      // 如果format为false，则无论什么时间戳，都显示xx之前
      if (format === false) {
        if (timer >= 2592000 && timer < 365 * 86400) {
          tips = parseInt(timer / (86400 * 30)) + "个月前";
        } else {
          tips = parseInt(timer / (86400 * 365)) + "年前";
        }
      } else {
        tips = formatDate(timestamp, format);
      }
  }
  return tips;
}

/**
 * 拼接单位符号
 * @param {string} value 值
 * @param {string} symbol 单位符号
 * @param {Boolean} isBefore 位置 是否在前面添加（默认false）
 */
export function symbol(value, symbol, isBefore) {
  let str = String(value);
  return isBefore ? symbol + str : str + symbol;
}

/**
 * 价格符号
 * @param {string/number} value 值
 */
export function yuan(value = 0) {
  var p = parseFloat(value || 0);
  var isDot = p.toString().indexOf(".") != -1;
  var fix = !isDot ? 0 : 2;
  var num = p.toFixed(fix);
  return "¥" + num;
}

// 虚拟币保留小数点四位
export function bi(value = 0, fixedNum = 4, symbol) {
  return symbol
    ? symbol + parseFloat(value).toFixed(fixedNum)
    : parseFloat(value).toFixed(fixedNum);
}

/**
 * 获取字符串url指定参数值
 * @param {string} str 字符串url
 * @param {string} param  指定参数名
 */
export function getUriParam(str, param) {
  var query = str.split("?")[1];
  if (query) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == param) {
        return pair[1];
      }
    }
  }
  return false;
}

/**
 * url中的参数解析成对象
 * @param {*} url
 */
export function decodeUriParams(url = "") {
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substr(1).split("=");
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeUriParams(obj = {}, encode) {
  const params = [];
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    // 如果值为undefined将其置空
    if (typeof value === "undefined") {
      value = "";
    }
    // 对于需要编码的文本（比如中文）进行编码
    let uriValue = encode ? encodeURIComponent(value) : value;
    params.push([key, uriValue].join("="));
  });

  return params.join("&");
}

/**
 * 判断是否为对象
 * @param {any} x
 */
export function isObject(x) {
  const type = typeof x;
  return x !== null && (type === "object" || type === "function");
}

/**
 * 判断是否有值
 * @param {any} x
 */
export function isDef(value) {
  return value !== undefined && value !== null && value !== "";
}

/**
 * 判断是否为空对象或空数组
 * @param obj
 */
export function isEmpty(obj) {
  if (!obj && obj !== 0 && obj !== "") {
    return true;
  }
  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }
  if (isObject(obj) && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

/**
 * 把一些不必要的参数进行格式化掉，完成url的美观
 * @param {String} URLQuery URL中传递的参数
 */
export function formatURLQuery(query) {
  switch (query.trim()) {
    case `query=%7B%7D`:
    case `%7B%7D`:
    case `?query=%7B%7D`:
    case `?`:
    case `?undefined`:
    case `?null`:
    case `?[object Object]`:
    case `?query={}`:
      query = "";
      break;
  }
  return query;
}

/**
 * 路由path转name
 * @param {string} path 路径
 * /pages/mall/index ==> pages-mall-index
 */
export function routePathToName(path = "") {
  const p = path.split("?")[0];
  return p
    .split("/")
    .filter(s => s && String(s).trim())
    .join("-");
}

/**
 * px转rpx单位
 * @param {number/string} value
 */
export function pxTorpx(value) {
  return typeof value !== "number" && String(value).indexOf("rpx") !== -1
    ? value
    : `${parseInt(value) * 2}rpx`;
}

/**
 * 添加图片资源域名
 */
export function addImgSrcDomain(src) {
  const domain =
    platform("H5") && process.env.NODE_ENV === "production"
      ? location.origin
      : $Store.state.domain;
  let newSrc = "";
  if (typeof src != "string") return "";
  if (src.indexOf("http://") == 0 || src.indexOf("https://") == 0) return src;
  src.substr(0, 1) !== "/"
    ? (newSrc = domain + "/" + src)
    : (newSrc = domain + src);
  return newSrc;
}

/**
 * 获取服务端时间
 */
export function getServerTime() {
  return new Promise((resolve, reject) => {
    uni.request({
      // #ifdef H5
      url: "?t=" + new Date().getTime(),
      // #endif

      // #ifndef H5
      url: $Store.getters.route.origin + "/?t=" + new Date().getTime(),
      // #endif
      data: {},
      header: {},
      complete: ({ statusCode, header }) => {
        if (statusCode == 200) {
          header.date = header.date || header.Date;
          var timestamp = new Date(header.date).getTime();
          resolve(timestamp);
        } else {
          resolve(new Date().getTime());
        }
      }
    });
  });
}

/**
 * 合并对象
 * @param {} target
 */
export function merge(target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }
  return target;
}

/**
 * 手机号中间数字以星号表示
 */
export function encryptMobile(s) {
  var reg = /^(\d{3})\d+(\d{4})$/;
  var str = String(s || "");
  str = str.replace(reg, "$1 **** $2");
  return str;
}

/**
 * 银行卡中间数字以星号表示
 */
export function encryptBankCard(s) {
  var reg = /^(\d{4})\d+(\d{4})$/;
  var str = String(s || "");
  str = str.replace(reg, "$1 **** **** $2");
  return str;
}

/**
 * 当数量超过5位数时，已w替代
 */
export function wan(value = 0) {
  var value = parseFloat(value) || 0;
  let num = 0;
  if (value > 10000) {
    num = (value - (value % 1000)) / 10000 + "w";
  } else {
    num = value;
  }
  return num;
}

/**
 * 处理发布信息时间
 */
export function timeText(value = 0) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var month = day * 30;
  var year = month * 12;
  var time1 = new Date().getTime(); //当前的时间戳
  var time2 = parseInt(value * 1000); //指定时间的时间戳
  var time = time1 - time2;

  var result = null;
  if (time < 0) {
  } else if (time / year >= 1) {
    result = parseInt(time / year) + "年前";
  } else if (time / month >= 1) {
    result = parseInt(time / month) + "月前";
  } else if (time / week >= 1) {
    result = parseInt(time / week) + "周前";
  } else if (time / day >= 1) {
    result = parseInt(time / day) + "天前";
  } else if (time / hour >= 1) {
    result = parseInt(time / hour) + "小时前";
  } else if (time / minute >= 1) {
    result = parseInt(time / minute) + "分钟前";
  } else {
    result = "刚刚发布";
  }
  return result;
}

/**
 * 函数节流
 * @param {*} fn 事件回调
 * @param {*} delay 时间间隔的阈值
 */
export function throttle(fn, delay = 500) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0,
    timer = null;
  // 将throttle处理结果当作函数返回

  return function() {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 记录本次触发回调的时间
    let now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 函数防抖
 * @param {*} fn 事件回调
 * @param {*} interval 时间间隔的阈值
 */
export function debounce(fn, interval = 500) {
  let timeout = null;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, interval);
  };
}

/**
 * 限制输入框小数点后保留四位小数
 */
export function handleInput(e, n = 4) {
  let val = e;
  // 通过正则过滤小数点后四位
  if (n === 6) {
    val = e.match(/^\d*(\.?\d{0,5})/g)[0] || null;
  } else {
    val = e.match(/^\d*(\.?\d{0,3})/g)[0] || null;
  }
  return val;
}
/**
 * 限制输入正整数，不能小数点
 */
export function handleInt(e) {
  let val = String(e || "");
  val = val.replace(/\D/g, "");
  return val;
}

/**
 * 计算图片在视图上的高度
 * 图片原始宽度 w
 * 图片原始高度 h
 *
 * @reutrn height  单位px
 */
export function countImageHeight(w = 0, h = 0) {
  const windowWidth = uni.getSystemInfoSync().windowWidth; // 屏幕视图宽度
  const s = parseFloat(w) / windowWidth;
  return parseFloat(h) / s;
}

/**
 * 计算图片在视图上的高度
 * 图片原始宽度 w
 * 图片原始高度 h
 * 视图宽度 dw
 *
 * @reutrn height  单位px
 */
export function countForViewImgHeight(w = 0, h = 0, dw = 0) {
  var _w = parseFloat(w) || 0;
  var _h = parseFloat(h) || 0;
  var _dw = parseFloat(dw) || uni.getSystemInfoSync().windowWidth;
  var s = _w / _dw;
  var v = isNaN(_h / s) ? 0 : _h / s;
  return v;
}

// 随机生成RGBA颜色
export function randomRgbaColor() {
  var r = Math.floor(Math.random() * 256); //随机生成256以内r值
  var g = Math.floor(Math.random() * 256); //随机生成256以内g值
  var b = Math.floor(Math.random() * 256); //随机生成256以内b值
  var alpha = Math.random(); //随机生成1以内a值
  return `rgba(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
}

// 递归遍历对象，将所有属性值为 string 可转成 number 的属性值 全部转为number
export function strNumToNmber(data = {}) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key]) {
      if (typeof data[key] === "string") {
        if (!isNaN(Number(data[key]))) {
          if (Number(data[key]) < 10) {
            // 小于 10的数值， 转换成整数 并 字符串长度 为1，避免 01,001等情况被转换
            if (Number.isInteger(Number(data[key])) && data[key].length === 1) {
              data[key] = Number(data[key]);
            }
          }
        }
      } else {
        if (typeof data[key] === "object") {
          strNumToNmber(data[key]);
        }
      }
    }
  }
  return data;
}
