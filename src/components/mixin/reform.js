import { addImgSrcDomain } from "@/common/utils";

export default {
  data() {
    return {
      cname: this.items.id,

      viewLoading: false, // 视图加载中
      viewLoaded: false, // 视图加载完成
      viewError: false, // 视图加载错误

      threshold: 50
    };
  },
  filters: {
    addDomain(value) {
      return addImgSrcDomain(value);
    }
  },
  props: {
    type: [String, Number],
    items: [Object, Array]
  },
  created() {},
  mounted() {
    // this.initIntersection();
  },
  beforeDestroy() {
    this.disconnectObserver();
  },
  methods: {
    toLink(link) {
      this.$Navigate.push(link);
    },
    disconnectObserver() {
      if (this.observer) this.observer.disconnect();
    },
    initIntersection(elClass) {
      return new Promise((resovle, reject) => {
        // mounted的时候，不一定挂载了这个元素，延时30ms
        // setTimeout(() => {
        this.disconnectObserver();
        this.$nextTick(() => {
          const observer = uni.createIntersectionObserver(this);
          // #ifdef H5
          try {
            if (window.parent.document.getElementById("wap-preview-iframe")) {
              resovle();
            } else {
              observer
                .relativeToViewport({ bottom: this.threshold })
                .observe(".reform-box", res => {
                  if (res.intersectionRatio > 0 && !this.appear) {
                    this.appear = true;
                    // console.log(this.items.id, this.items.key, "显示了");
                    this.disconnectObserver();
                    resovle();
                  }
                });
            }
          } catch (error) {
            resovle();
          }
          // #endif
          
          // #ifndef H5
          observer
            .relativeToViewport({ bottom: this.threshold })
            .observe(".reform-box", res => {
              if (res.intersectionRatio > 0 && !this.appear) {
                this.appear = true;
                // console.log(this.items.id, this.items.key, "显示了");
                this.disconnectObserver();
                resovle();
              }
            });
          // #endif
          this.observer = observer;
        });
        // }, 30);
      });
    }
  }
};
