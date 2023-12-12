<template>
  <view class="luxury-gift-group">
    <view class="box" v-if="activeItem.show" :class="activeItem.class">
      <image :src="activeItem.resource" class="img" mode="aspectFit" />
    </view>
  </view>
</template>

<script>
function countHeight(width, height) {
  const s = parseFloat(width) / 750;
  return parseFloat(height) / s;
}
function Queue(type) {
  //type  是否是一个接着一个执行
  function QueueConst() {}
  (QueueConst.execute_ing = []),
    (QueueConst.execute_no = []),
    (QueueConst.state = 1),
    (QueueConst.type = type ? type : false);
  QueueConst.prototype.stop = function() {
    //暂停
    QueueConst.state = 2;
  };
  QueueConst.prototype.reset = function() {
    //恢复
    QueueConst.state = 3;
    QueueConst.prototype.execute();
  };
  QueueConst.prototype.execute = function() {
    //执行队列
    if (QueueConst.state == 2) return;
    var currentItem = null;
    if (QueueConst.execute_ing.length > 0) {
      currentItem = QueueConst.execute_ing.shift();
      if (QueueConst.type) {
        currentItem(QueueConst.prototype.reset);
        QueueConst.prototype.stop();
      } else {
        currentItem();
        QueueConst.prototype.execute();
      }
      //执行当前
    } else {
      if (QueueConst.execute_no.length < 1) {
        //完成队列里面的任务;
        QueueConst.state = 1;
        return;
      }
      QueueConst.execute_ing = QueueConst.execute_no;
      QueueConst.execute_no = [];
      QueueConst.prototype.execute();
    }
  };
  QueueConst.prototype.add = function(item) {
    //添加任务
    QueueConst.execute_no.push(item);
    if (QueueConst.state == 1) QueueConst.state = 3;
    QueueConst.prototype.execute();
  };
  return new QueueConst();
}

export default {
  data() {
    return {
      activeItem: {
        show: false,
        timer: null,
        class: "",
        resource: ""
      },
      que: Queue(true),
      queues: [], // 队列消息
      maxTimestamp: 5000 // 效果时间戳，动画时间
    };
  },
  watch: {
    // list(val) {
    //   let item = Object.assign({}, { ...val[val.length - 1] }); //当前新加的礼物
    //   if (item.aniType == 1) {
    //     this.que &&
    //       this.que.add(next => {
    //         this.activeItem.timer = null;
    //         this.activeItem.show = true;
    //         this.activeItem.class = "fadeIn";
    //         this.activeItem.timestamp = Date.parse(new Date());
    //         this.activeItem.resource = item.resource;
    //         clearTimeout(this.activeItem.timer);
    //         this.activeItem.timer = setTimeout(() => {
    //           this.activeItem.class = "fadeOut";
    //           setTimeout(() => {
    //             this.activeItem.show = false;
    //             next();
    //           }, 500);
    //         }, this.maxTimestamp);
    //         this.queues.push(item);
    //       });
    //   }
    // }
  },
  props: {
    list: Array
  },
  mounted() {},
  beforeDestroy() {
    this.que = null;
  },
  methods: {
    push(obj) {
      let item = Object.assign({}, { ...obj }); //当前新加的礼物
      if (item.aniType == 1) {
        this.que &&
          this.que.add(next => {
            this.activeItem.timer = null;
            this.activeItem.show = true;
            this.activeItem.class = "fadeIn";
            this.activeItem.timestamp = Date.parse(new Date());
            this.activeItem.resource = item.resource;

            clearTimeout(this.activeItem.timer);
            this.activeItem.timer = setTimeout(() => {
              this.activeItem.class = "fadeOut";
              setTimeout(() => {
                this.activeItem.show = false;
                next();
              }, 500);
            }, this.maxTimestamp);

            this.queues.push(item);
          });
      }
    },
    player() {
      var player = new SVGA.Player("#demoCanvas");
      var parser = new SVGA.Parser("#demoCanvas"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      var sad = parser.load(
        "https://vslai-com-cn.oss-cn-hangzhou.aliyuncs.com/upload/26/2020/08/20/16/1597911819236.跑车",
        videoItem => {
          console.log(videoItem);
          player.setVideoItem(videoItem);
          player.startAnimation();
        }
      );
    },
    // 播放动画
    players() {
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player("#canvas", this);
      (async () => {
        const fileData = await downloader.get(
          "https://vslai-com-cn.oss-cn-hangzhou.aliyuncs.com/upload/26/2020/08/20/16/1597911819236.跑车"
        );
        const svgaData = await parser.do(fileData);

        player.set({
          loop: 1,
          fillMode: "forwards"
        });

        await player.mount(svgaData);

        player
          .$on("start", () => console.log("event start"))
          .$on("pause", () => console.log("event pause"))
          .$on("stop", () => console.log("event stop"))
          .$on("end", () => console.log("event end"))
          .$on("clear", () => console.log("event clear"))
          .$on("process", () => console.log("event process", player.progress));

        player.start();
        // player.pause()
        // player.stop()
        // player.clear()
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
.luxury-gift-group {
  .box {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 30;
    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.fadeIn {
  animation: fadeIn 0.8s ease 0s 1 both;
  -webkit-animation: fadeIn 0.8s ease 0s 1 both;
}
.fadeOut {
  animation: fadeOut 0.8s ease 0s 1 both;
  -webkit-animation: fadeOut 0.8s ease 0s 1 both;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
