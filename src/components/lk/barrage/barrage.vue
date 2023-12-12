<template>
  <view
    class="barrage"
    :class="barrageClass"
    v-if="(show && isDateNow) || showWebSocket"
  >
    <view class="cell-barrage">
      <image :src="IndexData.header"></image>
      <view class="barrage-text">
        <view class="barrage-name">{{ IndexData.user_name }} </view>
        <text> {{ IndexData.place_order_time }} 前提交了订单</text>
      </view>
    </view>
  </view>
</template>
<script>
import { GET_BARRAGEINFO, GET_BARRAGERULE } from "@/common/interface/barrage";
import { formatSeconds } from "@/common/utils";
import $Store from "@/store";
export default {
  data() {
    return {
      showWebSocket: false,
      change_rule_state: 0, //是否更新配置
      show: false,
      IndexData: {}, //当前显示数据
      barrageType: 0, //弹幕类型 1真实数据 2 虚拟数据 3真实+虚拟
      isDateNow: false,
      Intertimer: null,
      isRoute: false, //路由是否满足配置条件
      barrageClass: "fadeInLeft",
      orderbarrage: {},
      socketTask: null
    };
  },
  computed: {
    // 获取路由
    IndexRoute() {
      return $Store.getters.route;
    },
    addons() {
      return $Store.state.config.addons;
    },
    barrage_url() {
      return $Store.state.config.barrage_url;
    }
  },
  watch: {
    orderbarrage: {
      handler(newVal, oldVal) {
        this.changeRoute(this.IndexRoute);
      },
      deep: true
    },
    // 路由变化 展示模块变化
    IndexRoute(newRoute) {
      // use_place  1全局弹窗 2首页弹窗 3首页+详情
      //is_high_powered 是否使用webSocket
      if (this.barrage_url.is_high_powered) {
        if (this.barrage_url.use_place == 2) {
          if (newRoute.name == "pages-mall-index") {
            this.connectSocket();
          } else {
            if (this.socketTask) {
              this.socketTask.close({
                success: res => {
                  this.socketTask = null;
                  this.showWebSocket = false;
                }
              });
            }
          }
        } else if (this.barrage_url.use_place == 3) {
          if (
            newRoute.name == "pages-mall-index" ||
            newRoute.name == "packages-goods-detail"
          ) {
            this.connectSocket();
          } else {
            if (this.socketTask) {
              this.socketTask.close({
                success: res => {
                  this.socketTask = null;
                  this.showWebSocket = false;
                }
              });
            }
          }
        } else if (this.barrage_url.use_place == 1) {
          // #ifdef H5
          this.connectSocket();
          // #endif
        }
      } else {
        if (
          newRoute.name == "pages-mall-index" ||
          newRoute.name == "packages-goods-detail"
        ) {
          this.getBarrageRule()
            .then(data => {
              this.orderbarrage = data;
            })
            .catch(() => {});
        }
        if (this.orderbarrage.state) {
          this.changeRoute(newRoute);
        }
      }
    },
    //显示一定时间隐藏
    show(value) {
      if (value) {
        setTimeout(() => {
          this.barrageClass = "fadeOutLeft";
          setTimeout(() => {
            this.show = false;
            this.barrageClass = "fadeInLeft";
          }, 500);
        }, this.orderbarrage.show_time * 1000);
      }
    }
    // barrage_url: {
    //   handler(val) {
    //     if (val.is_high_powered) {
    //       this.connectSocket();
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    changeRoute(newRoute) {
      if (this.barrage_url.is_high_powered) {
        return false;
      }
      if (
        this.orderbarrage.use_place == 2 &&
        newRoute.name == "pages-mall-index"
      ) {
        this.isRoute = true;
        this.getData();
      } else if (this.orderbarrage.use_place == 1) {
        if (!this.Intertimer) {
          // #ifdef H5
          this.isRoute = true;
          this.getData();
          // #endif
        }
      } else if (
        this.orderbarrage.use_place == 3 &&
        (newRoute.name == "pages-mall-index" ||
          newRoute.name == "packages-goods-detail")
      ) {
        this.isRoute = true;
        this.getData();
      } else {
        this.isRoute = false;
        if (this.Intertimer) {
          clearInterval(this.Intertimer);
        }
      }
    },
    getBarrageRule() {
      return new Promise(resolve => {
        if (this.addons.orderbarrage && $Store.getters.token) {
          GET_BARRAGERULE()
            .then(({ data }) => {
              resolve(data || {});
            })
            .catch(() => {});
        } else {
          resolve({});
        }
      });
    },
    getData() {
      const $this = this;
      if ($this.Intertimer) {
        clearInterval($this.Intertimer);
      }
      let orderbarrage = $this.orderbarrage;
      if (orderbarrage.state == 1) {
        $this.barrageType = orderbarrage.type;
        let nowItem = parseInt(new Date().getTime() / 1000);
        if (orderbarrage.rule) {
          if (nowItem >= $this.orderbarrage.rule.start_time) {
            $this.getBarrageInfo();
          }
        }
      }
    },
    getBarrageInfo() {
      const $this = this;
      let params = {};
      if ($this.change_rule_state) {
        params.change_rule_state = $this.change_rule_state;
      }
      GET_BARRAGEINFO(params)
        .then(res => {
          if (res.data) {
            if (res.data.change_rule_state) {
              $this.change_rule_state = 1;
              // $Store.dispatch("getConfig", { update: true }).then(data => {
              //   // console.log(data);
              // });
            } else {
              $this.change_rule_state = 0;
            }
            $this.disposeData(res.data.current_data);
          }
        })
        .catch(() => {});
    },
    //数据处理
    disposeData(current_data) {
      const $this = this;
      if ($this.Intertimer) {
        clearInterval($this.Intertimer);
      }
      let index = 0;
      $this.Intertimer = setInterval(function() {
        if (!$this.isRoute) {
          if ($this.Intertimer) {
            clearInterval($this.Intertimer);
          }
        }
        index += 1; //判断index是否达到集合最后一个
        let nowItem = parseInt(new Date().getTime() / 1000);
        // 循环中超过结束时间退出
        if (
          nowItem >= $this.orderbarrage.rule.start_time &&
          nowItem <= $this.orderbarrage.rule.end_time
        ) {
          $this.isDateNow = true;
        } else {
          $this.isDateNow = false;
          clearInterval($this.Intertimer);
          return false;
        }
        // 是否开启循环
        if (index >= current_data.length) {
          //如果达到了，就清除定时器，停止循环
          clearInterval($this.Intertimer);
          // 真实数据
          if ($this.barrageType == 1) {
            $this.getData();
          } else {
            // 是否开启循环
            if ($this.orderbarrage.is_circle) {
              $this.getData();
            }
          }
        }
        if (current_data[index - 1]) {
          $this.IndexData = current_data[index - 1] || {};
          $this.IndexData.place_order_time = formatSeconds(
            $this.IndexData.place_order_time
          );
          $this.show = true;
        }
      }, ($this.orderbarrage.show_time +
        $this.orderbarrage.rule.space_end_time) *
        1000);
    },
    connectSocket() {
      const $this = this;
      if ($this.socketTask) {
        return $this.socketTask;
      }
      if (!$Store.state.config.barrage_url.websocket_url) {
        return;
      }
      $this.socketTask = uni.connectSocket({
        url: $Store.state.config.barrage_url.websocket_url,
        complete: () => {}
      });
      if (!$this.socketTask) {
        return;
      }
      // #ifdef H5
      if (!$this.socketTask || !$this.socketTask._webSocket) {
        return;
      }
      // #endif
      $this.socketTask.onOpen(res => {
        $this.socketTask.send({
          data:
            '{"website_id":"' +
            $Store.state.config.website_id +
            '","requset_url":"' +
            $Store.state.config.barrage_url.request_url +
            '"}',
          complete: res => {
            // console.log(res);
          }
        });
      });
      $this.socketTask.onClose(e => {
        // console.log("socket:close", e);
      });
      $this.socketTask.onError(e => {
        console.log("socket:error", e);
      });

      $this.socketTask.onMessage(res => {
        let data = JSON.parse(res.data);
        if (data.code == 1) {
          $this.IndexData = data.data;
          $this.IndexData.place_order_time = formatSeconds(
            $this.IndexData.place_order_time
          );
          $this.showWebSocket = true;
          $this.barrageClass = "fadeInLeft";
          setTimeout(() => {
            $this.barrageClass = "fadeOutLeft";
          }, parseInt($this.IndexData.show_time) * 1000);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.fadeInLeft {
  animation: fadeInLeft 0.8s ease 0s 1 both;
  -webkit-animation: fadeInLeft 0.8s ease 0s 1 both;
}
.fadeOutLeft {
  animation: fadeOutLeft 0.8s ease 0s 1 both;
  -webkit-animation: fadeOutLeft 0.8s ease 0s 1 both;
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeOutLeft {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}
.barrage {
  position: fixed;
  z-index: 10000;
  left: 40rpx;
  top: 200rpx;
  .cell-barrage {
    height: 60rpx;
    display: flex;
    justify-content: space-around;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 10rpx;
    image {
      height: 60rpx;
      width: 60rpx;
    }
    .barrage-text {
      color: #fff;
      padding: 0 20rpx 0 10rpx;
      font-size: 20rpx;
      line-height: 60rpx;
      display: flex;
      .barrage-name {
        max-width: 200rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 15rpx;
      }
    }
  }
}
</style>
