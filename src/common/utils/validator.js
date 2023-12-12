import $Prompt from "@/api/prompt";

/**
 * 验证是否为空
 */
export function validEmpty(value, msg) {
  if (!value || value == "") {
    $Prompt.toast(msg ? msg : "不能为空");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证手机号
 */
export function validMobile(value, areaCode = 86) {
  if (areaCode && areaCode != 86) {
    // 非86 非国内手机号区号 不验证
    return true;
  }
  value = String(value || "");
  value = value.replace(/[^-|\d]/g, "");
  let valid =
    /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
  if (!valid) {
    $Prompt.toast("请填入正确的手机号码");
  }
  return valid;
}

/**
 * 验证用户名
 */
export function validUsername(value, msg) {
  if (!value || value == "") {
    $Prompt.toast(msg ? msg : "用户名或者手机不能为空");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证短信验证
 */
export function validMsgcode(value) {
  if (!value || value == "") {
    $Prompt.toast("验证码不能为空");
    return false;
  } else if (value.length !== 6) {
    $Prompt.toast("验证码为6位数");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证图片验证
 */
export function validImgcode(value) {
  if (!value || value == "") {
    $Prompt.toast("图片验证码不能为空");
    return false;
  } else if (value.length !== 4) {
    $Prompt.toast("图片验证码为4位数");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证密码
 */
export function validPassword(value) {
  var patrn = /^(\w){6,20}$/;
  if (!value || value == "") {
    $Prompt.toast("密码不能为空");
    return false;
  } else if (!patrn.exec(value)) {
    $Prompt.toast("只能输入6-20个字母、数字、下划线");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证两次密码是否符合
 */
export function validCheckPassword(value1, value2) {
  if (!value2 || value2 == "") {
    $Prompt.toast("确认密码不能为空");
    return false;
  } else if (value1 !== value2) {
    $Prompt.toast("两次密码不符合");
    return false;
  } else {
    return true;
  }
}

/**
 * 验证邮箱
 */
export function validEmail(value) {
  var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (value === "") {
    $Prompt.toast("邮箱不能为空！");
    return false;
  } else if (!reg.test(value)) {
    $Prompt.toast("请输入正确的邮箱");
    return false;
  } else {
    return true;
  }
}

// 验证身份证
export function validCard(value) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    $Prompt.toast("请输入正确的身份证号！");
    return false;
  } else {
    return true;
  }
}

// 验证支付密码
export function validPayPassword(value, len) {
  var reg = /^[0-9a-zA-Z_%&.,=\-_]{9,20}$/;
  var text = "由9-20个字母、数字、普通字符组成";
  if (len == 6) {
    reg = /^[0-9a-zA-Z_%&.,=\-_]{6}$/;
    text = "长度为6位，由字母、数字、普通字符组成";
  }
  if (len == 9) {
    reg = /^[0-9a-zA-Z_%&.,=\-_]{9}$/;
    text = "长度为9位，由字母、数字、普通字符组成";
  }
  if (!reg.test(value)) {
    $Prompt.toast(text);
    return false;
  } else {
    return true;
  }
}

// 验证纯数字
export function validNumber(value, msg) {
  var reg = /^[1-9]+[0-9]*]*$/;
  if (reg.test(value)) {
    $Prompt.toast(msg ? msg : "不能为纯数字");
    return false;
  } else {
    return true;
  }
}
