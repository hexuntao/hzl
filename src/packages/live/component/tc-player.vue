<template>
  <div id="webPlayer" class="web-player" ref="webPlayer">
    <div class="controls" v-show="showControls" @click="clickPlay">
      <lk-icon name="play-circle-o" size="60" color="#ffffff" />
    </div>
  </div>
</template>

<script>
import TcPlayer from "../lib/TcPlayer-2.3.2";
export default {
  data() {
    return {
      playerOption: {
        domID: "webPlayer",
        flv: "",
        m3u8: "",
        autoplay: false,
        x5_type: "h5",
        width: "100%",
        height: "100%",
        poster: { style: "cover", src: "" },
        pausePosterEnabled: true,
        controls: "none",
        x5_player: true,
        live: true,
        objectFit: "fill",
        wording: {
          1: "网络错误，请检查网络配置或者播放链接是否正确~ ",
          2: "网络错误，请检查网络配置或者播放链接是否正确~ ",
          3: "视频解码错误~ ",
          4: "当前系统环境不支持播放该视频格式~ ",
          5: "当前系统环境不支持播放该视频格式~ ",
          13: "您观看的直播已结束",
          1002: "获取视频失败，请检查播放链接是否有效",
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        }
      },
      tweblive: null,
      showControls: true
    };
  },
  props: {
    url: String,
    groupInfo: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.destroyPlayer();
  },
  methods: {
    // 初始化
    init() {
      const tweblive = new TcPlayer({
        ...this.playerOption,
        poster: {
          style: "cover",
          src: this.groupInfo.live_img
        },
        ...this.options,
        listener: e => {
          // console.log("listener", e);
        }
      });
      console.log(tweblive, this.groupInfo);
      tweblive.setLogLevel(4);
      this.tweblive = tweblive;
      // this.enterRoom();

      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      // this.tweblive.on(TcPlayer.EVENT.IM_READY, this.onReadyStateUpdate);
      // 被踢出
      // this.tweblive.on(TcPlayer.EVENT.KICKED_OUT, this.onKickedOut);
      // SDK内部出错
      this.tweblive.on(TcPlayer.EVENT.ERROR, this.onTcPlayerError);
      // 收到自定义新消息
      // this.tweblive.on(
      //   TcPlayer.EVENT.CUSTOM_MESSAGE_RECEIVED,
      //   this.onCustomMessageReceived
      // );
      // 收到文本新消息
      // this.tweblive.on(
      //   TcPlayer.EVENT.TEXT_MESSAGE_RECEIVED,
      //   this.onTextMessageReceived
      // );
      // 加入直播间
      // this.tweblive.on(TcPlayer.EVENT.REMOTE_USER_JOIN, this.onRemoteUserJoin);
      // 离开直播间
      // this.tweblive.on(
      //   TcPlayer.EVENT.REMOTE_USER_LEAVE,
      //   this.onRemoteUserLeave
      // );
      // 推流结束
      this.tweblive.on(TcPlayer.EVENT.ENDED, this.onLiveEnd);
    },
    // 加入直播间
    enterRoom() {
      this.tweblive
        .enterRoom(this.groupInfo.group_id)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          if (error.code === 10007 || error.code === 10015) {
            console.log("你加入的直播间不存在");
          }
        });
    },
    // 退出直播间
    exitRoom() {
      return new Promise((resolve, reject) => {
        this.tweblive.exitRoom(this.groupInfo.group_id).then(res => {
          console.log(res);
          resolve();
        });
      });
    },
    clickPlay() {
      if (this.tweblive) {
        this.showControls = false;
        this.tweblive.play();
      }
    },
    destroyPlayer() {
      if (this.tweblive) {
        this.offListener();
        this.tweblive.destroyPlayer(); //销毁播放器
      }
    },
    // 取消监听
    offListener() {
      // this.tweblive.off(TcPlayer.EVENT.IM_READY, this.onReadyStateUpdate);
      this.tweblive.off(TcPlayer.EVENT.ERROR, this.onTcPlayerError);
      this.tweblive.off(TcPlayer.EVENT.ENDED, this.onLiveEnd);
    },
    onReadyStateUpdate(res) {
      console.log(res);
    },
    onKickedOut(res) {
      console.log(res);
    },
    onTcPlayerError(res) {
      console.log(res);
    },
    onCustomMessageReceived(res) {
      console.log(res);
    },
    onTextMessageReceived(res) {
      console.log(res);
    },
    onRemoteUserJoin(res) {
      console.log(res);
    },
    onRemoteUserLeave(res) {
      console.log(res);
    },
    onLiveEnd(res) {
      console.log(res);
    }
  }
};
</script>

<style lang="scss" scoped>
.web-player {
  width: 100%;
  height: 100%;
  // position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.controls {
  width: 100vw;
  height: 100vw;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1020;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
