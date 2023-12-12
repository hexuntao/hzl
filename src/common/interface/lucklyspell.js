import $Request from "@/api/requset";

// 幸运拼团详情
export function GETLUCKYSPELLRECORD(data = {}, config = {}) {
  return $Request({
    url: "/addons/luckyspell/luckyspell/getLuckySpellRecord",
    data,
    isShowLoading: true,
    errorCallback: true,
    ...config
  });
}