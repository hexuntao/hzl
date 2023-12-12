// 处理ios端键盘抬起视图上移问题

// #ifdef H5
import { isBrowser } from "@/common/utils";
// #endif

export default {
  // #ifdef H5
  mounted() {
    // 监听键盘事件抬起关闭
    if (isBrowser("ios")) {
      window.addEventListener("focusout", this._focusout);
    }
  },
  methods: {
    _focusout() {
      const scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }
  },
  destroyed() {
    if (isBrowser("ios")) {
      window.removeEventListener("focusout", this._focusout);
    }
  },
  deactivated() {
    if (isBrowser("ios")) {
      window.removeEventListener("focusout", this._focusout);
    }
  }
  // #endif
};
