import $Storage from "@/api/storage";

const key = "token";
const bind_mobile = "bind_mobile";

export function SET_TOKEN(token) {
  $Storage.set(key, token);
}

export function GET_TOKEN() {
  return $Storage.get(key);
}

export function REMOVE_TOKEN() {
  return $Storage.remove(key);
}

export function SET_BINDMOBILE(falg) {
  return $Storage.set(bind_mobile, falg);
}

export function GET_BINDMOBILE() {
  return $Storage.get(bind_mobile);
}

export function REMOVE_BINDMOBILE() {
  return $Storage.remove(bind_mobile);
}
