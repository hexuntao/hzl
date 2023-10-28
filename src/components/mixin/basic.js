export default {
  props: {
    // 自定义类名
    customClass: {
      type: [String, Array, Object],
      default: () => {}
    },
    // 自定义样式
    customStyle: {
      type: [Object],
      default: () => {}
    }
  }
};
