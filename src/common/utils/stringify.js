import { isObject, isDef } from ".";

/**
 * 格式化style对象 转成 字符串形式
 * {width:100px,height:100px} ==> width:100px;height:100px;
 * @param {object} value
 */
export function formatStyle(value) {
  if (isObject(value) && !Array.isArray(value)) {
    return tranString(value);
  }
  return "";
}

/**
 * 格式化class 转成字符串形式
 * {a:true,b:true} / ['a','b'] / 'a' ==> 'a b'
 * @param {string/array/object} value
 */
export function formatClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

// 规范化格式
const hyphenateRE = /\B([A-Z])/g;
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
export const hyphenate = cached(str => {
  return str.replace(hyphenateRE, "-$1").toLowerCase();
});

// 不需要添加数值单位符号的样式属性
const noUnitNumericStyleProps = {
  "animation-iteration-count": true,
  "border-image-outset": true,
  "border-image-slice": true,
  "border-image-width": true,
  "box-flex": true,
  "box-flex-group": true,
  "box-ordinal-group": true,
  "column-count": true,
  columns: true,
  flex: true,
  "flex-grow": true,
  "flex-positive": true,
  "flex-shrink": true,
  "flex-negative": true,
  "flex-order": true,
  "grid-row": true,
  "grid-row-end": true,
  "grid-row-span": true,
  "grid-row-start": true,
  "grid-column": true,
  "grid-column-end": true,
  "grid-column-span": true,
  "grid-column-start": true,
  "font-weight": true,
  "line-clamp": true,
  "line-height": true,
  opacity: true,
  order: true,
  orphans: true,
  "tab-size": true,
  widows: true,
  "z-index": true,
  zoom: true,
  // SVG
  "fill-opacity": true,
  "flood-opacity": true,
  "stop-opacity": true,
  "stroke-dasharray": true,
  "stroke-dashoffset": true,
  "stroke-miterlimit": true,
  "stroke-opacity": true,
  "stroke-width": true
};

function normalizeValue(key, value) {
  if (
    typeof value === "string" ||
    (typeof value === "number" && noUnitNumericStyleProps[key]) ||
    value === 0
  ) {
    return `${key}:${value};`;
  } else {
    return ``;
  }
}

function tranString(value) {
  let res = [];
  for (const key in value) {
    res.push(normalizeValue(hyphenate(key), value[key]));
  }
  return res.filter(e => e).join(" ");
}

function stringifyArray(value) {
  let res = "";
  let stringified;
  for (let i = 0, l = value.length; i < l; i++) {
    if (isDef((stringified = formatClass(value[i]))) && stringified !== "") {
      if (res) res += " ";
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value) {
  let res = "";
  for (const key in value) {
    if (value[key]) {
      if (res) res += " ";
      res += key;
    }
  }
  return res;
}
